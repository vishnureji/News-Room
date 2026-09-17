'use client';

import React, { useState, useEffect } from 'react';
import { Radio, AlertCircle, Save, CheckCircle2, Trash2 } from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { BreakingNewsItem } from '@/types/newsroom';

export default function BreakingNewsAdminPage() {
  const [items, setItems] = useState<BreakingNewsItem[]>([]);
  const [title, setTitle] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [priority, setPriority] = useState(1);

  useEffect(() => {
    setItems(newsroomService.getBreakingNews());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    newsroomService.saveBreakingNews({
      title,
      target_url: targetUrl || undefined,
      priority,
      is_active: isActive
    });

    setItems(newsroomService.getBreakingNews());
    setTitle('');
    setTargetUrl('');
  };

  const handleDismiss = (id: string) => {
    newsroomService.dismissBreakingNews(id);
    setItems(newsroomService.getBreakingNews());
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
              Breaking News Ticker Desk
            </h1>
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Broadcast emergency bulletins and critical flashes across the top banner of the reader portal.
          </p>
        </div>
      </div>

      {/* Active Tickers */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Currently Live Breaking Alert
        </h2>

        {items.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 text-center text-xs text-slate-400">
            No active breaking banner currently broadcasting.
          </div>
        ) : (
          items.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-gradient-to-r from-red-950/60 to-slate-900 border border-red-800/80 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-mono font-bold uppercase">
                  Live Banner
                </span>
                <p className="text-sm font-bold text-slate-100">{b.title}</p>
                {b.target_url && (
                  <span className="text-xs text-red-300 font-mono">Links to: {b.target_url}</span>
                )}
              </div>
              <button
                onClick={() => handleDismiss(b.id)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Retract / Dismiss
              </button>
            </div>
          ))
        )}
      </div>

      {/* Trigger New Breaking Alert */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-slate-200">Broadcast New Bulletin</h2>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Ticker Headline</label>
          <input
            type="text"
            required
            placeholder="e.g. Finance Ministry confirms emergency bilateral trade agreement..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Target Story URL (Optional)</label>
          <input
            type="text"
            placeholder="/article/india-budget-2026-fiscal-stimulus-infrastructure"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-950/50 transition-all"
        >
          Flash Alert on Public Portal
        </button>
      </form>
    </div>
  );
}
