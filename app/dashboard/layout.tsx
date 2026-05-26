'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Camera, History, LogOut, User as UserIcon } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const setUser = useAuthStore((s) => s.setUser);
  const hasHydrated = useRef(false);

  useEffect(() => {
    const token = document.cookie.split('; ').find((row) => row.startsWith('auth-token='))?.split('=')[1];

    // No token -> redirect to login
    if (!token) {
      if (!user) {
        router.push('/login');
      }
      return;
    }

    // Already have user -> nothing to do
    if (user) return;

    // Prevent multiple hydration attempts
    if (hasHydrated.current) return;
    hasHydrated.current = true;

    // Hydrate user from token
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          // Invalid response -> clear cookie and redirect
          document.cookie = 'auth-token=; path=/; max-age=0';
          router.push('/login');
        }
      })
      .catch(() => {
        document.cookie = 'auth-token=; path=/; max-age=0';
        router.push('/login');
      });
  }, [user, router, setUser]);

  const handleLogout = () => {
    document.cookie = 'auth-token=; path=/; max-age=0';
    logout();
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <nav className="bg-card border-b border-card-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-foreground tracking-tight mr-8">Ghost Coach</span>
              <div className="hidden sm:flex space-x-2">
                <NavLink href="/dashboard" icon={<Camera size={18} />} label="New Upload" />
                <NavLink href="/dashboard/history" icon={<History size={18} />} label="History" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-foreground">
                <UserIcon size={18} />
                <span className="font-medium">{user.fullName}</span>
                <span className="text-sm text-muted-foreground">({user.position})</span>
              </div>
              <button onClick={handleLogout} className="flex items-center space-x-1 text-muted-foreground hover:text-destructive transition-colors text-sm font-medium">
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
          {/* Mobile navigation */}
          <div className="sm:hidden pb-3 pt-1 flex space-x-2">
            <NavLink href="/dashboard" icon={<Camera size={18} />} label="Upload" />
            <NavLink href="/dashboard/history" icon={<History size={18} />} label="History" />
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 md:py-10 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <button
      onClick={() => router.push(href)}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
        isActive
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
