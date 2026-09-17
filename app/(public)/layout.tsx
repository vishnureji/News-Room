'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Bookmark,
  User,
  Radio,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Mail,
  Rss
} from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { BreakingNewsItem, Category } from '@/types/newsroom';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [breaking, setBreaking] = useState<BreakingNewsItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDate] = useState(
    new Date(2026, 8, 17).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  );

  useEffect(() => {
    setBreaking(newsroomService.getBreakingNews());
    setCategories(newsroomService.getCategories());
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 font-sans">
      {/* Top Meta Bar */}
      <div className="border-b border-slate-800/80 bg-[#080b12] text-slate-400 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slate-300">{currentDate}</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-[11px] text-emerald-400">
              Edition: Global / English
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/admin" className="hover:text-rose-400 font-semibold transition-colors">
              Newsroom Staff CMS
            </Link>
            <span>•</span>
            <Link href="/account" className="hover:text-slate-200 transition-colors flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>Reader Account</span>
            </Link>
            <span>•</span>
            <Link href="/feed.xml" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <Rss className="w-3 h-3" />
              <span>RSS</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Publication Masthead Header */}
      <header className="border-b border-slate-800 bg-[#0e131f]/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="group flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 flex items-center justify-center font-bold text-white shadow-lg shadow-rose-900/30 text-lg">
                AMG
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-headline group-hover:text-rose-400 transition-colors">
                  NEWSROOM
                </span>
                <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-400">
                  Global Journalism & Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* Search & Subscribe Action */}
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Search Archive"
            >
              <Search className="w-4 h-4" />
            </Link>

            <Link
              href="/account"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-md shadow-rose-950/40 transition-all"
            >
              Subscribe Premium
            </Link>
          </div>
        </div>

        {/* Primary Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex border-t border-slate-800/80 max-w-7xl mx-auto px-8 py-2.5 items-center justify-between text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-rose-400 transition-colors">
              Front Page
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className="hover:text-rose-400 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <Link href="/newsletter" className="hover:text-rose-400 transition-colors">
              Daily Intelligence Brief
            </Link>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#0a0d14] px-6 py-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Verticals</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-slate-200 hover:text-rose-400"
              >
                Front Page
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 text-slate-200 hover:text-rose-400"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Breaking News Ticker if active */}
      {breaking.length > 0 && (
        <div className="bg-red-950/90 border-b border-red-800 px-4 sm:px-8 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black tracking-wider uppercase shrink-0 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                Breaking
              </span>
              <Link
                href={breaking[0].target_url || '/'}
                className="text-xs sm:text-sm font-semibold text-white hover:underline truncate"
              >
                {breaking[0].title}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Public Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">{children}</main>

      {/* Public Footer */}
      <footer className="border-t border-slate-800 bg-[#080b12] py-12 px-4 sm:px-8 text-xs text-slate-400 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-white text-xs">
                AMG
              </div>
              <span className="text-base font-bold text-slate-100 font-headline">AMG Newsroom</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Independent investigative journalism, real-time macroeconomic intelligence, and global policy analysis.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Coverage Beats</h3>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/${c.slug}`} className="hover:text-rose-400 transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Syndication & Feeds</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/news-sitemap.xml" className="hover:text-rose-400 transition-colors">
                  Google News XML Feed
                </Link>
              </li>
              <li>
                <Link href="/feed.xml" className="hover:text-rose-400 transition-colors">
                  RSS 2.0 Feed
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-rose-400 transition-colors">
                  Master Sitemap
                </Link>
              </li>
              <li>
                <Link href="/newsletter" className="hover:text-rose-400 transition-colors">
                  Daily Morning Dispatch
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Editorial Independence</h3>
            <p className="text-[11px] leading-relaxed text-slate-400">
              All reporting adheres to strict verification protocols and editorial neutrality standards.
            </p>
            <div className="text-[11px] font-mono text-slate-400">
              © 2026 AMG Newsroom Operating System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
