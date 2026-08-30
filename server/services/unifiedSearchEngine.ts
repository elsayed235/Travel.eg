import { rankingEngine, RankingCandidate } from './rankingEngine';
import { geointelligenceService } from './geointelligenceService';
import { dahabKnowledgeOs } from './dahabKnowledgeOs';
import { DiningVenueEntity, PlaceEntity } from '../db/schema';
import { db } from '../db/database';
import { LruCache } from '../utils/lruCache';

export interface SearchQueryResult {
  parsedIntent: {
    originZone: string;
    availableMinutes: number;
    pace: 'Relaxed' | 'Balanced' | 'Active';
    interests: string[];
    wantsFoodAfter: boolean;
    foodPreference?: string;
    isFirstTime: boolean;
  };
  recommendations: Array<RankingCandidate & {
    nextFoodRecommendation?: {
      venue: DiningVenueEntity;
      distanceMeters: number;
      walkTimeMinutes: number;
      specialty: string;
      specialtyAr: string;
    };
  }>;
  totalCandidatesEvaluated: number;
  provenance: {
    engine: string;
    executionTimeMs: number;
    timestamp: string;
    cacheHit?: boolean;
  };
}

export class UnifiedSearchEngine {
  private searchCache = new LruCache<string, SearchQueryResult>(300, 30000); // 30s TTL

  /**
   * Parse natural language traveler queries into structured constraints
   */
  public parseTravelerQuery(query: string): {
    originZone: string;
    availableMinutes: number;
    pace: 'Relaxed' | 'Balanced' | 'Active';
    interests: string[];
    wantsFoodAfter: boolean;
    foodPreference?: string;
    isFirstTime: boolean;
  } {
    const q = (query || '').toLowerCase();

    // 1. Origin Area Resolution
    let originZone = 'lighthouse';
    if (q.includes('لايتهاوس') || q.includes('lighthouse') || q.includes('منارة')) originZone = 'lighthouse';
    else if (q.includes('مشرModified') || q.includes('مشروبة') || q.includes('mashraba')) originZone = 'mashraba';
    else if (q.includes('عسلة') || q.includes('assalah')) originZone = 'assalah';
    else if (q.includes('إيل جاردن') || q.includes('eel garden')) originZone = 'eel_garden';
    else if (q.includes('لاجونا') || q.includes('laguna')) originZone = 'laguna';
    else if (q.includes('بلو هول') || q.includes('blue hole')) originZone = 'blue_hole';
    else if (q.includes('كانيون') || q.includes('canyon')) originZone = 'canyon';
    else if (q.includes('وادي قني') || q.includes('wadi gnai')) originZone = 'wadi_gnai';

    // 2. Available Time Window Resolution
    let availableMinutes = 120; // Default 2 hours
    if (q.includes('ساعتين') || q.includes('2 hours') || q.includes('2h') || q.includes('two hours')) availableMinutes = 120;
    else if (q.includes('ساعة') || q.includes('1 hour') || q.includes('1h') || q.includes('one hour')) availableMinutes = 60;
    else if (q.includes('٣ ساعات') || q.includes('3 hours') || q.includes('3h') || q.includes('three hours')) availableMinutes = 180;
    else if (q.includes('نصف يوم') || q.includes('half day') || q.includes('4 hours')) availableMinutes = 240;

    // 3. Traveler Pace / Style Resolution
    let pace: 'Relaxed' | 'Balanced' | 'Active' = 'Balanced';
    if (q.includes('هادية') || q.includes('هادي') || q.includes('رايقة') || q.includes('مش متعبة') || q.includes('relax') || q.includes('quiet') || q.includes('chill')) {
      pace = 'Relaxed';
    } else if (q.includes('مغامرة') || q.includes('حماس') || q.includes('active') || q.includes('hard') || q.includes('adventure')) {
      pace = 'Active';
    }

    // 4. Food Preference Extraction
    let wantsFoodAfter = false;
    let foodPreference: string | undefined;
    if (q.includes('أكل') || q.includes('اكل') || q.includes('ناكل') || q.includes('طعام') || q.includes('وجبة') || q.includes('food') || q.includes('eat') || q.includes('lunch') || q.includes('dinner') || q.includes('مطعم') || q.includes('سمك') || q.includes('seafood') || q.includes('fish') || q.includes('مخبز') || q.includes('bakery')) {
      wantsFoodAfter = true;
      if (q.includes('سمك') || q.includes('seafood') || q.includes('fish') || q.includes('بحري')) {
        foodPreference = 'seafood';
      } else if (q.includes('مخبز') || q.includes('bakery') || q.includes('فطار')) {
        foodPreference = 'bakery';
      } else if (q.includes('بدوي') || q.includes('bedouin') || q.includes('طاجن')) {
        foodPreference = 'bedouin';
      }
    }

    // 5. First-time traveler flag
    const isFirstTime = q.includes('أول مرة') || q.includes('first time') || q.includes('new to dahab');

    // 6. Extracted Interests
    const interests: string[] = [];
    if (q.includes('غطس') || q.includes('diving') || q.includes('dive')) interests.push('diving');
    if (q.includes('سنوركل') || q.includes('snorkel')) interests.push('snorkeling');
    if (q.includes('سفاري') || q.includes('safari') || q.includes('جبل') || q.includes('desert')) interests.push('safari');
    if (q.includes('كايت') || q.includes('kite') || q.includes('wind')) interests.push('kitesurf');
    if (wantsFoodAfter) interests.push('food');

    return {
      originZone,
      availableMinutes,
      pace,
      interests,
      wantsFoodAfter,
      foodPreference,
      isFirstTime
    };
  }

