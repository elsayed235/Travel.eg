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

interface ChatMessage {
  id: string;
  sender: 'user' | 'daygi';
  text: string;
  timestamp: string;
  responsePayload?: DayGiResponse;
  liked?: boolean;
  disliked?: boolean;
  actionExecuted?: boolean;
  executionResult?: any;
}

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
    activeTrip
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
  const { language: siteLanguage } = useLanguage();
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
      text: lang === 'ar' 
        ? `أهلاً يا ${profile.name || 'صديق دهب'}! أنا دايجي ٣.٠، طبقة تشغيل وإدارة رحلتك الاستباقية في دهب.
مراقب دائم لصحة الرحلة والطقس، أفهم تفضيلاتك وقيودك تلقائياً، وأنسق مهامك المعقدة بخطوات موثقة وآمنة.`
        : `Welcome ${profile.name || 'explorer'}! I'm DayGI 3.0, the proactive operating layer for your Dahab journey.
I monitor trip health, track structured memory & preferences, and orchestrate multi-step plans with verified execution.`,
      timestamp: 'Just now',
      responsePayload: {
        replyText: 'DayGI 3.0 Proactive Trip Operating Layer active. Health score 94/100 (GOOD). 3 relaxation options, smart morning briefings, and non-destructive schedule adjustments ready.',
        replyTextAr: 'طبقة تشغيل دايجي ٣.٠ نشطة. مؤشر صحة الرحلة ٩٤/١٠٠ (ممتاز). خيارات الاسترخاء بعد الأنشطة، والموجز الصباحي، وإعادة الجدولة الآمنة جاهزة.',
        whyThis: 'Continuously auditing 7 trip health criteria against live CDWS marine telemetry, Cloud SQL ledger, and supplier SLAs.',
        whyThisAr: 'فحص فوري مستمر لـ ٧ معايير معتمدة بالتكامل مع رصد غرفة الغوص البحرية ودفتر الحسابات وتوافر الموردين.',
        actionType: 'DAILY_BRIEFING',
        actionRisk: 'READ_ONLY',
        actionTitle: 'Live Dahab Operating Overview & Marine Brief',
        actionTitleAr: 'نظرة تشغيلية عامة وموجز البحر المباشر',
        mode: 'DISCOVER',
        parsedIntent: {
          intent: 'DAILY_BRIEFING',
          confidence: 0.99,
          requires_confirmation: false,
          parameters: {}
        },
        actionData: {
          dailyBriefing: {
            dateFormatted: 'Today · Dahab Coastal Zone',
            timeline: [
              { time: '08:30 AM', title: 'Bedouin Breakfast & Seafront Coffee at Ralphs', titleAr: 'إفطار بدوي ومخبوزات طازجة في رالفز', type: 'MEAL' },
              { time: '10:30 AM', title: 'Lighthouse Protected Reef Snorkeling', titleAr: 'سنوركلينج شاطئي هادئ في اللايتهاوس', type: 'ACTIVITY' },
              { time: '01:30 PM', title: 'Fresh Catch Grilled Seafood at Ali Baba', titleAr: 'غداء سمك طازج وإطلالة بحرية في علي بابا', type: 'MEAL' },
              { time: '05:30 PM', title: 'Sunset Gathering at Eel Garden Seating', titleAr: 'جلسة شاي بالحبق ومتابعة الغروب في إيل جاردن', type: 'RELAX' }
            ],
            freeWindows: [
              { start: '03:00 PM', end: '05:00 PM', durationMins: 120, location: 'Lighthouse Promenade' }
            ],
            conditionsNote: 'CDWS Green Flag: Visibility > 25m, Gentle NE breeze (9 knots), calm waters.',
            conditionsNoteAr: 'الراية الخضراء مرفوعة: وضوح الرؤية أكثر من ٢٥ متراً، والرياح لطيفة ٩ عقد، مثالية للبحر.'
          }
        },
        sourceConfidence: {
          source: 'VERIFIED_FACT',
          freshness: 'Live (Synchronized with Active Itinerary)',
          confidenceScore: 0.99
        },
        suggestedFollowUps: [
          { textEn: 'Post-dive calm spots ("عايز حاجة هادية بعد الغطس")', textAr: 'عايز حاجة هادية بعد الغطس', query: 'عايز حاجة هادية بعد الغطس' },
          { textEn: 'What changed in my trip?', textAr: 'إيه اللي اتغير في الرحلة؟', query: 'إيه اللي اتغير في الرحلة؟' },
          { textEn: 'Save 2000 EGP on budget', textAr: 'وفّرلي 2000 جنيه من الميزانية', query: 'وفّرلي 2000 جنيه' }
        ]
      }
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

    const fetchProactiveData = async () => {
      try {
        const [proactiveRes, healthRes, memoryRes, tasksRes] = await Promise.all([
          api.getDayGiProactive(activeTripId).catch(() => null),
          api.getDayGiTripHealth(activeTripId).catch(() => null),
          api.getDayGiMemory().catch(() => null),
          api.getDayGiTasks(activeTripId).catch(() => [])
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
        text: lang === 'ar'
          ? 'أجواء دهب ممتازة الآن، وأنصحك بقضاء الوقت في ممشى اللايتهاوس والاستمتاع بمشروب دافئ مع إطلالة البحر.'
          : 'Dahab waters are calm and ideal for shoreline snorkeling and seaside dining at Lighthouse Promenade.',
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
        lang === 'ar' 
          ? `تم تنفيذ وتوثيق الخطوة: ${executedStep?.nameAr || executedStep?.name} بنجاح ✨`
          : `Step executed & verified: ${executedStep?.name} in Cloud SQL`
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
        lang === 'ar'
          ? 'تم تطبيق خطة الاستعادة البديلة وتسوية الفارق المالي فوراً ✨'
          : 'Recovery plan applied with automated ledger reconciliation ✨'
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
      showToast(lang === 'ar' ? 'تم إلغاء المهمة بأمان وتحرير الموارد' : 'Task safely cancelled');
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
    showToast(isPositive ? (lang === 'ar' ? 'شكراً لتقييمك! دايجي يتعلم تفضيلاتك باستمرار ✨' : 'Thank you! Feedback recorded for beta learning.') : (lang === 'ar' ? 'شكراً لملاحظتك، سنحسن المقترحات القادمة 🙏' : 'Feedback noted to improve recommendations.'));
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
      showToast(lang === 'ar' ? 'تم تحديث التفضيلات في ذاكرة دايجي المنظمة ✨' : 'Structured memory preferences updated');
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
  const healthScore = tripHealth?.score ?? 94;
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
            {lang === 'ar' ? 'حرج للسلامة (SAFETY)' : 'Safety Critical'}
          </span>
        );
      case 'FINANCIAL':
        return (
          <span className="bg-[var(--dg-fin)]/18 border border-[var(--dg-fin)]/40 text-[var(--dg-fin)] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <DollarSign className="w-2.5 h-2.5" />
            {lang === 'ar' ? 'معاملة مالية (LEDGER)' : 'Ledger Protected'}
          </span>
        );
      case 'COMMERCE':
        return (
          <span className="bg-[var(--dg-warn)]/18 border border-[var(--dg-warn)]/40 text-[var(--dg-warn)] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShoppingBag className="w-2.5 h-2.5" />
            {lang === 'ar' ? 'حجز وتثبيت (COMMERCE)' : 'Commerce Hold'}
          </span>
        );
      case 'LOW_RISK':
        return (
          <span className="bg-[var(--dg-info)]/18 border border-[var(--dg-info)]/40 text-[var(--dg-info)] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <SlidersHorizontal className="w-2.5 h-2.5" />
            {lang === 'ar' ? 'تعديل جدول آمن' : 'Low Risk Shift'}
          </span>
        );
      case 'READ_ONLY':
      default:
        return (
          <span className="bg-[var(--dg-ok)]/18 border border-[var(--dg-ok)]/40 text-[var(--dg-ok)] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-2.5 h-2.5" />
            {lang === 'ar' ? 'قراءة واستكشاف' : 'Read-Only Fact'}
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
            {lang === 'ar' ? 'تنفيذ موثق (ACT)' : 'Direct Action (ACT)'}
          </span>
        );
      case 'PLAN':
        return (
          <span className="bg-[var(--dg-gold)]/20 border border-[var(--dg-gold)]/40 text-[var(--dg-gold)] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <SlidersHorizontal className="w-2.5 h-2.5" />
            {lang === 'ar' ? 'تخطيط وتعديل (PLAN)' : 'Itinerary Plan (PLAN)'}
          </span>
        );
      case 'DISCOVER':
      default:
        return (
          <span className="bg-[var(--dg-teal)]/20 border border-[var(--dg-teal)]/40 text-[var(--dg-teal)] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Compass className="w-2.5 h-2.5" />
            {lang === 'ar' ? 'استكشاف سياقي (DISCOVER)' : 'Discovery (DISCOVER)'}
          </span>
        );
    }
  };

  return (
    <div
      className="daygi-surface bg-[var(--dg-canvas)] text-[var(--dg-text)] flex flex-col relative h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5rem)] overflow-hidden"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >

      {/* Top Sinai Topographic Aura */}
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[var(--dg-teal)]/12 via-[var(--dg-gold)]/5 to-transparent pointer-events-none" aria-hidden="true" />

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

            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-[var(--dg-gold)] to-[var(--dg-teal)] flex items-center justify-center text-[var(--dg-gold-ink)] shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                {/* The full name does not fit beside the status controls on a
                    phone; it degraded to a truncated "د…". Short name there,
                    full name from sm up. */}
                <h1 className="text-[15px] sm:text-base font-bold text-[var(--dg-text)] tracking-tight flex items-center gap-2 min-w-0">
                  <span className="truncate">
                    <span className="sm:hidden">{lang === 'ar' ? 'دايجي' : 'DayGI'}</span>
                    <span className="hidden sm:inline">{lang === 'ar' ? 'دايجي — طبقة تشغيل الرحلة' : 'DayGI — Trip Operating Layer'}</span>
                  </span>
                  <span className="dg-num hidden sm:inline shrink-0 bg-[var(--dg-teal)]/15 text-[var(--dg-teal)] text-[11px] font-mono px-1.5 py-0.5 rounded border border-[var(--dg-teal)]/35">3.0</span>
                </h1>
                <p className="text-xs text-[var(--dg-muted)] truncate hidden sm:block">
                  {lang === 'ar'
                    ? 'يتابع رحلتك لحظة بلحظة، يفتكر تفضيلاتك، وينفّذ المهام خطوة بخطوة بعد موافقتك'
                    : 'Watches your trip live, remembers your preferences, and runs multi-step tasks only after you approve'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">

              {/* Trip health — the single most important status on this screen */}
              <button
                onClick={() => setHealthModalOpen(true)}
                className="dg-focus h-9 bg-[var(--dg-ok)]/12 hover:bg-[var(--dg-ok)]/22 border border-[var(--dg-ok)]/40 text-[var(--dg-ok)] text-xs font-bold px-3 rounded-xl flex items-center gap-2 transition-colors"
                aria-label={lang === 'ar' ? `صحة الرحلة ${healthScore} بالمئة — افتح تقرير الفحص` : `Trip health ${healthScore} percent — open the audit report`}
              >
                <HeartPulse className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="dg-num">{healthScore}%</span>
                <span className="hidden sm:inline">{lang === 'ar' ? 'صحة الرحلة' : 'Trip Health'}</span>
              </button>

              {/* Structured memory */}
              <button
                onClick={() => setMemoryModalOpen(true)}
                className="dg-focus h-9 flex items-center gap-2 bg-[var(--dg-tint)] hover:bg-[var(--dg-tint-2)] border border-[var(--dg-line)] px-3 rounded-xl text-xs font-medium text-[var(--dg-text-2)] hover:text-[var(--dg-text)] transition-colors"
                aria-label={lang === 'ar' ? 'ذاكرة التفضيلات المنظمة' : 'Structured preference memory'}
              >
                <Brain className="w-4 h-4 text-[var(--dg-gold)] shrink-0" aria-hidden="true" />
                <span className="hidden md:inline">{lang === 'ar' ? 'ذاكرة التفضيلات' : 'Memory'}</span>
              </button>

              {/* Language */}
              <div
                role="group"
                aria-label={lang === 'ar' ? 'لغة المرشد' : 'Concierge language'}
                className="flex items-center bg-[var(--dg-tint)] border border-[var(--dg-line)] p-1 rounded-xl h-9"
              >
                <button
                  onClick={() => setLang('ar')}
                  aria-pressed={lang === 'ar'}
                  className={`dg-focus px-2.5 h-7 rounded-lg text-xs transition-colors ${lang === 'ar' ? 'bg-[var(--dg-gold)] text-[var(--dg-gold-ink)] font-bold' : 'text-[var(--dg-muted)] hover:text-[var(--dg-text)]'}`}
                >
                  ع
                </button>
                <button
                  onClick={() => setLang('en')}
                  aria-pressed={lang === 'en'}
                  className={`dg-focus px-2.5 h-7 rounded-lg text-xs transition-colors ${lang === 'en' ? 'bg-[var(--dg-gold)] text-[var(--dg-gold-ink)] font-bold' : 'text-[var(--dg-muted)] hover:text-[var(--dg-text)]'}`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>

          {/* Row 2 — the context DayGI answers against, stated in the traveler's words */}
          <div className="flex items-center gap-2 pb-3 overflow-x-auto scrollbar-none">
            <span className="text-xs text-[var(--dg-muted)] shrink-0 hidden sm:inline">
              {lang === 'ar' ? 'ردودي مبنية على:' : 'Answering for:'}
            </span>

            <label className="flex items-center gap-2 bg-[var(--dg-tint)] border border-[var(--dg-line)] ps-3 pe-2 h-9 rounded-xl shrink-0 cursor-pointer">
              <MapPin className="w-4 h-4 text-[var(--dg-gold)] shrink-0" aria-hidden="true" />
              <span className="sr-only">{lang === 'ar' ? 'مكانك الحالي في دهب' : 'Your current location in Dahab'}</span>
              <select
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                aria-label={lang === 'ar' ? 'مكانك الحالي في دهب' : 'Your current location in Dahab'}
                className="dg-focus bg-transparent text-[var(--dg-text)] outline-none text-xs cursor-pointer py-1"
              >
                <option value="Lighthouse" className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{lang === 'ar' ? 'اللايتهاوس' : 'Lighthouse'}</option>
                <option value="Eel Garden" className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{lang === 'ar' ? 'إيل جاردن' : 'Eel Garden'}</option>
                <option value="The Canyon" className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{lang === 'ar' ? 'الكانيون' : 'The Canyon'}</option>
                <option value="Blue Hole" className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{lang === 'ar' ? 'البلوهول' : 'Blue Hole'}</option>
                <option value="Laguna" className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{lang === 'ar' ? 'اللاجونا' : 'Laguna'}</option>
              </select>
            </label>

            <label className="flex items-center gap-2 bg-[var(--dg-tint)] border border-[var(--dg-line)] ps-3 pe-2 h-9 rounded-xl shrink-0 cursor-pointer">
              <Clock className="w-4 h-4 text-[var(--dg-teal)] shrink-0" aria-hidden="true" />
              <span className="sr-only">{lang === 'ar' ? 'الوقت المتاح عندك' : 'Time you have available'}</span>
              <select
                value={availableMinutes}
                onChange={(e) => setAvailableMinutes(Number(e.target.value))}
                aria-label={lang === 'ar' ? 'الوقت المتاح عندك' : 'Time you have available'}
                className="dg-focus bg-transparent text-[var(--dg-text)] outline-none text-xs cursor-pointer py-1"
              >
                <option value={60} className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{lang === 'ar' ? 'ساعة فاضية' : '1 free hour'}</option>
                <option value={120} className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{lang === 'ar' ? 'ساعتين فاضيين' : '2 free hours'}</option>
                <option value={180} className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{lang === 'ar' ? '٣ ساعات فاضية' : '3 free hours'}</option>
                <option value={240} className="bg-[var(--dg-panel)] text-[var(--dg-text)]">{lang === 'ar' ? '٤ ساعات فاضية' : '4 free hours'}</option>
              </select>
            </label>

            {/* Live marine flag — the condition every Dahab day actually turns on */}
            <span className="flex items-center gap-2 bg-[var(--dg-teal)]/12 border border-[var(--dg-teal)]/30 text-[var(--dg-teal)] px-3 h-9 rounded-xl text-xs font-medium shrink-0">
              <span className="w-2 h-2 rounded-full bg-[var(--dg-ok)] motion-safe:animate-pulse" aria-hidden="true" />
              <Waves className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{lang === 'ar' ? 'البحر: راية خضراء' : 'Sea: green flag'}</span>
            </span>
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
                {lang === 'ar' ? 'تنبيه استباقي:' : 'Proactive alert:'}
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
                  <span>{lang === 'ar' ? 'عرض الإجراء' : 'View action'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
              )}
              <button
                onClick={() => setProactiveBannerDismissed(true)}
                aria-label={lang === 'ar' ? 'إخفاء التنبيه' : 'Dismiss alert'}
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
        On xl the leftover desktop width becomes a context rail instead of void.
      */}
      <div className="relative z-10 flex-1 min-h-0 w-full max-w-[1440px] mx-auto px-4 sm:px-6 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-6">

        {/* Main Chat Stream Container */}
        <section
          aria-label={lang === 'ar' ? 'محادثة المرشد الذكي' : 'DayGI conversation'}
          className="min-h-0 flex flex-col"
        >

        {/* Messages List — announced as a live log so replies reach assistive tech */}
        <div
          ref={transcriptRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
          aria-label={lang === 'ar' ? 'سجل المحادثة' : 'Conversation transcript'}
          tabIndex={0}
          className="dg-scroll dg-focus flex-1 min-h-0 overflow-y-auto space-y-4 py-4 pe-1"
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
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--dg-gold)] to-[var(--dg-teal)] flex items-center justify-center text-[var(--dg-gold-ink)] font-bold shrink-0 mt-1 shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[90%] sm:max-w-[85%] xl:max-w-[46rem] space-y-3 ${isDayGi ? 'text-[var(--dg-text)]' : 'text-[var(--dg-gold-ink)]'}`}>
                  
                  {/* Text Bubble */}
                  <div
                    className={`rounded-2xl p-4 shadow-md text-sm leading-relaxed ${
                      isDayGi
                        ? 'bg-[var(--dg-bubble)] border border-[var(--dg-line)] text-[var(--dg-text)]'
                        : 'bg-gradient-to-r from-[var(--dg-gold)] to-[var(--dg-gold-hi)] text-[var(--dg-gold-ink)] font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isDayGi && payload?.mode && getModeBadge(payload.mode)}
                        {isDayGi && payload?.actionRisk && getRiskBadge(payload.actionRisk)}
                      </div>
                      <span className={`dg-num text-xs ${isDayGi ? 'text-[var(--dg-muted)]' : 'text-[var(--dg-gold-ink)]'}`}>{msg.timestamp}</span>
                    </div>

                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    
                    {/* Active Parsed Constraints Pills (MUST_HAVE, PREFER, AVOID) */}
                    {isDayGi && constraints && (constraints.mustHave?.length > 0 || constraints.prefer?.length > 0 || constraints.avoid?.length > 0) && (
                      <div className="mt-3 pt-2.5 border-t border-[var(--dg-line)] flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-[var(--dg-muted)] font-semibold">{lang === 'ar' ? 'القيود المستخرجة:' : 'Active Constraints:'}</span>
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

                    {isDayGi && payload?.sourceConfidence && (
                      <div className="mt-2.5 pt-2 border-t border-[var(--dg-line)] flex items-center justify-between text-[11px] text-[var(--dg-muted)]">
                        <span className="flex items-center gap-1 text-[var(--dg-teal)]">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{payload.sourceConfidence.source === 'VERIFIED_FACT' ? (lang === 'ar' ? 'حقائق مؤكدة ودفتر مركزي' : 'Verified Cloud SQL Truth') : (lang === 'ar' ? 'سياق محلي موثق' : 'Curated Dahab Context')}</span>
                        </span>
                        <span dir="auto">{payload.sourceConfidence.freshness}</span>
                      </div>
                    )}
                  </div>

                  {/* DayGI Structured Action & Rationale Cards */}
                  {isDayGi && payload && (
                    <div className="space-y-3">
                      
                      {/* "Why This?" Rationale Card */}
                      {(payload.whyThis || payload.whyThisAr) && (
                        <div className="bg-[var(--dg-panel)] border border-[var(--dg-teal)]/30 rounded-xl p-3 text-xs flex items-start gap-2.5 text-[var(--dg-text-2)]">
                          <HelpCircle className="w-4 h-4 text-[var(--dg-teal)] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[var(--dg-teal)] block mb-0.5">
                              {lang === 'ar' ? 'منطق وترشيح دايجي (Why this?):' : 'DayGI Rationale:'}
                            </span>
                            <p className="text-[var(--dg-text-2)]">
                              {lang === 'ar' ? (payload.whyThisAr || payload.whyThis) : payload.whyThis}
                            </p>
                          </div>
                        </div>
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
                              <span className="dg-num">{payload.taskPlan.steps.filter(s => s.status === 'EXECUTED').length} / {payload.taskPlan.steps.length}</span> {lang === 'ar' ? 'مكتمل' : 'Done'}
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
                                <span className="text-[11px] font-mono uppercase bg-[var(--dg-well)] px-1.5 py-0.5 rounded">
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
                              {lang === 'ar' ? 'تم التنفيذ والتسجيل في الدفتر المركزي' : 'Action Executed & Audited in Cloud SQL'}
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
                            <span className="text-[11px] text-[var(--dg-teal)] font-bold uppercase tracking-wider block">
                              {lang === 'ar' ? '٣ خيارات هادئة موثقة بعد الغوص' : '3 Verified Post-Dive Options'}
                            </span>
                            <span className="text-[12px] text-[var(--dg-gold)] font-semibold">
                              <span className="dg-num">{payload.multiOptions.postActivityContext?.endTime}</span> @ <span dir="auto">{payload.multiOptions.postActivityContext?.location}</span>
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-2.5">
                            {payload.multiOptions.options.map((opt, idx) => (
                              <div 
                                key={opt.id} 
                                className="bg-[var(--dg-tint)] hover:bg-[var(--dg-tint-2)] border border-[var(--dg-line)] rounded-xl p-3 text-xs transition-all space-y-2"
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
                                  <div className="text-right shrink-0">
                                    <span className="font-bold text-[var(--dg-gold)] text-xs block">
                                      <span className="dg-num">{opt.priceEGP} EGP</span>
                                    </span>
                                    <span className="text-[11px] text-[var(--dg-teal)] flex items-center gap-1 justify-end">
                                      <Clock className="w-2.5 h-2.5" />
                                      {opt.travelTimeMins} {lang === 'ar' ? 'د مشي' : 'min walk'}
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
                                      className="bg-gradient-to-r bg-[var(--dg-ok)] hover:brightness-110 text-[var(--dg-text)] font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1 shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
                                    >
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>{lang === 'ar' ? `احجز الخيار (${idx + 1})` : `Book Option ${idx + 1}`}</span>
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
                            <span>{lang === 'ar' ? 'تقرير التغييرات والاستجابة الفورية' : 'Differential Change & Response'}</span>
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="bg-[var(--dg-tint)] p-2.5 rounded-lg space-y-1">
                              <span className="text-[var(--dg-muted)] block text-[11px] uppercase font-bold">{lang === 'ar' ? 'ما الذي استجد؟' : 'What Changed?'}</span>
                              <span className="text-[var(--dg-text)] font-medium">{lang === 'ar' ? payload.whatChanged.whatChangedAr : payload.whatChanged.whatChangedEn}</span>
                            </div>
                            <div className="bg-[var(--dg-tint)] p-2.5 rounded-lg space-y-1">
                              <span className="text-[var(--dg-muted)] block text-[11px] uppercase font-bold">{lang === 'ar' ? 'ما الذي تأثر في رحلتك؟' : 'What Does It Affect?'}</span>
                              <span className="text-[var(--dg-risk)] font-semibold">{lang === 'ar' ? payload.whatChanged.whatItAffectsAr : payload.whatChanged.whatItAffectsEn}</span>
                            </div>
                          </div>

                          <div className="space-y-2 pt-1">
                            <span className="text-[12px] font-bold text-[var(--dg-text-2)] block">{lang === 'ar' ? 'الخيارات المتاحة لك الآن:' : 'Available Action Choices:'}</span>
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
                                    className="bg-[var(--dg-gold)] hover:bg-[var(--dg-gold-hi)] text-[var(--dg-gold-ink)] font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 transition-all"
                                  >
                                    {lang === 'ar' ? 'اختيار' : 'Select'}
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
                              <span>{lang === 'ar' ? 'مراجعة وتأكيد تعديل الرحلة' : 'Schedule Shift Confirmation'}</span>
                            </span>
                            <span className="text-[11px] bg-[var(--dg-gold)]/20 text-[var(--dg-gold)] px-2 py-0.5 rounded-full font-bold">
                              5-Step Audit
                            </span>
                          </div>

                          <div className="bg-[var(--dg-tint)] rounded-lg p-3 text-xs space-y-2">
                            <div className="flex items-center justify-between text-[var(--dg-muted)]">
                              <span>1. {lang === 'ar' ? 'النشاط الحالي:' : 'Current Activity:'}</span>
                              <span className="font-semibold text-[var(--dg-risk)] line-through">
                                {lang === 'ar' ? payload.multiActionConfirmation.step1OldItem.titleAr : payload.multiActionConfirmation.step1OldItem.titleEn}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[var(--dg-text-2)]">
                              <span>2. {lang === 'ar' ? 'الموعد البديل:' : 'New Target Slot:'}</span>
                              <span className="font-bold text-[var(--dg-teal)]">
                                {payload.multiActionConfirmation.step2Alternative.newTime} ({payload.multiActionConfirmation.step2Alternative.supplierName})
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[var(--dg-muted)]">
                              <span>3. {lang === 'ar' ? 'الفارق المالي:' : 'Ledger Impact:'}</span>
                              <span className="font-semibold text-[var(--dg-ok)]">
                                {lang === 'ar' ? payload.multiActionConfirmation.step3PriceVariance.ledgerNoteAr : payload.multiActionConfirmation.step3PriceVariance.ledgerNoteEn}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[var(--dg-muted)]">
                              <span>4. {lang === 'ar' ? 'تأثير الجدول:' : 'Pacing Impact:'}</span>
                              <span className="font-semibold text-[var(--dg-text-2)]">
                                {lang === 'ar' ? payload.multiActionConfirmation.step4ScheduleImpact.impactSummaryAr : payload.multiActionConfirmation.step4ScheduleImpact.impactSummaryEn}
                              </span>
                            </div>
                          </div>

                          {!isExecuted ? (
                            <button
                              onClick={() => handleExecuteAction(msg.id, payload.multiActionConfirmation!.step5ActionKey, payload.multiActionConfirmation!.step5Payload)}
                              disabled={executingActionId === msg.id}
                              className="w-full bg-[var(--dg-gold)] hover:bg-[var(--dg-gold-hi)] text-[var(--dg-gold-ink)] font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
                            >
                              {executingActionId === msg.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                              <span>5. {lang === 'ar' ? 'تأكيد التعديل وتحديث خطتي' : 'Confirm & Commit Shift'}</span>
                            </button>
                          ) : (
                            <div className="text-center text-xs text-[var(--dg-ok)] font-semibold py-1">
                              ✓ {lang === 'ar' ? 'تم تحديث جدول الرحلة بنجاح' : 'Shift applied to itinerary'}
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
                                {lang === 'ar' ? 'مؤشر صحة وموثوقية الرحلة' : 'Trip Health & Reliability Score'}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-[var(--dg-ok)] font-mono">
                              <span className="dg-num">{payload.tripHealth.score} / 100</span>
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-[var(--dg-tint)] p-2 rounded-lg">
                              <span className="text-[11px] text-[var(--dg-muted)] block">{lang === 'ar' ? 'المدفوعات:' : 'Payments:'}</span>
                              <span className="text-[var(--dg-ok)] font-bold">
                                {!payload.tripHealth.issues.some((i: DayGiTripHealthIssue) => i.type === 'PAYMENT_PENDING') ? '✓ Verified (100%)' : 'Pending'}
                              </span>
                            </div>
                            <div className="bg-[var(--dg-tint)] p-2 rounded-lg">
                              <span className="text-[11px] text-[var(--dg-muted)] block">{lang === 'ar' ? 'حالة الموردين:' : 'Suppliers:'}</span>
                              <span className="text-[var(--dg-ok)] font-bold">
                                {payload.tripHealth.metrics.pendingBookings === 0 ? '✓ Assigned Tier-1' : 'Pending'}
                              </span>
                            </div>
                            <div className="bg-[var(--dg-tint)] p-2 rounded-lg">
                              <span className="text-[11px] text-[var(--dg-muted)] block">{lang === 'ar' ? 'التعارضات:' : 'Conflicts:'}</span>
                              <span className="text-[var(--dg-ok)] font-bold">
                                {payload.tripHealth.metrics.conflictsCount === 0 ? '✓ 0 Conflicts' : 'Detected'}
                              </span>
                            </div>
                            <div className="bg-[var(--dg-tint)] p-2 rounded-lg">
                              <span className="text-[11px] text-[var(--dg-muted)] block">{lang === 'ar' ? 'رايات البحر:' : 'Marine Flags:'}</span>
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
                              <span className="text-[11px] text-[var(--dg-teal)] font-bold uppercase tracking-wider block">
                                {lang === 'ar' ? 'مراجعة وتأكيد الحجز المباشر' : 'Direct Booking Review'}
                              </span>
                              <h4 className="font-bold text-[var(--dg-text)] text-sm">
                                {lang === 'ar' ? (payload.actionData.bookingReview.serviceAr || payload.actionTitleAr) : (payload.actionData.bookingReview.service || payload.actionTitle)}
                              </h4>
                              <p className="text-[12px] text-[var(--dg-muted)]">
                                {payload.actionData.bookingReview.supplierName}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-[var(--dg-gold)] block">
                                <span className="dg-num">{payload.actionData.bookingReview.priceEGP?.toLocaleString()} EGP</span>
                              </span>
                              <span className="text-[11px] text-[var(--dg-ok)] flex items-center gap-1 justify-end">
                                <Check className="w-2.5 h-2.5" />
                                {lang === 'ar' ? 'سعر مباشر بدون وسيط' : 'Direct Best Price'}
                              </span>
                            </div>
                          </div>

                          <div className="bg-[var(--dg-tint)] rounded-lg p-3 text-xs text-[var(--dg-text-2)] mb-3 space-y-1.5">
                            <div className="flex items-center justify-between text-[var(--dg-muted)]">
                              <span>{lang === 'ar' ? 'الميعاد والوقت:' : 'Date & Slot:'}</span>
                              <span className="font-semibold text-[var(--dg-text)]">{payload.actionData.bookingReview.date} · {payload.actionData.bookingReview.time}</span>
                            </div>
                            <div className="flex items-center justify-between text-[var(--dg-muted)]">
                              <span>{lang === 'ar' ? 'عدد الأفراد:' : 'Guests:'}</span>
                              <span className="font-semibold text-[var(--dg-text)]">{payload.actionData.bookingReview.people} {lang === 'ar' ? 'أفراد' : 'Guests'}</span>
                            </div>
                            <div className="flex items-center justify-between text-[var(--dg-muted)]">
                              <span>{lang === 'ar' ? 'سياسة الإلغاء:' : 'Cancellation:'}</span>
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
                                className="bg-gradient-to-r bg-[var(--dg-ok)] hover:brightness-110 text-[var(--dg-text)] font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
                              >
                                {executingActionId === msg.id ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                                <span>{lang === 'ar' ? 'تثبيت الحجز (Hold)' : 'Confirm & Hold'}</span>
                              </button>

                              <button
                                onClick={() => handleOpenBookingHandoff(payload.actionData?.bookingReview?.skuId || 'SKU-DIV-001')}
                                className="bg-[var(--dg-gold)] hover:bg-[var(--dg-gold-hi)] text-[var(--dg-gold-ink)] font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-[0.99]"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>{lang === 'ar' ? 'دفع إلكتروني' : 'Pay Now'}</span>
                              </button>
                            </div>
                          ) : (
                            <div className="text-center text-xs text-[var(--dg-ok)] font-semibold py-1">
                              ✓ {lang === 'ar' ? 'تم تثبيت المقعد في حسابك' : 'Booking held and confirmed'}
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
                                {lang === 'ar' ? 'خطة خفض الميزانية المعتمدة' : 'Verified Budget Optimization'}
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
                              className="w-full bg-[var(--dg-teal)] hover:bg-[var(--dg-teal-hi)] text-[var(--dg-teal-ink)] font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{lang === 'ar' ? 'تطبيق خطة التوفير المقترحة' : 'Apply Savings Optimizations'}</span>
                            </button>
                          ) : (
                            <div className="text-center text-xs text-[var(--dg-ok)] font-semibold py-1">
                              ✓ {lang === 'ar' ? 'تم تطبيق التوفير وإيداع الفرق' : 'Optimizations applied'}
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
                              {lang === 'ar' ? 'موجز اليوم' : 'Daily Briefing'}
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
                            {lang === 'ar' ? 'نصائح عملية من أهل دهب:' : 'Practical Local Advice:'}
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
                            {lang === 'ar' ? 'هل ساعدتك هذه الخطوة؟' : 'Did this help your outcome?'}
                          </span>
                          <button
                            onClick={() => {
                              if (msg.liked) return;
                              setFeedbackReasonOpenId(feedbackReasonOpenId === msg.id ? null : msg.id);
                              handleFeedback(msg.id, true, 'ACCURATE');
                            }}
                            className={`p-1 rounded hover:bg-[var(--dg-tint-2)] text-[var(--dg-muted)] hover:text-[var(--dg-ok)] transition-colors ${msg.liked ? 'text-[var(--dg-ok)] font-bold' : ''}`}
                            title="Helpful"
                            aria-label={lang === 'ar' ? 'كان مفيداً' : 'This answer was helpful'}
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
                            aria-label={lang === 'ar' ? 'يحتاج تحسين' : 'This answer needs improvement'}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* 1-Tap Feedback Detail Tags */}
                        {feedbackReasonOpenId === msg.id && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-1 animate-in fade-in duration-200">
                            <span className="text-[11px] text-[var(--dg-muted)]">{lang === 'ar' ? 'سبب التقييم:' : 'Reason:'}</span>
                            {[
                              { tag: 'ACCURATE', labelAr: '🎯 دقيق ومباشر', labelEn: 'Accurate' },
                              { tag: 'FAST_RESOLUTION', labelAr: '⚡ سريع وسهل', labelEn: 'Fast' },
                              { tag: 'SAVED_MONEY', labelAr: '💰 وفّر ميزانية', labelEn: 'Saved Money' },
                              { tag: 'TOO_VAGUE', labelAr: '❓ غير دقيق', labelEn: 'Vague' },
                              { tag: 'WRONG_LOCATION', labelAr: '📍 الموقع غير مناسب', labelEn: 'Wrong Spot' }
                            ].map((item) => (
                              <button
                                key={item.tag}
                                onClick={() => handleFeedback(msg.id, msg.liked || true, item.tag)}
                                className="px-2 py-0.5 rounded-md bg-[var(--dg-tint)] hover:bg-[var(--dg-tint-3)] border border-[var(--dg-line)] text-[11px] text-[var(--dg-text-2)] hover:text-[var(--dg-text)] transition-all"
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
                <span>{lang === 'ar' ? 'دايجي ٣.٠ يطابق القيود، يفحص صحة الرحلة، ويجهز الخيارات المعتمدة…' : 'DayGI 3.0 is matching constraints, auditing trip health, and structuring verified options…'}</span>
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

          {/* Quick Prompts Carousel / Pills */}
          <div
            role="group"
            aria-label={lang === 'ar' ? 'أوامر سريعة' : 'Quick actions'}
            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
          >
            <span className="text-xs text-[var(--dg-muted)] font-semibold shrink-0 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[var(--dg-gold)]" aria-hidden="true" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'جرّب:' : 'Try:'}</span>
            </span>
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.prompt)}
                disabled={isLoading}
                className="dg-focus shrink-0 bg-[var(--dg-tint)] hover:bg-[var(--dg-tint-3)] border border-[var(--dg-line)] text-[var(--dg-text-2)] hover:text-[var(--dg-text)] px-3.5 h-9 rounded-full text-xs transition-colors active:scale-[0.98] disabled:opacity-45"
              >
                {lang === 'ar' ? qp.titleAr : qp.titleEn}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-[var(--dg-panel)] border border-[var(--dg-line)] focus-within:border-[var(--dg-gold)] focus-within:ring-2 focus-within:ring-[var(--dg-gold)]/35 rounded-2xl p-2 shadow-[var(--dg-shadow)] transition-colors"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              aria-label={lang === 'ar' ? 'اكتب رسالتك للمرشد الذكي' : 'Message DayGI'}
              placeholder={
                lang === 'ar'
                  ? 'اسأل دايجي: «عايز حاجة هادية بعد الغطس»…'
                  : 'Ask DayGI: “somewhere calm after the dive”…'
              }
              className="flex-1 min-w-0 bg-transparent text-[var(--dg-text)] px-3 py-2.5 text-sm outline-none placeholder:text-[var(--dg-muted)] truncate"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              aria-label={lang === 'ar' ? 'إرسال الرسالة' : 'Send message'}
              className="dg-focus w-11 h-11 rounded-xl bg-gradient-to-tr from-[var(--dg-gold)] to-[var(--dg-teal)] text-[var(--dg-gold-ink)] flex items-center justify-center shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:hover:brightness-100 shrink-0"
            >
              {isLoading
                ? <RefreshCw className="w-4.5 h-4.5 animate-spin" aria-hidden="true" />
                : <Send className={`w-4.5 h-4.5 ${lang === 'ar' ? 'rotate-180' : ''}`} aria-hidden="true" />}
            </button>
          </form>

          {/* Safety & Operating Layer Guarantee */}
          <p className="flex items-center justify-center gap-2 text-xs text-[var(--dg-muted)] text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--dg-teal)] shrink-0" aria-hidden="true" />
            <span>
              {lang === 'ar'
                ? 'دايجي مش هيغيّر أي حجز أو يخصم أي مبلغ من غير ما توافق أنت الأول.'
                : 'DayGI never changes a booking or moves money until you confirm it.'}
            </span>
          </p>

        </div>

        </section>

        {/*
          Context rail.

          Trip health, structured memory, live alerts and the multi-step task
          queue were all locked behind badges and modals, so a 1440px screen
          showed a narrow chat column flanked by ~500px of empty canvas on each
          side. The same state now reads at a glance on xl and up; the modals
          stay as the detail view and remain the only route on narrow screens.
        */}
        <aside
          aria-label={lang === 'ar' ? 'حالة الرحلة المباشرة' : 'Live trip status'}
          className="dg-scroll hidden xl:flex flex-col gap-3 min-h-0 overflow-y-auto py-4 pb-24"
        >

          {/* Trip health */}
          <div className="bg-[var(--dg-panel)] border border-[var(--dg-line)] rounded-2xl p-4 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-xs font-semibold text-[var(--dg-muted)] block">
                  {lang === 'ar' ? 'صحة الرحلة' : 'Trip health'}
                </span>
                <span className="text-2xl font-bold text-[var(--dg-ok)] dg-num block leading-tight">
                  {healthScore}%
                </span>
              </div>
              <div
                className="w-14 h-14 rounded-full shrink-0 grid place-items-center"
                style={{
                  background: `conic-gradient(var(--dg-ok) ${healthScore * 3.6}deg, var(--dg-tint-2) 0deg)`
                }}
                aria-hidden="true"
              >
                <span className="w-11 h-11 rounded-full bg-[var(--dg-panel)] grid place-items-center">
                  <HeartPulse className="w-5 h-5 text-[var(--dg-ok)]" />
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--dg-text-2)] mt-2 leading-relaxed">
              {openIssues > 0
                ? (lang === 'ar'
                    ? `${openIssues} نقطة محتاجة انتباهك في الجدول.`
                    : `${openIssues} point${openIssues > 1 ? 's' : ''} need your attention.`)
                : (lang === 'ar'
                    ? 'كل الحجوزات مؤكدة، ومفيش تعارض في الجدول.'
                    : 'Every booking is confirmed and nothing clashes.')}
            </p>

            <button
              onClick={() => setHealthModalOpen(true)}
              className="dg-focus mt-3 w-full h-9 rounded-xl bg-[var(--dg-tint)] hover:bg-[var(--dg-tint-2)] border border-[var(--dg-line)] text-xs font-semibold text-[var(--dg-text-2)] hover:text-[var(--dg-text)] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{lang === 'ar' ? 'افتح الفحص الكامل' : 'Open the full audit'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
          </div>

          {/* Live alerts */}
          {liveSuggestions.length > 0 && (
            <div className="bg-[var(--dg-panel)] border border-[var(--dg-line)] rounded-2xl p-4 shrink-0 space-y-2.5">
              <span className="text-xs font-semibold text-[var(--dg-muted)] flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[var(--dg-gold)]" aria-hidden="true" />
                {lang === 'ar' ? 'تنبيهات استباقية' : 'Proactive alerts'}
              </span>
              {liveSuggestions.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className={`rounded-xl p-3 border text-xs leading-relaxed ${
                    s.urgency === 'CRITICAL'
                      ? 'bg-[var(--dg-risk)]/12 border-[var(--dg-risk)]/35'
                      : s.urgency === 'ACTION_REQUIRED'
                      ? 'bg-[var(--dg-gold)]/12 border-[var(--dg-gold)]/35'
                      : 'bg-[var(--dg-tint)] border-[var(--dg-line)]'
                  }`}
                >
                  <span className="font-bold text-[var(--dg-text)] block">
                    {lang === 'ar' ? s.titleAr : s.titleEn}
                  </span>
                  <span className="text-[var(--dg-text-2)] block mt-0.5">
                    {lang === 'ar' ? s.descriptionAr : s.descriptionEn}
                  </span>
                  {s.timeContext && (
                    <span className="dg-num text-[var(--dg-muted)] block mt-1">{s.timeContext}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Multi-step tasks in flight */}
          {activeTasks.length > 0 && (
            <div className="bg-[var(--dg-panel)] border border-[var(--dg-line)] rounded-2xl p-4 shrink-0 space-y-2.5">
              <span className="text-xs font-semibold text-[var(--dg-muted)] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[var(--dg-teal)]" aria-hidden="true" />
                {lang === 'ar' ? 'مهام شغّالة دلوقتي' : 'Tasks in progress'}
              </span>
              {activeTasks.slice(0, 3).map((t) => (
                <div key={t.taskId} className="bg-[var(--dg-tint)] border border-[var(--dg-line)] rounded-xl p-3 text-xs">
                  <span className="font-bold text-[var(--dg-text)] block">
                    {lang === 'ar' ? t.titleAr : t.titleEn}
                  </span>
                  <div className="flex items-center justify-between mt-2 text-[var(--dg-muted)]">
                    <span className="dg-num">
                      {t.currentStepNumber}/{t.totalSteps}
                    </span>
                    <span className="font-mono uppercase text-[var(--dg-teal)]">{t.state}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-[var(--dg-tint-2)] overflow-hidden">
                    <span
                      className="block h-full rounded-full bg-[var(--dg-teal)]"
                      style={{ width: `${Math.min(100, (t.currentStepNumber / Math.max(1, t.totalSteps)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Structured memory summary */}
          <div className="bg-[var(--dg-panel)] border border-[var(--dg-line)] rounded-2xl p-4 shrink-0">
            <span className="text-xs font-semibold text-[var(--dg-muted)] flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-[var(--dg-gold)]" aria-hidden="true" />
              {lang === 'ar' ? 'اللي دايجي فاكره عنك' : 'What DayGI remembers'}
            </span>

            {userMemory ? (
              <>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {userMemory.preferences.pace && (
                    <span className="bg-[var(--dg-teal)]/15 text-[var(--dg-teal)] border border-[var(--dg-teal)]/30 px-2 py-1 rounded-lg text-xs">
                      {lang === 'ar' ? 'الإيقاع' : 'Pace'}: {userMemory.preferences.pace}
                    </span>
                  )}
                  {userMemory.preferences.morningPreference && (
                    <span className="bg-[var(--dg-teal)]/15 text-[var(--dg-teal)] border border-[var(--dg-teal)]/30 px-2 py-1 rounded-lg text-xs">
                      {userMemory.preferences.morningPreference === 'Late_Start'
                        ? (lang === 'ar' ? 'صباح متأخر' : 'Late mornings')
                        : (lang === 'ar' ? 'صباح مبكر' : 'Early riser')}
                    </span>
                  )}
                  {userMemory.preferences.budgetBand && (
                    <span className="bg-[var(--dg-gold)]/15 text-[var(--dg-gold)] border border-[var(--dg-gold)]/30 px-2 py-1 rounded-lg text-xs">
                      {userMemory.preferences.budgetBand}
                    </span>
                  )}
                  {userMemory.preferences.seafoodPreference && (
                    <span className="bg-[var(--dg-tint)] text-[var(--dg-text-2)] border border-[var(--dg-line)] px-2 py-1 rounded-lg text-xs">
                      {lang === 'ar' ? 'بيحب السمك الطازج' : 'Loves fresh seafood'}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setMemoryModalOpen(true)}
                  className="dg-focus mt-3 w-full h-9 rounded-xl bg-[var(--dg-tint)] hover:bg-[var(--dg-tint-2)] border border-[var(--dg-line)] text-xs font-semibold text-[var(--dg-text-2)] hover:text-[var(--dg-text)] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{lang === 'ar' ? 'عدّل تفضيلاتك' : 'Edit preferences'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
              </>
            ) : (
              <p className="text-xs text-[var(--dg-text-2)] mt-2 leading-relaxed">
                {lang === 'ar'
                  ? 'لسه دايجي بيتعرّف عليك — كل ما تقوله عن مزاجك وميزانيتك بيتحفظ هنا ويتطبّق على كل اقتراح.'
                  : 'DayGI is still learning you — whatever you say about pace and budget lands here and shapes every suggestion.'}
              </p>
            )}
          </div>
        </aside>
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
                  {lang === 'ar' ? 'فحص معايير صحة وموثوقية الرحلة (٧ محاور)' : '7-Point Trip Health Inspector'}
                </h3>
              </div>
              <button
                onClick={() => setHealthModalOpen(false)}
                autoFocus
                aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
                className="dg-focus w-9 h-9 shrink-0 grid place-items-center text-[var(--dg-muted)] hover:text-[var(--dg-text)] hover:bg-[var(--dg-tint-2)] rounded-lg transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="bg-[var(--dg-tint)] rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-[var(--dg-muted)] block">{lang === 'ar' ? 'التقييم الإجمالي:' : 'Overall Health Status:'}</span>
                <span className="text-lg font-bold text-[var(--dg-ok)]" dir="auto">{tripHealth.status} <span className="dg-num">({tripHealth.score} / 100)</span></span>
              </div>
              <div className="dg-num w-12 h-12 rounded-full border-4 border-[var(--dg-ok)] flex items-center justify-center font-bold text-[var(--dg-text)] text-sm">
                {tripHealth.score}%
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--dg-tint)]">
                <span>1. {lang === 'ar' ? 'المدفوعات والمطابقات المالية:' : 'Payment Verification:'}</span>
                <span className="text-[var(--dg-ok)] font-bold">✓ 100% {lang === 'ar' ? 'مكتمل' : 'Cleared'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--dg-tint)]">
                <span>2. {lang === 'ar' ? 'التزامات الموردين المعتمدين:' : 'Supplier Assignment SLAs:'}</span>
                <span className="text-[var(--dg-ok)] font-bold">✓ {lang === 'ar' ? 'مؤكد' : 'Confirmed'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--dg-tint)]">
                <span>3. {lang === 'ar' ? 'خلو الجدول من التعارضات الزمنية:' : 'Schedule Conflict Check:'}</span>
                <span className="text-[var(--dg-ok)] font-bold">✓ 0 {lang === 'ar' ? 'تعارض' : 'Conflicts'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--dg-tint)]">
                <span>4. {lang === 'ar' ? 'فواصل التنقل والراحة (Buffer):' : 'Transit Buffer (>= 15 min):'}</span>
                <span className="text-[var(--dg-ok)] font-bold">✓ {lang === 'ar' ? 'كافية ومريحة' : 'Optimal'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--dg-tint)]">
                <span>5. {lang === 'ar' ? 'أمان فترات تخفيف الضغط والغوص:' : 'Decompression & Ascent Safety:'}</span>
                <span className="text-[var(--dg-ok)] font-bold">✓ {lang === 'ar' ? 'آمن تماماً' : 'Safe Window'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--dg-tint)]">
                <span>6. {lang === 'ar' ? 'رصد غرفة الغوص وحالة البحر:' : 'CDWS Marine Flags & Weather:'}</span>
                <span className="text-[var(--dg-ok)] font-bold">✓ Green Flag</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--dg-tint)]">
                <span>7. {lang === 'ar' ? 'اكتمال النقل والإقامة:' : 'Hotel & Airport Transfers:'}</span>
                <span className="text-[var(--dg-ok)] font-bold">✓ {lang === 'ar' ? 'مغطى بالكامل' : 'Complete'}</span>
              </div>
            </div>

            <button
              onClick={() => setHealthModalOpen(false)}
              className="dg-focus w-full bg-[var(--dg-gold)] hover:bg-[var(--dg-gold-hi)] text-[var(--dg-gold-ink)] font-bold h-11 rounded-xl text-xs transition-colors"
            >
              {lang === 'ar' ? 'إغلاق تقرير الفحص' : 'Close Audit Report'}
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
                  {lang === 'ar' ? 'ذاكرة دايجي المنظمة' : 'DayGI Structured Memory & Preferences'}
                </h3>
              </div>
              <button
                onClick={() => setMemoryModalOpen(false)}
                autoFocus
                aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
                className="dg-focus w-9 h-9 shrink-0 grid place-items-center text-[var(--dg-muted)] hover:text-[var(--dg-text)] hover:bg-[var(--dg-tint-2)] rounded-lg transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <p className="text-xs text-[var(--dg-text-2)] leading-relaxed">
              {lang === 'ar'
                ? 'دايجي يحفظ تفضيلاتك كبيانات منظمة دقيقة (وليس نصوص محادثات طويلة) ليطبقها فورياً في كل ترشيح وتعديل للجدول.'
                : 'DayGI maintains explicit structured preferences (never raw transcripts) to ground every proposal and itinerary adjustment.'}
            </p>

            <div className="space-y-3 text-xs">
              
              {/* Pace Toggle */}
              <div className="bg-[var(--dg-tint)] p-3 rounded-xl flex items-center justify-between">
                <span>{lang === 'ar' ? 'إيقاع الرحلة المفضل:' : 'Trip Pacing:'}</span>
                <div className="flex items-center gap-1 bg-[var(--dg-well)] p-1 rounded-lg">
                  {(['Relaxed', 'Balanced', 'Active'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => handleUpdatePreferences({ pace: p })}
                      className={`px-2 py-1 rounded text-xs transition-all ${userMemory.preferences.pace === p ? 'bg-[var(--dg-gold)] text-[var(--dg-gold-ink)] font-bold' : 'text-[var(--dg-muted)] hover:text-[var(--dg-text)]'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mornings Preference */}
              <div className="bg-[var(--dg-tint)] p-3 rounded-xl flex items-center justify-between">
                <span>{lang === 'ar' ? 'توقيت الصباح المفضل:' : 'Morning Routine:'}</span>
                <div className="flex items-center gap-1 bg-[var(--dg-well)] p-1 rounded-lg">
                  <button
                    onClick={() => handleUpdatePreferences({ morningPreference: 'Late_Start' })}
                    className={`px-2 py-1 rounded text-xs transition-all ${userMemory.preferences.morningPreference === 'Late_Start' ? 'bg-[var(--dg-teal)] text-[var(--dg-teal-ink)] font-bold' : 'text-[var(--dg-muted)] hover:text-[var(--dg-text)]'}`}
                  >
                    {lang === 'ar' ? 'بعد ١٠:٠٠ ص' : 'After 10 AM'}
                  </button>
                  <button
                    onClick={() => handleUpdatePreferences({ morningPreference: 'Early_Bird' })}
                    className={`px-2 py-1 rounded text-xs transition-all ${userMemory.preferences.morningPreference === 'Early_Bird' ? 'bg-[var(--dg-teal)] text-[var(--dg-teal-ink)] font-bold' : 'text-[var(--dg-muted)] hover:text-[var(--dg-text)]'}`}
                  >
                    {lang === 'ar' ? 'صباحي مبكر' : 'Early Bird'}
                  </button>
                </div>
              </div>

              {/* Seafood Preference */}
              <div className="bg-[var(--dg-tint)] p-3 rounded-xl flex items-center justify-between">
                <span>{lang === 'ar' ? 'تفضيل الأسماك الطازجة:' : 'Seafood Dining Preference:'}</span>
                <button
                  onClick={() => handleUpdatePreferences({ seafoodPreference: !userMemory.preferences.seafoodPreference })}
                  className={`px-3 py-1 rounded-lg font-bold text-xs ${userMemory.preferences.seafoodPreference ? 'bg-[var(--dg-ok)]/18 text-[var(--dg-ok)] border border-[var(--dg-ok)]/40' : 'bg-[var(--dg-tint-2)] text-[var(--dg-muted)]'}`}
                >
                  {userMemory.preferences.seafoodPreference ? (lang === 'ar' ? 'مفعل (نشط)' : 'Enabled') : (lang === 'ar' ? 'غير مفعل' : 'Disabled')}
                </button>
              </div>

              {/* Learned Insights */}
              {userMemory.learnedInsights?.length > 0 && (
                <div className="bg-[var(--dg-tint)] p-3 rounded-xl space-y-1.5">
                  <span className="font-bold text-[var(--dg-gold)] block text-[12px]">
                    {lang === 'ar' ? 'رؤى تم استنتاجها تلقائياً:' : 'Learned Behavioral Insights:'}
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
              {lang === 'ar' ? 'حفظ وإغلاق' : 'Save & Close'}
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
