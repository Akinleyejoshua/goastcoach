'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Camera, History, LogOut, User as UserIcon, Menu, X } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royalblue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Premium Navbar */}
      <nav className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-royalblue/10 dark:bg-royalblue/20 rounded-2xl flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
              <span className="text-2xl font-semibold tracking-tight text-black dark:text-white">
                Ghost Coach
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink href="/dashboard" icon={<Camera size={20} />} label="New Upload" />
              <NavLink href="/dashboard/history" icon={<History size={20} />} label="History" />
            </div>

            {/* User Section - Desktop */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center">
                  <UserIcon size={18} className="text-royalblue" />
                </div>
                <div className="text-right">
                  <div className="font-medium text-black dark:text-white">{user.fullName}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{user.position}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-2xl"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="px-4 py-6 space-y-6">
              <div className="flex flex-col gap-2">
                <MobileNavLink href="/dashboard" icon={<Camera size={20} />} label="New Upload" onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink href="/dashboard/history" icon={<History size={20} />} label="History" onClick={() => setMobileMenuOpen(false)} />
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3 mb-6 px-3">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center">
                    <UserIcon size={22} className="text-royalblue" />
                  </div>
                  <div>
                    <div className="font-medium text-black dark:text-white">{user.fullName}</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">{user.position}</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 py-4 text-red-600 dark:text-red-500 font-medium rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/50"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
      className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all
        ${isActive 
          ? 'bg-royalblue text-white' 
          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
        }`}
    >
      {icon}
      {label}
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
      className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-left text-base font-medium transition-all
        ${isActive 
          ? 'bg-royalblue text-white' 
          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}