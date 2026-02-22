'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, Users, HeartHandshake, LogOut, FileText, Settings } from 'lucide-react';

const routes = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Patients', path: '/dashboard/patients', icon: Users },
  { name: 'Campaigns', path: '/dashboard/campaigns', icon: FileText },
  { name: 'Donations', path: '/dashboard/donations', icon: HeartHandshake },
  { name: 'Profile', path: '/dashboard/profile', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const filteredRoutes = routes.filter((route) => {
    // Only admins see the users management route (if added later)
    return true;
  });

  return (
    <div className="flex w-64 flex-col border-r bg-muted/30">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <HeartHandshake className="h-6 w-6 text-primary" />
          <span className="">Charity System</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {filteredRoutes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                pathname === route.path ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
            >
              <route.icon className="h-4 w-4" />
              {route.name}
            </Link>
          ))}
          {session?.user.role === 'admin' && (
            <Link
              href="/dashboard/users"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                pathname === '/dashboard/users' ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
            >
              <Users className="h-4 w-4" />
              Users Management
            </Link>
          )}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="flex items-center gap-2 mb-4 px-2">
            <div className="flex flex-col">
                <span className="text-sm font-medium">{session?.user?.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{session?.user?.role}</span>
            </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );
}
