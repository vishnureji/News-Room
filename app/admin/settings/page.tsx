'use client';

import React, { useState } from 'react';
import { Settings, Save, Check, Shield, Database, Cloud, Radio } from 'lucide-react';

export default function SettingsAdminPage() {
  const [siteName, setSiteName] = useState('AMG Newsroom');
  const [tagline, setTagline] = useState('Global Journalism & Strategic Intelligence');
  const [primaryColor, setPrimaryColor] = useState('#E53E3E');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
            Newsroom Settings & Integrations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Global metadata, branding tokens, Supabase Storage bucket connection and database parameters.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Theme */}
        <div className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-slate-200">Publication Identity & Theme</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Publication Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Editorial Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Cloud Infrastructure Status */}
        <div className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-slate-200">Infrastructure Health & Endpoints</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>Supabase PostgreSQL</span>
                <Database className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="font-mono text-emerald-400 font-bold">Connected (RLS Enforced)</div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>Supabase Media Storage</span>
                <Cloud className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="font-mono text-blue-400 font-bold">Active (newsroom-media)</div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>AI Inference Engine</span>
                <Radio className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="font-mono text-purple-400 font-bold">Latency 180ms</div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/50 transition-all flex items-center gap-2"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Settings Saved' : 'Save System Settings'}</span>
        </button>
      </form>
    </div>
  );
}
