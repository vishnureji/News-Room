'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function NewsletterPublicPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8 pb-20">
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
          Curated Intelligence
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-headline">
          The AMG Morning Brief
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-editorial max-w-xl mx-auto">
          Unfiltered strategic briefings on policy, economy, energy, and AI innovation delivered to your inbox every morning at 06:00 AM.
        </p>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-[#0e131f] border border-slate-800 shadow-2xl space-y-6">
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400" />
            <h2 className="text-xl font-bold text-white font-headline">You're on the Executive List!</h2>
            <p className="text-xs text-slate-300">
              A verification dispatch has been sent to <strong className="text-white">{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Corporate / Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="john@enterprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-300">Sector Focus Areas</span>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-rose-500" />
                  <span>Macroeconomics & Fiscal Policy</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-rose-500" />
                  <span>Artificial Intelligence & Hardware</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-950/50 transition-all"
            >
              Confirm Subscription & Access Briefings
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
