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
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-6">
      {/* Subtle background accent */}
      <div className="fixed inset-0 bg-[radial-gradient(#1E40AF_0.5px,transparent_1px)] dark:bg-[radial-gradient(#3B82F6_0.5px,transparent_1px)] [background-size:40px_40px] opacity-30 pointer-events-none" />

      <div className="w-full max-w-2xl relative">
        <div className="bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-white/5 p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 bg-royalblue/10 dark:bg-royalblue/20 rounded-2xl flex items-center justify-center mb-6">
              <Trophy className="w-8 h-8 text-royalblue" />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white mb-2">
              Ghost Coach
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              Join the premium AI coaching experience
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-4">
              {steps.map((s, idx) => (
                <div key={s.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-11 h-11 border border-zinc-300 dark:border-zinc-600 rounded-2xl flex items-center justify-center text-sm font-semibold transition-all duration-200
                        ${step >= s.num 
                          ? 'bg-royalblue' 
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500'}`}
                    >
                      {step > s.num ? '✓' : s.num}
                    </div>
                    <span className={`mt-3 text-xs font-medium ${step >= s.num ? 'text-royalblue' : 'text-zinc-400 dark:text-zinc-500'}`}>
                      {s.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-6 mt-5 transition-all ${step > s.num ? 'bg-royalblue' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-8 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 
                          px-5 py-4 rounded-2xl text-sm font-medium border-l-4 border-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Account Creation */}
            {step === 1 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                        <User size={20} />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white 
                                 pl-12 pr-5 py-4 rounded-2xl focus:outline-none focus:ring-2 
                                 focus:ring-royalblue text-[15px] placeholder-zinc-400 dark:placeholder-zinc-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                        <User size={20} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white 
                                 pl-12 pr-5 py-4 rounded-2xl focus:outline-none focus:ring-2 
                                 focus:ring-royalblue text-[15px] placeholder-zinc-400 dark:placeholder-zinc-500"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white 
                               pl-12 pr-14 py-4 rounded-2xl focus:outline-none focus:ring-2 
                               focus:ring-royalblue text-[15px] placeholder-zinc-400 dark:placeholder-zinc-500"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Must be at least 6 characters</p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white 
                               pl-12 pr-5 py-4 rounded-2xl focus:outline-none focus:ring-2 
                               focus:ring-royalblue text-[15px] placeholder-zinc-400 dark:placeholder-zinc-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-royalblue hover:text-white hover:bg-[#1E40AF] active:bg-[#1E3A8A] 
                           font-semibold py-4 rounded-2xl text-base transition-all duration-200
                           shadow-lg shadow-royalblue/30 dark:shadow-royalblue/20"
                >
                  Continue to Profile
                </button>
              </div>
            )}

            {/* Step 2: Sport Profile */}
            {step === 2 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sport Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Your Sport
                    </label>
                    <select
                      name="sport"
                      value={formData.sport}
                      onChange={handleChange}
                      className="w-full bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white 
                               px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 
                               focus:ring-royalblue text-[15px]"
                      required
                    >
                      <option value="">Select your sport</option>
                      {SPORTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Position / Role */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Position / Role
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white 
                               px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 
                               focus:ring-royalblue text-[15px] placeholder-zinc-400 dark:placeholder-zinc-500"
                      placeholder="e.g. Batsman, Striker, Point Guard"
                      required
                    />
                  </div>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white 
                             px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 
                             focus:ring-royalblue text-[15px]"
                    required
                  >
                    <option value="">Select your level</option>
                    {EXPERIENCE_LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 border border-zinc-200 dark:border-zinc-800 
                             text-zinc-700 dark:text-zinc-300 font-semibold rounded-2xl 
                             hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-royalblue hover:bg-[#1E40AF] hover:text-white active:bg-[#1E3A8A] 
                             ont-semibold py-4 rounded-2xl text-base
                             transition-all duration-200 disabled:opacity-70 shadow-lg shadow-royalblue/30 dark:shadow-royalblue/20"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="text-center mt-8 text-sm text-zinc-500 dark:text-zinc-400">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-royalblue hover:text-[#1E40AF] font-medium transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>

        <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-6">
          Secure registration • Powered by Ghost Coach AI
        </p>
      </div>
    </div>
  );
}