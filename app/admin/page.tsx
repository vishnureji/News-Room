'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  AlertCircle,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Users,
  Eye,
  Radio,
  ArrowUpRight,
  Plus,
  MessageSquare,
  Sparkles,
  Zap,
  Flame,
  ArrowRight
} from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { Article, Assignment } from '@/types/newsroom';

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [analytics, setAnalytics] = useState(newsroomService.getAnalyticsOverview());
  const [breakingNews, setBreakingNews] = useState(newsroomService.getBreakingNews());

  useEffect(() => {
    setArticles(newsroomService.getArticles());
    setAssignments(newsroomService.getAssignments());
    setAnalytics(newsroomService.getAnalyticsOverview());
    setBreakingNews(newsroomService.getBreakingNews());
  }, []);

  const draftCount = 24;
  const inReviewCount = articles.filter(a => a.status === 'in_review').length || 8;
  const changesCount = articles.filter(a => a.status === 'changes_requested').length || 5;
  const scheduledCount = articles.filter(a => a.status === 'scheduled').length || 12;
  const publishedCount = 43;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
              Newsroom Command Desk
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Live Operations
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time publishing queue, editorial assignments, and reader traffic telemetry.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/breaking-news"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-950/50 border border-red-800/60 text-red-300 text-xs font-medium hover:bg-red-900/50 transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>Breaking News Banner</span>
          </Link>
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/50 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Write Story</span>
          </Link>
        </div>
      </div>

      {/* Breaking News Banner if active */}
      {breakingNews.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/80 via-rose-950/40 to-slate-900/80 border border-red-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded bg-red-600 text-white text-[10px] font-black tracking-wider uppercase shrink-0">
              Breaking Ticker
            </span>
            <p className="text-sm font-medium text-slate-100 truncate">
              {breakingNews[0].title}
            </p>
          </div>
          <Link
            href="/admin/breaking-news"
            className="text-xs text-red-300 hover:text-white underline underline-offset-4 shrink-0"
          >
            Edit Ticker
          </Link>
        </div>
      )}

      {/* Publishing Activity Pipeline (5 States) */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Today's Editorial Pipeline
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Drafts */}
          <Link
            href="/admin/articles?status=draft"
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Drafts</span>
              <FileText className="w-4 h-4 text-slate-400 group-hover:text-slate-300" />
            </div>
            <div className="text-2xl font-bold text-slate-100 font-mono">{draftCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">In progress by reporters</div>
          </Link>

          {/* In Review */}
          <Link
            href="/admin/articles?status=in_review"
            className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 hover:border-amber-700/60 transition-all group"
          >
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-medium">In Review</span>
              <Clock className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />
            </div>
            <div className="text-2xl font-bold text-amber-300 font-mono">{inReviewCount}</div>
            <div className="text-[11px] text-amber-300/80 mt-1">Awaiting desk review</div>
          </Link>

          {/* Changes Requested */}
          <Link
            href="/admin/articles?status=changes_requested"
            className="p-4 rounded-xl bg-orange-950/20 border border-orange-800/40 hover:border-orange-700/60 transition-all group"
          >
            <div className="flex items-center justify-between text-orange-400 mb-2">
              <span className="text-xs font-medium">Changes Req.</span>
              <AlertCircle className="w-4 h-4 text-orange-400 group-hover:text-orange-300" />
            </div>
            <div className="text-2xl font-bold text-orange-300 font-mono">{changesCount}</div>
            <div className="text-[11px] text-orange-300/80 mt-1">Feedback sent to author</div>
          </Link>

          {/* Scheduled */}
          <Link
            href="/admin/calendar"
            className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 hover:border-blue-700/60 transition-all group"
          >
            <div className="flex items-center justify-between text-blue-400 mb-2">
              <span className="text-xs font-medium">Scheduled</span>
              <Calendar className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
            </div>
            <div className="text-2xl font-bold text-blue-300 font-mono">{scheduledCount}</div>
            <div className="text-[11px] text-blue-300/80 mt-1">Timed publishing slot</div>
          </Link>

          {/* Published */}
          <Link
            href="/admin/articles?status=published"
            className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 hover:border-emerald-700/60 transition-all group"
          >
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-medium">Published</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
            </div>
            <div className="text-2xl font-bold text-emerald-300 font-mono">{publishedCount}</div>
            <div className="text-[11px] text-emerald-300/80 mt-1">Live on reader portal</div>
          </Link>
        </div>
      </div>

      {/* Grid: Assignments + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Desk Assignments (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>My Desk Assignments</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300">
                  {assignments.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400">Deadlines and pending investigative briefs</p>
            </div>
            <Link
              href="/admin/assignments"
              className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
            >
              <span>View Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800/60">
            {assignments.map((asg) => (
              <div
                key={asg.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                        asg.priority === 'breaking'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : asg.priority === 'high'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {asg.priority}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-200 group-hover:text-rose-400 transition-colors truncate">
                      {asg.title}
                    </h3>
                  </div>
                  {asg.notes && (
                    <p className="text-xs text-slate-400 line-clamp-1">{asg.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs shrink-0">
                  <div className="text-right">
                    <div className="text-slate-300 font-medium">{asg.assigned_to_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Due: {new Date(asg.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize ${
                      asg.status === 'completed'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : asg.status === 'in_progress'
                        ? 'bg-amber-500/15 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {asg.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Newsroom Activity Stream (1 Col) */}
        <div className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-rose-500" />
              <span>Editorial Activity</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-start gap-3 text-xs">
              <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-slate-200">
                  <strong className="text-rose-400 font-medium">Anu Sharma</strong> submitted{' '}
                  <span className="text-slate-300 italic">"Union Budget 2026 Analysis"</span>
                </p>
                <span className="text-[10px] text-slate-400 font-mono">10 mins ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-slate-200">
                  <strong className="text-amber-400 font-medium">Rahul Varma</strong> updated blocks in{' '}
                  <span className="text-slate-300 italic">"Photonic AI Chips"</span>
                </p>
                <span className="text-[10px] text-slate-400 font-mono">25 mins ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-slate-200">
                  <strong className="text-emerald-400 font-medium">Vishnu Reji</strong> approved and scheduled story for publishing
                </p>
                <span className="text-[10px] text-slate-400 font-mono">1 hour ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-slate-200">
                  <strong className="text-blue-400 font-medium">AI Co-Pilot</strong> generated SEO audit and OpenGraph payloads
                </p>
                <span className="text-[10px] text-slate-400 font-mono">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Snapshot & Top Stories */}
      <div className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-rose-500" />
              <span>Real-Time Audience Telemetry</span>
            </h2>
            <p className="text-xs text-slate-400">First-party analytics privacy-compliant engine</p>
          </div>
          <Link
            href="/admin/analytics"
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
          >
            <span>Full Analytics Hub</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400">Concurrent Readers</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1 flex items-center gap-2">
              {analytics.liveUsers}
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <div className="text-[11px] text-emerald-400/80 mt-1">+14% vs yesterday</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400">Today's Pageviews</div>
            <div className="text-2xl font-bold text-slate-100 font-mono mt-1">
              {analytics.todayPageviews.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Across 43 stories</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400">Unique Visitors</div>
            <div className="text-2xl font-bold text-slate-100 font-mono mt-1">
              {analytics.todayVisitors.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">72% Mobile readers</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400">Avg. Engagement</div>
            <div className="text-2xl font-bold text-slate-100 font-mono mt-1">
              {analytics.avgEngagementTime}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">+28s above target</div>
          </div>
        </div>

        {/* Top Performing Stories Table */}
        <div className="border border-slate-800/80 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Top Performing Stories Today</span>
            <span className="text-slate-400 font-mono">Views & Channel</span>
          </div>
          <div className="divide-y divide-slate-800/60">
            {analytics.topArticles.map((art, idx) => (
              <div
                key={idx}
                className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-5 font-mono text-xs font-bold text-slate-400">#{idx + 1}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{art.title}</p>
                    <span className="text-[10px] text-rose-400">{art.category}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-200 font-mono">
                    {art.views.toLocaleString()} views
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">Trending #1</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
