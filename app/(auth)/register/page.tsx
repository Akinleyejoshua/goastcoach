'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { User, Lock, Eye, EyeOff, Trophy } from 'lucide-react';

const SPORTS = ['Cricket', 'Football', 'Basketball', 'Badminton'];
const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    sport: '',
    position: '',
    experienceLevel: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.password) {
        setError('Please fill all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      setStep(2);
      return;
    }

    if (!formData.sport || !formData.position || !formData.experienceLevel) {
      setError('Please select your sport details');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...payload } = formData;

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      document.cookie = `auth-token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      setUser(data.user);
      setToken(data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Account', desc: 'Basic info' },
    { num: 2, title: 'Profile', desc: 'Sport details' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-2xl rounded-3xl shadow-2xl p-10 bg-card dark:bg-card border border-card-border dark:border-card-border">
        {/* Enhanced Header with Progress */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mb-4 shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Ghost Coach
          </h1>
          <p className="text-muted-foreground dark:text-muted-foreground mt-2">Your AI-Powered Personal Coach</p>

          {/* Multi-step Progress Indicator */}
          <div className="mt-8 flex justify-center items-center gap-4">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                      step >= s.num
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 border-indigo-600 text-white shadow-lg'
                        : 'bg-card border-card-border dark:bg-card dark:border-card-border text-muted-foreground dark:text-muted-foreground'
                    }`}
                  >
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className={`mt-2 text-xs font-semibold ${step >= s.num ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground dark:text-muted-foreground'}`}>
                    {s.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground dark:text-muted-foreground">{s.desc}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 rounded ${
                      step > s.num ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-card-border dark:bg-card-border'
                    }`}
                    style={{ backgroundColor: step > s.num ? undefined : 'var(--card-border)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 dark:bg-destructive/20 border border-destructive/30 dark:border-destructive/50 text-destructive dark:text-destructive rounded-xl text-sm flex items-start">
            <div className="w-2 h-2 bg-destructive rounded-full mt-1.5 mr-3 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Account Creation */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                <label className="block text-sm font-semibold text-foreground dark:text-foreground mb-2">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-input dark:border-input rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-background dark:bg-background text-foreground dark:text-foreground"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground dark:text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-input dark:border-input rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-background dark:bg-background text-foreground dark:text-foreground"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground dark:text-foreground mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-input dark:border-input rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-background dark:bg-background text-foreground dark:text-foreground"
                    placeholder="Create a strong password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">At least 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground dark:text-foreground mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-input dark:border-input rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-background dark:bg-background text-foreground dark:text-foreground"
                    placeholder="Re-enter your password"
                    required
                  />
                </div>
              </div>

              {/* Navigation Buttons for Step 1 */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Advanced Profile Onboarding */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Sport & Position */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground dark:text-foreground mb-2">
                    Your Sport
                  </label>
                  <select
                    name="sport"
                    value={formData.sport}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-input dark:border-input rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-background dark:bg-background text-foreground dark:text-foreground"
                    required
                  >
                    <option value="">
                      -- Choose your sport --
                    </option>
                    {SPORTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">Select the sport you want coaching for</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground dark:text-foreground mb-2">
                    Position / Role
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-input dark:border-input rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-background dark:bg-background text-foreground dark:text-foreground"
                    placeholder="e.g., Batsman, Goalkeeper, Point Guard, Setter"
                    required
                  />
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">Your playing position or role</p>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-semibold text-foreground dark:text-foreground mb-2">
                  Experience Level
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-input dark:border-input rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-background dark:bg-background text-foreground dark:text-foreground"
                  required
                >
                  <option value="">
                    -- Select your level --
                  </option>
                  {EXPERIENCE_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border-2 border-input dark:border-input text-foreground dark:text-foreground font-semibold rounded-xl hover:bg-secondary dark:hover:bg-secondary transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="text-center mt-6 text-muted-foreground dark:text-muted-foreground">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
