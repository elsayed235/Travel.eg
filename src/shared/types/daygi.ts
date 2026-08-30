export type DayGiIntentType =
  | 'DISCOVER_ACTIVITY'
  | 'DISCOVER_FOOD'
  | 'WHAT_SHOULD_I_DO_NOW'
  | 'DAILY_BRIEFING'
  | 'PROPOSE_TRIP_CHANGE'
  | 'BUDGET_OPTIMIZE'
  | 'SCHEDULE_CHECK'
  | 'PREPARE_BOOKING'
  | 'CONFIRM_BOOKING'
  | 'MODIFY_BOOKING'
  | 'CANCEL_BOOKING'
  | 'TRIP_RECOVERY'
  | 'SUPPORT_INQUIRY'
  | 'OPERATIONS_INQUIRY'
  | 'SUPPLIER_INQUIRY'
  | 'GENERAL_CONVERSATION'
  | 'MULTI_STEP_POST_ACTIVITY'
  | 'WHAT_CHANGED_QUERY'
  | 'TRIP_HEALTH_CHECK'
  | 'MARKET_PRICE_INQUIRY'
  | 'SUPPLIER_CHANGES_INQUIRY'
  | 'SOURCE_STALENESS_INQUIRY';

export interface DayGiParsedIntent {
  intent: DayGiIntentType;
  entity?: string;
  parameters: Record<string, any>;
  confidence: number;
  requires_confirmation: boolean;
  required_permission?: 'Traveler' | 'Supplier' | 'Operations' | 'Admin';
}

export interface DayGiBookingReview {
  service: string;
  serviceAr: string;
  date: string;
  time: string;
  people: number;
  location: string;
  priceEGP: number;
  cancellationPolicy: string;
  cancellationPolicyAr: string;
  supplierName: string;
  availabilityStatus: 'AVAILABLE' | 'FEW_SLOTS' | 'ON_HOLD';
  skuId: string;
  holdToken?: string;
}

export interface DayGiRecoveryProposal {
  whatChanged: string;
  whatChangedAr: string;
  whatItAffects: string;
  whatItAffectsAr: string;
  originalItemId: string;
  alternatives: Array<{
    id: string;
    title: string;
    titleAr: string;
    priceVarianceEGP: number;
    scheduleImpact: string;
    scheduleImpactAr: string;
    serviceType: string;
  }>;
}

export interface DayGiBudgetAnalysis {
  targetBudgetEGP: number;
  currentEstimatedEGP: number;
  potentialSavingsEGP: number;
  adjustableItems: Array<{
    itemId: string;
    title: string;
    titleAr: string;
    currentPriceEGP: number;
    lowerCostAlternative: string;
    lowerCostAlternativeAr: string;
    savingsEGP: number;
    tradeOff: string;
    tradeOffAr: string;
  }>;
}

export interface DayGiScheduleResult {
  feasible: boolean;
  status: 'YES' | 'NO' | 'NEEDS_CONFIRMATION';
  proposedTimeSlot: string;
  reason: string;
  reasonAr: string;
  breakdown: {
    existingSchedule: string;
    travelTimeMins: number;
    activityDurationMins: number;
    bufferMins: number;
    nextEventTime: string;
  };
}

export interface DayGiDailyBriefing {
  dateFormatted: string;
  timeline: Array<{ time: string; title: string; titleAr: string; type: string }>;
  freeWindows: Array<{ start: string; end: string; durationMins: number; location: string }>;
  conditionsNote: string;
  conditionsNoteAr: string;
}

export interface DayGiConflictData {
  severity: 'WARNING' | 'CRITICAL';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  suggestedFix: string;
  suggestedFixAr: string;
  safeAlternative?: any;
}

export interface DayGiOpsSupportData {
  targetType: 'TRANSFER' | 'BOOKING' | 'SUPPLIER_ALERT' | 'EMERGENCY_CONTACT';
  referenceId: string;
  status: string;
  detailsEn: string;
  detailsAr: string;
  quickActions: Array<{
    actionKey: string;
    labelEn: string;
    labelAr: string;
    payload?: any;
  }>;
}

