import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Zap, 
  ShieldCheck, 
  Globe, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Star,
  Send,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import heroFriends from '../assets/hero-friends.png';
import { TravelLogoIcon } from '../components/TravelLogo';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useToast();

  // Determine initial mode from path (/signup or /signin)
  const isSignInInitial = location.pathname === '/signin';
  const [mode, setMode] = useState<'signup' | 'signin'>(isSignInInitial ? 'signin' : 'signup');

  useEffect(() => {
    if (location.pathname === '/signin') {
      setMode('signin');
    } else if (location.pathname === '/signup') {
      setMode('signup');
    }
  }, [location.pathname]);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      if (password && confirmPassword && password !== confirmPassword) {
        showInfo('Passwords do not match. Please verify.');
        return;
      }
      showSuccess(`Account created successfully! Welcome to AI Router, ${fullName || 'Traveler'}.`);
    } else {
      showSuccess('Signed in successfully! Redirecting to Dashboard...');
    }
    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  };

  const handleSocialLogin = (provider: string) => {
    showSuccess(`Connecting with ${provider}... Success!`);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F4F5FB] flex flex-col lg:flex-row text-slate-800 font-sans overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* LEFT PANEL (Marketing & Branding - Uniform 2-Column Grid) */}
      {/* ========================================================= */}
      <div className="w-full lg:w-[52%] xl:w-[55%] pt-20 pb-6 px-6 sm:pt-24 sm:pb-10 sm:px-10 lg:pt-24 lg:pb-12 lg:px-12 xl:pt-28 xl:pb-14 xl:px-14 flex flex-col justify-between relative bg-[#F4F5FB]">
        
        {/* Topmost-Left Header / Logo */}
        <div className="absolute top-5 left-5 sm:top-6 sm:left-8 lg:top-7 lg:left-10 z-30 flex items-center gap-3.5">
          <Link to="/" className="flex items-center gap-3 group">
            <TravelLogoIcon className="w-11 h-11 transition-transform group-hover:scale-105" size={44} />
            <div>
              <span className="text-xl font-bold text-[#0F1B3D] leading-tight block tracking-tight">
                Wanderly
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Travel with us
              </span>
            </div>
          </Link>
        </div>

        {/* Main Grid: Left Column (Text & Features) + Right Column (Enlarged Arch Portal) */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_310px] xl:grid-cols-[1.05fr_380px] gap-6 xl:gap-10 items-center my-auto z-10">
          
          {/* Left Column of Grid: Copy, Features, Testimonial */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-[#0F1B3D] tracking-tight leading-[1.1]">
                Your Journey <br />
                <span className="text-[#3B5BFF]">Starts Here</span>
              </h1>

              <p className="mt-3 text-slate-500 text-xs sm:text-sm xl:text-base leading-relaxed max-w-sm">
                Create your account and unlock a world of AI-powered travel experiences.
              </p>
            </div>

            {/* 3 Feature Rows */}
            <div className="space-y-4 pt-1">
              {/* Feature 1 */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3B5BFF] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F1B3D]">Smart Orchestration</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">AI agents working together to plan your perfect trip</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3B5BFF] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F1B3D]">Secure & Reliable</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">Your data and payments are always protected</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3B5BFF] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F1B3D]">Explore Anywhere</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">From local getaways to global adventures</p>
                </div>
              </div>
            </div>

            {/* Testimonial Card at Bottom-Left */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm border border-slate-100 flex items-center gap-3 max-w-sm">
              <img
                src={heroFriends}
                alt="Sarah M."
                className="w-10 h-10 rounded-full object-cover border border-blue-100 flex-shrink-0"
              />
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[11px] text-slate-600 italic leading-snug">
                  "AI Router planned our entire trip perfectly. Saved time, money and stress!"
                </p>
                <span className="text-[11px] font-bold text-[#0F1B3D] mt-0.5 block">Sarah M.</span>
              </div>
            </div>

          </div>

          {/* Right Column of Grid: Enlarged Arch Portal Image & Graphic Accents */}
          <div className="relative flex justify-center items-center py-2 sm:py-4">
            
            {/* Curved Dotted Vector Line Top */}
            <svg className="absolute -top-12 -left-12 w-52 h-52 text-[#3B5BFF]/30 pointer-events-none hidden md:block" viewBox="0 0 160 160" fill="none">
              <path d="M10 140 C 30 30, 130 10, 150 70" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
            </svg>
            
            {/* Curved Dotted Vector Line Bottom */}
            <svg className="absolute -bottom-12 -right-10 w-52 h-52 text-[#3B5BFF]/20 pointer-events-none hidden md:block" viewBox="0 0 160 160" fill="none">
              <path d="M10 20 C 50 140, 130 120, 150 10" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
            </svg>

            {/* 9-Dot Grid Accent */}
            <div className="absolute top-2 -left-6 grid grid-cols-3 gap-2 opacity-30 hidden sm:grid">
              {[...Array(9)].map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#0F1B3D]"></span>
              ))}
            </div>

            {/* Enlarged Arch Portal Image Card */}
            <div className="relative w-full max-w-[320px] lg:max-w-[340px] xl:max-w-[380px] aspect-[4/5.4] rounded-t-[170px] rounded-b-[28px] border-2 border-[#3B5BFF]/40 p-2.5 bg-white shadow-2xl">
              <img
                src={heroFriends}
                alt="Travelers in Hot Air Balloon landscape"
                className="w-full h-full object-cover rounded-t-[160px] rounded-b-[22px]"
              />

              {/* Overlapping Dark Navy Circle Badge on Top Right Edge */}
              <div className="absolute top-8 -right-5 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#0F1B3D] flex items-center justify-center shadow-xl border-2 border-white z-20">
                <Send className="w-6 h-6 text-white transform -rotate-12" />
              </div>
            </div>

            {/* Gold Sparkle Star Accent */}
            <div className="absolute top-1/2 -left-6 w-6 h-6 text-amber-400 hidden sm:block">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
              </svg>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================== */}
      {/* RIGHT PANEL (AUTH FORM CARD ~48%) */}
      {/* ========================================== */}
      <div className="w-full lg:w-[48%] xl:w-[45%] p-4 sm:p-8 lg:p-12 flex items-center justify-center">
        
        {/* White Auth Card */}
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-10 transition-all duration-300">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1B3D] tracking-tight">
              {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {mode === 'signup' 
                ? 'Join AI Router and start your journey today'
                : 'Sign in to access your atomic AI travel dashboard'}
            </p>
          </div>

          {/* Mode Switcher Toggle Pill */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 mb-8">
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                mode === 'signup'
                  ? 'bg-white text-[#3B5BFF] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                mode === 'signin'
                  ? 'bg-white text-[#3B5BFF] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-[#0F1B3D] mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3B5BFF] focus:ring-2 focus:ring-[#3B5BFF]/20 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-[#0F1B3D] mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3B5BFF] focus:ring-2 focus:ring-[#3B5BFF]/20 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-[#0F1B3D] uppercase tracking-wide">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => showInfo('Password reset link sent to your email!')}
                    className="text-xs font-semibold text-[#3B5BFF] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3B5BFF] focus:ring-2 focus:ring-[#3B5BFF]/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-[#0F1B3D] mb-1.5 uppercase tracking-wide">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3B5BFF] focus:ring-2 focus:ring-[#3B5BFF]/20 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Checkbox Row (Terms - Sign Up only) */}
            {mode === 'signup' && (
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#3B5BFF] rounded border-slate-300 focus:ring-[#3B5BFF] cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-xs text-slate-600 leading-normal cursor-pointer select-none">
                  I agree to the{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); showInfo('Opening Terms of Service...'); }} className="text-[#3B5BFF] font-semibold hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); showInfo('Opening Privacy Policy...'); }} className="text-[#3B5BFF] font-semibold hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            )}

            {/* Primary CTA Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-[#3B5BFF] hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-[#3B5BFF]/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
            </button>

          </form>

          {/* Social Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative px-4 bg-white text-xs font-medium text-slate-400">
              or continue with
            </span>
          </div>

          {/* Google Social Button */}
          <div className="w-full">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="w-full py-3 px-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 text-sm font-bold text-slate-700 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Footer Switch Link */}
          <div className="mt-8 text-center text-xs text-slate-500 font-medium">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-bold text-[#3B5BFF] hover:underline"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-[#3B5BFF] hover:underline"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default AuthPage;
