'use client';

import React, { useState } from 'react';
import { User, Bookmark, History, CreditCard, ShieldCheck, Check, Sparkles } from 'lucide-react';

export default function ReaderAccountPage() {
  const [activeTab, setActiveTab] = useState<'membership' | 'bookmarks' | 'history'>('membership');

  const bookmarks = [
    {
      title: 'Union Budget 2026 Unveils Landmark $120B Infrastructure & Green Energy Package',
      category: 'Economy & Business',
      time: '6 min read'
    },
    {
      title: 'Breakthrough in Photonic AI Chips Promises 50x Compute Efficiency',
      category: 'Technology & AI',
      time: '5 min read'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Profile Blurb */}
      <div className="p-8 rounded-3xl bg-[#0e131f] border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center text-xl font-bold text-white shadow-lg">
            VR
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl font-bold text-white">Vishnu Reji</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PRO SUBSCRIBER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">vishnu@newsroom.com • Member since 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('membership')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              activeTab === 'membership' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Membership
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              activeTab === 'bookmarks' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Saved Stories
          </button>
        </div>
      </div>

      {/* Membership / Paywall Tier Selection */}
      {activeTab === 'membership' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white font-headline">Subscription & Intelligence Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Tier */}
            <div className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-200">Standard Reader</h3>
                <div className="text-2xl font-bold text-white font-mono">$0 / month</div>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">✓ Unlimited public reporting access</li>
                <li className="flex items-center gap-2">✓ Daily Morning Dispatch newsletter</li>
                <li className="flex items-center gap-2 text-slate-400">✗ Premium investigative dossiers</li>
              </ul>
            </div>

            {/* Pro Tier */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/40 space-y-4 shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">AMG Intelligence Pro</h3>
                  <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                    ACTIVE
                  </span>
                </div>
                <div className="text-2xl font-bold text-rose-400 font-mono">$9 / month</div>
              </div>
              <ul className="space-y-2 text-xs text-slate-200">
                <li className="flex items-center gap-2 text-emerald-400 font-medium">
                  ✓ Full access to all Paywall & Deep-Tech investigations
                </li>
                <li className="flex items-center gap-2 text-emerald-400 font-medium">
                  ✓ Ad-free reading canvas
                </li>
                <li className="flex items-center gap-2 text-emerald-400 font-medium">
                  ✓ Sector data downloads & PDF dossier archives
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Bookmarked Stories */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white font-headline">Saved Investigative Reports</h2>
          <div className="divide-y divide-slate-800 bg-[#0e131f] border border-slate-800 rounded-2xl overflow-hidden">
            {bookmarks.map((b, i) => (
              <div key={i} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-800/30">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-rose-400 font-bold">
                    {b.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">{b.title}</h3>
                  <span className="text-xs text-slate-400 font-mono">{b.time}</span>
                </div>
                <button className="text-xs text-rose-400 hover:underline">Read Now</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