export interface DayGiActionData {
  skuId?: string;
  serviceType?: 'hotel' | 'transfer' | 'diving' | 'safari' | 'food';
  title?: string;
  titleAr?: string;
  location?: string;
  priceEGP?: number;
  durationMinutes?: number;
  timeSlot?: string;
  targetDayNumber?: number;
  proposedShift?: {
    activityId?: string;
    fromDay?: number;
    toDay?: number;
    newTimeSlot?: string;
    impactDescription?: string;
    impactDescriptionAr?: string;
  };
  recommendationItems?: Array<{
    id: string;
    name: string;
    nameAr: string;
    distanceWalk: string;
    priceTier: string;
    specialty: string;
    specialtyAr: string;
    openingHours?: string;
  }>;
  practicalTips?: string[];
  practicalTipsAr?: string[];
  bookingReview?: DayGiBookingReview;
  recoveryProposal?: DayGiRecoveryProposal;
  budgetAnalysis?: DayGiBudgetAnalysis;
  scheduleResult?: DayGiScheduleResult;
  dailyBriefing?: DayGiDailyBriefing;
  conflictData?: DayGiConflictData;
  opsSupportData?: DayGiOpsSupportData;
  marketTrends?: any;
  recentEvents?: any;
  lowestObservedBlueHoleEGP?: number;
  monitoredSuppliers?: number;
  observationCount?: number;
  activeSuppliersCount?: number;
  freshnessReport?: any;
  totalEventsCount?: number;
  staleSourcesCount?: number;
  recentIncreases?: any;
  recentDrops?: any;
  supplierDifferences?: any;
}

export type DayGiActionType =
  | 'RECOMMENDATION'
  | 'PLAN_CHANGE'
  | 'BOOKING_CARD'
  | 'CONFLICT'
  | 'RECOVERY'
  | 'BUDGET_SAVINGS'
  | 'SCHEDULE_EVALUATION'
  | 'DAILY_BRIEFING'
  | 'SUPPORT_OPS'
  | 'DISCOVERY'
  | 'BOOK_HANDOFF'
  | 'PRACTICAL_TIP'
  | 'MULTI_STEP_OPTIONS'
  | 'TASK_PLAN'
  | 'WHAT_CHANGED'
  | 'TRIP_HEALTH'
  | 'MULTI_ACTION_CONFIRMATION';

export type DayGiActionRisk =
  | 'READ_ONLY'
  | 'LOW_RISK'
  | 'COMMERCE'
  | 'FINANCIAL'
  | 'SAFETY_CRITICAL';

export type DayGiTripHealthStatus = 'GOOD' | 'ATTENTION' | 'CONFLICT' | 'UNVERIFIED';

export interface DayGiTripHealthIssue {
  type:
    | 'PAYMENT_PENDING'
    | 'SUPPLIER_PENDING'
    | 'SCHEDULE_CONFLICT'
    | 'INSUFFICIENT_TRAVEL_TIME'
    | 'ACTIVITY_DEPENDENCY'
    | 'CONDITION_UNCERTAINTY'
    | 'MISSING_REQUIREMENT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  titleEn: string;
  titleAr: string;
  messageEn: string;
  messageAr: string;
  suggestedFixEn: string;
  suggestedFixAr: string;
  actionKey?: string;
  actionPayload?: any;
}

export interface DayGiTripHealth {
  status: DayGiTripHealthStatus;
  score: number;
  evaluatedAt: string;
  summaryEn: string;
  summaryAr: string;
  issues: DayGiTripHealthIssue[];
  metrics: {
    confirmedBookings: number;
    pendingBookings: number;
    conflictsCount: number;
    budgetAdherencePercent: number;
  };
}

export interface DayGiStructuredMemory {
  userId: string;
  preferences: {
    pace?: 'Relaxed' | 'Balanced' | 'Active';
    morningPreference?: 'Late_Start' | 'Early_Bird';
    divingLevel?: 'Open_Water' | 'Advanced' | 'None';
    dietaryPreferences?: string[];
    budgetBand?: 'Budget' | 'Moderate' | 'Premium';
    transferPreference?: 'Private' | 'Shared';
    seafoodPreference?: boolean;
    avoidsLongTransfers?: boolean;
  };
  learnedInsights: string[];
  learnedInsightsAr: string[];
  recentIntents: string[];
  updatedAt: string;
}

export interface DayGiConstraintModel {
  mustHave: string[];
  mustHaveAr: string[];
  prefer: string[];
  preferAr: string[];
  avoid: string[];
  avoidAr: string[];
  optional: string[];
  optionalAr: string[];
}

export interface DayGiTaskPlanStep {
  stepNumber: number;
  labelEn: string;
  labelAr: string;
  status: 'PENDING' | 'RESOLVING' | 'READY_FOR_CONFIRMATION' | 'EXECUTED' | 'FAILED';
  systemComponent: 'TRIP_SERVICE' | 'COMMERCE_SERVICE' | 'MAPS_ENGINE' | 'LEDGER' | 'SUPPLIER_GATEWAY';
  details?: string;
  detailsAr?: string;
}