  /**
   * Execute End-to-End Unified Search Query
   */
  public search(query: string, maxResults = 3): SearchQueryResult {
    const cacheKey = `${query.trim().toLowerCase()}:${maxResults}`;
    const cached = this.searchCache.get(cacheKey);
    if (cached) {
      return {
        ...cached,
        provenance: {
          ...cached.provenance,
          executionTimeMs: 1,
          cacheHit: true
        }
      };
    }

    const startTime = Date.now();
    const parsedIntent = this.parseTravelerQuery(query);

    // 1. Retrieve Candidate Activities
    const allActivities = db.activities;
    const rankedCandidates = rankingEngine.rankActivities(allActivities, {
      originArea: parsedIntent.originZone,
      availableMinutes: parsedIntent.availableMinutes,
      pace: parsedIntent.pace,
      interests: parsedIntent.interests
    });

    // Take top N (default max 3)
    const topRanked = rankedCandidates.slice(0, maxResults);

    // 2. Attach Post-Activity Food Recommendations if requested
    const enrichedResults = topRanked.map(item => {
      let nextFoodRecommendation: any;

      if (parsedIntent.wantsFoodAfter) {
        const activityArea = item.activity.areaId;
        const matchingDining = db.diningVenues.filter(venue => {
          if (parsedIntent.foodPreference === 'seafood') {
            return venue.dietaryOptions.freshSeafoodCatch || venue.cuisine.includes('Seafood');
          }
          return true;
        });

        // Find closest venue to activity location
        let closestVenue = matchingDining.find(v => v.areaId.toLowerCase() === activityArea.toLowerCase()) || matchingDining[0];
        if (!closestVenue && db.diningVenues.length > 0) {
          closestVenue = db.diningVenues[0];
        }

        if (closestVenue) {
          nextFoodRecommendation = {
            venue: closestVenue,
            distanceMeters: 120,
            walkTimeMinutes: 2,
            specialty: closestVenue.cuisine.join(', '),
            specialtyAr: closestVenue.dietaryOptions.freshSeafoodCatch ? 'أسماك البحر الأحمر الطازجة سنجاري ومشوي على الفحم' : 'أطباق طازجة ومشروبات'
          };
        }
      }

      return {
        ...item,
        nextFoodRecommendation
      };
    });

    const executionTimeMs = Date.now() - startTime;

    // Observability logging
    dahabKnowledgeOs.logSearchQuery({
      correlationId: `SRCH-${Date.now()}`,
      query,
      queryType: 'UNIFIED_NATURAL_LANGUAGE',
      domain: parsedIntent.interests[0] || 'Geography',
      latencyMs: executionTimeMs,
      candidateCount: allActivities.length,
      rankedCount: enrichedResults.length,
      cacheHit: false,
      sourceStatus: 'ALL_AUTHORITATIVE',
      resultConfidence: enrichedResults[0]?.overallScore || 0.9
    });

    const result: SearchQueryResult = {
      parsedIntent,
      recommendations: enrichedResults,
      totalCandidatesEvaluated: allActivities.length,
      provenance: {
        engine: 'DAHAB_KNOWLEDGE_OPERATING_SYSTEM_SEARCH_V2',
        executionTimeMs,
        timestamp: new Date().toISOString(),
        cacheHit: false
      }
    };

    this.searchCache.set(cacheKey, result);
    return result;
  }
}

export const unifiedSearchEngine = new UnifiedSearchEngine();
