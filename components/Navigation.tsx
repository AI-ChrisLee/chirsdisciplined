'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, TrendingUp, UserCircle, Cog, LayoutDashboard } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  
  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/progress',
      label: 'Progress',
      icon: TrendingUp,
    },
    {
      href: '/account',
      label: 'Account',
      icon: UserCircle,
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Cog,
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block">Chris</span>
          </div>

          {/* Center: Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-black text-white' 
                      : 'text-gray-600 hover:text-black hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Date */}
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </p>
            <p className="text-xs text-gray-500">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}