export type DayGiTaskState =
  | 'DRAFT'
  | 'PLANNED'
  | 'WAITING_FOR_USER'
  | 'WAITING_FOR_PROVIDER'
  | 'EXECUTING'
  | 'VERIFYING'
  | 'COMPLETED'
  | 'FAILED'
  | 'PARTIALLY_COMPLETED'
  | 'CANCELLED';

export type DayGiStepState =
  | 'PENDING'
  | 'WAITING_FOR_DEPENDENCY'
  | 'WAITING_FOR_USER'
  | 'WAITING_FOR_PROVIDER'
  | 'EXECUTING'
  | 'VERIFYING'
  | 'COMPLETED'
  | 'FAILED'
  | 'SKIPPED'
  | 'CANCELLED';

export type DayGiVerificationRule =
  | 'VERIFY_CLOUD_SQL_BOOKING'
  | 'VERIFY_LEDGER_CHAIN'
  | 'VERIFY_TRIP_TIMELINE'
  | 'VERIFY_PROVIDER_STATE'
  | 'VERIFY_PRICE_INVENTORY'
  | 'VERIFY_SAFETY_COMPLIANCE';

export interface DayGiOrchestratedStep {
  stepId: string;
  stepNumber: number;
  name: string;
  nameAr: string;
  systemComponent: 'TRIP_SERVICE' | 'COMMERCE_SERVICE' | 'PAYMENT_SERVICE' | 'SUPPLIER_SERVICE' | 'MAPS_ENGINE' | 'LEDGER';
  actionKey: string;
  payload: Record<string, any>;
  riskLevel: DayGiActionRisk;
  state: DayGiStepState;
  dependsOnStepIds: string[];
  actionToken: string;
  idempotencyKey: string;
  verificationRule: DayGiVerificationRule;
  verificationResult?: {
    verified: boolean;
    evidence: string;
    evidenceAr?: string;
    verifiedAt: string;
    authoritativeSource: string;
  };
  error?: string;
  errorAr?: string;
  resultData?: any;
}

export interface DayGiActionLineage {
  actionToken: string;
  taskId: string;
  tripId: string;
  bookingId?: string;
  paymentId?: string;
  auditId?: string;
  ledgerEntryId?: string;
  timestamp: string;
}

export interface DayGiRecoveryOption {
  id: string;
  labelEn: string;
  labelAr: string;
  type: 'RETRY' | 'SUBSTITUTE' | 'CONTINUE_PARTIAL' | 'REFUND_FAILED_STEP';
  actionToken: string;
  payload: any;
}

export interface DayGiOrchestratedTask {
  taskId: string;
  userId: string;
  tripId: string;
  intent: string;
  titleEn: string;
  titleAr: string;
  currentStepNumber: number;
  totalSteps: number;
  riskLevel: DayGiActionRisk;
  state: DayGiTaskState;
  steps: DayGiOrchestratedStep[];
  actionLineage: DayGiActionLineage[];
  completedTruth: {
    confirmedBookings: string[];
    settledAmountEGP: number;
    timelineUpdated: boolean;
  };
  partialFailureDetails?: {
    failedStepId: string;
    failedReasonEn: string;
    failedReasonAr: string;
    completedStepsSummaryEn: string;
    completedStepsSummaryAr: string;
    recoveryOptions: DayGiRecoveryOption[];
  };
  waitingDetails?: {
    waitingFor: 'USER_CONFIRMATION' | 'PROVIDER_CONFIRMATION' | 'PAYMENT_SETTLEMENT' | 'DEPENDENT_STEP';
    providerName?: string;
    estimatedResolutionTime?: string;
    actionTokenRequired?: string;
  };
  createdAt: string;
  updatedAt: string;
  outcome?: 'CLICKED' | 'IGNORED' | 'BOOKED' | 'ACCEPTED' | 'REJECTED' | 'ALTERNATIVE_CHOSEN';
}

export interface DayGiTaskPlan {
  id: string;
  intent: string;
  title: string;
  titleAr: string;
  risk: DayGiActionRisk;
  steps: DayGiTaskPlanStep[];
  executionPayload?: any;
  verifiedDeterministic: boolean;
}

export interface DayGiProactiveSuggestion {
  id: string;
  type:
    | 'MORNING_BRIEF'
    | 'SUPPLIER_DELAY'
    | 'SCHEDULE_CONFLICT'
    | 'TRANSFER_APPROACHING'
    | 'FREE_WINDOW_OPPORTUNITY'
    | 'WEATHER_IMPACT'
    | 'PREPARATION_REMINDER'
    | 'UNRESOLVED_ACTION';
  urgency: 'INFO' | 'ACTION_REQUIRED' | 'CRITICAL';
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  timeContext?: string;
  actionKey?: string;
  actionPayload?: any;
  dismissed?: boolean;
}

