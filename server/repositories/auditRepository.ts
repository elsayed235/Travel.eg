import { db } from '../db/database';
import { AuditEventEntity } from '../db/schema';

export class AuditRepository {
  public getAllAuditEvents(): AuditEventEntity[] {
    return [...db.auditEvents];
  }

  public getEventsByEntity(entityType: string, entityId: string): AuditEventEntity[] {
    return db.auditEvents.filter(e => e.entityType === entityType && e.entityId === entityId);
  }

  public logEvent(actor: string, actorRole: string, action: string, entityType: string, entityId: string, payload: Record<string, any>): AuditEventEntity {
    return db.logAudit(actor, actorRole, action, entityType, entityId, payload);
  }
}

export const auditRepository = new AuditRepository();
