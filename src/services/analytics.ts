export type AnalyticsEventType =
  | 'trip_entry_viewed'
  | 'quickstart_opened'
  | 'first_time_selected'
  | 'vibe_selected'
  | 'ready_trip_recommended'
  | 'ready_trip_started'
  | 'ready_trip_customized'
  | 'ready_trip_rejected'
  | 'build_myself_selected'
  | 'ready_trip_selected'
  | 'ready_trip_previewed'
  | 'plan_it_for_me_selected'
  | 'planner_started'
  | 'planner_completed'
  | 'ai_plan_generated'
  | 'trip_created'
  | 'trip_entry_mode_switched'
  | 'entry_mode_switched'
  | 'trip_entry_abandoned'
  | 'ready_trip_compared'
  | 'smart_match_quiz_started'
  | 'smart_match_quiz_completed'
  | 'unpro_wizard_matched'
  // Unified Traveler Journey Lifecycle Events
  | 'arrival_started'
  | 'trip_started'
  | 'book_now_opened'
  | 'option_viewed'
  | 'booking_started'
  | 'booking_completed'
  | 'activity_completed'
  | 'post_activity_action'
  | 'food_action'
  | 'recovery_started'
  | 'recovery_completed'
  | 'trip_completed'
  | 'departure_completed'
  | 'next_best_action_clicked';

export interface AnalyticsPayload {
  eventName: AnalyticsEventType;
  timestamp: string;
  templateId?: string;
  sourceMode?: string;
  targetMode?: string;
  durationDays?: number;
  travelersCount?: number;
  budget?: string;
  pace?: string;
  interests?: string[];
  metadata?: Record<string, any>;
}

class AnalyticsService {
  private events: AnalyticsPayload[] = [];
  private readonly storageKey = 'dahab_telemetry_events';

  constructor() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.events = JSON.parse(saved).slice(-100); // keep last 100
      }
    } catch {
      this.events = [];
    }
  }

  public track(eventName: AnalyticsEventType, data: Partial<AnalyticsPayload> = {}): void {
    const payload: AnalyticsPayload = {
      eventName,
      timestamp: new Date().toISOString(),
      ...data
    };

    this.events.push(payload);
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.events.slice(-100)));
    } catch {
      // storage quota or private mode ignore
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Dahab Analytics] ${eventName}`, payload);
    }
  }

  public getRecentEvents(): AnalyticsPayload[] {
    return [...this.events];
  }
}

export const analytics = new AnalyticsService();
