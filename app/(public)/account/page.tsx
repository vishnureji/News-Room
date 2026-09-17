'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User as UserIcon,
  Bookmark,
  History,
  CreditCard,
  ShieldCheck,
  Check,
  Sparkles,
  LogIn,
  LogOut,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { db } from '@/lib/supabase/db';
import { newsroomService } from '@/lib/services/newsroom-service';
import { siteConfig } from '@/lib/config';
import { Article } from '@/types/newsroom';

export default function ReaderAccountPage() {
  const [activeTab, setActiveTab] = useState<'membership' | 'bookmarks' | 'auth'>('membership');
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Article[]>([]);

  useEffect(() => {
    // Check active session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        loadUserBookmarks(user.id);
      } else {
        // Fallback default sample bookmark from local catalog
        const published = newsroomService.getArticles({ status: 'published' });
        setBookmarkedArticles(published.slice(0, 2));
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        loadUserBookmarks(currentUser.id);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadUserBookmarks = async (userId: string) => {
    const ids = await db.getBookmarks(userId);
    const all = newsroomService.getArticles();
    if (ids.length > 0) {
      const filtered = all.filter((a) => ids.includes(a.id));
      setBookmarkedArticles(filtered);
    } else {
      setBookmarkedArticles(all.slice(0, 2));
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthMessage(null);
    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          setUser(data.user);
          setAuthMessage('Account registered successfully! Welcome to the newsroom.');
          setActiveTab('membership');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          setUser(data.user);
          setAuthMessage('Signed in successfully.');
          setActiveTab('membership');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAuthMessage('Signed out successfully.');
  };

  const userDisplayName =
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Reader Member';
  const userInitials = userDisplayName.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Notifications */}
      {authMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{authMessage}</span>
          </div>
          <button onClick={() => setAuthMessage(null)} className="text-emerald-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header Profile Blurb */}
      <div className="p-8 rounded-3xl bg-[#0e131f] border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center text-xl font-bold text-white shadow-lg">
            {user ? userInitials : <UserIcon className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl font-bold text-white">
                {user ? userDisplayName : 'Guest Reader'}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {user ? 'SUBSCRIBER ACCESS' : 'FREE EDITION'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {user ? `${user.email} • Authenticated via Supabase` : 'Sign in to sync saved stories and access premium briefs'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap justify-center">
          {user ? (
            <>
              <button
                onClick={() => setActiveTab('membership')}
                className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors ${
                  activeTab === 'membership'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Tiers
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors ${
                  activeTab === 'bookmarks'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Saved ({bookmarkedArticles.length})
              </button>
              <button
                onClick={handleSignOut}
                className="px-3.5 py-1.5 rounded-xl font-medium bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setActiveTab('auth')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all ${
                activeTab === 'auth'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Sign Up</span>
            </button>
          )}
        </div>
      </div>

      {/* Auth Modal / Tab if guest or switching to auth */}
      {activeTab === 'auth' && !user && (
        <div className="p-8 rounded-3xl bg-[#0e131f] border border-slate-800 space-y-6 shadow-2xl max-w-lg mx-auto">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-white font-headline">
              {authMode === 'signin' ? 'Sign In to Reader Account' : 'Create Reader Account'}
            </h2>
            <p className="text-xs text-slate-400">
              Access bookmarked stories, subscriber exclusives, and newsletter preferences.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="reader@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-rose-950/50 transition-all flex items-center justify-center gap-2"
            >
              <span>{authLoading ? 'Authenticating...' : authMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 text-center text-xs text-slate-400">
            {authMode === 'signin' ? (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setAuthMode('signup')}
                  className="text-rose-400 font-bold hover:underline ml-1"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('signin')}
                  className="text-rose-400 font-bold hover:underline ml-1"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Membership / Paywall Tier Selection */}
      {activeTab === 'membership' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-headline">Subscription & Intelligence Access</h2>
            <span className="text-xs text-slate-400">Cancel or switch anytime</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {siteConfig.membershipTiers.map((tier) => {
              const isPro = tier.id === 'tier-pro';
              return (
                <div
                  key={tier.id}
                  className={`p-6 rounded-2xl flex flex-col justify-between space-y-6 transition-all ${
                    isPro
                      ? 'bg-gradient-to-br from-rose-950/40 via-[#0e131f] to-slate-900 border-2 border-rose-500/50 shadow-2xl'
                      : 'bg-[#0e131f] border border-slate-800 shadow-xl'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">{tier.name}</h3>
                      {tier.badge && (
                        <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black tracking-wider">
                          {tier.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white font-mono">
                      {tier.price}{' '}
                      <span className="text-xs text-slate-400 font-normal">/ {tier.period}</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {tier.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                      isPro
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isPro ? 'Upgrade to Pro' : 'Select Tier'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bookmarked Stories */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-headline">Saved Investigative Reports</h2>
            <span className="text-xs text-slate-400 font-mono">{bookmarkedArticles.length} Stories</span>
          </div>

          <div className="divide-y divide-slate-800 bg-[#0e131f] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {bookmarkedArticles.length > 0 ? (
              bookmarkedArticles.map((art) => (
                <div
                  key={art.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-rose-400 font-bold">
                      {art.primary_category?.name || 'Investigation'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100">{art.title}</h3>
                    <span className="text-xs text-slate-400 font-mono">
                      {art.reading_time_mins || 4} min read
                    </span>
                  </div>
                  <Link
                    href={`/article/${art.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 self-start sm:self-auto"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No saved articles yet. Click the bookmark icon on any investigative piece to save it here.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
