'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Calendar,
  FolderTree,
  Tags,
  Users,
  Image as ImageIcon,
  Layers,
  Search,
  BarChart3,
  Megaphone,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Settings,
  History,
  Radio,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  PlusCircle,
  Bell,
  Sliders,
  Check,
  Clock,
  AlertCircle
} from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { siteConfig } from '@/lib/config';
import { NotificationItem } from '@/types/newsroom';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

const getNavGroups = (articlesCount: number, assignmentsCount: number, commentsCount: number): { group: string; items: NavItem[] }[] => [
  {
    group: 'Editorial Core',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Articles & CMS', href: '/admin/articles', icon: FileText, badge: articlesCount > 0 ? articlesCount : undefined },
      { label: 'Assignments Desk', href: '/admin/assignments', icon: CheckSquare, badge: assignmentsCount > 0 ? assignmentsCount : undefined },
      { label: 'Editorial Calendar', href: '/admin/calendar', icon: Calendar },
      { label: 'Breaking News Ticker', href: '/admin/breaking-news', icon: Radio },
    ],
  },
  {
    group: 'Taxonomy & Authors',
    items: [
      { label: 'Categories', href: '/admin/categories', icon: FolderTree },
      { label: 'Tags & Topics', href: '/admin/tags', icon: Tags },
      { label: 'Authors & Staff', href: '/admin/authors', icon: Users },
    ],
  },
  {
    group: 'Media & Layout',
    items: [
      { label: 'Media Storage (Supabase)', href: '/admin/media', icon: ImageIcon },
      { label: 'Homepage Builder', href: '/admin/homepage-builder', icon: Layers },
      { label: 'Menus & Navigation', href: '/admin/menus', icon: Sliders },
    ],
  },
  {
    group: 'Growth & Monetization',
    items: [
      { label: 'SEO & Redirects', href: '/admin/seo', icon: Search, badge: '96' },
      { label: '1st-Party Analytics', href: '/admin/analytics', icon: BarChart3 },
      { label: 'Ad Placements', href: '/admin/advertising', icon: Megaphone },
      { label: 'Newsletters', href: '/admin/newsletters', icon: Mail },
      { label: 'Comments Queue', href: '/admin/comments', icon: MessageSquare, badge: commentsCount > 0 ? commentsCount : undefined },
    ],
  },
  {
    group: 'AI & Administration',
    items: [
      { label: 'AI Newsroom Co-Pilot', href: '/admin/ai-tools', icon: Sparkles },
      { label: 'Roles & RBAC', href: '/admin/roles', icon: ShieldCheck },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: History },
      { label: 'System Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    setNotifications(newsroomService.getNotifications());
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = () => {
    newsroomService.markAllNotificationsRead();
    setNotifications([...newsroomService.getNotifications()]);
  };

  const handleMarkOneRead = (id: string) => {
    newsroomService.markNotificationRead(id);
    setNotifications([...newsroomService.getNotifications()]);
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0d14] text-slate-100 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0e131f] border-r border-slate-800/80 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Newsroom Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between bg-[#0e131f]">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center font-bold text-white shadow-lg shadow-rose-900/30">
              {siteConfig.name.charAt(0) || 'N'}
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
                {siteConfig.name}
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono font-normal">
                  OS 2.0
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Editorial Operations</div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-3 border-b border-slate-800/50">
          <Link
            href="/admin/articles/new"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-medium text-xs shadow-md shadow-rose-950/50 transition-all active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Article Draft</span>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
          {getNavGroups(
            newsroomService.getArticles().length,
            newsroomService.getAssignments().filter((a) => a.status !== 'completed').length,
            newsroomService.getComments().filter((c) => c.status === 'pending').length
          ).map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {group.group}
              </div>
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                          isActive
                            ? 'bg-rose-500/30 text-rose-200'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Footer Card */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0c101a]">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-rose-700/60 border border-rose-500/40 flex items-center justify-center text-xs font-semibold text-white">
                VR
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-200 truncate">Vishnu Reji</div>
                <div className="text-[10px] text-rose-400 truncate">Editor-in-Chief</div>
              </div>
            </div>
            <Link
              href="/"
              target="_blank"
              title="View Public Site"
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0e131f]/90 backdrop-blur px-6 flex items-center justify-between shrink-0 relative z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-slate-800/70 text-slate-300 hover:text-white lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span>AMG Newsroom</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-200 capitalize">
                {pathname.replace('/admin', '').replace('/', '') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>342 live readers</span>
            </div>

            {/* Notification Center Trigger */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors relative"
                title="Newsroom Collaboration Alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Slide-Down Modal */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0e131f] border border-slate-700 shadow-2xl overflow-hidden z-50">
                  <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-rose-400" />
                      <span className="text-xs font-bold text-white">Newsroom Collaboration</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] font-mono text-rose-400 hover:underline"
                      >
                        Mark All Read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No recent newsroom alerts.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <Link
                          key={n.id}
                          href={n.target_url || '/admin'}
                          onClick={() => {
                            handleMarkOneRead(n.id);
                            setNotificationsOpen(false);
                          }}
                          className={`p-3.5 block hover:bg-slate-800/40 transition-colors space-y-1 ${
                            !n.is_read ? 'bg-rose-950/15' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200 truncate">{n.title}</span>
                            {!n.is_read && (
                              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            By {n.actor_name}
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/"
              target="_blank"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors"
            >
              <span>Live Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </header>

        {/* Scrollable Page Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#0a0d14] p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
