import crypto from 'crypto';
import { db } from '../db/database';
import { NotificationEntity } from '../db/schema';

export class NotificationService {
  public sendNotification(params: {
    userId: string;
    type: NotificationEntity['type'];
    title: string;
    message: string;
    channel?: NotificationEntity['channel'];
    metadata?: Record<string, any>;
  }): NotificationEntity {
    const id = `NTF-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    const notification: NotificationEntity = {
      id,
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      channel: params.channel || 'IN_APP',
      status: 'SENT',
      metadata: params.metadata,
      createdAt: new Date().toISOString()
    };

    db.runInTransaction(() => {
      db.notifications.unshift(notification);
      db.logAudit('NotificationService', 'System', 'NOTIFICATION_SENT', 'Notification', notification.id, {
        userId: params.userId,
        type: params.type,
        channel: notification.channel
      });
    });

    console.log(`[Notification][${notification.channel}] -> ${params.userId}: ${params.title}`);
    return notification;
  }

  public getNotificationsForUser(userId: string): NotificationEntity[] {
    return db.notifications.filter(n => n.userId === userId || n.userId === 'ALL');
  }
}

export const notificationService = new NotificationService();
