'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-6">
      {/* Subtle background accent */}
      <div className="fixed inset-0 bg-[radial-gradient(#1E40AF_0.5px,transparent_1px)] dark:bg-[radial-gradient(#3B82F6_0.5px,transparent_1px)] [background-size:40px_40px] opacity-30 pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-white/5 p-10">
          {/* Header */}
          <div className="text-center mb-10">
            
            <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white mb-2">
              Ghost Coach
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              Premium AI Sports Coaching
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                  <User size={20} />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white 
                           pl-12 pr-5 py-4 rounded-2xl focus:outline-none focus:ring-2 
                           focus:ring-royalblue text-[15px] placeholder-zinc-400 dark:placeholder-zinc-500
                           transition-all duration-200"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white 
                           pl-12 pr-14 py-4 rounded-2xl focus:outline-none focus:ring-2 
                           focus:ring-royalblue text-[15px] placeholder-zinc-400 dark:placeholder-zinc-500
                           transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 
                            px-5 py-3 rounded-2xl text-sm font-medium border-l-4 border-red-500">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-royalblue hover:bg-[#1E40AF] active:bg-[#1E3A8A] 
                       text-white font-semibold py-4 rounded-2xl text-base
                       transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed
                       shadow-lg shadow-royalblue/30 dark:shadow-royalblue/20
                       flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-8 text-sm text-zinc-500 dark:text-zinc-400">
            Don't have an account?{' '}
            <a 
              href="/register" 
              className="text-royalblue hover:text-[#1E40AF] font-medium transition-colors"
            >
              Create account
            </a>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-6">
          Secure login • Powered by Ghost Coach AI
        </p>
      </div>
    </div>
  );
}