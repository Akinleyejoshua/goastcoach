'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Camera, History, LogOut, User as UserIcon } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = () => {
    document.cookie = 'auth-token=; path=/; max-age=0';
    logout();
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <nav className="bg-card dark:bg-card shadow-sm border-b border-card-border dark:border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-foreground dark:text-foreground mr-8">Ghost Coach</span>
              <div className="flex space-x-4">
                <NavLink href="/dashboard" icon={<Camera size={18} />} label="New Upload" />
                <NavLink href="/dashboard/history" icon={<History size={18} />} label="History" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-foreground dark:text-foreground">
                <UserIcon size={18} />
                <span>{user.fullName}</span>
                <span className="text-sm text-muted-foreground dark:text-muted-foreground">({user.position})</span>
              </div>
              <button onClick={handleLogout} className="flex items-center space-x-1 text-muted-foreground dark:text-muted-foreground hover:text-destructive dark:hover:text-destructive transition-colors">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const router = useRouter();
  const isActive = router.asPath === href;

  return (
    <button
      onClick={() => router.push(href)}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
        isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'text-muted-foreground dark:text-muted-foreground hover:bg-secondary dark:hover:bg-secondary'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
