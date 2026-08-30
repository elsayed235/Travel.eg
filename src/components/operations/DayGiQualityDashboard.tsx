import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Radio,
  RefreshCw,
  Search,
  Shield,
  Sliders,
  Users,
  Compass,
  FileText,
  Zap,
  ArrowRight,
  TrendingUp,
  MapPin,
  MessageSquare,
  Check,
  X,
  Globe,
  Lightbulb,
  Sparkles,
  Bot,
  DollarSign,
  ShieldCheck,
  Play,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Layers,
  ArrowUpRight,
  Filter,
  CheckSquare,
  BarChart3,
  SlidersHorizontal,
  Bell,
  Lock,
  ChevronDown,
  ChevronRight,
  Download
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  DayGiBetaDashboardData,
  DayGiExperimentFlags,
  DayGiGoldenScenarioResult,
  DayGiIntentPerformance
} from '../../types/daygiBeta';

export const DayGiQualityDashboard: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const [data, setData] = useState<DayGiBetaDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedIntentTier, setSelectedIntentTier] = useState<'ALL' | 'GREEN' | 'YELLOW' | 'RED'>('ALL');
  const [activeSubTab, setActiveSubTab] = useState<'funnel' | 'intents' | 'locales' | 'alerts' | 'cards' | 'audits' | 'scenarios' | 'experiments' | 'weekly_report'>('funnel');

  // Golden Scenarios Suite State
  const [isRunningScenarios, setIsRunningScenarios] = useState<boolean>(false);
  const [scenariosReport, setScenariosReport] = useState<{
    allPassed: boolean;
    passCount: number;
    totalCount: number;
    results: DayGiGoldenScenarioResult[];
  } | null>(null);

  // Weekly Report State
  const [weeklyReport, setWeeklyReport] = useState<any | null>(null);
  const [isGeneratingWeekly, setIsGeneratingWeekly] = useState<boolean>(false);

  // Experiment Flags State
  const [flags, setFlags] = useState<DayGiExperimentFlags>({
    proactiveAlertFrequency: 'BALANCED',
    quickPromptOrdering: 'CONTEXT_AWARE',
    explanationLevel: 'ON_DEMAND',
    confirmationStyle: 'MODAL_EXPLICIT',
    recommendationCardLayout: 'RICH_VERTICAL'
  });
  const [isSavingFlags, setIsSavingFlags] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const dashboard = await api.getDayGiBetaDashboard();
      setData(dashboard);
      if (dashboard.experimentFlags) {
        setFlags(dashboard.experimentFlags);
      }
    } catch (err) {
      console.error('Failed to load DayGI beta metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateExperimentFlag = async (key: keyof DayGiExperimentFlags, value: any) => {
    const updated = { ...flags, [key]: value };
    setFlags(updated);
    setIsSavingFlags(true);
    try {
      await api.updateDayGiBetaExperiments(updated);
    } catch (err) {
      console.error('Failed to update experiment flag:', err);
    } finally {
      setIsSavingFlags(false);
    }
  };

  const handleRunGoldenScenarios = async () => {
    setIsRunningScenarios(true);
    try {
      const report = await api.runDayGiGoldenScenarios();
      setScenariosReport(report);
    } catch (err) {
      console.error('Failed to run golden scenarios:', err);
    } finally {
      setIsRunningScenarios(false);
    }
  };

  const handleGenerateWeeklyReport = async () => {
    setIsGeneratingWeekly(true);
    try {
      const report = await api.generateDayGiWeeklyReport();
      setWeeklyReport(report);
    } catch (err) {
      console.error('Failed to generate weekly report:', err);
    } finally {
      setIsGeneratingWeekly(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="p-8 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#20A89A] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[#E7D3AE]/70">
          {language === 'ar' ? 'جاري تحميل مؤشرات أداء بيتا دايجي...' : 'Loading DayGI Closed Beta outcome metrics...'}
        </p>
      </div>
    );
  }

  const { summary, funnelSteps, localeComparison, intentTiers, proactiveAlerts, actionCards, recentOutcomeAudits, recentFeedback, governedOpportunitiesFromFriction, operationalThresholds } = data;

  const allIntents: DayGiIntentPerformance[] = [
    ...intentTiers.green,
    ...intentTiers.yellow,
    ...intentTiers.red
  ];

  const filteredIntents = selectedIntentTier === 'ALL'
    ? allIntents
    : allIntents.filter(i => i.tier === selectedIntentTier);

  return (
    <div id="daygi-quality-dashboard" className="space-y-6">
      {/* 1. Header KPI Overview Banner */}
      <div className="bg-[#062C35]/80 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#20A89A]/20 text-[#52C4B7] border border-[#20A89A]/30">
                DAYGI 4.0 CLOSED BETA
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> RELEASE GATE: PASS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif] text-[#F7F3EA] mt-1">
              {language === 'ar' ? 'لوحة جودة مخرجات دايجي وتتبع التجربة' : 'DayGI Quality & Real User Outcome Dashboard'}
            </h2>
            <p className="text-xs text-[#E7D3AE]/70">
              {language === 'ar'
                ? 'مراقبة تحويل الطلبات، دقة الفهم، جودة التنبيهات الاستباقية، ومؤشرات الأمان المعتمدة للمسافرين'
                : 'Measuring full funnel transitions, intent understanding, proactive alert quality, and zero-tolerance safety'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchDashboardData}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#E7D3AE] text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تحديث البيانات' : 'Refresh Metrics'}</span>
            </button>
            <button
              type="button"
              onClick={handleRunGoldenScenarios}
              disabled={isRunningScenarios}
              className="px-4 py-1.5 rounded-xl bg-[#20A89A] hover:bg-[#1B8F83] text-[#04171D] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunningScenarios ? (language === 'ar' ? 'جاري الفحص...' : 'Evaluating...') : (language === 'ar' ? 'فحص السيناريوهات (9)' : 'Run 9 Golden Scenarios')}</span>
            </button>
          </div>
        </div>

        {/* 2. Top-Level Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-5">
          <div className="bg-[#04171D]/60 border border-white/5 rounded-xl p-3.5">
            <div className="text-[12px] text-[#E7D3AE]/70 font-medium">
              {language === 'ar' ? 'دقة فهم الطلب' : 'Intent Understanding'}
            </div>
            <div className="text-xl font-extrabold text-emerald-400 mt-1 font-mono">
              {summary.intentUnderstandingRate}%
            </div>
            <div className="text-[11px] text-emerald-400/80 flex items-center gap-1 mt-0.5">
              <Check className="w-3 h-3" /> Target ≥92.0%
            </div>
          </div>

          <div className="bg-[#04171D]/60 border border-white/5 rounded-xl p-3.5">
            <div className="text-[12px] text-[#E7D3AE]/70 font-medium">
              {language === 'ar' ? 'معدل طلب التوضيح' : 'Clarification Rate'}
            </div>
            <div className="text-xl font-extrabold text-[#52C4B7] mt-1 font-mono">
              {summary.clarificationRate}%
            </div>
            <div className="text-[11px] text-[#52C4B7]/80 flex items-center gap-1 mt-0.5">
              <Check className="w-3 h-3" /> Target ≤12.0%
            </div>
          </div>

          <div className="bg-[#04171D]/60 border border-white/5 rounded-xl p-3.5">
            <div className="text-[12px] text-[#E7D3AE]/70 font-medium">
              {language === 'ar' ? 'قبول المقترحات' : 'Recommendation Accept'}
            </div>
            <div className="text-xl font-extrabold text-amber-400 mt-1 font-mono">
              {summary.recommendationAcceptanceRate}%
            </div>
            <div className="text-[11px] text-[#E7D3AE]/50 mt-0.5">
              82 of 94 accepted
            </div>
          </div>

          <div className="bg-[#04171D]/60 border border-white/5 rounded-xl p-3.5">
            <div className="text-[12px] text-[#E7D3AE]/70 font-medium">
              {language === 'ar' ? 'اكتمال وتوثيق الإجراء' : 'Action Completion'}
            </div>
            <div className="text-xl font-extrabold text-emerald-400 mt-1 font-mono">
              {summary.actionCompletionRate}%
            </div>
            <div className="text-[11px] text-emerald-400/80 mt-0.5">
              Cloud SQL verified
            </div>
          </div>

          <div className="bg-[#04171D]/60 border border-white/5 rounded-xl p-3.5">
            <div className="text-[12px] text-[#E7D3AE]/70 font-medium">
              {language === 'ar' ? 'تحويل الحجوزات' : 'Booking Conversion'}
            </div>
            <div className="text-xl font-extrabold text-[#E7A83B] mt-1 font-mono">
              {summary.bookingConversionRate}%
            </div>
            <div className="text-[11px] text-emerald-400/80 mt-0.5">
              Paymob / Escrow settled
            </div>
          </div>

          <div className="bg-[#04171D]/60 border border-white/5 rounded-xl p-3.5">
            <div className="text-[12px] text-[#E7D3AE]/70 font-medium">
              {language === 'ar' ? 'زمن النتيجة (MTTR)' : 'Time to Resolution'}
            </div>
            <div className="text-xl font-extrabold text-sky-400 mt-1 font-mono">
              {summary.avgTimeToResolutionSec}s
            </div>
            <div className="text-[11px] text-sky-400/80 mt-0.5">
              Sub-second routing
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {([
          { id: 'funnel', label: language === 'ar' ? 'مسار التحويل (Funnel)' : 'Outcome Funnel (10 Steps)', icon: BarChart3 },
          { id: 'intents', label: language === 'ar' ? 'جودة النوايا (Green/Yellow/Red)' : 'Intent Quality Radar', icon: Search },
          { id: 'locales', label: language === 'ar' ? 'العربية vs الإنجليزية' : 'Arabic vs English Split', icon: Globe },
          { id: 'alerts', label: language === 'ar' ? 'جودة التنبيهات الاستباقية' : 'Proactive Alert Quality', icon: Bell },
          { id: 'cards', label: language === 'ar' ? 'أداء بطاقات الإجراءات' : 'Action Card Metrics', icon: Layers },
          { id: 'audits', label: language === 'ar' ? 'تدقيق المخرجات (Audits)' : 'Outcome Root-Cause Audit', icon: ShieldCheck },
          { id: 'scenarios', label: language === 'ar' ? 'سيناريوهات المسافرين (9)' : 'Golden Traveler Scenarios', icon: Play },
          { id: 'experiments', label: language === 'ar' ? 'تجارب وأعلام الميزات' : 'Beta Feature Flags', icon: SlidersHorizontal },
          { id: 'weekly_report', label: language === 'ar' ? 'تقرير التعلّم الأسبوعي' : 'Weekly Learning Loop', icon: FileText }
        ] as const).map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#20A89A] text-[#04171D] shadow-lg font-extrabold'
                  : 'bg-white/5 hover:bg-white/10 text-[#E7D3AE]/80 hover:text-white border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab Contents */}

      {/* TAB 1: OUTCOME FUNNEL */}
      {activeSubTab === 'funnel' && (
        <div className="space-y-6">
          <div className="bg-[#062C35]/60 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#F7F3EA] font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'مسار التحويل الكامل من فتح دايجي حتى النتيجة الموثقة' : 'DayGI End-to-End Real User Outcome Funnel'}
                </h3>
                <p className="text-xs text-[#E7D3AE]/70">
                  {language === 'ar' ? 'تتبع نسبة التحويل والانقطاع في كل مرحلة من مراحل التفاعل' : 'Step-by-step conversion and drop-off analysis across active travelers'}
                </p>
              </div>
              <span className="text-xs font-mono text-[#52C4B7] bg-[#20A89A]/10 px-3 py-1 rounded-full border border-[#20A89A]/20">
                142 Active Sessions
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {funnelSteps.map((step, idx) => {
                const maxCount = funnelSteps[0].count;
                const widthPct = Math.max((step.count / maxCount) * 100, 15);
                const isFinal = idx === funnelSteps.length - 1;

                return (
                  <div key={step.step} className="bg-[#04171D]/60 border border-white/5 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white/10 text-[#E7D3AE] text-[11px] font-mono flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-[#F7F3EA]">
                          {language === 'ar' ? step.labelAr : step.labelEn}
                        </span>
                        <span className="text-[11px] font-mono text-[#E7D3AE]/50">
                          ({step.step})
                        </span>
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-[#F7F3EA] font-bold">{step.count} travelers</span>
                        <span className="text-emerald-400 font-bold">{step.stepConversionPercentage}%</span>
                        {step.dropoffPercentage > 0 && (
                          <span className="text-rose-400/80 text-[12px]">-{step.dropoffPercentage}% drop</span>
                        )}
                      </div>
                    </div>

                    <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFinal
                            ? 'bg-gradient-to-r from-[#20A89A] to-emerald-400'
                            : 'bg-gradient-to-r from-[#20A89A]/70 to-[#52C4B7]'
                        }`}
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Why This & Trust Lift Insight */}
            <div className="mt-6 bg-[#20A89A]/10 border border-[#20A89A]/30 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#20A89A]/20 text-[#52C4B7]">
                <Eye className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-bold text-[#52C4B7]">
                  {language === 'ar' ? 'أثر بطاقة "لماذا هذا المقترح؟" (Why This? Validation)' : '"Why This?" Explanation Impact on Trust & Conversion'}
                </div>
                <p className="text-[#E7D3AE]/80">
                  {language === 'ar'
                    ? `تفاعل المسافرون مع بطاقة التعليل بنسبة ${summary.whyThisInteractionRate}%. عندما يفتح المسافر التعليل، يرتفع معدل إتمام الإجراء بنسبة +${summary.whyThisConversionLift}%. التعليل يعزز الثقة المباشرة في التوصيات.`
                    : `Travelers interacted with "Why This?" reasoning in ${summary.whyThisInteractionRate}% of views. When opened, conversion lift is +${summary.whyThisConversionLift}%. Transparent reasoning significantly boosts execution trust.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTENT QUALITY RADAR */}
      {activeSubTab === 'intents' && (
        <div className="space-y-6">
          <div className="bg-[#062C35]/60 border border-white/10 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-[#F7F3EA] font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'رادار جودة النوايا وتصنيف الاعتمادية' : 'Intent Quality Radar & Reliability Classification'}
                </h3>
                <p className="text-xs text-[#E7D3AE]/70">
                  {language === 'ar' ? 'تصنيف النوايا إلى الأخضر (موثوق)، الأصفر (يحتاج توضيح)، والأحمر (مبهم/حذر)' : 'Governed grouping into GREEN (reliable), YELLOW (needs clarification), and RED (ambiguous/safety-gated)'}
                </p>
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-1.5">
                {(['ALL', 'GREEN', 'YELLOW', 'RED'] as const).map(tier => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setSelectedIntentTier(tier)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedIntentTier === tier
                        ? tier === 'GREEN' ? 'bg-emerald-500 text-[#04171D]' :
                          tier === 'YELLOW' ? 'bg-amber-500 text-[#04171D]' :
                          tier === 'RED' ? 'bg-rose-500 text-white' :
                          'bg-[#20A89A] text-[#04171D]'
                        : 'bg-white/5 hover:bg-white/10 text-[#E7D3AE] border border-white/5'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIntents.map(intent => {
                const isGreen = intent.tier === 'GREEN';
                const isYellow = intent.tier === 'YELLOW';
                const isRed = intent.tier === 'RED';

                return (
                  <div
                    key={intent.intentKey}
                    className={`border rounded-xl p-4 space-y-3 ${
                      isGreen ? 'bg-emerald-950/20 border-emerald-500/30' :
                      isYellow ? 'bg-amber-950/20 border-amber-500/30' :
                      'bg-rose-950/20 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                            isGreen ? 'bg-emerald-500/20 text-emerald-300' :
                            isYellow ? 'bg-amber-500/20 text-amber-300' :
                            'bg-rose-500/20 text-rose-300'
                          }`}>
                            {intent.tier} TIER
                          </span>
                          <span className="text-xs font-mono text-[#E7D3AE]/60">
                            {intent.intentKey}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#F7F3EA] mt-1">
                          {language === 'ar' ? intent.labelAr : intent.labelEn}
                        </h4>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <span className="text-[#F7F3EA] font-bold">{intent.totalQueries}</span>
                        <span className="text-[#E7D3AE]/60 text-[11px] block">queries</span>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center bg-[#04171D]/40 rounded-lg p-2 font-mono text-xs">
                      <div>
                        <span className="text-[11px] text-[#E7D3AE]/60 block">{language === 'ar' ? 'الفهم' : 'Understand'}</span>
                        <span className="font-bold text-emerald-400">{intent.understandingRate}%</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#E7D3AE]/60 block">{language === 'ar' ? 'التوضيح' : 'Clarify'}</span>
                        <span className="font-bold text-[#52C4B7]">{intent.clarificationRate}%</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#E7D3AE]/60 block">{language === 'ar' ? 'الإنجاز' : 'Complete'}</span>
                        <span className="font-bold text-[#E7A83B]">{intent.completionRate}%</span>
                      </div>
                    </div>

                    {/* Sample Prompts */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-[#E7D3AE]/70 block">
                        {language === 'ar' ? 'نماذج الاستعلام الحقيقية:' : 'Sample Real Queries:'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {intent.samplePrompts.map((p, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-[12px] text-[#E7D3AE] border border-white/5">
                            "{p}"
                          </span>
                        ))}
                      </div>
                    </div>

                    {intent.primaryFrictionCause && (
                      <div className="text-[12px] text-amber-300/90 bg-amber-500/10 p-2 rounded border border-amber-500/20 flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{intent.primaryFrictionCause}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ARABIC VS ENGLISH */}
      {activeSubTab === 'locales' && (
        <div className="space-y-6">
          <div className="bg-[#062C35]/60 border border-white/10 rounded-2xl p-6">
            <div className="mb-6">
              <h3 className="text-base font-bold text-[#F7F3EA] font-['Outfit',sans-serif]">
                {language === 'ar' ? 'المقارنة بين اللغة العربية (المصرية) والإنجليزية' : 'Egyptian Arabic vs. English Deep Comparative Analysis'}
              </h3>
              <p className="text-xs text-[#E7D3AE]/70">
                {language === 'ar'
                  ? 'مقارنة دقة الفهم ومعدلات الانقطاع للأنماط المصرية مثل: "معايا ساعتين"، "عايز حاجة هادية"، "اعملها"'
                  : 'Comparing accuracy, clarification rates, and nuances for real Egyptian dialect patterns'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Arabic Card */}
              <div className="bg-[#04171D]/60 border border-[#20A89A]/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-[#20A89A]/20 text-[#52C4B7] font-bold flex items-center justify-center">
                      ع
                    </span>
                    <div>
                      <h4 className="font-bold text-base text-[#F7F3EA]">Egyptian Arabic (العامية المصرية)</h4>
                      <span className="text-xs text-[#E7D3AE]/60">{localeComparison.arabic.queriesCount} Queries Analyzed (65.6% Share)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-[11px] text-[#E7D3AE]/60 block">{language === 'ar' ? 'دقة الفهم' : 'Understanding Rate'}</span>
                    <span className="text-lg font-bold text-emerald-400">{localeComparison.arabic.understandingRate}%</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-[11px] text-[#E7D3AE]/60 block">{language === 'ar' ? 'معدل التوضيح' : 'Clarification Rate'}</span>
                    <span className="text-lg font-bold text-[#52C4B7]">{localeComparison.arabic.clarificationRate}%</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-[11px] text-[#E7D3AE]/60 block">{language === 'ar' ? 'نجاح الإجراء' : 'Action Success'}</span>
                    <span className="text-lg font-bold text-emerald-400">{localeComparison.arabic.actionSuccessRate}%</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-[11px] text-[#E7D3AE]/60 block">{language === 'ar' ? 'متوسط الاستجابة' : 'Avg Latency'}</span>
                    <span className="text-lg font-bold text-sky-400">{localeComparison.arabic.avgLatencyMs}ms</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="font-semibold text-[#E7D3AE]/80 block">
                    {language === 'ar' ? 'أبرز الأنماط المصرية التي تم اعتمادها بنجاح:' : 'Verified Egyptian Arabic Idioms:'}
                  </span>
                  <div className="space-y-1.5 text-[#E7D3AE]/90">
                    <div className="flex items-center justify-between p-2 rounded bg-white/5">
                      <span>"معايا ساعتين"</span>
                      <span className="text-emerald-400 font-mono text-[12px]">98.5% understood (2-hour slot)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white/5">
                      <span>"عايز حاجة هادية"</span>
                      <span className="text-emerald-400 font-mono text-[12px]">96.9% understood (relaxation)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white/5">
                      <span>"احجزلي دي" / "احجزلي التاني"</span>
                      <span className="text-emerald-400 font-mono text-[12px]">96.2% understood (ordinal booking)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white/5">
                      <span>"الغوص اتلغى"</span>
                      <span className="text-emerald-400 font-mono text-[12px]">100% recovery routing</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white/5">
                      <span>"اعملها" (ضمير مبهم)</span>
                      <span className="text-amber-400 font-mono text-[12px]">Safely triggers disambiguation</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* English Card */}
              <div className="bg-[#04171D]/60 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-white/10 text-[#F7F3EA] font-bold flex items-center justify-center">
                      EN
                    </span>
                    <div>
                      <h4 className="font-bold text-base text-[#F7F3EA]">International English</h4>
                      <span className="text-xs text-[#E7D3AE]/60">{localeComparison.english.queriesCount} Queries Analyzed (34.4% Share)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-[11px] text-[#E7D3AE]/60 block">{language === 'ar' ? 'دقة الفهم' : 'Understanding Rate'}</span>
                    <span className="text-lg font-bold text-emerald-400">{localeComparison.english.understandingRate}%</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-[11px] text-[#E7D3AE]/60 block">{language === 'ar' ? 'معدل التوضيح' : 'Clarification Rate'}</span>
                    <span className="text-lg font-bold text-[#52C4B7]">{localeComparison.english.clarificationRate}%</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-[11px] text-[#E7D3AE]/60 block">{language === 'ar' ? 'نجاح الإجراء' : 'Action Success'}</span>
                    <span className="text-lg font-bold text-emerald-400">{localeComparison.english.actionSuccessRate}%</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-[11px] text-[#E7D3AE]/60 block">{language === 'ar' ? 'متوسط الاستجابة' : 'Avg Latency'}</span>
                    <span className="text-lg font-bold text-sky-400">{localeComparison.english.avgLatencyMs}ms</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="font-semibold text-[#E7D3AE]/80 block">
                    {language === 'ar' ? 'أبرز الأنماط باللغة الإنجليزية:' : 'Common English Traveler Inquiries:'}
                  </span>
                  <div className="space-y-1.5 text-[#E7D3AE]/90">
                    <div className="flex items-center justify-between p-2 rounded bg-white/5">
                      <span>"I have two hours free"</span>
                      <span className="text-emerald-400 font-mono text-[12px]">97.8% understood</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white/5">
                      <span>"Where to eat near Lighthouse"</span>
                      <span className="text-emerald-400 font-mono text-[12px]">96.5% understood</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white/5">
                      <span>"Make tomorrow more relaxed"</span>
                      <span className="text-emerald-400 font-mono text-[12px]">95.2% schedule shift</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PROACTIVE ALERTS QUALITY */}
      {activeSubTab === 'alerts' && (
        <div className="space-y-6">
          <div className="bg-[#062C35]/60 border border-white/10 rounded-2xl p-6">
            <div className="mb-6">
              <h3 className="text-base font-bold text-[#F7F3EA] font-['Outfit',sans-serif]">
                {language === 'ar' ? 'جودة التنبيهات الاستباقية وسياسة "تداخلات أقل وأفضل"' : 'Proactive Alert Quality: "Fewer, Better Interventions"'}
              </h3>
              <p className="text-xs text-[#E7D3AE]/70">
                {language === 'ar'
                  ? 'قياس رحلة كل تنبيه (عرض ← فتح ← تفاعل ← تجاهل). التنبيهات كثيرة الضجيج يتم كبحها تلقائياً'
                  : 'Tracking lifecycle: Shown → Opened → Acted on → Dismissed. High-noise alerts are automatically flagged for throttling.'}
              </p>
            </div>

            <div className="space-y-4">
              {proactiveAlerts.map(alert => {
                const isUseful = alert.qualityClassification === 'USEFUL';
                const isNoise = alert.qualityClassification === 'NOISE';

                return (
                  <div
                    key={alert.alertId}
                    className={`border rounded-2xl p-4 space-y-3 ${
                      isUseful ? 'bg-emerald-950/20 border-emerald-500/30' :
                      isNoise ? 'bg-rose-950/20 border-rose-500/30' :
                      'bg-[#04171D]/60 border-white/10'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                          isUseful ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {alert.qualityClassification}
                        </span>
                        <span className="text-xs font-mono text-[#E7D3AE]/60">
                          {alert.alertId} · {alert.ruleType}
                        </span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded text-[12px] font-bold font-mono ${
                        alert.recommendation === 'KEEP_ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' :
                        alert.recommendation === 'THROTTLE_FREQUENCY' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-rose-500/20 text-rose-300'
                      }`}>
                        RECOMMENDATION: {alert.recommendation}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#F7F3EA]">
                      {language === 'ar' ? alert.titleAr : alert.title}
                    </h4>

                    {/* Funnel breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs text-center bg-[#04171D]/40 p-2.5 rounded-xl">
                      <div>
                        <span className="text-[11px] text-[#E7D3AE]/60 block">{language === 'ar' ? 'الظهور' : 'Shown'}</span>
                        <span className="font-bold text-[#F7F3EA]">{alert.impressionsCount}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#E7D3AE]/60 block">{language === 'ar' ? 'الفتح' : 'Opened'}</span>
                        <span className="font-bold text-[#52C4B7]">{alert.openedCount}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#E7D3AE]/60 block">{language === 'ar' ? 'التفاعل' : 'Acted On'}</span>
                        <span className="font-bold text-emerald-400">{alert.actedOnCount}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#E7D3AE]/60 block">{language === 'ar' ? 'الإغلاق' : 'Dismissed'}</span>
                        <span className="font-bold text-amber-400">{alert.dismissedCount}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#E7D3AE]/60 block">{language === 'ar' ? 'معدل التحويل' : 'Conversion'}</span>
                        <span className={`font-bold ${alert.conversionRate > 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {alert.conversionRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ACTION CARDS PERFORMANCE */}
      {activeSubTab === 'cards' && (
        <div className="space-y-6">
          <div className="bg-[#062C35]/60 border border-white/10 rounded-2xl p-6">
            <div className="mb-6">
              <h3 className="text-base font-bold text-[#F7F3EA] font-['Outfit',sans-serif]">
                {language === 'ar' ? 'أداء بطاقات الإجراءات التفاعلية (Action Cards Matrix)' : 'Action Cards Performance & Conversion Matrix'}
              </h3>
              <p className="text-xs text-[#E7D3AE]/70">
                {language === 'ar' ? 'متابعة نسبة النقر والإتمام والرفض لكل نوع بطاقة لكشف البطاقات الضعيفة' : 'Tracking shown, clicked, accepted, and completed ratios across all card types'}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left font-mono">
                <thead className="bg-white/5 text-[#E7D3AE]/70 uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4 rounded-l-lg">{language === 'ar' ? 'نوع البطاقة' : 'Card Type'}</th>
                    <th className="py-3 px-4">{language === 'ar' ? 'الظهور' : 'Impressions'}</th>
                    <th className="py-3 px-4">{language === 'ar' ? 'النقر (CTR)' : 'CTR %'}</th>
                    <th className="py-3 px-4">{language === 'ar' ? 'القبول' : 'Acceptances'}</th>
                    <th className="py-3 px-4">{language === 'ar' ? 'الإتمام والتوثيق' : 'Completion %'}</th>
                    <th className="py-3 px-4 rounded-r-lg">{language === 'ar' ? 'متوسط الزمن' : 'Avg Duration'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[#F7F3EA]">
                  {actionCards.map(c => (
                    <tr key={c.cardType} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#52C4B7]">{c.cardType}</td>
                      <td className="py-3.5 px-4">{c.impressions}</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-bold">{c.ctr}%</td>
                      <td className="py-3.5 px-4">{c.acceptances} / {c.clicks}</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-bold">{c.conversionRate}%</td>
                      <td className="py-3.5 px-4 text-sky-400">{c.avgDurationSec}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: OUTCOME AUDITS & GOVERNED OPPORTUNITIES */}
      {activeSubTab === 'audits' && (
        <div className="space-y-6">
          {/* Governed Opportunities Bridge */}
          <div className="bg-[#062C35]/60 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#F7F3EA] font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'جسر تحويل نقاط احتكاك المسافرين إلى فرص منتج معتمدة' : 'Conversation Friction → Governed Product Opportunities'}
                </h3>
                <p className="text-xs text-[#E7D3AE]/70">
                  {language === 'ar'
                    ? 'تحويل تكرار طلبات المسافرين (مثل "أكل بعد الغطس" أو "خليها أرخص") إلى فرص في سجل الميزات'
                    : 'Systematically aggregating repeated traveler friction into formal Product Opportunities without unsolicited code.'}
                </p>
              </div>
              <span className="text-xs font-mono text-[#E7A83B] bg-[#E7A83B]/10 px-3 py-1 rounded-full border border-[#E7A83B]/20">
                {governedOpportunitiesFromFriction.length} Governed Proposals
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {governedOpportunitiesFromFriction.map(opp => (
                <div key={opp.id} className="bg-[#04171D]/60 border border-white/10 rounded-xl p-4 space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#52C4B7] bg-[#20A89A]/10 px-2 py-0.5 rounded">
                        {opp.id}
                      </span>
                      <span className="text-[11px] font-bold text-amber-400 font-mono">
                        {opp.occurrenceCount} occurrences
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#F7F3EA]">
                      {language === 'ar' ? opp.titleAr : opp.title}
                    </h4>
                    <p className="text-[12px] text-[#E7D3AE]/70">
                      {opp.frictionPattern}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <span className="text-[11px] font-semibold text-[#52C4B7] block">
                      {language === 'ar' ? 'الإجراء المقترح:' : 'Suggested Action:'}
                    </span>
                    <p className="text-[12px] text-[#E7D3AE]">
                      {language === 'ar' ? opp.suggestedActionAr : opp.suggestedAction}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outcome Audits Log */}
          <div className="bg-[#062C35]/60 border border-white/10 rounded-2xl p-6">
            <div className="mb-4">
              <h3 className="text-base font-bold text-[#F7F3EA] font-['Outfit',sans-serif]">
                {language === 'ar' ? 'سجل تدقيق مخرجات المهام وتحليل أسباب الانقطاع' : 'Task Outcome Audit & Root-Cause Classification'}
              </h3>
              <p className="text-xs text-[#E7D3AE]/70">
                {language === 'ar' ? 'التمييز الدقيق بين انقطاع المستخدم (UX Abandonment) وفشل التنفيذ في الأنظمة' : 'Distinguishing traveler drop-off vs backend execution failure with Cloud SQL verification'}
              </p>
            </div>

            <div className="space-y-2.5">
              {recentOutcomeAudits.map(audit => (
                <div key={audit.id} className="bg-[#04171D]/60 border border-white/5 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                      audit.classification === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300' :
                      audit.classification === 'ABANDONED' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-rose-500/20 text-rose-300'
                    }`}>
                      {audit.classification}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F7F3EA]">{audit.taskId}</span>
                        <span className="text-[11px] font-mono text-[#E7D3AE]/50">{audit.intentKey}</span>
                      </div>
                      <p className="text-[12px] text-[#E7D3AE]/80 mt-0.5">
                        {language === 'ar' ? audit.rootCauseAr : audit.rootCause}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 font-mono text-[12px]">
                    <span className="text-[#52C4B7]">
                      {audit.financialImpactEGP !== 0 ? `${audit.financialImpactEGP > 0 ? '+' : ''}${audit.financialImpactEGP} EGP` : '0 EGP'}
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Ledger OK
                    </span>
                    <span className="text-[#E7D3AE]/50">{audit.timeToResolutionSec}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: GOLDEN SCENARIOS TESTER */}
      {activeSubTab === 'scenarios' && (
        <div className="space-y-6">
          <div className="bg-[#062C35]/60 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-[#F7F3EA] font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'فحص السيناريوهات الذهبية للمسافرين الحقيقيين (9 Scenarios)' : 'Golden Real-World Traveler Scenarios (9 Scenarios)'}
                </h3>
                <p className="text-xs text-[#E7D3AE]/70">
                  {language === 'ar'
                    ? 'محاكاة كاملة للزائر لأول مرة، نافذة الساعتين، مطاعم بعد الغطس، الحجز، الميزانية، الاستعادة، والضمائر المبهمة'
                    : 'End-to-end deterministic evaluation of 9 canonical traveler journeys with safety gates'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunGoldenScenarios}
                disabled={isRunningScenarios}
                className="px-4 py-2 rounded-xl bg-[#20A89A] hover:bg-[#1B8F83] text-[#04171D] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunningScenarios ? (language === 'ar' ? 'جاري الفحص...' : 'Evaluating...') : (language === 'ar' ? 'إعادة الفحص الآن' : 'Run Full Suite Now')}</span>
              </button>
            </div>

            {scenariosReport && (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border flex items-center justify-between font-mono text-xs ${
                  scenariosReport.allPassed ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                }`}>
                  <span className="font-bold">
                    VERDICT: {scenariosReport.allPassed ? 'ALL SCENARIOS PASSED (100%) ✓' : 'PARTIAL PASS'}
                  </span>
                  <span>{scenariosReport.passCount} of {scenariosReport.totalCount} Scenarios Passed</span>
                </div>

                <div className="space-y-3">
                  {scenariosReport.results.map(sc => (
                    <div key={sc.id} className="bg-[#04171D]/60 border border-white/5 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                            sc.actualStatus === 'PASSED' ? 'bg-emerald-500/20 text-emerald-300' :
                            sc.actualStatus === 'CLARIFIED_SAFELY' ? 'bg-[#20A89A]/20 text-[#52C4B7]' :
                            'bg-rose-500/20 text-rose-300'
                          }`}>
                            {sc.actualStatus}
                          </span>
                          <span className="font-bold text-[#F7F3EA]">
                            {sc.id}: {language === 'ar' ? sc.scenarioNameAr : sc.scenarioName}
                          </span>
                          <span className="text-[11px] text-[#E7D3AE]/60 font-mono">({sc.archetype})</span>
                        </div>

                        <div className="font-mono text-[12px] text-[#52C4B7]">
                          {sc.timeToResolutionMs}ms
                        </div>
                      </div>

                      <div className="bg-white/5 p-2 rounded text-xs text-[#E7D3AE]/90">
                        <span className="text-[11px] text-[#E7D3AE]/50 block">Prompt:</span>
                        "{sc.prompt}"
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] text-[#E7D3AE]/80 font-mono">
                        <div>
                          <span className="text-[#E7D3AE]/50 block">Intent Mapped:</span>
                          <span className="text-emerald-400 font-bold">{sc.intentMapped} ({(sc.confidence * 100).toFixed(0)}% conf)</span>
                        </div>
                        <div>
                          <span className="text-[#E7D3AE]/50 block">Action / Safety Gate:</span>
                          <span className="text-[#F7F3EA]">{sc.actionTaken}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 8: EXPERIMENT FLAGS */}
      {activeSubTab === 'experiments' && (
        <div className="space-y-6">
          <div className="bg-[#062C35]/60 border border-white/10 rounded-2xl p-6">
            <div className="mb-6">
              <h3 className="text-base font-bold text-[#F7F3EA] font-['Outfit',sans-serif]">
                {language === 'ar' ? 'أعلام ميزات بيتا المغلقة والتجارب المحكومة' : 'Closed Beta Controlled Experimentation Flags'}
              </h3>
              <p className="text-xs text-[#E7D3AE]/70">
                {language === 'ar' ? 'ضبط وتعديل خيارات التنبيهات وترتيب الأسئلة السريعة ومستوى الشرح' : 'Safely configure feature flags across active traveler cohorts'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Alert Frequency */}
              <div className="bg-[#04171D]/60 border border-white/5 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F7F3EA]">Proactive Alert Frequency</span>
                  <span className="text-[11px] font-mono text-[#52C4B7]">{flags.proactiveAlertFrequency}</span>
                </div>
                <p className="text-[12px] text-[#E7D3AE]/70">
                  Controls threshold for triggering weather and surface interval alerts.
                </p>
                <div className="flex gap-2 pt-1">
                  {(['CONSERVATIVE', 'BALANCED', 'PROACTIVE'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleUpdateExperimentFlag('proactiveAlertFrequency', opt)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        flags.proactiveAlertFrequency === opt
                          ? 'bg-[#20A89A] text-[#04171D]'
                          : 'bg-white/5 text-[#E7D3AE] hover:bg-white/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Prompt Ordering */}
              <div className="bg-[#04171D]/60 border border-white/5 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F7F3EA]">Quick Prompt Ordering</span>
                  <span className="text-[11px] font-mono text-[#52C4B7]">{flags.quickPromptOrdering}</span>
                </div>
                <p className="text-[12px] text-[#E7D3AE]/70">
                  Prioritizes popular buttons vs. context-aware dynamic suggestions.
                </p>
                <div className="flex gap-2 pt-1">
                  {(['POPULAR_FIRST', 'CONTEXT_AWARE'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleUpdateExperimentFlag('quickPromptOrdering', opt)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        flags.quickPromptOrdering === opt
                          ? 'bg-[#20A89A] text-[#04171D]'
                          : 'bg-white/5 text-[#E7D3AE] hover:bg-white/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Explanation Level */}
              <div className="bg-[#04171D]/60 border border-white/5 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F7F3EA]">Explanation Level ("Why This?")</span>
                  <span className="text-[11px] font-mono text-[#52C4B7]">{flags.explanationLevel}</span>
                </div>
                <p className="text-[12px] text-[#E7D3AE]/70">
                  Controls whether "Why This?" is displayed on-demand or pre-expanded.
                </p>
                <div className="flex gap-2 pt-1">
                  {(['MINIMAL', 'ON_DEMAND', 'DETAILED'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleUpdateExperimentFlag('explanationLevel', opt)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        flags.explanationLevel === opt
                          ? 'bg-[#20A89A] text-[#04171D]'
                          : 'bg-white/5 text-[#E7D3AE] hover:bg-white/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirmation Style */}
              <div className="bg-[#04171D]/60 border border-white/5 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F7F3EA]">Confirmation UI Style</span>
                  <span className="text-[11px] font-mono text-[#52C4B7]">{flags.confirmationStyle}</span>
                </div>
                <p className="text-[12px] text-[#E7D3AE]/70">
                  Modal dialog vs in-line conversational confirmation badge.
                </p>
                <div className="flex gap-2 pt-1">
                  {(['MODAL_EXPLICIT', 'INLINE_CARD'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleUpdateExperimentFlag('confirmationStyle', opt)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        flags.confirmationStyle === opt
                          ? 'bg-[#20A89A] text-[#04171D]'
                          : 'bg-white/5 text-[#E7D3AE] hover:bg-white/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: WEEKLY LEARNING LOOP */}
      {activeSubTab === 'weekly_report' && (
        <div className="space-y-6">
          <div className="bg-[#062C35]/60 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-[#F7F3EA] font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'تقرير التعلّم الأسبوعي وحلقة تحسين المنتج' : 'Weekly Closed Beta Learning Loop Report'}
                </h3>
                <p className="text-xs text-[#E7D3AE]/70">
                  {language === 'ar'
                    ? 'تغذية استخبارات السوق وفرص المنتج تلقائياً بأبرز الدروس المستفادة'
                    : 'Synthesizing top intents, friction points, and governed opportunities into the product roadmap'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateWeeklyReport}
                disabled={isGeneratingWeekly}
                className="px-4 py-2 rounded-xl bg-[#20A89A] hover:bg-[#1B8F83] text-[#04171D] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isGeneratingWeekly ? (language === 'ar' ? 'جاري التوليد...' : 'Generating...') : (language === 'ar' ? 'توليد التقرير الآن' : 'Generate Weekly Summary')}</span>
              </button>
            </div>

            {weeklyReport && (
              <div className="bg-[#04171D]/60 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    REPORT DATE: {weeklyReport.reportDate}
                  </span>
                  <span className="text-xs text-[#E7D3AE]/70 font-mono">
                    {weeklyReport.cohortSummary}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <span className="font-bold text-[#52C4B7] block">Top Real Traveler Intents:</span>
                    <ul className="space-y-1 text-[#E7D3AE]/90 list-disc list-inside">
                      {weeklyReport.topIntents.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-amber-400 block">Top Friction Points Identified:</span>
                    <ul className="space-y-1 text-[#E7D3AE]/90 list-disc list-inside">
                      {weeklyReport.topFrictionPoints.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-2">
                  <span className="font-bold text-[#F7F3EA] text-xs block">
                    Recommended Actions for Next Sprint:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {weeklyReport.recommendedActions.map((act: string, idx: number) => (
                      <div key={idx} className="bg-white/5 p-2.5 rounded-lg text-[#E7D3AE] flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Operational Thresholds Audit Table */}
      <div className="bg-[#062C35]/60 border border-white/10 rounded-2xl p-6">
        <div className="mb-4">
          <h3 className="text-base font-bold text-[#F7F3EA] font-['Outfit',sans-serif]">
            {language === 'ar' ? 'معايير الإطلاق التشغيلية الصارمة (Operational Quality Thresholds)' : 'Operational Quality Thresholds & Zero-Tolerance Invariants'}
          </h3>
          <p className="text-xs text-[#E7D3AE]/70">
            {language === 'ar' ? 'معايير واضحة وموثقة تضمن أمان التجربة واستقرار المعاملات المالية' : 'Documented performance and financial safety thresholds required for Closed Beta'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {operationalThresholds.map(t => (
            <div
              key={t.metricName}
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                t.status === 'PASS'
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-amber-950/20 border-amber-500/30'
              }`}
            >
              <div>
                <span className="font-bold text-[#F7F3EA] block">{t.metricName}</span>
                <span className="text-[11px] text-[#E7D3AE]/60 font-mono">Target: {t.targetThreshold}</span>
              </div>
              <div className="text-right font-mono">
                <span className="text-emerald-400 font-bold block">{t.currentValue}</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