export interface DayGiWhatChangedCard {
  whatChangedEn: string;
  whatChangedAr: string;
  whatItAffectsEn: string;
  whatItAffectsAr: string;
  reason?: string;
  reasonAr?: string;
  options?: Array<{
    id: string;
    titleEn: string;
    titleAr: string;
    priceVarianceEGP: number;
    scheduleImpactEn: string;
    scheduleImpactAr: string;
    actionKey: string;
    actionPayload: any;
  }>;
  actionOptions?: Array<{
    labelEn: string;
    labelAr: string;
    actionKey: string;
    payload?: any;
  }>;
}

export interface DayGiMultiOptionItem {
  id: string;
  titleEn: string;
  titleAr: string;
  category: 'RELAX' | 'FOOD' | 'ACTIVITY' | 'CULTURE';
  location: string;
  travelTimeMins: number;
  priceEGP: number;
  whyItFitsEn: string;
  whyItFitsAr: string;
  skuId?: string;
  actionKey?: string;
  actionPayload?: any;
}

export interface DayGiMultiOptionResult {
  postActivityContext?: {
    originalActivity: string;
    originalActivityAr: string;
    endTime: string;
    location: string;
    availableWindowMins: number;
  };
  options: DayGiMultiOptionItem[];
}

export interface DayGiMultiActionConfirmation {
  step1OldItem: {
    id: string;
    titleEn: string;
    titleAr: string;
    time: string;
    currentPriceEGP: number;
  };
  step2Alternative: {
    id: string;
    titleEn: string;
    titleAr: string;
    newTime: string;
    newPriceEGP: number;
    supplierName: string;
  };
  step3PriceVariance: {
    diffEGP: number;
    ledgerNoteEn: string;
    ledgerNoteAr: string;
  };
  step4ScheduleImpact: {
    originalSlot: string;
    newSlot: string;
    impactSummaryEn: string;
    impactSummaryAr: string;
  };
  step5ActionKey: string;
  step5Payload: any;
  risk: DayGiActionRisk;
}

export interface DayGiResponse {
  replyText: string;
  replyTextAr: string;
  whyThis: string;
  whyThisAr: string;
  actionType: DayGiActionType;
  actionRisk?: DayGiActionRisk;
  actionTitle?: string;
  actionTitleAr?: string;
  actionData?: DayGiActionData;
  mode?: 'DISCOVER' | 'PLAN' | 'ACT';
  parsedIntent?: DayGiParsedIntent;
  constraints?: DayGiConstraintModel;
  taskPlan?: DayGiTaskPlan;
  orchestratedTask?: DayGiOrchestratedTask;
  whatChanged?: DayGiWhatChangedCard;
  multiOptions?: DayGiMultiOptionResult;
  multiActionConfirmation?: DayGiMultiActionConfirmation;
  tripHealth?: DayGiTripHealth;
  requiresConfirmation?: boolean;
  confirmationPayload?: {
    actionKey: string;
    descriptionEn: string;
    descriptionAr: string;
    parameters: Record<string, any>;
  };
  sourceConfidence?: {
    source: 'VERIFIED_FACT' | 'CURATED_DAHAB_CONTEXT' | 'AI_INFERENCE';
    freshness: string;
    confidenceScore: number;
  };
  suggestedFollowUps?: Array<{
    textEn: string;
    textAr: string;
    query: string;
  }>;
}

export interface DayGiQueryContext {
  prompt: string;
  language?: 'en' | 'ar';
  /**
   * Required. Identity comes from the verified session — the handler sets it,
   * never the request body — and the service used to fall back to the seeded
   * demo traveler when it was missing, which routed a real traveler's memory,
   * tasks and telemetry into one shared record.
   */
  userId: string;
  tripId?: string;
  currentLocation?: string;
  availableMinutes?: number;
  currentDayNumber?: number;
  currentTime?: string;
  userRole?: 'Traveler' | 'Supplier' | 'Operations' | 'Admin';
  userPace?: 'Relaxed' | 'Balanced' | 'Active';
  userBudget?: 'Budget' | 'Moderate' | 'Premium';
  interests?: string[];
  activeBookingsCount?: number;
  activeTripTitle?: string;
  tripDays?: any[];
  memory?: Partial<DayGiStructuredMemory>;
}

