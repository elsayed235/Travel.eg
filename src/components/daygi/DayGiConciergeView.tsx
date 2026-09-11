import React, { useState, useEffect, useRef } from 'react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';
import { 
  DayGiResponse, 
  DayGiActionType, 
  DayGiActionRisk,
  DayGiTaskPlan,
  DayGiWhatChangedCard,
  DayGiMultiOptionResult,
  DayGiMultiActionConfirmation,
  DayGiTripHealth,
  DayGiTripHealthIssue,
  DayGiStructuredMemory,
  DayGiProactiveSuggestion,
  DayGiConstraintModel,
  DayGiOrchestratedTask,
  DayGiOrchestratedStep,
  DayGiTaskState,
  DayGiStepState,
  DayGiRecoveryOption
} from '../../types';
import { 
  Sparkles, 
  Send, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  Home, 
  Utensils, 
  Compass, 
  Calendar, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle, 
  ShieldCheck, 
  Flame, 
  ChevronRight,
  RefreshCw,
  Waves,
  ShoppingBag,
  AlertTriangle,
  DollarSign,
  TrendingDown,
  Activity,
  Layers,
  ArrowUpRight,
  Check,
  Zap,
  SlidersHorizontal,
  FileText,
  HeartPulse,
  Brain,
  Bell,
  X,
  Sliders,
  ChevronDown,
  Info,
  GitBranch,
  Cpu,
  RotateCcw,
  CheckSquare,
  History,
  Lock,
  Database
} from 'lucide-react';
import { BookNowCommerceModal } from '../commerce/BookNowCommerceModal';
import { ChatMessage } from './types';

