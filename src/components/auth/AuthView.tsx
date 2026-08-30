import React, { useState, useEffect } from 'react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { humanizeAuthError } from '../../lib/firebase';
import { 
  Compass, 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  KeyRound,
  Building2
} from 'lucide-react';
import { AppRoute } from '../../types';

interface AuthViewProps {
  initialMode?: 'sign-in' | 'sign-up' | 'forgot-password' | 'verify';
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'sign-in' }) => {
  const { 
    user, 
    intendedRoute, 
    navigateTo, 
    signInWithGoogle, 
    signInWithEmail, 
    registerWithEmail, 
    signInWithPassword,
    registerWithPassword,
    isFederatedSignInAvailable,
    sendResetPasswordEmail,
    isAuthLoading, 
    tripBrief, 
    tripDays,
    showToast 
  } = useTrip();

  const [mode, setMode] = useState<'sign-in' | 'sign-up' | 'forgot-password' | 'verify'>(initialMode);
  /**
   * Was hardcoded to 'ar' and ignored the site language, so a visitor browsing
   * in English hit an entirely Arabic sign-in screen — on the one page where
   * confusion costs you the account.
   */
  const { language: siteLanguage } = useLanguage();
  const [lang, setLang] = useState<'ar' | 'en'>(siteLanguage);
  useEffect(() => { setLang(siteLanguage); }, [siteLanguage]);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  // Every self-service registration is a Traveler. The server ignores any role
  // sent from here regardless; keeping the constant makes that explicit.
  const role = 'Traveler' as const;
  
  // Local state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasActiveTripDraft = tripDays && tripDays.length > 0;

  const handlePostAuthRedirect = (selectedRole: string) => {
    if (selectedRole === 'Supplier') {
      navigateTo('/supplier-portal');
    } else if (selectedRole === 'Operations') {
      navigateTo('/ops-console');
    } else if (intendedRoute && intendedRoute !== '/auth/sign-in' && intendedRoute !== '/auth/sign-up') {
      navigateTo(intendedRoute as AppRoute);
    } else {
      navigateTo('/my-trip');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const ok = await signInWithGoogle();
      if (ok) {
        handlePostAuthRedirect('Traveler');
      }
    } catch (err: any) {
      setErrorMessage(humanizeAuthError(err, lang));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);
    setIsSubmitting(true);

    try {
      if (mode === 'sign-in') {
        if (!email || !password) {
          setErrorMessage(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter your email and password');
          setIsSubmitting(false);
          return;
        }
        // Firebase can only issue a session when the server has Admin
        // credentials. Where it cannot, this fell through to a 503 and nobody
        // could sign in at all — which is why booking always ended in a 401.
        const ok = isFederatedSignInAvailable
          ? await signInWithEmail(email, password)
          : await signInWithPassword(email, password);
        if (ok) {
          handlePostAuthRedirect(role);
        }
      } else if (mode === 'sign-up') {
        if (!name || !email || !password) {
          setErrorMessage(lang === 'ar' ? 'يرجى إدخال الاسم والبريد وكلمة المرور' : 'Please complete all required fields');
          setIsSubmitting(false);
          return;
        }
        const ok = isFederatedSignInAvailable
          ? await registerWithEmail(name, email, phone, password, role)
          : await registerWithPassword(name, email, phone, password);
        if (ok) {
          handlePostAuthRedirect(role);
        }
      } else if (mode === 'forgot-password') {
        if (!email) {
          setErrorMessage(lang === 'ar' ? 'يرجى إدخال بريدك الإلكتروني' : 'Please enter your email');
          setIsSubmitting(false);
          return;
        }
        await sendResetPasswordEmail(email);
        setSuccessInfo(
          lang === 'ar' 
            ? 'تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح.' 
            : 'Password reset link sent to your email address.'
        );
      }
    } catch (err: any) {
      setErrorMessage(humanizeAuthError(err, lang));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[88vh] bg-[#06181F] text-[#F8F6F0] flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Subtle Sinai Topographic Glow Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top_right,#E7A83B_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,#20A89A_0%,transparent_50%)]" />
      
      <div className="w-full max-w-md relative z-10">
        
        {/* Top Header / Language Switch & Back */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateTo(intendedRoute ? (intendedRoute as AppRoute) : '/home')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            <span>{lang === 'ar' ? 'الرجوع إلى دهب' : 'Back to Dahab'}</span>
          </button>

          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-0.5 rounded-full">
            <button
              onClick={() => setLang('ar')}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${lang === 'ar' ? 'bg-[#E7A83B] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              العربية
            </button>
            <button
              onClick={() => setLang('en')}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${lang === 'en' ? 'bg-[#E7A83B] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              English
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#0B2530] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          
          {/* Logo & Headline */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E7A83B] to-[#20A89A] text-slate-950 shadow-lg mb-3">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
              {mode === 'sign-in' && (lang === 'ar' ? 'أهلاً بيك تاني في دهب' : 'Welcome Back to Dahab')}
              {mode === 'sign-up' && (lang === 'ar' ? 'انضم إلى مجتمع دهب' : 'Join the Dahab Community')}
              {mode === 'forgot-password' && (lang === 'ar' ? 'استعادة كلمة المرور' : 'Reset Password')}
            </h1>
            
            <p className="text-xs text-slate-300">
              {mode === 'sign-in' && (lang === 'ar' ? 'سجل دخولك لحفظ واسترجاع خططك وتجاربك' : 'Sign in to access your itinerary, ledger, and bookings')}
              {mode === 'sign-up' && (lang === 'ar' ? 'احفظ رحلتك واستمتع بالمرافقة الذكية وتأكيد الحجوزات' : 'Create your account in seconds with seamless cloud sync')}
              {mode === 'forgot-password' && (lang === 'ar' ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط الاستعادة' : 'Enter your email address and we will send you a reset link')}
            </p>
          </div>

          {/* Active Trip Draft Preservation Banner */}
          {hasActiveTripDraft && mode !== 'forgot-password' && (
            <div className="mb-5 bg-gradient-to-r from-[#20A89A]/15 to-[#E7A83B]/10 border border-[#20A89A]/30 rounded-xl p-3 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#E7A83B] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-white block">
                  {lang === 'ar' ? 'رحلتك الحالية محفوظة بالكامل' : 'Your Trip Draft is Active'}
                </span>
                <span className="text-slate-300">
                  {lang === 'ar' 
                    ? `سيتم حفظ جدول الـ ${tripDays.length} أيام وحجوزاتك الحالية وربطها بحسابك تلقائياً.` 
                    : `Your ${tripDays.length}-day itinerary and custom selections will stay intact after signing in.`}
                </span>
              </div>
            </div>
          )}

          {/* Error & Success Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2">
              <span className="font-bold">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successInfo && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successInfo}</span>
            </div>
          )}

          {/* Social Auth: Google.
              Hidden when the server has no Firebase Admin credentials — the
              button would return 503, and offering a control that cannot work
              is how a traveller ends up unable to sign in with no explanation. */}
          {mode !== 'forgot-password' && isFederatedSignInAvailable && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting || isAuthLoading}
                className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100 font-semibold py-3 px-4 rounded-xl transition-all shadow-md active:scale-[0.99] disabled:opacity-50 text-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                )}
                <span>{lang === 'ar' ? 'المتابعة بحساب Google' : 'Continue with Google'}</span>
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#0B2530] px-3 text-slate-400">
                    {lang === 'ar' ? 'أو عبر البريد الإلكتروني' : 'or with email'}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Mode: Sign-Up Specific Fields */}
            {mode === 'sign-up' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 rtl:left-auto rtl:right-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: أحمد مصطفى' : 'e.g., Ahmed Mostafa'}
                      className="w-full bg-white/5 border border-white/15 focus:border-[#E7A83B] focus:ring-1 focus:ring-[#E7A83B] text-white rounded-xl py-2.5 px-3 ltr:pl-10 rtl:pr-10 text-sm outline-none transition-all placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/*
                  The account-type picker was removed. It let anyone sign up as
                  Supplier or Operations and be redirected straight into the
                  back-office consoles. Every account is created as a Traveler;
                  elevation is an administrative action against the database.
                */}
                <p className="text-[12px] leading-relaxed text-slate-400 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                  {lang === 'ar'
                    ? 'يتم إنشاء الحسابات كحساب مسافر. لو إنت شريك أو مورد، تواصل مع فريق التشغيل لتفعيل صلاحيات البوابة.'
                    : 'Accounts are created as Traveler. If you are a partner or supplier, contact the operations team to have portal access enabled.'}
                </p>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 rtl:left-auto rtl:right-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang === 'ar' ? 'name@example.com' : 'name@example.com'}
                  className="w-full bg-white/5 border border-white/15 focus:border-[#E7A83B] focus:ring-1 focus:ring-[#E7A83B] text-white rounded-xl py-2.5 px-3 ltr:pl-10 rtl:pr-10 text-sm outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password Field */}
            {mode !== 'forgot-password' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                  </label>
                  {mode === 'sign-in' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot-password'); setErrorMessage(null); setSuccessInfo(null); }}
                      className="text-xs text-[#E7A83B] hover:underline"
                    >
                      {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 rtl:left-auto rtl:right-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/15 focus:border-[#E7A83B] focus:ring-1 focus:ring-[#E7A83B] text-white rounded-xl py-2.5 px-3 ltr:pl-10 rtl:pr-10 text-sm outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isAuthLoading}
              className="w-full mt-2 bg-gradient-to-r from-[#E7A83B] to-[#20A89A] text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <>
                  <span>
                    {mode === 'sign-in' && (lang === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
                    {mode === 'sign-up' && (lang === 'ar' ? 'إنشاء الحساب وحفظ الخطة' : 'Create Account & Save Trip')}
                    {mode === 'forgot-password' && (lang === 'ar' ? 'إرسال رابط الاستعادة' : 'Send Reset Link')}
                  </span>
                  <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Sign In / Sign Up */}
          <div className="mt-6 text-center text-xs text-slate-400 border-t border-white/10 pt-4">
            {mode === 'sign-in' && (
              <p>
                {lang === 'ar' ? 'ليس لديك حساب بعد؟ ' : "Don't have an account yet? "}
                <button
                  type="button"
                  onClick={() => { setMode('sign-up'); setErrorMessage(null); setSuccessInfo(null); }}
                  className="text-[#E7A83B] font-semibold hover:underline"
                >
                  {lang === 'ar' ? 'سجّل مجاناً' : 'Sign up free'}
                </button>
              </p>
            )}

            {mode === 'sign-up' && (
              <p>
                {lang === 'ar' ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => { setMode('sign-in'); setErrorMessage(null); setSuccessInfo(null); }}
                  className="text-[#E7A83B] font-semibold hover:underline"
                >
                  {lang === 'ar' ? 'سجّل الدخول' : 'Sign in'}
                </button>
              </p>
            )}

            {mode === 'forgot-password' && (
              <button
                type="button"
                onClick={() => { setMode('sign-in'); setErrorMessage(null); setSuccessInfo(null); }}
                className="text-[#E7A83B] font-semibold hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                <span>{lang === 'ar' ? 'الرجوع لتسجيل الدخول' : 'Back to Sign In'}</span>
              </button>
            )}
          </div>

          {/* Trust Footnote */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-slate-400 border-t border-white/5 pt-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#20A89A]" />
            <span>{lang === 'ar' ? 'بياناتك ودفتر حساباتك مشفرة ومؤمّنة سحابياً' : 'End-to-end encrypted identity & double-entry ledger'}</span>
          </div>

        </div>
      </div>
    </div>
  );
};
