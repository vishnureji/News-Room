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
import { siteConfig } from '@/lib/config';
import { BreakingNewsItem, Category } from '@/types/newsroom';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [breaking, setBreaking] = useState<BreakingNewsItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
    setBreaking(newsroomService.getBreakingNews());
    setCategories(newsroomService.getCategories());
    newsroomService.syncFromSupabase().then(() => {
      setBreaking(newsroomService.getBreakingNews());
      setCategories(newsroomService.getCategories());
    });
  }, []);

  const siteInitials = siteConfig.name.slice(0, 3).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 font-sans">
      {/* Top Meta Bar */}
      <div className="border-b border-slate-800/80 bg-[#080b12] text-slate-400 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slate-300">{currentDate || 'Today'}</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-[11px] text-emerald-400">
              Edition: {siteConfig.edition}
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 flex items-center justify-center font-bold text-white shadow-lg shadow-rose-900/30 text-base">
                {siteInitials}
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-headline group-hover:text-rose-400 transition-colors">
                  {siteConfig.name}
                </span>
                <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-400">
                  {siteConfig.description}
                </span>
              </div>
            </Link>
          </div>

          {/* Search & Subscribe Action */}
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2 text-xs"
              title="Search Archive"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search Dispatch</span>
            </Link>

            <Link
              href="/account"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/50 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Subscribe</span>
            </Link>
          </div>
        </div>

        {/* Categories Bar */}
        <nav className="hidden lg:block border-t border-slate-800/60 bg-[#0a0e17]">
          <div className="max-w-7xl mx-auto px-8 flex items-center gap-6 overflow-x-auto py-2.5 text-xs font-semibold text-slate-300">
            <Link href="/" className="hover:text-rose-400 whitespace-nowrap text-rose-400 flex items-center gap-1.5">
              <span>Frontpage</span>
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className="hover:text-white whitespace-nowrap text-slate-300 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#0a0e17] p-4 space-y-3 animate-in fade-in">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
              Coverage Verticals
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-rose-400"
              >
                Frontpage
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400">
              <Link href="/admin" className="hover:text-white">
                Admin Newsroom
              </Link>
              <Link href="/newsletter" className="hover:text-white">
                Newsletter
              </Link>
              <Link href="/account" className="hover:text-white">
                Account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Breaking News High-Priority Header Banner */}
      {breaking.length > 0 && (
        <div className="bg-red-950/90 border-b border-red-800/80 px-4 sm:px-8 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black tracking-wider uppercase shrink-0 animate-pulse">
                <Radio className="w-3 h-3" />
                <span>Breaking</span>
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white truncate">
                {breaking[0].title}
              </p>
            </div>
            {breaking[0].target_url && (
              <Link
                href={breaking[0].target_url}
                className="text-xs text-red-200 hover:text-white flex items-center gap-1 shrink-0 font-medium underline underline-offset-2"
              >
                <span>Read Story</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Page Slot */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-8">{children}</main>

      {/* Public Footer */}
      <footer className="border-t border-slate-800 bg-[#080b12] py-12 px-4 sm:px-8 text-xs text-slate-400 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-white text-xs">
                {siteInitials}
              </div>
              <span className="text-base font-bold text-slate-100 font-headline">{siteConfig.name}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {siteConfig.description}
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
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