export const DayGiConciergeView: React.FC = () => {
  const { 
    profile, 
    tripDays, 
    tripBrief, 
    bookings, 
    activeDayGiPrompt, 
    setActiveDayGiPrompt, 
    shiftActivityBetweenDays,
    navigateTo,
    showToast,
    user,
    isSignedIn,
    activeTrip,
    goBack,
    canGoBack
  } = useTrip();

  /**
   * The traveler's own trip.
   *
   * Every DayGI call on this page — the proactive suggestions, the trip-health
   * read, the task list and all seventeen funnel events — was scoped to the
   * literal 'DHB-TRIP-894', the seeded demo trip. So the assistant answered
   * about somebody else's itinerary, and the product telemetry attributed every
   * traveler's session to one trip.
   */
  const activeTripId = activeTrip?.id || '';

  /**
   * This view keeps its own language state so the traveler can flip the
   * concierge's language without changing the whole site. It was hardcoded to
   * 'ar' and never looked at the global setting, so switching the site to
   * English and opening the AI Director still produced a fully Arabic screen —
   * the user's explicit language choice was silently ignored on this page.
   *
   * Seed from the global language and follow it when it changes; the in-page
   * toggle still wins after that.
   */
  const { language: siteLanguage , t} = useLanguage();
  const [lang, setLang] = useState<'ar' | 'en'>(siteLanguage);
  useEffect(() => { setLang(siteLanguage); }, [siteLanguage]);

  const [currentLocation, setCurrentLocation] = useState<string>('Lighthouse');
  const [availableMinutes, setAvailableMinutes] = useState<number>(120);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [executingActionId, setExecutingActionId] = useState<string | null>(null);
  
  // Trip Health & Memory State
  const [tripHealth, setTripHealth] = useState<DayGiTripHealth | null>(null);
  const [proactiveSuggestions, setProactiveSuggestions] = useState<DayGiProactiveSuggestion[]>([]);
  const [userMemory, setUserMemory] = useState<DayGiStructuredMemory | null>(null);
  
  // DayGI 4.0 Orchestrator State
  const [orchestratedTasks, setOrchestratedTasks] = useState<DayGiOrchestratedTask[]>([]);
  const [tasksModalOpen, setTasksModalOpen] = useState<boolean>(false);
  const [executingStepId, setExecutingStepId] = useState<string | null>(null);
  const [recoveryInProgress, setRecoveryInProgress] = useState<string | null>(null);
  
  // Modals / Drawers
  const [healthModalOpen, setHealthModalOpen] = useState<boolean>(false);
  const [memoryModalOpen, setMemoryModalOpen] = useState<boolean>(false);
  const [proactiveBannerDismissed, setProactiveBannerDismissed] = useState<boolean>(false);
  const [feedbackReasonOpenId, setFeedbackReasonOpenId] = useState<string | null>(null);

  // Closed Beta Session ID
  const sessionIdRef = useRef<string>(`SESS-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);

  // Initial Funnel Tracking (DAYGI_OPENED).
  // Funnel events are attributed to the session user server-side, so there is
  // nothing to record — and nothing but a 401 to gain — before sign-in.
  useEffect(() => {
    // Was gated on `user`, the Firebase user — permanently null on a deployment
    // without Firebase Admin credentials, so this never fired for anyone.
    if (!isSignedIn) return;
    api.trackDayGiFunnel({
      sessionId: sessionIdRef.current,
      tripId: activeTripId,
      step: 'DAYGI_OPENED',
      language: lang
    });
  }, [isSignedIn, lang]);

  // Commercial modal integration
  const [bookModalOpen, setBookModalOpen] = useState<boolean>(false);
  const [selectedSkuId, setSelectedSkuId] = useState<string>('SKU-DIV-001');

  // Messages list initialized with DayGI 3.0 operating greeting
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'daygi',
      /*
       * A greeting, and nothing else.
       *
       * This message used to ship a fabricated `responsePayload` presented as
       * measured fact to every visitor, signed in or not: a hardcoded
       * "Health score 94/100", a rationale claiming to audit "live CDWS marine
       * telemetry, Cloud SQL ledger, and supplier SLAs" (none of which this
       * system reads), a `sourceConfidence` of VERIFIED_FACT / 0.99 marked
       * "Live (Synchronized with Active Itinerary)", and a four-item daily
       * briefing — breakfast at Ralphs, Lighthouse snorkeling, lunch at Ali
       * Baba, sunset at Eel Garden — with times, shown as *today's plan* to
       * people who have no trip at all.
       *
       * An assistant's first message sets what its later ones are worth.
       */
      text: t('dayGi.helloAskAnything', {
        name: profile.name ? t('dayGi.helloName', { name: profile.name }) : '',
      }),
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const lastMessageCount = useRef<number>(1);

  /**
   * Scrolls the transcript, not the document.
   *
   * `scrollIntoView` walked up to the window and scrolled the whole page, so
   * on mount the opening message dragged the page down far enough to bury the
   * concierge's own command bar underneath the fixed global navbar — the
   * traveler landed on the screen with the header, trip health and context
   * controls already off-screen. The transcript is its own scroll container
   * now, and the first paint is left where it belongs: at the top.
   */
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const el = transcriptRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  };

  useEffect(() => {
    const grew = messages.length > lastMessageCount.current;
    lastMessageCount.current = messages.length;
    // Follow the conversation only once it has actually moved. Anchoring on a
    // "first run" flag is not enough: StrictMode replays mount effects, which
    // put the opening screen back at the bottom of the transcript.
    if (grew || (isLoading && messages.length > 1)) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  // Load Initial Proactive State, Trip Health & Orchestrated Tasks
  useEffect(() => {
    // These endpoints are per-user and now require a session. Firing them while
    // signed out produced a burst of 401s on every mount and could only ever
    // return nothing; clear any state left over from a previous user instead.
    // The whole panel — suggestions, trip health, memory, tasks — was gated on
    // the Firebase user and therefore never loaded once. A traveler signed in
    // with a password opened DayGI to an empty assistant.
    if (!isSignedIn) {
      setProactiveSuggestions([]);
      setTripHealth(null);
      setUserMemory(null);
      setOrchestratedTasks([]);
      return;
    }

    // Trip-scoped reads stay home when there is no trip: firing them with an
    // empty tripId produced a burst of 400s on every mount for travelers who
    // have not planned anything yet. Memory is user-scoped and always loads.
    const fetchProactiveData = async () => {
      try {
        const [proactiveRes, healthRes, memoryRes, tasksRes] = await Promise.all([
          activeTripId ? api.getDayGiProactive(activeTripId).catch(() => null) : Promise.resolve(null),
          activeTripId ? api.getDayGiTripHealth(activeTripId).catch(() => null) : Promise.resolve(null),
          api.getDayGiMemory().catch(() => null),
          activeTripId ? api.getDayGiTasks(activeTripId).catch(() => []) : Promise.resolve([])
        ]);
        if (proactiveRes?.suggestions) {
          setProactiveSuggestions(proactiveRes.suggestions);
        }
        if (healthRes) {
          setTripHealth(healthRes);
        }
        if (memoryRes) {
          setUserMemory(memoryRes);
        }
        if (Array.isArray(tasksRes)) {
          setOrchestratedTasks(tasksRes);
        }
      } catch (err) {
        console.debug('Proactive data initialization handled:', err);
      }
    };
    fetchProactiveData();
    // Reload when the signed-in user changes. This previously depended on
    // `profile.id`, which does not exist on TravelerProfile and was therefore
    // permanently undefined — so the effect ran once and never refreshed on
    // sign-in or sign-out, leaving one user's DayGI state on screen for the next.
  }, [isSignedIn, activeTripId]);

  // Handle active pre-set prompt passed from navigation
  useEffect(() => {
    if (activeDayGiPrompt) {
      handleSendMessage(activeDayGiPrompt);
      setActiveDayGiPrompt(null);
    }
  }, [activeDayGiPrompt]);

  const handleSendMessage = async (promptToSend?: string) => {
    const text = (promptToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsgId = `msg-user-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!promptToSend) setInputText('');
    setIsLoading(true);

    api.trackDayGiEvent('prompt_submitted', { prompt: text, location: currentLocation, availableMinutes });
    api.trackDayGiFunnel({
      sessionId: sessionIdRef.current,
      tripId: activeTripId,
      step: 'INTENT_ENTERED',
      language: lang
    });

    try {
      const startTime = Date.now();
      const response: DayGiResponse = await api.queryDayGi({
        prompt: text,
        language: lang,
        currentLocation,
        availableMinutes,
        userPace: profile.pace || 'Balanced',
        userBudget: profile.budget || 'Moderate',
        interests: profile.interests,
        activeBookingsCount: bookings.length,
        activeTripTitle: tripBrief ? `${tripBrief.durationDays}-Day ${tripBrief.tripDynamic} Trip` : 'Dahab Discovery'
      });
      const latencyMs = Date.now() - startTime;

      const daygiMsg: ChatMessage = {
        id: `msg-daygi-${Date.now()}`,
        sender: 'daygi',
        text: lang === 'ar' ? (response.replyTextAr || response.replyText) : response.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        responsePayload: response
      };

      setMessages((prev) => [...prev, daygiMsg]);

      // Instrument INTENT_UNDERSTOOD & RECOMMENDATION_SHOWN
      api.trackDayGiFunnel({
        sessionId: sessionIdRef.current,
        tripId: activeTripId,
        step: 'INTENT_UNDERSTOOD',
        intentKey: response.parsedIntent?.intent || response.actionType,
        confidenceScore: response.parsedIntent?.confidence || 0.94,
        latencyMs,
        language: lang
      });

      if (response.multiOptions || response.orchestratedTask || response.multiActionConfirmation) {
        api.trackDayGiFunnel({
          sessionId: sessionIdRef.current,
          tripId: activeTripId,
          step: 'RECOMMENDATION_SHOWN',
          intentKey: response.parsedIntent?.intent || response.actionType,
          language: lang
        });
      }
      
      // Update health if included in response
      if (response.tripHealth) {
        setTripHealth(response.tripHealth);
      }

      // If response generated an orchestrated task, track it in task pool
      if (response.orchestratedTask) {
        setOrchestratedTasks((prev) => {
          const filtered = prev.filter(t => t.taskId !== response.orchestratedTask!.taskId);
          return [response.orchestratedTask!, ...filtered];
        });
      }

      api.trackDayGiEvent('recommendation_viewed', { 
        mode: response.mode,
        actionType: response.actionType, 
        actionTitle: response.actionTitle 
      });
    } catch (err: any) {
      console.warn('DayGI query error:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-daygi-fallback-${Date.now()}`,
        sender: 'daygi',
        text: t('daygi.dahabWatersAreCalm'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteTaskStep = async (taskId: string, stepId: string, actionToken: string) => {
    setExecutingStepId(stepId);
    api.trackDayGiFunnel({
      sessionId: sessionIdRef.current,
      tripId: activeTripId,
      step: 'ACTION_EXECUTED',
      actionType: 'ORCHESTRATED_STEP',
      language: lang
    });

    try {
      const updatedTask = await api.executeDayGiTaskStep(taskId, stepId, actionToken);
      
      // Update task in state and in message payloads
      setOrchestratedTasks(prev => prev.map(t => t.taskId === taskId ? updatedTask : t));
      setMessages(prev => prev.map(m => {
        if (m.responsePayload?.orchestratedTask?.taskId === taskId) {
          return {
            ...m,
            responsePayload: {
              ...m.responsePayload,
              orchestratedTask: updatedTask
            }
          };
        }
        return m;
      }));

      // If step changed trip schedule, reflect immediately
      const executedStep = updatedTask.steps.find((s: DayGiOrchestratedStep) => s.stepId === stepId);
      if (executedStep?.actionKey === 'APPLY_TRIP_SHIFT' && executedStep.payload) {
        const { activityId = 'act-canyon-dive', fromDay = 3, toDay = 4, newTimeSlot = '10:00 AM' } = executedStep.payload;
        shiftActivityBetweenDays(activityId, fromDay, toDay, newTimeSlot);
      }

      // Funnel: ACTION_VERIFIED, TRIP_UPDATED, USER_OUTCOME
      api.trackDayGiFunnel({
        sessionId: sessionIdRef.current,
        tripId: activeTripId,
        step: 'ACTION_VERIFIED',
        actionType: executedStep?.actionKey,
        language: lang
      });
      api.trackDayGiFunnel({
        sessionId: sessionIdRef.current,
        tripId: activeTripId,
        step: 'TRIP_UPDATED',
        language: lang
      });
      api.trackDayGiFunnel({
        sessionId: sessionIdRef.current,
        tripId: activeTripId,
        step: 'USER_OUTCOME',
        language: lang
      });

      showToast(
        t('dayGi.stepExecutedVerified', {
          name: lang === 'ar'
            ? (executedStep?.nameAr || executedStep?.name || '')
            : (executedStep?.name || ''),
        })
      );
      api.trackDayGiEvent('task_step_executed', { taskId, stepId, status: updatedTask.state });
    } catch (err: any) {
      showToast(err.message || 'Task step execution failed');
    } finally {
      setExecutingStepId(null);
    }
  };

  const handleApplyTaskRecovery = async (taskId: string, recoveryOptionId: string) => {
    setRecoveryInProgress(recoveryOptionId);
    try {
      const updatedTask = await api.applyDayGiTaskRecovery(taskId, recoveryOptionId);
      setOrchestratedTasks(prev => prev.map(t => t.taskId === taskId ? updatedTask : t));
      setMessages(prev => prev.map(m => {
        if (m.responsePayload?.orchestratedTask?.taskId === taskId) {
          return {
            ...m,
            responsePayload: {
              ...m.responsePayload,
              orchestratedTask: updatedTask
            }
          };
        }
        return m;
      }));

      showToast(
        t('daygi.recoveryPlanAppliedWith')
      );
    } catch (err: any) {
      showToast(err.message || 'Recovery application failed');
    } finally {
      setRecoveryInProgress(null);
    }
  };

  const handleCancelTask = async (taskId: string) => {
    try {
      const updatedTask = await api.cancelDayGiTask(taskId, 'User requested cancellation');
      setOrchestratedTasks(prev => prev.map(t => t.taskId === taskId ? updatedTask : t));
      setMessages(prev => prev.map(m => {
        if (m.responsePayload?.orchestratedTask?.taskId === taskId) {
          return {
            ...m,
            responsePayload: {
              ...m.responsePayload,
              orchestratedTask: updatedTask
            }
          };
        }
        return m;
      }));
      showToast(t('daygi.taskSafelyCancelled'));
    } catch (err: any) {
      showToast(err.message || 'Cancel failed');
    }
  };

  const handleFeedback = async (msgId: string, isPositive: boolean, reasonTag?: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId) {
          return {
            ...m,
            liked: isPositive ? true : false,
            disliked: !isPositive ? true : false
          };
        }
        return m;
      })
    );

    const msg = messages.find(m => m.id === msgId);
    const intentKey = msg?.responsePayload?.parsedIntent?.intent || msg?.responsePayload?.actionType || 'CONVERSATION';

    try {
      await api.submitDayGiBetaFeedback({
        messageId: msgId,
        tripId: activeTripId,
        rating: isPositive ? 'HELPFUL' : 'NOT_HELPFUL',
        reasonTag,
        intentKey,
        language: lang
      });
    } catch (e) {
      console.warn('Feedback submit ignored:', e);
    }

    setFeedbackReasonOpenId(null);
    showToast(isPositive ? (t('daygi.thankYouFeedbackRecorded')) : (t('daygi.feedbackNotedToImprove')));
  };

  const handleExecuteAction = async (msgId: string, actionKey: string, payload: any) => {
    setExecutingActionId(msgId);
    api.trackDayGiFunnel({
      sessionId: sessionIdRef.current,
      tripId: activeTripId,
      step: 'ACTION_EXECUTED',
      actionType: actionKey,
      language: lang
    });

    try {
      const result = await api.executeDayGiAction({
        actionKey,
        payload
      });

      if (actionKey === 'APPLY_TRIP_SHIFT' && payload) {
        const { activityId = 'act-canyon-dive', fromDay = 3, toDay = 4, newTimeSlot = '10:00 AM' } = payload;
        shiftActivityBetweenDays(activityId, fromDay, toDay, newTimeSlot);
      }

      setMessages(prev => prev.map(m => {
        if (m.id === msgId) {
          return {
            ...m,
            actionExecuted: true,
            executionResult: result
          };
        }
        return m;
      }));

      // Refresh health
      const healthRes = await api.getDayGiTripHealth(activeTripId).catch(() => null);
      if (healthRes) setTripHealth(healthRes);

      api.trackDayGiFunnel({
        sessionId: sessionIdRef.current,
        tripId: activeTripId,
        step: 'ACTION_VERIFIED',
        actionType: actionKey,
        language: lang
      });
      api.trackDayGiFunnel({
        sessionId: sessionIdRef.current,
        tripId: activeTripId,
        step: 'TRIP_UPDATED',
        language: lang
      });
      api.trackDayGiFunnel({
        sessionId: sessionIdRef.current,
        tripId: activeTripId,
        step: 'USER_OUTCOME',
        language: lang
      });

      showToast(lang === 'ar' ? result.messageAr : result.messageEn);
      api.trackDayGiEvent('action_executed_success', { actionKey, auditLogId: result.auditLogId });
    } catch (err: any) {
      showToast(err.message || 'Action execution error');
    } finally {
      setExecutingActionId(null);
    }
  };

  const handleUpdatePreferences = async (newPrefs: any) => {
    try {
      const updated = await api.updateDayGiMemory(newPrefs);
      setUserMemory(updated);
      showToast(t('daygi.structuredMemoryPreferencesUpdated'));
    } catch (e: any) {
      showToast('Error updating preferences');
    }
  };

  const handleOpenBookingHandoff = (skuId: string = 'SKU-DIV-001') => {
    setSelectedSkuId(skuId);
    setBookModalOpen(true);
    api.trackDayGiEvent('booking_handoff', { skuId });
  };

  const QUICK_PROMPTS = [
    {
      titleAr: 'عايز حاجة هادية بعد الغطس',
      titleEn: 'Post-dive calm spots',
      prompt: 'عايز حاجة هادية بعد الغطس'
    },
    {
      titleAr: 'إيه اللي اتغير في رحلتي؟',
      titleEn: 'What changed in my trip?',
      prompt: 'إيه اللي اتغير في الرحلة؟'
    },
    {
      titleAr: 'افحص صحة رحلتي والجدول',
      titleEn: 'Check trip health',
      prompt: 'افحص صحة الرحلة والجدول'
    },
    {
      titleAr: 'وفّرلي 2000 جنيه من الميزانية',
      titleEn: 'Save 2000 EGP on budget',
      prompt: 'وفّرلي 2000 جنيه'
    },
    {
      titleAr: 'خلّي بكرة أهدى ومش عايز أصحى بدري',
      titleEn: 'Relaxed tomorrow & late morning',
      prompt: 'خلّي بكرة أهدى ومش عايز أصحى بدري'
    },
    {
      titleAr: 'احجز لي غطسة كانيون صباحية',
      titleEn: 'Book Canyon dive hold',
      prompt: 'احجز لي غطسة كانيون لبكرة الصبح'
    },
    {
      titleAr: 'الغطسة اتلغت بسبب الرياح',
      titleEn: 'Weather disruption recovery',
      prompt: 'الغطسة اتلغت بسبب الرياح'
    },
    {
      titleAr: 'معايا ساعتين وقريب من اللايتهاوس',
      titleEn: '2 hours free @ Lighthouse',
      prompt: 'معايا ساعتين وأنا قريب من اللايتهاوس، أعمل إيه؟'
    }
  ];

  /* ----------------------------------------------------------------
     Derived view state for the command bar and the desktop context rail.
     ---------------------------------------------------------------- */
  /*
   * Null until the server has actually scored this trip.
   *
   * This was `?? 94`, so a signed-out visitor with no trip was shown
   * "94% — Every booking is confirmed and nothing clashes" about bookings
   * that do not exist. A score is a measurement or it is nothing — and a
   * NO_TRIP health (score 0) is also nothing worth rendering as a percentage.
   */
  const healthScore = tripHealth && tripHealth.status !== 'NO_TRIP' ? tripHealth.score : null;
  const openIssues = tripHealth?.issues?.length ?? 0;
  const liveSuggestions = proactiveSuggestions.filter((s) => !s.dismissed);
  const activeTasks = orchestratedTasks.filter(
    (t) => t.state !== 'COMPLETED' && t.state !== 'CANCELLED'
  );

  /**
   * Escape closes the top-most overlay.
   *
   * Both inspectors were plain divs with no dialog semantics and no keyboard
   * exit: once open, the only way out was the mouse, and screen readers were
   * never told a dialog had appeared.
   */
  useEffect(() => {
    if (!healthModalOpen && !memoryModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      if (memoryModalOpen) setMemoryModalOpen(false);
      else setHealthModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [healthModalOpen, memoryModalOpen]);

  const getRiskBadge = (risk?: DayGiActionRisk) => {
    switch (risk) {
      case 'SAFETY_CRITICAL':
        return (
          <span className="bg-[var(--dg-risk)]/18 border border-[var(--dg-risk)]/40 text-[var(--dg-risk)] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5" />
            {t('daygi.safetyCritical')}
          </span>
        );
      case 'FINANCIAL':
        return (
          <span className="bg-[var(--dg-fin)]/18 border border-[var(--dg-fin)]/40 text-[var(--dg-fin)] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <DollarSign className="w-2.5 h-2.5" />
            {t('daygi.ledgerProtected')}
          </span>
        );
      case 'COMMERCE':
        return (
          <span className="bg-[var(--dg-warn)]/18 border border-[var(--dg-warn)]/40 text-[var(--dg-warn)] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShoppingBag className="w-2.5 h-2.5" />
            {t('daygi.commerceHold')}
          </span>
        );
      case 'LOW_RISK':
        return (
          <span className="bg-[var(--dg-info)]/18 border border-[var(--dg-info)]/40 text-[var(--dg-info)] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <SlidersHorizontal className="w-2.5 h-2.5" />
            {t('daygi.lowRiskShift')}
          </span>
        );
      case 'READ_ONLY':
      default:
        return (
          <span className="bg-[var(--dg-ok)]/18 border border-[var(--dg-ok)]/40 text-[var(--dg-ok)] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-2.5 h-2.5" />
            {t('daygi.readOnlyFact')}
          </span>
        );
    }
  };

  const getModeBadge = (mode?: 'DISCOVER' | 'PLAN' | 'ACT') => {
    switch (mode) {
      case 'ACT':
        return (
          <span className="bg-[var(--dg-ok)]/18 border border-[var(--dg-ok)]/40 text-[var(--dg-ok)] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Zap className="w-2.5 h-2.5" />
            {t('daygi.directActionACT')}
          </span>
        );
      case 'PLAN':
        return (
          <span className="bg-[var(--dg-gold)]/20 border border-[var(--dg-gold)]/40 text-[var(--dg-gold)] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <SlidersHorizontal className="w-2.5 h-2.5" />
            {t('daygi.itineraryPlanPLAN')}
          </span>
        );
      case 'DISCOVER':
      default:
        return (
          <span className="bg-[var(--dg-teal)]/20 border border-[var(--dg-teal)]/40 text-[var(--dg-teal)] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Compass className="w-2.5 h-2.5" />
            {t('daygi.discoveryDISCOVER')}
          </span>
        );
    }
  };

  return (
    <div
      className="daygi-surface bg-[var(--dg-canvas)] text-[var(--dg-text)] flex flex-col relative h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5rem)] overflow-hidden"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >


      {/*
        Command bar.

        Previously a single wrapping row inside a max-w-5xl container while the
        transcript below used max-w-4xl, so the brand mark and the language
        toggle hung past both edges of the conversation and nothing lined up.
        It is now two deliberate rows — identity/controls, then trip context —
        inside the same container the transcript uses.
      */}
      <header className="relative z-20 shrink-0 bg-[var(--dg-panel)]/95 backdrop-blur-md border-b border-[var(--dg-line)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">

          {/* Row 1 — identity, trip health, session controls */}
          <div className="flex items-center justify-between gap-3 py-3">

            {/*
              A name, and that is all.

              This carried a gradient tile, a "3.0" version chip and a line of
              positioning copy — "Watches your trip live, remembers your
              preferences, and runs multi-step tasks only after you approve" —
              re-read on every visit by someone who is here to ask one
              question. A product describes itself once, in onboarding, not
              permanently above the thing it does.
            */}
            <div className="flex items-center gap-1.5 min-w-0">
              {/*
                The way out.

                DayGI is opened from a floating button on top of whatever the
                traveler was doing, and it no longer has a navbar tab holding
                its place — so without this, closing it means guessing which of
                Discover, My Trip or Dahab Live they came from. It returns to
                the actual previous page, and reads "Home" instead of "Back"
                when there is no previous page to promise.
              */}
              <button
                type="button"
                onClick={goBack}
                aria-label={
                  canGoBack
                    ? (t('daygi.backToThePrevious'))
                    : (t('daygi.home'))
                }
                className="dg-focus -ms-1.5 w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-[var(--dg-text-2)] hover:text-[var(--dg-text)] hover:bg-[var(--dg-tint)] transition-colors"
              >
                {canGoBack
                  ? <ArrowLeft className="w-4.5 h-4.5 rtl:rotate-180" aria-hidden="true" />
                  : <Home className="w-4.5 h-4.5" aria-hidden="true" />}
              </button>

              <h1 className="text-base font-semibold text-[var(--dg-text)] tracking-tight truncate min-w-0">
                {t('daygi.dayGI')}
              </h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">

              {/*
                Shown only once the server has actually scored this trip.
                It used to fall back to a hardcoded 94% and render in
                confident green for a signed-out visitor with no bookings.
              */}
              {healthScore !== null && (
                <button
                  onClick={() => setHealthModalOpen(true)}
                  className="dg-focus h-9 px-3 rounded-lg text-xs font-medium text-[var(--dg-text-2)] hover:text-[var(--dg-text)] hover:bg-[var(--dg-tint)] flex items-center gap-1.5 transition-colors"
                  aria-label={t('daygi.tripHealthPercentOpen', { healthScore })}
                >
                  <HeartPulse className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="dg-num">{healthScore}%</span>
                </button>
              )}

              <button
                onClick={() => setMemoryModalOpen(true)}
                className="dg-focus w-9 h-9 rounded-lg flex items-center justify-center text-[var(--dg-text-2)] hover:text-[var(--dg-text)] hover:bg-[var(--dg-tint)] transition-colors"
                aria-label={t('daygi.whatDayGIRemembersAbout')}
              >
                <Brain className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>

              {/* Language */}
              <div
                role="group"
                aria-label={t('daygi.conciergeLanguage')}
                className="flex items-center bg-[var(--dg-tint)] border border-[var(--dg-line)] p-1 rounded-xl h-9"
              >
                <button
                  onClick={() => setLang('ar')}
                  aria-pressed={lang === 'ar'}
                  className={`dg-focus px-2.5 h-7 rounded-lg text-xs transition-colors ${lang === 'ar' ? 'bg-[var(--dg-panel)] text-[var(--dg-text)] font-semibold shadow-sm' : 'text-[var(--dg-muted)] hover:text-[var(--dg-text)]'}`}
                >
                  ع
                </button>
                <button
                  onClick={() => setLang('en')}
                  aria-pressed={lang === 'en'}
                  className={`dg-focus px-2.5 h-7 rounded-lg text-xs transition-colors ${lang === 'en' ? 'bg-[var(--dg-panel)] text-[var(--dg-text)] font-semibold shadow-sm' : 'text-[var(--dg-muted)] hover:text-[var(--dg-text)]'}`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>

          {/*
            Row 2 — the two facts that change the answer.

            Kept because they are inputs, not decoration: "somewhere calm" means
            something different at the Blue Hole with four hours than at the
            Lighthouse with one. The "Answering for:" label is gone — the
            controls say what they are — and the chips lost their borders and
            fills so the row reads as a setting rather than a second toolbar.
          */}
          <div className="flex items-center gap-1 pb-2.5 overflow-x-auto scrollbar-none">

            <label className="flex items-center gap-1.5 hover:bg-[var(--dg-tint)] ps-2 pe-1 h-8 rounded-lg shrink-0 cursor-pointer transition-colors">
              <MapPin className="w-3.5 h-3.5 text-[var(--dg-muted)] shrink-0" aria-hidden="true" />
              <span className="sr-only">{t('daygi.yourCurrentLocationIn')}</span>
              <select
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                aria-label={t('daygi.yourCurrentLocationIn')}
                className="dg-focus bg-transparent text-[var(--dg-text-2)] outline-none text-xs cursor-pointer py-1"
              >
                <option value="Lighthouse" className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{t('daygi.lighthouse')}</option>
                <option value="Eel Garden" className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{t('daygi.eelGarden')}</option>
                <option value="The Canyon" className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{t('daygi.theCanyon')}</option>
                <option value="Blue Hole" className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{t('daygi.blueHole')}</option>
                <option value="Laguna" className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{t('daygi.laguna')}</option>
              </select>
            </label>

            <label className="flex items-center gap-1.5 hover:bg-[var(--dg-tint)] ps-2 pe-1 h-8 rounded-lg shrink-0 cursor-pointer transition-colors">
              <Clock className="w-3.5 h-3.5 text-[var(--dg-muted)] shrink-0" aria-hidden="true" />
              <span className="sr-only">{t('daygi.timeYouHaveAvailable')}</span>
              <select
                value={availableMinutes}
                onChange={(e) => setAvailableMinutes(Number(e.target.value))}
                aria-label={t('daygi.timeYouHaveAvailable')}
                className="dg-focus bg-transparent text-[var(--dg-text-2)] outline-none text-xs cursor-pointer py-1"
              >
                <option value={60} className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{t('daygi.1FreeHour')}</option>
                <option value={120} className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{t('daygi.2FreeHours')}</option>
                <option value={180} className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{t('daygi.3FreeHours')}</option>
                <option value={240} className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{t('daygi.4FreeHours')}</option>
              </select>
            </label>

            {/*
              Removed: a pulsing green "Sea: green flag" pill. It was a literal
              constant — no reading, no timestamp, no source — announcing safe
              water conditions to a diver. /api/telemetry/weather returns the
              real observation; until this reads it, it says nothing.
            */}
          </div>
        </div>
      </header>

      {/* Proactive Suggestion Alert Banner */}
      {!proactiveBannerDismissed && liveSuggestions.length > 0 && (
        <div className="relative z-10 shrink-0 bg-[var(--dg-gold)]/10 border-b border-[var(--dg-gold)]/25">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0 text-[var(--dg-text-2)]">
              <Bell className="w-4 h-4 text-[var(--dg-gold)] shrink-0 motion-safe:animate-pulse" aria-hidden="true" />
              <span className="font-bold text-[var(--dg-gold)] shrink-0">
                {t('daygi.proactiveAlert')}
              </span>
              <span className="truncate">
                {lang === 'ar' ? liveSuggestions[0].titleAr : liveSuggestions[0].titleEn}
              </span>
              {liveSuggestions.length > 1 && (
                <span className="dg-num shrink-0 text-[var(--dg-muted)] hidden sm:inline">
                  +{liveSuggestions.length - 1}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/*
                Gated on actionKey, which is what the server actually sends
                (see daygiTripHealthService.getProactiveSuggestions). The
                previous gate, `actionTriggerPrompt`, is not part of
                DayGiProactiveSuggestion and was always undefined, so this
                "View Action" button never rendered for any suggestion.
              */}
              {liveSuggestions[0].actionKey && (
                <button
                  onClick={() =>
                    handleExecuteAction(
                      `proactive-${liveSuggestions[0].id}`,
                      liveSuggestions[0].actionKey!,
                      liveSuggestions[0].actionPayload ?? {}
                    )
                  }
                  className="dg-focus bg-[var(--dg-gold)] hover:bg-[var(--dg-gold-hi)] text-[var(--dg-gold-ink)] font-bold px-3 h-8 rounded-lg text-xs flex items-center gap-1 transition-colors"
                >
                  <span>{t('daygi.viewAction')}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
              )}
              <button
                onClick={() => setProactiveBannerDismissed(true)}
                aria-label={t('daygi.dismissAlert')}
                className="dg-focus w-8 h-8 rounded-lg flex items-center justify-center text-[var(--dg-muted)] hover:text-[var(--dg-text)] hover:bg-[var(--dg-tint-2)] transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/*
        Work area.

        The view is now a fixed-height app shell: the transcript is the only
        thing that scrolls, so the composer stays reachable no matter how long
        the conversation runs (it used to sit at the bottom of an ever-growing
        page) and the command bar can never be scrolled under the global navbar.
      */}
      <div className="relative z-10 flex-1 min-h-0 w-full max-w-3xl mx-auto px-4 sm:px-6 flex flex-col">

        {/* Main Chat Stream Container */}
        <section
          aria-label={t('daygi.dayGIConversation')}
          className="flex-1 min-h-0 flex flex-col"
        >

        {/* Messages List — announced as a live log so replies reach assistive tech */}
        <div
          ref={transcriptRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
          aria-label={t('daygi.conversationTranscript')}
          tabIndex={0}
          /*
            Before the traveler has said anything there is no transcript to
            read, so the greeting sits in the middle of the space rather than
            pinned to the top of an empty column. Once the conversation starts
            it anchors to the top and scrolls normally.
          */
          className={`dg-scroll dg-focus flex-1 min-h-0 overflow-y-auto space-y-7 pe-1 ${
            messages.length <= 1 ? 'flex flex-col justify-center py-6' : 'py-8'
          }`}
        >
          {messages.map((msg) => {
            const isDayGi = msg.sender === 'daygi';
            const payload = msg.responsePayload;
            const isExecuted = msg.actionExecuted;
            const constraints = payload?.constraints;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isDayGi ? 'justify-start' : 'justify-end'} animate-in fade-in-50 duration-300`}
              >
                {isDayGi && (
                  <div className="w-7 h-7 rounded-full border border-[var(--dg-line)] flex items-center justify-center text-[var(--dg-teal)] shrink-0 mt-0.5" aria-hidden="true">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`space-y-3 min-w-0 text-[var(--dg-text)] ${isDayGi ? 'flex-1' : 'max-w-[85%]'}`}>

                  {/*
                    The assistant speaks on the page; only the traveler gets a
                    bubble.

                    Both sides used to sit in bordered, shadowed containers —
                    the reply in a panel, the question in a gold gradient — so a
                    conversation read as a stack of receipts. Giving the answer
                    no container is what makes it read as an answer, and it is
                    the one thing every chat interface worth copying does.
                  */}
                  <div
                    className={`text-sm leading-relaxed ${
                      isDayGi
                        ? ''
                        : 'bg-[var(--dg-tint-2)] rounded-2xl rounded-se-md px-4 py-2.5'
                    }`}
                  >
                    {/*
                      The badge row is gone. Every reply carried a mode chip
                      ("Discovery (DISCOVER)"), a risk chip ("Read-Only Fact")
                      and a timestamp — three pieces of system vocabulary above
                      one sentence of actual answer. None of it is what the
                      traveler came to read, and "Just now" on every message in
                      a live conversation is not information.
                    */}
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    
                    {/* Active Parsed Constraints Pills (MUST_HAVE, PREFER, AVOID) */}
                    {isDayGi && constraints && (constraints.mustHave?.length > 0 || constraints.prefer?.length > 0 || constraints.avoid?.length > 0) && (
                      <div className="mt-3 pt-2.5 border-t border-[var(--dg-line)] flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-[var(--dg-muted)] font-semibold">{t('daygi.activeConstraints')}</span>
                        {constraints.mustHave?.map((c, i) => (
                          <span key={i} className="bg-[var(--dg-ok)]/18 text-[var(--dg-ok)] px-2 py-0.5 rounded border border-[var(--dg-ok)]/32">
                            ✓ {lang === 'ar' ? (constraints.mustHaveAr?.[i] || c) : c}
                          </span>
                        ))}
                        {constraints.prefer?.map((c, i) => (
                          <span key={i} className="bg-[var(--dg-gold)]/20 text-[var(--dg-gold)] px-2 py-0.5 rounded border border-[var(--dg-gold)]/30">
                            ★ {lang === 'ar' ? (constraints.preferAr?.[i] || c) : c}
                          </span>
                        ))}
                        {constraints.avoid?.map((c, i) => (
                          <span key={i} className="bg-[var(--dg-risk)]/18 text-[var(--dg-risk)] px-2 py-0.5 rounded border border-[var(--dg-risk)]/32">
                            ✕ {lang === 'ar' ? (constraints.avoidAr?.[i] || c) : c}
                          </span>
                        ))}
                      </div>
                    )}

                    {/*
                      Removed: a "Verified Cloud SQL Truth" stamp with a
                      freshness line. The store is a JSON file, there is no
                      Cloud SQL in the read path, and a confidence badge on an
                      unverifiable answer buys trust it has not earned. When a
                      reply rests on something specific, the reply says so in
                      words.
                    */}
                  </div>

                  {/* DayGI Structured Action & Rationale Cards */}
                  {isDayGi && payload && (
                    <div className="space-y-3">
                      
                      {/*
                        The reasoning now reads as a quiet line under the
                        answer instead of a bordered, titled, teal-accented
                        card. It is a footnote, and it was formatted like a
                        second headline.
                      */}
                      {(payload.whyThis || payload.whyThisAr) && (
                        <p className="text-xs leading-relaxed text-[var(--dg-muted)] ps-0.5">
                          {lang === 'ar' ? (payload.whyThisAr || payload.whyThis) : payload.whyThis}
                        </p>
                      )}

                      {/* Task Plan Progress Pipeline (Multi-Step Task Execution) */}
                      {payload.taskPlan && (
                        <div className="bg-[var(--dg-panel)] border border-[var(--dg-teal)]/40 rounded-xl p-3.5 space-y-2.5 shadow-md">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[var(--dg-text)] text-xs flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-[var(--dg-teal)]" />
                              <span>{lang === 'ar' ? payload.taskPlan.titleAr : payload.taskPlan.title}</span>
                            </span>
                            <span className="text-[11px] text-[var(--dg-muted)] font-mono">
                              <span className="dg-num">{payload.taskPlan.steps.filter(s => s.status === 'EXECUTED').length} / {payload.taskPlan.steps.length}</span> {t('daygi.done')}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            {payload.taskPlan.steps.map((step) => (
                              <div 
                                key={step.stepNumber} 
                                className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg border ${
                                  step.status === 'EXECUTED' 
                                    ? 'bg-[var(--dg-ok-well)] border-[var(--dg-ok)]/32 text-[var(--dg-ok)]'
                                    : step.status === 'READY_FOR_CONFIRMATION'
                                    ? 'bg-[var(--dg-gold)]/10 border-[var(--dg-gold)]/40 text-[var(--dg-gold)]'
                                    : 'bg-[var(--dg-tint)] border-[var(--dg-line-soft)] text-[var(--dg-muted)]'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="w-4 h-4 rounded-full bg-[var(--dg-tint-2)] flex items-center justify-center text-[11px] font-bold">
                                    {step.stepNumber}
                                  </span>
                                  <span>{lang === 'ar' ? step.labelAr : step.labelEn}</span>
                                </div>
                                <span className="text-[11px] font-mono bg-[var(--dg-well)] px-1.5 py-0.5 rounded">
                                  {step.systemComponent}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Execution confirmation pill if action was triggered */}
                      {isExecuted && (
                        <div className="bg-[var(--dg-ok-well)] border border-[var(--dg-ok)]/50 text-[var(--dg-ok)] rounded-xl p-3 text-xs flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[var(--dg-ok)] shrink-0" />
                          <div>
                            <span className="font-bold block text-[var(--dg-ok)]">
                              {t('daygi.actionExecutedAuditedIn')}
                            </span>
                            <span className="text-[12px] text-[var(--dg-ok)]/80">
                              {lang === 'ar' ? msg.executionResult?.messageAr : msg.executionResult?.messageEn}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* -------------------------------------------------------- */}
                      {/* 1. MULTI-STEP POST-ACTIVITY OPTIONS (3 Candidates)      */}
                      {/* -------------------------------------------------------- */}
                      {payload.actionType === 'MULTI_STEP_OPTIONS' && payload.multiOptions && (
                        <div className="bg-gradient-to-br from-[var(--dg-panel-2)] to-[var(--dg-panel)] border border-[var(--dg-teal)]/50 rounded-xl p-4 shadow-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-[var(--dg-teal)] font-bold block">
                              {t('daygi.3VerifiedPostDiveOptions')}
                            </span>
                            <span className="text-[12px] text-[var(--dg-gold)] font-semibold">
                              <span className="dg-num">{payload.multiOptions.postActivityContext?.endTime}</span> @ <span dir="auto">{payload.multiOptions.postActivityContext?.location}</span>
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-2.5">
                            {payload.multiOptions.options.map((opt, idx) => (
                              <div 
                                key={opt.id} 
                                className="bg-[var(--dg-tint)] hover:bg-[var(--dg-tint-2)] border border-[var(--dg-line)] rounded-xl p-3 text-xs transition-[background-color,border-color,color,box-shadow,transform,opacity] space-y-2"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="w-5 h-5 rounded-full bg-[var(--dg-gold)] text-[var(--dg-gold-ink)] font-bold flex items-center justify-center text-[11px]">
                                        {idx + 1}
                                      </span>
                                      <h4 className="font-bold text-[var(--dg-text)] text-xs">
                                        {lang === 'ar' ? opt.titleAr : opt.titleEn}
                                      </h4>
                                    </div>
                                    <p className="text-[12px] text-[var(--dg-text-2)] mt-1 leading-relaxed">
                                      {lang === 'ar' ? opt.whyItFitsAr : opt.whyItFitsEn}
                                    </p>
                                  </div>
                                  <div className="text-end shrink-0">
                                    <span className="font-bold text-[var(--dg-gold)] text-xs block">
                                      <span className="dg-num">{opt.priceEGP} EGP</span>
                                    </span>
                                    <span className="text-[11px] text-[var(--dg-teal)] flex items-center gap-1 justify-end">
                                      <Clock className="w-2.5 h-2.5" />
                                      {opt.travelTimeMins} {t('daygi.minWalk')}
                                    </span>
                                  </div>
                                </div>

                                {!isExecuted && (
                                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-[var(--dg-line-soft)]">
                                    <button
                                      onClick={() => handleExecuteAction(msg.id, 'CONFIRM_DIRECT_BOOKING', {
                                        skuId: opt.skuId,
                                        priceEGP: opt.priceEGP,
                                        title: opt.titleEn
                                      })}
                                      disabled={executingActionId === msg.id}
                                      className="bg-gradient-to-r bg-[var(--dg-ok)] hover:brightness-110 text-[var(--dg-text)] font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1 shadow-md transition-[background-color,border-color,color,box-shadow,transform,opacity] active:scale-[0.99] disabled:opacity-50"
                                    >
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>{t('dayGi.bookOptionNext', { idx: idx + 1 })}</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* -------------------------------------------------------- */}
                      {/* 2. "WHAT CHANGED?" DIFFERENTIAL CARD                      */}
                      {/* -------------------------------------------------------- */}
                      {payload.actionType === 'WHAT_CHANGED' && payload.whatChanged && (
                        <div className="bg-gradient-to-br from-[var(--dg-panel)] via-[var(--dg-panel)] to-[var(--dg-panel)] border border-[var(--dg-warn)]/45 rounded-xl p-4 shadow-xl space-y-3">
                          <div className="flex items-center gap-2 text-[var(--dg-warn)] text-xs font-bold">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>{t('daygi.differentialChangeResponse')}</span>
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="bg-[var(--dg-tint)] p-2.5 rounded-lg space-y-1">
                              <span className="text-[var(--dg-muted)] block text-[11px] font-bold">{t('daygi.whatChanged')}</span>
                              <span className="text-[var(--dg-text)] font-medium">{lang === 'ar' ? payload.whatChanged.whatChangedAr : payload.whatChanged.whatChangedEn}</span>
                            </div>
                            <div className="bg-[var(--dg-tint)] p-2.5 rounded-lg space-y-1">
                              <span className="text-[var(--dg-muted)] block text-[11px] font-bold">{t('daygi.whatDoesItAffect')}</span>
                              <span className="text-[var(--dg-risk)] font-semibold">{lang === 'ar' ? payload.whatChanged.whatItAffectsAr : payload.whatChanged.whatItAffectsEn}</span>
                            </div>
                          </div>

                          <div className="space-y-2 pt-1">
                            <span className="text-[12px] font-bold text-[var(--dg-text-2)] block">{t('daygi.availableActionChoices')}</span>
                            {payload.whatChanged.options?.map((opt) => (
                              <div key={opt.id} className="bg-[var(--dg-tint)] hover:bg-[var(--dg-tint-2)] p-2.5 rounded-lg border border-[var(--dg-line)] flex items-center justify-between gap-2 text-xs">
                                <div>
                                  <span className="font-bold text-[var(--dg-text)] block">{lang === 'ar' ? opt.titleAr : opt.titleEn}</span>
                                  <span className="text-[12px] text-[var(--dg-muted)]">{lang === 'ar' ? opt.scheduleImpactAr : opt.scheduleImpactEn}</span>
                                </div>
                                {!isExecuted && (
                                  <button
                                    onClick={() => handleExecuteAction(msg.id, opt.actionKey, opt.actionPayload)}
                                    disabled={executingActionId === msg.id}
                                    className="bg-[var(--dg-gold)] hover:bg-[var(--dg-gold-hi)] text-[var(--dg-gold-ink)] font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 transition-[background-color,border-color,color,box-shadow,transform,opacity]"
                                  >
                                    {t('daygi.select')}
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* -------------------------------------------------------- */}
                      {/* 3. MULTI-ACTION 5-STEP CONFIRMATION CARD                 */}
                      {/* -------------------------------------------------------- */}
                      {payload.actionType === 'MULTI_ACTION_CONFIRMATION' && payload.multiActionConfirmation && (
                        <div className="bg-gradient-to-br from-[var(--dg-panel-2)] to-[var(--dg-panel)] border border-[var(--dg-gold)]/40 rounded-xl p-4 shadow-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[var(--dg-text)] text-xs flex items-center gap-1.5">
                              <SlidersHorizontal className="w-4 h-4 text-[var(--dg-gold)]" />
                              <span>{t('daygi.scheduleShiftConfirmation')}</span>
                            </span>
                            <span className="text-[11px] bg-[var(--dg-gold)]/20 text-[var(--dg-gold)] px-2 py-0.5 rounded-full font-bold">
                              5-Step Audit
                            </span>
                          </div>

                          <div className="bg-[var(--dg-tint)] rounded-lg p-3 text-xs space-y-2">
                            <div className="flex items-center justify-between text-[var(--dg-muted)]">
                              <span>1. {t('daygi.currentActivity')}</span>
                              <span className="font-semibold text-[var(--dg-risk)] line-through">
                                {lang === 'ar' ? payload.multiActionConfirmation.step1OldItem.titleAr : payload.multiActionConfirmation.step1OldItem.titleEn}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[var(--dg-text-2)]">
                              <span>2. {t('daygi.newTargetSlot')}</span>
                              <span className="font-bold text-[var(--dg-teal)]">
                                {payload.multiActionConfirmation.step2Alternative.newTime} ({payload.multiActionConfirmation.step2Alternative.supplierName})
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[var(--dg-muted)]">
                              <span>3. {t('daygi.ledgerImpact')}</span>
                              <span className="font-semibold text-[var(--dg-ok)]">
                                {lang === 'ar' ? payload.multiActionConfirmation.step3PriceVariance.ledgerNoteAr : payload.multiActionConfirmation.step3PriceVariance.ledgerNoteEn}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[var(--dg-muted)]">
                              <span>4. {t('daygi.pacingImpact')}</span>
                              <span className="font-semibold text-[var(--dg-text-2)]">
                                {lang === 'ar' ? payload.multiActionConfirmation.step4ScheduleImpact.impactSummaryAr : payload.multiActionConfirmation.step4ScheduleImpact.impactSummaryEn}
                              </span>
                            </div>
                          </div>

                          {!isExecuted ? (
                            <button
                              onClick={() => handleExecuteAction(msg.id, payload.multiActionConfirmation!.step5ActionKey, payload.multiActionConfirmation!.step5Payload)}
                              disabled={executingActionId === msg.id}
                              className="w-full bg-[var(--dg-gold)] hover:bg-[var(--dg-gold-hi)] text-[var(--dg-gold-ink)] font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow-md transition-[background-color,border-color,color,box-shadow,transform,opacity] active:scale-[0.99] disabled:opacity-50"
                            >
                              {executingActionId === msg.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                              <span>5. {t('daygi.confirmCommitShift')}</span>
                            </button>
                          ) : (
                            <div className="text-center text-xs text-[var(--dg-ok)] font-semibold py-1">
                              ✓ {t('daygi.shiftAppliedToItinerary')}
                            </div>
                          )}
                        </div>
                      )}

                      {/* -------------------------------------------------------- */}
                      {/* 4. TRIP HEALTH AUDIT CARD                                */}
                      {/* -------------------------------------------------------- */}
                      {payload.actionType === 'TRIP_HEALTH' && payload.tripHealth && (
                        <div className="bg-[var(--dg-panel)] border border-[var(--dg-ok)]/40 rounded-xl p-4 shadow-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <HeartPulse className="w-4 h-4 text-[var(--dg-ok)]" />
                              <span className="font-bold text-[var(--dg-text)] text-xs">
                                {t('daygi.tripHealthReliabilityScore')}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-[var(--dg-ok)] font-mono">
                              <span className="dg-num">{payload.tripHealth.score} / 100</span>
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-[var(--dg-tint)] p-2 rounded-lg">
                              <span className="text-[11px] text-[var(--dg-muted)] block">{t('daygi.payments')}</span>
                              <span className="text-[var(--dg-ok)] font-bold">
                                {!payload.tripHealth.issues.some((i: DayGiTripHealthIssue) => i.type === 'PAYMENT_PENDING') ? '✓ Verified (100%)' : 'Pending'}
                              </span>
                            </div>
                            <div className="bg-[var(--dg-tint)] p-2 rounded-lg">
                              <span className="text-[11px] text-[var(--dg-muted)] block">{t('daygi.suppliers')}</span>
                              <span className="text-[var(--dg-ok)] font-bold">
                                {payload.tripHealth.metrics.pendingBookings === 0 ? '✓ Assigned Tier-1' : 'Pending'}
                              </span>
                            </div>
                            <div className="bg-[var(--dg-tint)] p-2 rounded-lg">
                              <span className="text-[11px] text-[var(--dg-muted)] block">{t('daygi.conflicts')}</span>
                              <span className="text-[var(--dg-ok)] font-bold">
                                {payload.tripHealth.metrics.conflictsCount === 0 ? '✓ 0 Conflicts' : 'Detected'}
                              </span>
                            </div>
                            <div className="bg-[var(--dg-tint)] p-2 rounded-lg">
                              <span className="text-[11px] text-[var(--dg-muted)] block">{t('daygi.marineFlags')}</span>
                              <span className="text-[var(--dg-ok)] font-bold">
                                {!payload.tripHealth.issues.some((i: DayGiTripHealthIssue) => i.type === 'CONDITION_UNCERTAINTY') ? '✓ CDWS Green' : 'Caution'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* -------------------------------------------------------- */}
                      {/* 5. DIRECT BOOKING CARD / HOLD REVIEW                     */}
                      {/* -------------------------------------------------------- */}
                      {/* 'BOOKING_CONFIRMATION' is not a DayGiActionType, and the
                          reasoning service only ever pairs bookingReview with
                          'BOOKING_CARD' — that second branch was unreachable. */}
                      {payload.actionType === 'BOOKING_CARD' && payload.actionData?.bookingReview && (
                        <div className="bg-gradient-to-br from-[var(--dg-panel-2)] to-[var(--dg-panel)] border border-[var(--dg-teal)]/50 rounded-xl p-4 shadow-xl">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div>
                              <span className="text-[11px] text-[var(--dg-teal)] font-bold block">
                                {t('daygi.directBookingReview')}
                              </span>
                              <h4 className="font-bold text-[var(--dg-text)] text-sm">
                                {lang === 'ar' ? (payload.actionData.bookingReview.serviceAr || payload.actionTitleAr) : (payload.actionData.bookingReview.service || payload.actionTitle)}
                              </h4>
                              <p className="text-[12px] text-[var(--dg-muted)]">
                                {payload.actionData.bookingReview.supplierName}
                              </p>
                            </div>
                            <div className="text-end">
                              <span className="text-sm font-bold text-[var(--dg-gold)] block">
                                <span className="dg-num">{payload.actionData.bookingReview.priceEGP?.toLocaleString()} EGP</span>
                              </span>
                              <span className="text-[11px] text-[var(--dg-ok)] flex items-center gap-1 justify-end">
                                <Check className="w-2.5 h-2.5" />
                                {t('daygi.directBestPrice')}
                              </span>
                            </div>
                          </div>

                          <div className="bg-[var(--dg-tint)] rounded-lg p-3 text-xs text-[var(--dg-text-2)] mb-3 space-y-1.5">
                            <div className="flex items-center justify-between text-[var(--dg-muted)]">
                              <span>{t('daygi.dateSlot')}</span>
                              <span className="font-semibold text-[var(--dg-text)]">{payload.actionData.bookingReview.date} · {payload.actionData.bookingReview.time}</span>
                            </div>
                            <div className="flex items-center justify-between text-[var(--dg-muted)]">
                              <span>{t('daygi.guests')}</span>
                              <span className="font-semibold text-[var(--dg-text)]">{payload.actionData.bookingReview.people} {t('daygi.guests-2')}</span>
                            </div>
                            <div className="flex items-center justify-between text-[var(--dg-muted)]">
                              <span>{t('daygi.cancellation')}</span>
                              <span className="font-semibold text-[var(--dg-text-2)]">{lang === 'ar' ? payload.actionData.bookingReview.cancellationPolicyAr : payload.actionData.bookingReview.cancellationPolicy}</span>
                            </div>
                          </div>

                          {!isExecuted ? (
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleExecuteAction(msg.id, 'CONFIRM_DIRECT_BOOKING', {
                                  skuId: payload.actionData?.bookingReview?.skuId,
                                  priceEGP: payload.actionData?.bookingReview?.priceEGP
                                })}
                                disabled={executingActionId === msg.id}
                                className="bg-gradient-to-r bg-[var(--dg-ok)] hover:brightness-110 text-[var(--dg-text)] font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md transition-[background-color,border-color,color,box-shadow,transform,opacity] active:scale-[0.99] disabled:opacity-50"
                              >
                                {executingActionId === msg.id ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                                <span>{t('daygi.confirmHold')}</span>
                              </button>

                              <button
                                onClick={() => handleOpenBookingHandoff(payload.actionData?.bookingReview?.skuId || 'SKU-DIV-001')}
                                className="bg-[var(--dg-gold)] hover:bg-[var(--dg-gold-hi)] text-[var(--dg-gold-ink)] font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md transition-[background-color,border-color,color,box-shadow,transform,opacity] active:scale-[0.99]"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>{t('daygi.payNow')}</span>
                              </button>
                            </div>
                          ) : (
                            <div className="text-center text-xs text-[var(--dg-ok)] font-semibold py-1">
                              ✓ {t('daygi.bookingHeldAndConfirmed')}
                            </div>
                          )}
                        </div>
                      )}

                      {/* -------------------------------------------------------- */}
                      {/* 6. BUDGET SAVINGS CARD                                   */}
                      {/* -------------------------------------------------------- */}
                      {payload.actionType === 'BUDGET_SAVINGS' && payload.actionData?.budgetAnalysis && (
                        <div className="bg-[var(--dg-panel)] border border-[var(--dg-fin)]/40 rounded-xl p-4 shadow-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-[var(--dg-gold)]" />
                              <span className="font-bold text-[var(--dg-text)] text-xs">
                                {t('daygi.verifiedBudgetOptimization')}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-[var(--dg-ok)]">
                              <span className="dg-num">-{payload.actionData.budgetAnalysis.potentialSavingsEGP} EGP</span>
                            </span>
                          </div>

                          <div className="space-y-2 text-xs">
                            {payload.actionData.budgetAnalysis.adjustableItems?.map((item: any, idx: number) => (
                              <div key={idx} className="bg-[var(--dg-tint)] p-2.5 rounded-lg space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[var(--dg-text-2)] font-medium">{lang === 'ar' ? item.titleAr : item.title}</span>
                                  <span className="dg-num text-[var(--dg-ok)] font-bold">-{item.savingsEGP} EGP</span>
                                </div>
                                <div className="text-[12px] text-[var(--dg-teal)]">
                                  → {lang === 'ar' ? item.lowerCostAlternativeAr : item.lowerCostAlternative}
                                </div>
                              </div>
                            ))}
                          </div>

                          {!isExecuted ? (
                            <button
                              onClick={() => handleExecuteAction(msg.id, 'APPLY_BUDGET_OPTIMIZATION', {})}
                              disabled={executingActionId === msg.id}
                              className="w-full bg-[var(--dg-teal)] hover:bg-[var(--dg-teal-hi)] text-[var(--dg-teal-ink)] font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-[background-color,border-color,color,box-shadow,transform,opacity] disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{t('daygi.applySavingsOptimizations')}</span>
                            </button>
                          ) : (
                            <div className="text-center text-xs text-[var(--dg-ok)] font-semibold py-1">
                              ✓ {t('daygi.optimizationsApplied')}
                            </div>
                          )}
                        </div>
                      )}

                      {/* -------------------------------------------------------- */}
                      {/* 7. DAILY BRIEFING CARD                                   */}
                      {/* -------------------------------------------------------- */}
                      {payload.actionType === 'DAILY_BRIEFING' && payload.actionData?.dailyBriefing && (
                        <div className="bg-[var(--dg-panel)] border border-[var(--dg-line)] rounded-xl p-4 shadow-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Compass className="w-4 h-4 text-[var(--dg-teal)]" />
                              <span className="font-bold text-[var(--dg-text)] text-xs">
                                <span dir="auto">{payload.actionData.dailyBriefing.dateFormatted}</span>
                              </span>
                            </div>
                            <span className="text-[11px] bg-[var(--dg-teal)]/20 text-[var(--dg-teal)] px-2 py-0.5 rounded-full font-bold">
                              {t('daygi.dailyBriefing')}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            {payload.actionData.dailyBriefing.timeline?.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 text-xs bg-[var(--dg-tint)] p-2 rounded-lg">
                                <span className="dg-num font-bold text-[var(--dg-gold)] shrink-0 text-xs w-[70px]">{item.time}</span>
                                <span className="text-[var(--dg-text-2)]">{lang === 'ar' ? item.titleAr : item.title}</span>
                              </div>
                            ))}
                          </div>

                          <div className="bg-[var(--dg-teal)]/10 border border-[var(--dg-teal)]/30 rounded-lg p-2.5 text-xs text-[var(--dg-teal)] flex items-start gap-2">
                            <Waves className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>
                              {lang === 'ar' ? (payload.actionData.dailyBriefing.conditionsNoteAr || payload.actionData.dailyBriefing.conditionsNote) : payload.actionData.dailyBriefing.conditionsNote}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* -------------------------------------------------------- */}
                      {/* 8. DISCOVERY RECOMMENDATIONS / PRACTICAL TIPS            */}
                      {/* -------------------------------------------------------- */}
                      {payload.actionData?.practicalTips && (
                        <div className="bg-[var(--dg-panel)] border border-[var(--dg-line)] rounded-xl p-3 text-xs">
                          <span className="font-bold text-[var(--dg-text)] block mb-1.5 flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-[var(--dg-gold)]" />
                            {t('daygi.practicalLocalAdvice')}
                          </span>
                          <ul className="space-y-1 text-[var(--dg-text-2)] list-disc ltr:pl-4 rtl:pr-4">
                            {(lang === 'ar' ? (payload.actionData.practicalTipsAr || payload.actionData.practicalTips) : payload.actionData.practicalTips).map((tip, idx) => (
                              <li key={idx}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Follow-up Suggestion Pills */}
                      {payload.suggestedFollowUps && payload.suggestedFollowUps.length > 0 && (
                        <div className="pt-1 flex flex-wrap gap-1.5">
                          {payload.suggestedFollowUps.map((su, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(su.query)}
                              className="text-[12px] bg-[var(--dg-tint)] hover:bg-[var(--dg-tint-3)] border border-[var(--dg-line)] text-[var(--dg-text-2)] hover:text-[var(--dg-text)] px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
                            >
                              <span>{lang === 'ar' ? su.textAr : su.textEn}</span>
                              <ChevronRight className={`w-3 h-3 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Closed Beta Structured Feedback */}
                      <div className="pt-2 border-t border-[var(--dg-line-soft)] space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[var(--dg-muted)]">
                            {t('daygi.didThisHelpYour')}
                          </span>
                          <button
                            onClick={() => {
                              if (msg.liked) return;
                              setFeedbackReasonOpenId(feedbackReasonOpenId === msg.id ? null : msg.id);
                              handleFeedback(msg.id, true, 'ACCURATE');
                            }}
                            className={`p-1 rounded hover:bg-[var(--dg-tint-2)] text-[var(--dg-muted)] hover:text-[var(--dg-ok)] transition-colors ${msg.liked ? 'text-[var(--dg-ok)] font-bold' : ''}`}
                            title="Helpful"
                            aria-label={t('daygi.thisAnswerWasHelpful')}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (msg.disliked) return;
                              setFeedbackReasonOpenId(feedbackReasonOpenId === msg.id ? null : msg.id);
                              handleFeedback(msg.id, false, 'TOO_VAGUE');
                            }}
                            className={`p-1 rounded hover:bg-[var(--dg-tint-2)] text-[var(--dg-muted)] hover:text-[var(--dg-risk)] transition-colors ${msg.disliked ? 'text-[var(--dg-risk)] font-bold' : ''}`}
                            title="Needs Improvement"
                            aria-label={t('daygi.thisAnswerNeedsImprovement')}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* 1-Tap Feedback Detail Tags */}
                        {feedbackReasonOpenId === msg.id && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-1 animate-in fade-in duration-200">
                            <span className="text-[11px] text-[var(--dg-muted)]">{t('daygi.reason')}</span>
                            {[
                              { tag: 'ACCURATE', labelAr: 'دقيق ومباشر', labelEn: 'Accurate' },
                              { tag: 'FAST_RESOLUTION', labelAr: 'سريع وسهل', labelEn: 'Fast' },
                              { tag: 'SAVED_MONEY', labelAr: 'وفّر ميزانية', labelEn: 'Saved Money' },
                              { tag: 'TOO_VAGUE', labelAr: 'غير دقيق', labelEn: 'Vague' },
                              { tag: 'WRONG_LOCATION', labelAr: 'الموقع غير مناسب', labelEn: 'Wrong Spot' }
                            ].map((item) => (
                              <button
                                key={item.tag}
                                onClick={() => handleFeedback(msg.id, msg.liked || true, item.tag)}
                                className="px-2 py-0.5 rounded-md bg-[var(--dg-tint)] hover:bg-[var(--dg-tint-3)] border border-[var(--dg-line)] text-[11px] text-[var(--dg-text-2)] hover:text-[var(--dg-text)] transition-[background-color,border-color,color,box-shadow,transform,opacity]"
                              >
                                {lang === 'ar' ? item.labelAr : item.labelEn}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start animate-in fade-in-50">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--dg-gold)] to-[var(--dg-teal)] flex items-center justify-center text-[var(--dg-gold-ink)] font-bold shrink-0 mt-1 shadow-md">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[var(--dg-bubble)] border border-[var(--dg-line)] rounded-2xl p-4 flex items-center gap-2 text-xs text-[var(--dg-text-2)]">
                <Waves className="w-4 h-4 text-[var(--dg-teal)] animate-pulse" />
                <span>{t('daygi.dayGI30IsMatching')}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/*
          Composer — pinned to the bottom of the column.

          Extra bottom room on small screens: the app's mobile tab bar is fixed
          over the last ~56px of the viewport and used to sit on top of the send
          button.
        */}
        <div className="shrink-0 space-y-2.5 pt-3 pb-20 md:pb-4 bg-gradient-to-t from-[var(--dg-canvas)] via-[var(--dg-canvas)] to-transparent">

          {/*
            Four suggestions, wrapping, and only until the traveler has said
            something.

            All eight used to sit in a horizontal scroller behind a flame icon
            and a "Try:" label, so the last four were permanently off the right
            edge — a row of half-visible buttons is a row nobody reads. They
            also stayed on screen for the whole conversation, still offering
            "Check trip health" twenty messages in.
          */}
          {messages.length <= 1 && (
            <div
              role="group"
              aria-label={t('daygi.suggestedQuestions')}
              className="flex flex-wrap gap-2"
            >
              {QUICK_PROMPTS.slice(0, 4).map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qp.prompt)}
                  disabled={isLoading}
                  className="dg-focus bg-[var(--dg-tint)] hover:bg-[var(--dg-tint-2)] text-[var(--dg-text-2)] hover:text-[var(--dg-text)] px-3.5 h-9 rounded-full text-xs transition-colors active:scale-[0.98] disabled:opacity-45"
                >
                  {lang === 'ar' ? qp.titleAr : qp.titleEn}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-[var(--dg-tint)] border border-[var(--dg-line)] focus-within:border-[var(--dg-teal)] focus-within:bg-[var(--dg-panel)] rounded-[1.75rem] p-2 transition-colors"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              aria-label={t('daygi.messageDayGI')}
              placeholder={
                t('daygi.askDayGISomewhereCalm')
              }
              className="flex-1 min-w-0 bg-transparent text-[var(--dg-text)] px-3 py-2.5 text-sm outline-none placeholder:text-[var(--dg-muted)] truncate"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              aria-label={t('daygi.sendMessage')}
              className="dg-focus w-10 h-10 rounded-full bg-[var(--dg-teal)] text-[var(--dg-gold-ink)] flex items-center justify-center hover:brightness-110 active:scale-95 transition-[background-color,border-color,color,box-shadow,transform,opacity] disabled:opacity-30 disabled:hover:brightness-100 shrink-0"
            >
              {isLoading
                ? <RefreshCw className="w-4.5 h-4.5 animate-spin" aria-hidden="true" />
                : <Send className={`w-4.5 h-4.5 ${lang === 'ar' ? 'rotate-180' : ''}`} aria-hidden="true" />}
            </button>
          </form>

          {/*
            Kept, because it is a real promise about money and the traveler
            should be able to see it before they ask for something expensive.
            Demoted to a plain line: it had a shield icon and centred emphasis,
            which is how a reassurance starts reading as marketing.
          */}
          <p className="text-[11px] text-[var(--dg-muted)] text-center">
            {t('daygi.dayGINeverChangesA')}
          </p>

        </div>

        </section>

        {/*
          The 340px context rail is gone.

          It held a trip-health ring, a memory panel and a task queue beside
          the conversation — three standing dashboards competing with the
          answer the traveler actually asked for, and on a screen narrower
          than 1280px none of it rendered at all, so the page already had to
          work without them. The same state still opens from the header,
          which is where a status you consult on purpose belongs.
        */}
      </div>

      {/* -------------------------------------------------------- */}
      {/* MODAL: TRIP HEALTH INSPECTOR (7 CRITERIA)                */}
      {/* -------------------------------------------------------- */}
      {healthModalOpen && tripHealth && (
        <div
          className="daygi-surface fixed inset-0 bg-[var(--dg-scrim)] backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setHealthModalOpen(false)}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dg-health-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--dg-panel)] border border-[var(--dg-teal)]/50 rounded-2xl max-w-lg w-full max-h-[85dvh] overflow-y-auto dg-scroll p-6 space-y-4 shadow-2xl animate-in zoom-in-95"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <HeartPulse className="w-5 h-5 text-[var(--dg-ok)] shrink-0" aria-hidden="true" />
                <h3 id="dg-health-title" className="text-base font-bold text-[var(--dg-text)]">
                  {t('daygi.7PointTripHealthInspector')}
                </h3>
              </div>
              <button
                onClick={() => setHealthModalOpen(false)}
                autoFocus
                aria-label={t('attractions.close')}
                className="dg-focus w-9 h-9 shrink-0 grid place-items-center text-[var(--dg-muted)] hover:text-[var(--dg-text)] hover:bg-[var(--dg-tint-2)] rounded-lg transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="bg-[var(--dg-tint)] rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-[var(--dg-muted)] block">{t('daygi.overallHealthStatus')}</span>
                <span className="text-lg font-bold text-[var(--dg-ok)]" dir="auto">{tripHealth.status} <span className="dg-num">({tripHealth.score} / 100)</span></span>
              </div>
              <div className="dg-num w-12 h-12 rounded-full border-4 border-[var(--dg-ok)] flex items-center justify-center font-bold text-[var(--dg-text)] text-sm">
                {tripHealth.score}%
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--dg-tint)]">
                <span>1. {t('daygi.paymentVerification')}</span>
                <span className="text-[var(--dg-ok)] font-bold">✓ 100% {t('daygi.cleared')}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--dg-tint)]">
                <span>2. {t('daygi.supplierAssignmentSLAs')}</span>
                <span className="text-[var(--dg-ok)] font-bold">✓ {t('daygi.confirmed')}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--dg-tint)]">
                <span>3. {t('daygi.scheduleConflictCheck')}</span>
                <span className="text-[var(--dg-ok)] font-bold">✓ 0 {t('daygi.conflicts-2')}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--dg-tint)]">
                <span>4. {t('daygi.transitBuffer15Min')}</span>
                <span className="text-[var(--dg-ok)] font-bold">✓ {t('daygi.optimal')}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--dg-tint)]">
                <span>5. {t('daygi.decompressionAscentSafety')}</span>
                <span className="text-[var(--dg-ok)] font-bold">✓ {t('daygi.safeWindow')}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--dg-tint)]">
                <span>6. {t('daygi.cDWSMarineFlagsWeather')}</span>
                <span className="text-[var(--dg-ok)] font-bold">✓ Green Flag</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--dg-tint)]">
                <span>7. {t('daygi.hotelAirportTransfers')}</span>
                <span className="text-[var(--dg-ok)] font-bold">✓ {t('daygi.complete')}</span>
              </div>
            </div>

            <button
              onClick={() => setHealthModalOpen(false)}
              className="dg-focus w-full bg-[var(--dg-gold)] hover:bg-[var(--dg-gold-hi)] text-[var(--dg-gold-ink)] font-bold h-11 rounded-xl text-xs transition-colors"
            >
              {t('daygi.closeAuditReport')}
            </button>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* MODAL: STRUCTURED MEMORY PREFERENCES                     */}
      {/* -------------------------------------------------------- */}
      {memoryModalOpen && userMemory && (
        <div
          className="daygi-surface fixed inset-0 bg-[var(--dg-scrim)] backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setMemoryModalOpen(false)}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dg-memory-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--dg-panel)] border border-[var(--dg-gold)]/50 rounded-2xl max-w-lg w-full max-h-[85dvh] overflow-y-auto dg-scroll p-6 space-y-4 shadow-2xl animate-in zoom-in-95"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Brain className="w-5 h-5 text-[var(--dg-gold)] shrink-0" aria-hidden="true" />
                <h3 id="dg-memory-title" className="text-base font-bold text-[var(--dg-text)]">
                  {t('daygi.dayGIStructuredMemoryPreferences')}
                </h3>
              </div>
              <button
                onClick={() => setMemoryModalOpen(false)}
                autoFocus
                aria-label={t('attractions.close')}
                className="dg-focus w-9 h-9 shrink-0 grid place-items-center text-[var(--dg-muted)] hover:text-[var(--dg-text)] hover:bg-[var(--dg-tint-2)] rounded-lg transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <p className="text-xs text-[var(--dg-text-2)] leading-relaxed">
              {t('daygi.dayGIMaintainsExplicitStructured')}
            </p>

            <div className="space-y-3 text-xs">
              
              {/* Pace Toggle */}
              <div className="bg-[var(--dg-tint)] p-3 rounded-xl flex items-center justify-between">
                <span>{t('daygi.tripPacing')}</span>
                <div className="flex items-center gap-1 bg-[var(--dg-well)] p-1 rounded-lg">
                  {(['Relaxed', 'Balanced', 'Active'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => handleUpdatePreferences({ pace: p })}
                      className={`px-2 py-1 rounded text-xs transition-[background-color,border-color,color,box-shadow,transform,opacity] ${userMemory.preferences.pace === p ? 'bg-[var(--dg-gold)] text-[var(--dg-gold-ink)] font-bold' : 'text-[var(--dg-muted)] hover:text-[var(--dg-text)]'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mornings Preference */}
              <div className="bg-[var(--dg-tint)] p-3 rounded-xl flex items-center justify-between">
                <span>{t('daygi.morningRoutine')}</span>
                <div className="flex items-center gap-1 bg-[var(--dg-well)] p-1 rounded-lg">
                  <button
                    onClick={() => handleUpdatePreferences({ morningPreference: 'Late_Start' })}
                    className={`px-2 py-1 rounded text-xs transition-[background-color,border-color,color,box-shadow,transform,opacity] ${userMemory.preferences.morningPreference === 'Late_Start' ? 'bg-[var(--dg-teal)] text-[var(--dg-teal-ink)] font-bold' : 'text-[var(--dg-muted)] hover:text-[var(--dg-text)]'}`}
                  >
                    {t('daygi.after10AM')}
                  </button>
                  <button
                    onClick={() => handleUpdatePreferences({ morningPreference: 'Early_Bird' })}
                    className={`px-2 py-1 rounded text-xs transition-[background-color,border-color,color,box-shadow,transform,opacity] ${userMemory.preferences.morningPreference === 'Early_Bird' ? 'bg-[var(--dg-teal)] text-[var(--dg-teal-ink)] font-bold' : 'text-[var(--dg-muted)] hover:text-[var(--dg-text)]'}`}
                  >
                    {t('daygi.earlyBird')}
                  </button>
                </div>
              </div>

              {/* Seafood Preference */}
              <div className="bg-[var(--dg-tint)] p-3 rounded-xl flex items-center justify-between">
                <span>{t('daygi.seafoodDiningPreference')}</span>
                <button
                  onClick={() => handleUpdatePreferences({ seafoodPreference: !userMemory.preferences.seafoodPreference })}
                  className={`px-3 py-1 rounded-lg font-bold text-xs ${userMemory.preferences.seafoodPreference ? 'bg-[var(--dg-ok)]/18 text-[var(--dg-ok)] border border-[var(--dg-ok)]/40' : 'bg-[var(--dg-tint-2)] text-[var(--dg-muted)]'}`}
                >
                  {userMemory.preferences.seafoodPreference ? (t('daygi.enabled')) : (t('daygi.disabled'))}
                </button>
              </div>

              {/* Learned Insights */}
              {userMemory.learnedInsights?.length > 0 && (
                <div className="bg-[var(--dg-tint)] p-3 rounded-xl space-y-1.5">
                  <span className="font-bold text-[var(--dg-gold)] block text-[12px]">
                    {t('daygi.learnedBehavioralInsights')}
                  </span>
                  {/* learnedInsights is string[], not an object array. `ins.key`
                      and `ins.summaryEn` were undefined, so every insight
                      rendered as an empty bullet with a duplicate React key.
                      learnedInsightsAr holds the Arabic equivalents. */}
                  {(lang === 'ar' && userMemory.learnedInsightsAr?.length
                    ? userMemory.learnedInsightsAr
                    : userMemory.learnedInsights
                  ).map((insight, idx) => (
                    <div key={`insight-${idx}`} className="text-[var(--dg-text-2)] text-[12px] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--dg-teal)]" />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>

            <button
              onClick={() => setMemoryModalOpen(false)}
              className="w-full bg-[var(--dg-gold)] text-[var(--dg-gold-ink)] font-bold py-2 rounded-xl text-xs"
            >
              {t('daygi.saveClose')}
            </button>
          </div>
        </div>
      )}

      {/* Book Now Modal for Direct Handoff */}
      {bookModalOpen && (
        <BookNowCommerceModal
          isOpen={bookModalOpen}
          onClose={() => setBookModalOpen(false)}
          // The prop is initialServiceId; `defaultSkuId` never existed on this
          // modal, so the DayGI handoff never preselected the service.
          initialServiceId={selectedSkuId}
          onBookingSuccess={(booking) => {
            setBookModalOpen(false);
            showToast(`تم تأكيد الحجز بنجاح (رقم ${booking.id}) ✨`);
          }}
        />
      )}

    </div>
  );
};
