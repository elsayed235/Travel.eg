import { db } from '../db/database';
import {
  ResearchSourceEntity,
  TemporalFactEntity,
  EvidenceNodeEntity,
  ConflictSetEntity,
  AreaProfileEntity,
  PlaceEntity,
  ActivityDetailEntity,
  DiningVenueEntity,
  EmergencyResourceEntity,
  RegulatoryDecreeEntity,
  KnowledgeSnapshotEntity
} from '../db/schema';
import { TemporalState } from '../domain/knowledgeTypes';
import { isFactStale } from '../domain/factFreshness';

export class KnowledgeRepository {
  // -------------------------------------------------------------------------
  // Research Sources
  // -------------------------------------------------------------------------
  public getAllSources(): ResearchSourceEntity[] {
    return [...db.researchSources];
  }

  public getSourceById(id: string): ResearchSourceEntity | undefined {
    return db.researchSources.find(s => s.id === id);
  }

  public upsertSource(source: ResearchSourceEntity): ResearchSourceEntity {
    const idx = db.researchSources.findIndex(s => s.id === source.id);
    if (idx >= 0) {
      db.researchSources[idx] = source;
    } else {
      db.researchSources.push(source);
    }
    db.saveToDisk();
    return source;
  }

  // -------------------------------------------------------------------------
  // Temporal Facts
  // -------------------------------------------------------------------------
  public getAllFacts(): TemporalFactEntity[] {
    return [...db.temporalFacts];
  }

  public getFactsBySubject(subjectId: string, state?: TemporalState): TemporalFactEntity[] {
    return db.temporalFacts.filter(f => {
      if (f.subjectId !== subjectId) return false;
      if (state && f.status !== state) return false;
      return true;
    });
  }

  public getFactById(id: string): TemporalFactEntity | undefined {
    return db.temporalFacts.find(f => f.id === id);
  }

  public upsertFact(fact: TemporalFactEntity): TemporalFactEntity {
    const idx = db.temporalFacts.findIndex(f => f.id === fact.id);
    if (idx >= 0) {
      db.temporalFacts[idx] = fact;
    } else {
      db.temporalFacts.push(fact);
    }
    db.saveToDisk();
    return fact;
  }

  public getStaleFacts(revalidationThresholdDays = 90): TemporalFactEntity[] {
    const cutoff = new Date(Date.now() - revalidationThresholdDays * 24 * 60 * 60 * 1000).toISOString();
    return db.temporalFacts.filter(f => isFactStale(f, cutoff));
  }

  // -------------------------------------------------------------------------
  // Evidence Nodes
  // -------------------------------------------------------------------------
  public getEvidenceForFact(factId: string): EvidenceNodeEntity[] {
    return db.evidenceNodes.filter(e => e.factId === factId);
  }

  public addEvidence(evidence: EvidenceNodeEntity): EvidenceNodeEntity {
    const idx = db.evidenceNodes.findIndex(e => e.id === evidence.id);
    if (idx >= 0) {
      db.evidenceNodes[idx] = evidence;
    } else {
      db.evidenceNodes.push(evidence);
    }
    db.saveToDisk();
    return evidence;
  }

  // -------------------------------------------------------------------------
  // Conflict Sets
  // -------------------------------------------------------------------------
  public getAllConflicts(): ConflictSetEntity[] {
    return [...db.conflictSets];
  }

  public getOpenConflicts(): ConflictSetEntity[] {
    return db.conflictSets.filter(c => c.status === 'OPEN');
  }

  public upsertConflict(conflict: ConflictSetEntity): ConflictSetEntity {
    const idx = db.conflictSets.findIndex(c => c.id === conflict.id);
    if (idx >= 0) {
      db.conflictSets[idx] = conflict;
    } else {
      db.conflictSets.push(conflict);
    }
    db.saveToDisk();
    return conflict;
  }

  // -------------------------------------------------------------------------
  // Area Profiles
  // -------------------------------------------------------------------------
  public getAllAreas(): AreaProfileEntity[] {
    return [...db.areaProfiles];
  }

  public getAreaById(id: string): AreaProfileEntity | undefined {
    return db.areaProfiles.find(a => a.id.toLowerCase() === id.toLowerCase());
  }

  public upsertArea(area: AreaProfileEntity): AreaProfileEntity {
    const idx = db.areaProfiles.findIndex(a => a.id === area.id);
    if (idx >= 0) {
      db.areaProfiles[idx] = area;
    } else {
      db.areaProfiles.push(area);
    }
    db.saveToDisk();
    return area;
  }

