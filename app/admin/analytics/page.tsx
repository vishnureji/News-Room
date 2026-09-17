'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Smartphone, Globe, ArrowUpRight, Activity } from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';

export default function AnalyticsDashboardPage() {
  const [overview, setOverview] = useState(newsroomService.getAnalyticsOverview());

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
              1st-Party Real-Time Analytics
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Telemetry
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Privacy-compliant reader session metrics, dwell time, scroll depth, and referrer attribution.
          </p>
        </div>
      </div>

      {/* 4 Large Overview Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400">Concurrent Readers Online</div>
          <div className="text-3xl font-bold text-emerald-400 font-mono flex items-center gap-2">
            {overview.liveUsers}
          </div>
          <span className="text-[11px] text-emerald-400/80 font-mono">100% first-party cookies</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400">Total Pageviews Today</div>
          <div className="text-3xl font-bold text-slate-100 font-mono">
            {overview.todayPageviews.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">+18.4% vs last week</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400">Unique Daily Readers</div>
          <div className="text-3xl font-bold text-slate-100 font-mono">
            {overview.todayVisitors.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">84% return reader rate</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400">Avg. Dwell & Engagement Time</div>
          <div className="text-3xl font-bold text-slate-100 font-mono">
            {overview.avgEngagementTime}
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">68% scroll depth &gt; 75%</span>
        </div>
      </div>

      {/* Traffic Sources & Device Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-rose-500" />
            <span>Traffic Channels & Attribution</span>
          </h2>

          <div className="space-y-3">
            {overview.trafficSources.map((source, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{source.name}</span>
                  <span className="font-mono text-slate-400">
                    {source.count.toLocaleString()} ({source.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-rose-600 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-500" />
            <span>Reader Device Breakdown</span>
          </h2>

          <div className="space-y-3">
            {overview.deviceBreakdown.map((dev, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{dev.device}</span>
                  <span className="font-mono text-slate-400">{dev.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${dev.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
