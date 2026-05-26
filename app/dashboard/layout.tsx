'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Camera, History, LogOut, User as UserIcon, Menu, X, Activity } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const setUser = useAuthStore((s) => s.setUser);
  const hasHydrated = useRef(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = document.cookie.split('; ').find((row) => row.startsWith('auth-token='))?.split('=')[1];

    if (!token) {
      if (!user) {
        router.push('/login');
      }
      return;
    }

    if (user) return;

    if (hasHydrated.current) return;
    hasHydrated.current = true;

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Premium Glassmorphic Navbar */}
      <nav className="bg-background/80 backdrop-blur-md border-b border-card-border sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo / Brand identity */}
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/dashboard')}>
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Activity size={18} className="animate-pulse" />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Ghost Coach
              </span>
            </div>

            {/* Desktop Navigation Link Hub */}
            <div className="hidden md:flex items-center gap-2">
              <NavLink href="/dashboard" icon={<Camera size={18} />} label="New Upload" />
              <NavLink href="/dashboard/history" icon={<History size={18} />} label="History" />
            </div>

            {/* User Profile Controls - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl border border-card-border/60 bg-secondary/30">
                <div className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <UserIcon size={15} />
                </div>
                <div className="text-left leading-none">
                  <div className="font-semibold text-xs tracking-wide">{user.fullName}</div>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{user.position}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/20 hover:bg-destructive/5 rounded-xl transition-all"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Action Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-card-border bg-card/95 backdrop-blur-lg animate-fadeIn">
            <div className="px-4 py-6 space-y-6">
              <div className="flex flex-col gap-1.5">
                <MobileNavLink href="/dashboard" icon={<Camera size={18} />} label="New Upload" onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink href="/dashboard/history" icon={<History size={18} />} label="History" onClick={() => setMobileMenuOpen(false)} />
              </div>

              <div className="pt-5 border-t border-card-border">
                <div className="flex items-center gap-3 mb-5 px-3">
                  <div className="w-9 h-9 bg-secondary text-primary border border-card-border rounded-xl flex items-center justify-center">
                    <UserIcon size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">{user.fullName}</div>
                    <div className="text-xs text-muted-foreground">{user.position}</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2.5 py-3 text-sm font-semibold text-destructive border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 rounded-xl transition-all"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        {children}
      </main>
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
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold tracking-tight transition-all
        ${isActive 
          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/10' 
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MobileNavLink({ href, icon, label, onClick }: { 
  href: string; 
  icon: React.ReactNode; 
  label: string;
  onClick: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <button
      onClick={() => {
        router.push(href);
        onClick();
      }}
      className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all
        ${isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}