  // -------------------------------------------------------------------------
  // Places & Points of Interest
  // -------------------------------------------------------------------------
  public getAllPlaces(): PlaceEntity[] {
    return [...db.places];
  }

  public getPlaceById(id: string): PlaceEntity | undefined {
    return db.places.find(p => p.id === id);
  }

  public getPlacesByArea(areaId: string): PlaceEntity[] {
    return db.places.filter(p => p.areaId.toLowerCase() === areaId.toLowerCase());
  }

  public upsertPlace(place: PlaceEntity): PlaceEntity {
    const idx = db.places.findIndex(p => p.id === place.id);
    if (idx >= 0) {
      db.places[idx] = place;
    } else {
      db.places.push(place);
    }
    db.saveToDisk();
    return place;
  }

  // -------------------------------------------------------------------------
  // Activities
  // -------------------------------------------------------------------------
  public getAllActivities(): ActivityDetailEntity[] {
    return [...db.activities];
  }

  public getActivityById(id: string): ActivityDetailEntity | undefined {
    return db.activities.find(a => a.id === id || a.skuId === id);
  }

  public getActivitiesByArea(areaId: string): ActivityDetailEntity[] {
    return db.activities.filter(a => a.areaId.toLowerCase() === areaId.toLowerCase());
  }

  public upsertActivity(activity: ActivityDetailEntity): ActivityDetailEntity {
    const idx = db.activities.findIndex(a => a.id === activity.id);
    if (idx >= 0) {
      db.activities[idx] = activity;
    } else {
      db.activities.push(activity);
    }
    db.saveToDisk();
    return activity;
  }

  // -------------------------------------------------------------------------
  // Dining Venues
  // -------------------------------------------------------------------------
  public getAllDiningVenues(): DiningVenueEntity[] {
    return [...db.diningVenues];
  }

  public getDiningVenueById(id: string): DiningVenueEntity | undefined {
    return db.diningVenues.find(d => d.id === id);
  }

  public getDiningByArea(areaId: string): DiningVenueEntity[] {
    return db.diningVenues.filter(d => d.areaId.toLowerCase() === areaId.toLowerCase());
  }

  public upsertDining(venue: DiningVenueEntity): DiningVenueEntity {
    const idx = db.diningVenues.findIndex(d => d.id === venue.id);
    if (idx >= 0) {
      db.diningVenues[idx] = venue;
    } else {
      db.diningVenues.push(venue);
    }
    db.saveToDisk();
    return venue;
  }

  // -------------------------------------------------------------------------
  // Emergency Resources & Regulations
  // -------------------------------------------------------------------------
  public getAllEmergencyResources(): EmergencyResourceEntity[] {
    return [...db.emergencyResources];
  }

  public upsertEmergencyResource(res: EmergencyResourceEntity): EmergencyResourceEntity {
    const idx = db.emergencyResources.findIndex(e => e.id === res.id);
    if (idx >= 0) {
      db.emergencyResources[idx] = res;
    } else {
      db.emergencyResources.push(res);
    }
    db.saveToDisk();
    return res;
  }

  public getAllRegulatoryDecrees(): RegulatoryDecreeEntity[] {
    return [...db.regulatoryDecrees];
  }

  public upsertRegulatoryDecree(decree: RegulatoryDecreeEntity): RegulatoryDecreeEntity {
    const idx = db.regulatoryDecrees.findIndex(d => d.id === decree.id);
    if (idx >= 0) {
      db.regulatoryDecrees[idx] = decree;
    } else {
      db.regulatoryDecrees.push(decree);
    }
    db.saveToDisk();
    return decree;
  }

  // -------------------------------------------------------------------------
  // Knowledge Snapshots
  // -------------------------------------------------------------------------
  public getAllSnapshots(): KnowledgeSnapshotEntity[] {
    return [...db.knowledgeSnapshots];
  }

  public getSnapshotById(versionId: string): KnowledgeSnapshotEntity | undefined {
    return db.knowledgeSnapshots.find(s => s.versionId === versionId);
  }

  public saveSnapshot(snapshot: KnowledgeSnapshotEntity): KnowledgeSnapshotEntity {
    const idx = db.knowledgeSnapshots.findIndex(s => s.versionId === snapshot.versionId);
    if (idx >= 0) {
      db.knowledgeSnapshots[idx] = snapshot;
    } else {
      db.knowledgeSnapshots.unshift(snapshot);
    }
    db.saveToDisk();
    return snapshot;
  }
}

export const knowledgeRepository = new KnowledgeRepository();
