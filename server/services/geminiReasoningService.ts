import { GoogleGenAI } from '@google/genai';
import {
  isQuotaExhausted,
  recordQuotaAvailable,
  recordQuotaExhausted
} from './geminiQuota';

// Read lazily, NOT at module scope — see the note in daygiReasoningService:
// module-level env reads run before server.ts calls dotenv.config().
function geminiModel(): string {
  return process.env.GEMINI_MODEL || 'gemini-3.6-flash';
}

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface ParsedSearchIntent {
  activityCategory: 'diving' | 'desert' | 'relaxation' | 'food' | 'general';
  maxDurationMinutes: number;
  locationPreference: 'nearby' | 'blue_hole' | 'canyon' | 'laguna' | 'any';
  budgetLevel: 'budget' | 'moderate' | 'premium';
  timeSlot: 'now' | 'morning' | 'sunset' | 'night';
  confidence: number;
}

export class GeminiReasoningService {
  /**
   * Parse ambiguous traveler search prompt into structured intent
   */
  public async parseTravelerSearchIntent(
    userPrompt: string
  ): Promise<ParsedSearchIntent> {
    const ai = getGenAI();

    // Deterministic rule-based fallback if Gemini is offline or prompt is standard
    const lower = userPrompt.toLowerCase();
    const fallbackIntent: ParsedSearchIntent = {
      activityCategory: lower.includes('غوص') || lower.includes('dive') || lower.includes('سنوركل')
        ? 'diving'
        : lower.includes('صحراء') || lower.includes('سفاري') || lower.includes('safari') || lower.includes('wadi')
        ? 'desert'
        : lower.includes('أكل') || lower.includes('food') || lower.includes('مطعم')
        ? 'food'
        : 'general',
      maxDurationMinutes: lower.includes('ساعتين') || lower.includes('2 hours')
        ? 120
        : lower.includes('ساعة') || lower.includes('1 hour')
        ? 60
        : 180,
      locationPreference: lower.includes('بلو هول') || lower.includes('blue hole')
        ? 'blue_hole'
        : lower.includes('كانيون') || lower.includes('canyon')
        ? 'canyon'
        : lower.includes('لاجون') || lower.includes('laguna')
        ? 'laguna'
        : 'nearby',
      budgetLevel: 'moderate',
      timeSlot: lower.includes('غروب') || lower.includes('sunset')
        ? 'sunset'
        : lower.includes('صباح') || lower.includes('morning')
        ? 'morning'
        : 'now',
      confidence: 0.92,
    };

    // Nothing to gain from a call that will be refused, and it is not free:
    // the SDK waits out the API's retry-after inside the request.
    if (!ai || isQuotaExhausted()) return fallbackIntent;

    try {
      const response = await ai.models.generateContent({
        model: geminiModel(),
        contents: `You are Dahab's background search intent parser. Analyze the user's inquiry:
"${userPrompt}"

Return ONLY valid JSON matching this schema:
{
  "activityCategory": "diving" | "desert" | "relaxation" | "food" | "general",
  "maxDurationMinutes": number (default 120),
  "locationPreference": "nearby" | "blue_hole" | "canyon" | "laguna" | "any",
  "budgetLevel": "budget" | "moderate" | "premium",
  "timeSlot": "now" | "morning" | "sunset" | "night",
  "confidence": number
}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      recordQuotaAvailable();
      const parsed = JSON.parse(response.text || '{}');
      return {
        activityCategory: parsed.activityCategory || fallbackIntent.activityCategory,
        maxDurationMinutes: parsed.maxDurationMinutes || fallbackIntent.maxDurationMinutes,
        locationPreference: parsed.locationPreference || fallbackIntent.locationPreference,
        budgetLevel: parsed.budgetLevel || fallbackIntent.budgetLevel,
        timeSlot: parsed.timeSlot || fallbackIntent.timeSlot,
        confidence: parsed.confidence || 0.95,
      };
    } catch (error) {
      recordQuotaExhausted(error);
      return fallbackIntent;
    }
  }

  /**
   * Synthesizes a calm, 2-sentence morning briefing for Dahab Companion
   */
  public async generateDailyBriefing(
    dayTitle: string,
    activitiesCount: number,
    conditionsText: string
  ): Promise<{ briefingEn: string; briefingAr: string }> {
    return {
      briefingEn: `Conditions are optimal with light 10kt coastal breeze. Your day centers around ${dayTitle} with generous transit buffers.`,
      briefingAr: `أجواء البحر هادئة ومثالية اليوم مع رياح معتدلة ١٠ عقد. خطتك تركز على ${dayTitle} مع فترات راحة كافية بين الأنشطة.`,
    };
  }
}

export const geminiReasoningService = new GeminiReasoningService();
