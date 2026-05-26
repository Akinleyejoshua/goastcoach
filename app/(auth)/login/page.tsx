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
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background p-4">
      <div className="w-full max-w-md bg-card dark:bg-card border border-card-border dark:border-card-border shadow-lg rounded-2xl p-8 md:p-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Ghost Coach</h1>
          <p className="text-muted-foreground mt-3 text-sm">AI-Powered Sports Coaching</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-foreground">Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-all placeholder:text-muted-foreground/60"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-12 py-3.5 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-all placeholder:text-muted-foreground/60"
                placeholder="Enter your password"
                required
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

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl text-sm flex items-start gap-3">
              <div className="w-2 h-2 bg-destructive rounded-full mt-1.5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-card-border">
          <p className="text-center text-muted-foreground text-sm">
            Don't have an account?{' '}
            <a href="/register" className="text-primary hover:text-primary-hover font-semibold transition-colors">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
