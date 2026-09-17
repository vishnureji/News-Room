'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Filter,
  Layers,
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { Article } from '@/types/newsroom';
import { formatDate } from '@/lib/utils';

export default function EditorialCalendarPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [newPublishDate, setNewPublishDate] = useState('2026-09-18T09:00');

  useEffect(() => {
    setArticles(newsroomService.getArticles());
  }, []);

  const categories = newsroomService.getCategories();

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle) return;
    newsroomService.updateArticlePublishDate(selectedArticle.id, new Date(newPublishDate).toISOString());
    setArticles([...newsroomService.getArticles()]);
    setRescheduleModalOpen(false);
  };

  const weekDays = [
    { day: 'Mon', date: 'Sep 15', items: [] },
    { day: 'Tue', date: 'Sep 16', items: [articles[0], articles[1]].filter(Boolean) },
    { day: 'Wed', date: 'Sep 17 (Today)', items: [articles[2]].filter(Boolean) },
    { day: 'Thu', date: 'Sep 18', items: [articles[3]].filter(Boolean) },
    { day: 'Fri', date: 'Sep 19', items: [] },
    { day: 'Sat', date: 'Sep 20', items: [] },
    { day: 'Sun', date: 'Sep 21', items: [] },
  ];

  const monthGrid = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    let dayArticles: Article[] = [];
    if (dayNum === 16) dayArticles = [articles[0], articles[1]].filter(Boolean);
    if (dayNum === 17) dayArticles = [articles[2]].filter(Boolean);
    if (dayNum === 18) dayArticles = [articles[3]].filter(Boolean);
    return { dayNum, dateStr: `Sep ${dayNum}, 2026`, items: dayArticles };
  });

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
              Editorial Publishing Calendar
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
              September 2026
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Visual planning desk for embargoed reports, scheduled releases, and daily publishing slots.
          </p>
        </div>

        {/* View Mode & Month Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${viewMode === 'month' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${viewMode === 'week' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${viewMode === 'day' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Day View
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((col, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border min-h-[380px] flex flex-col justify-between shadow-lg ${
                col.date.includes('Today')
                  ? 'bg-rose-950/20 border-rose-500/40'
                  : 'bg-[#0e131f] border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-200">{col.day}</span>
                  <span className="text-[10px] font-mono text-slate-400">{col.date}</span>
                </div>

                {/* Day Items */}
                <div className="space-y-2.5">
                  {col.items.map((art) => (
                    <div
                      key={art.id}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-rose-500 transition-all space-y-1.5 shadow-md"
                    >
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="text-rose-400 uppercase font-semibold">
                          {art.primary_category?.name || 'News'}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded capitalize ${
                            art.status === 'published'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}
                        >
                          {art.status}
                        </span>
                      </div>

                      <Link
                        href={`/admin/articles/${art.id}/edit`}
                        className="text-xs font-bold text-slate-100 hover:text-rose-400 block line-clamp-2"
                      >
                        {art.title}
                      </Link>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                        <span className="truncate">{art.authors[0]?.display_name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedArticle(art);
                            setRescheduleModalOpen(true);
                          }}
                          className="text-rose-400 hover:underline font-mono"
                        >
                          Shift Slot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/admin/articles/new"
                className="mt-4 py-1.5 px-2 rounded-lg border border-dashed border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-300 text-[10px] font-medium text-center block transition-colors"
              >
                + Slot Story
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Month View Grid */}
      {viewMode === 'month' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 bg-[#0e131f] p-4 rounded-2xl border border-slate-800">
          {monthGrid.map((cell) => (
            <div
              key={cell.dayNum}
              className={`p-2.5 rounded-xl border min-h-[110px] flex flex-col justify-between ${
                cell.dayNum === 17
                  ? 'bg-rose-950/25 border-rose-500/40'
                  : 'bg-slate-900/60 border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-slate-200">{cell.dayNum}</span>
                {cell.dayNum === 17 && (
                  <span className="text-[9px] text-rose-400 font-bold">TODAY</span>
                )}
              </div>

              <div className="space-y-1">
                {cell.items.map((art) => (
                  <Link
                    key={art.id}
                    href={`/admin/articles/${art.id}/edit`}
                    className="block p-1 rounded bg-slate-800 text-[10px] font-semibold text-slate-200 truncate hover:text-rose-300"
                  >
                    {art.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Day View Detail */}
      {viewMode === 'day' && (
        <div className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100">
            Publishing Schedule for Wednesday, September 17, 2026
          </h2>
          <div className="space-y-3">
            {articles.map((art) => (
              <div
                key={art.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase text-rose-400 font-bold">
                    {art.primary_category?.name}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">{art.title}</h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    By {art.authors[0]?.display_name} • Status: {art.status}
                  </div>
                </div>
                <Link
                  href={`/admin/articles/${art.id}/edit`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                >
                  Open Editor
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reschedule Date Modal */}
      {rescheduleModalOpen && selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleReschedule}
            className="w-full max-w-md p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4 shadow-2xl"
          >
            <h3 className="text-sm font-bold text-white">Reschedule Publishing Time Slot</h3>
            <p className="text-xs text-slate-400">{selectedArticle.title}</p>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">New Scheduled Date & Time</label>
              <input
                type="datetime-local"
                value={newPublishDate}
                onChange={(e) => setNewPublishDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRescheduleModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-500"
              >
                Save Schedule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
