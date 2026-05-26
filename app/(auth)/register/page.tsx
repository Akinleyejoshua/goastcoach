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
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background p-4">
      <div className="w-full max-w-2xl bg-card dark:bg-card border border-card-border dark:border-card-border shadow-lg rounded-2xl p-6 md:p-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4 shadow-md">
            <Trophy className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Ghost Coach</h1>
          <p className="text-muted-foreground mt-2 text-sm">Your AI-Powered Personal Coach</p>
        </div>

        {/* Multi-step Progress */}
        <div className="mb-10">
          <div className="flex justify-center items-center gap-4 md:gap-6">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                      step >= s.num
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-card border-card-border text-muted-foreground'
                    }`}
                  >
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className={`mt-2 text-xs font-semibold ${step >= s.num ? 'text-primary' : 'text-muted-foreground'}`}>
                    {s.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground hidden sm:block">{s.desc}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-12 md:w-20 h-1 mx-2 rounded ${
                      step > s.num ? 'bg-primary' : 'bg-card-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl text-sm flex items-start gap-3">
            <div className="w-2 h-2 bg-destructive rounded-full mt-1.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Account */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-semibold text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-all placeholder:text-muted-foreground/60"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground">Email</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-all placeholder:text-muted-foreground/60"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3.5 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-all placeholder:text-muted-foreground/60"
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-all placeholder:text-muted-foreground/60"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Profile */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="sport" className="block text-sm font-semibold text-foreground">Sport</label>
                  <div className="relative">
                    <select
                      id="sport"
                      name="sport"
                      value={formData.sport}
                      onChange={handleChange}
                      className="w-full pl-4 pr-10 py-3.5 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select sport</option>
                      {SPORTS.map((sport) => (
                        <option key={sport} value={sport}>{sport}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="position" className="block text-sm font-semibold text-foreground">Position</label>
                  <div className="relative">
                    <input
                      id="position"
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full pl-4 pr-4 py-3.5 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-all placeholder:text-muted-foreground/60"
                      placeholder="e.g. Forward, Bowler"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="experienceLevel" className="block text-sm font-semibold text-foreground">Experience Level</label>
                <div className="relative">
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-3.5 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select level</option>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3.5 px-4 border border-input bg-background text-foreground font-semibold rounded-xl hover:bg-secondary transition-all"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 px-4 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              {loading ? (step === 1 ? 'Creating...' : 'Completing...') : step === 1 ? 'Continue' : 'Complete Registration'}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-card-border text-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:text-primary-hover font-semibold transition-colors">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
                  
}
