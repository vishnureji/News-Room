'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  CheckCircle,
  ExternalLink,
  Globe,
  ArrowRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  FileCode,
  Trash2,
  Sliders,
  Send,
  Eye,
  Smartphone,
  Monitor
} from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { RedirectRule } from '@/types/newsroom';

export default function SEOSuitePage() {
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [healthReport, setHealthReport] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Redirect Form
  const [isAdding, setIsAdding] = useState(false);
  const [oldPath, setOldPath] = useState('');
  const [newPath, setNewPath] = useState('');
  const [statusCode, setStatusCode] = useState<301 | 302 | 410>(301);
  const [notes, setNotes] = useState('');

  // Ping Search Engines State
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{ google: string; bing: string; timestamp: string } | null>(null);

  // SERP Preview Simulator State
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [serpTitle, setSerpTitle] = useState(
    'Union Budget 2026 Unveils Landmark $120B Infrastructure Package'
  );
  const [serpDesc, setSerpDesc] = useState(
    'Comprehensive macroeconomic analysis of India Budget 2026: Capital expenditure outlays, semiconductor fabrication incentives, and clean grid integration.'
  );
  const [copiedSchema, setCopiedSchema] = useState(false);

  useEffect(() => {
    reloadSEO();
  }, []);

  const reloadSEO = () => {
    setRedirects(newsroomService.getRedirects());
    setHealthReport(newsroomService.getSEOGlobalHealthReport());
  };

  const handleAddRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPath.trim() || !newPath.trim()) return;

    newsroomService.addRedirect({
      old_path: oldPath,
      new_path: newPath,
      status_code: statusCode,
      notes
    });

    setOldPath('');
    setNewPath('');
    setNotes('');
    setIsAdding(false);
    reloadSEO();
  };

  const handleDeleteRedirect = (id: string) => {
    if (confirm('Delete this redirection rule?')) {
      newsroomService.deleteRedirect(id);
      reloadSEO();
    }
  };

  const handleToggleRedirectActive = (id: string, current: boolean) => {
    newsroomService.updateRedirect(id, { is_active: !current });
    reloadSEO();
  };

  const handlePingSearchEngines = () => {
    setIsPinging(true);
    setTimeout(() => {
      const res = newsroomService.pingSearchEngines();
      setPingResult(res);
      setIsPinging(false);
    }, 1200);
  };

  const sampleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://newsroom.live/article/india-budget-2026-fiscal-stimulus-infrastructure'
    },
    headline: 'Union Budget 2026 Unveils Landmark $120B Infrastructure & Green Energy Package',
    image: ['https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80'],
    datePublished: '2026-09-17T06:00:00Z',
    dateModified: '2026-09-17T08:30:00Z',
    author: [
      {
        '@type': 'Person',
        name: 'Vishnu Reji',
        jobTitle: 'Editor-in-Chief',
        url: 'https://newsroom.live/author/auth-1'
      }
    ],
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'AMG Newsroom',
      url: 'https://newsroom.live',
      logo: {
        '@type': 'ImageObject',
        url: 'https://newsroom.live/logo.png'
      }
    }
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleJsonLd, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  const filteredRedirects = redirects.filter(
    (r) =>
      r.old_path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.new_path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
              Editorial SEO Suite & Sitemaps
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Score: {healthReport?.overallScore || 96}/100</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Google News Schema Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time search health diagnostics, Google News XML feeds, IndexNow pings, 301/302 redirect engine & SERP snippet simulators.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={handlePingSearchEngines}
            disabled={isPinging}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all disabled:opacity-50"
          >
            {isPinging ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-400" /> : <Send className="w-3.5 h-3.5 text-blue-400" />}
            <span>Ping Google & Bing</span>
          </button>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/50 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Redirect</span>
          </button>
        </div>
      </div>

      {/* Ping Results Notification if triggered */}
      {pingResult && (
        <div className="p-4 rounded-2xl bg-[#0e131f] border border-blue-500/40 space-y-2 text-xs text-blue-200 animate-in fade-in">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>Search Engine Notification Dispatched</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">{pingResult.timestamp}</span>
          </div>
          <div className="space-y-1 font-mono text-[11px] text-slate-300">
            <p>• {pingResult.google}</p>
            <p>• {pingResult.bing}</p>
          </div>
        </div>
      )}

      {/* Global SEO Health Score & Diagnostic Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score Overview Card (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-br from-[#0e131f] to-slate-950 border border-slate-800 space-y-4 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Publication SEO Health</span>
          </span>

          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black text-white font-headline">96</span>
            <span className="text-slate-400 font-mono text-xs">/ 100 Grade A+</span>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Total Indexable URLs</span>
              <span className="font-mono font-bold text-white">
                {healthReport?.totalIndexableUrls || 14}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Google News Feed Ready</span>
              <span className="font-mono font-bold text-emerald-400">
                {healthReport?.googleNewsEligible || 4} articles
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Active Redirections</span>
              <span className="font-mono font-bold text-blue-400">
                {healthReport?.redirectCount || 2} rules
              </span>
            </div>
          </div>
        </div>

        {/* Audit Checklist (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-3.5 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Real-Time Diagnostic Checks
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(healthReport?.checks || []).map((chk: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-2.5 text-xs"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-slate-200">{chk.label}</p>
                  <p className="text-[11px] text-slate-400">{chk.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sitemaps & Feeds Hub */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          XML Sitemaps, Feeds & Discovery Endpoints
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-2 group shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Google News XML</span>
              <Globe className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">/news-sitemap.xml</p>
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-emerald-400 font-semibold">Live & Compliant</span>
              <Link
                href="/news-sitemap.xml"
                target="_blank"
                className="text-slate-400 group-hover:text-white flex items-center gap-1"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-2 group shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Master Post Sitemap</span>
              <Globe className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">/sitemap.xml</p>
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-emerald-400 font-semibold">Auto-Synced</span>
              <Link
                href="/sitemap.xml"
                target="_blank"
                className="text-slate-400 group-hover:text-white flex items-center gap-1"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-2 group shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Global RSS 2.0 Feed</span>
              <Globe className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">/feed.xml</p>
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-amber-400 font-semibold">Syndicated</span>
              <Link
                href="/feed.xml"
                target="_blank"
                className="text-slate-400 group-hover:text-white flex items-center gap-1"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-2 group shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Robots.txt Engine</span>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">/robots.txt</p>
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-blue-400 font-semibold">Protected</span>
              <Link
                href="/robots.txt"
                target="_blank"
                className="text-slate-400 group-hover:text-white flex items-center gap-1"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Google SERP Search Snippet Simulator */}
      <div className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-rose-400" />
              <span>Google SERP Snippet Preview Simulator</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Simulate how lead stories appear on Google Search results and Google News Top Stories carousel.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSerpDevice('desktop')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold transition-all ${
                serpDevice === 'desktop' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setSerpDevice('mobile')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold transition-all ${
                serpDevice === 'mobile' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>
        </div>

        {/* Visual SERP Simulator Box */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            serpDevice === 'mobile'
              ? 'max-w-md mx-auto bg-slate-950 border-slate-700 space-y-2'
              : 'bg-slate-950 border-slate-800 space-y-1.5'
          }`}
        >
          {/* Breadcrumb / URL */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center text-[10px] font-black text-white">
              AMG
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono truncate">
              <span className="text-slate-200">newsroom.live</span>
              <span>›</span>
              <span>article</span>
              <span>›</span>
              <span className="text-slate-400">india-budget-2026-fiscal-stimulus</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg text-blue-400 font-medium hover:underline cursor-pointer leading-snug">
            {serpTitle}
          </h3>

          {/* Snippet Description */}
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            <span className="text-slate-500 font-mono">Sep 17, 2026 — </span>
            {serpDesc}
          </p>

          <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
            <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
              NewsArticle Rich Result
            </span>
            <span className="px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-300">
              Byline: Vishnu Reji
            </span>
          </div>
        </div>
      </div>

      {/* New Redirect Modal Form */}
      {isAdding && (
        <form
          onSubmit={handleAddRedirect}
          className="p-6 rounded-2xl bg-[#0e131f] border border-rose-500/40 space-y-4 shadow-2xl animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-rose-400" />
              <span>Create URL Redirection Rule</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Auto Edge Fast-Routing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Legacy / Source Path</label>
              <input
                type="text"
                required
                placeholder="/legacy-story-slug"
                value={oldPath}
                onChange={(e) => setOldPath(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Destination URL / Path</label>
              <input
                type="text"
                required
                placeholder="/article/canonical-slug"
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">HTTP Status Code</label>
              <select
                value={statusCode}
                onChange={(e) => setStatusCode(Number(e.target.value) as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              >
                <option value={301}>301 Permanent Redirect</option>
                <option value={302}>302 Temporary Redirect</option>
                <option value={410}>410 Content Gone / Deleted</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Editorial Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Migrated from old WordPress taxonomy structure"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-500 shadow-lg shadow-rose-950/50"
            >
              Save Redirect Rule
            </button>
          </div>
        </form>
      )}

      {/* Redirects Management Table */}
      <div className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-200">
              Active URL Redirection Engine ({redirects.length})
            </h2>
            <p className="text-[11px] text-slate-400">
              Edge-handled redirect rules preserving SEO equity and link backlinks.
            </p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-800/60">
          {filteredRedirects.map((r) => (
            <div
              key={r.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 font-mono">
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      r.status_code === 301
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : r.status_code === 302
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {r.status_code}
                  </span>
                  <span className="text-slate-400">{r.old_path}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-200 font-semibold">{r.new_path}</span>
                </div>
                {r.notes && (
                  <p className="text-[11px] text-slate-400 italic pl-1">{r.notes}</p>
                )}
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <span className="font-mono text-[11px] text-slate-400">
                  {r.hit_count.toLocaleString()} hits
                </span>
                <button
                  onClick={() => handleToggleRedirectActive(r.id, r.is_active !== false)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    r.is_active !== false
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {r.is_active !== false ? 'Active' : 'Paused'}
                </button>
                <button
                  onClick={() => handleDeleteRedirect(r.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  title="Delete rule"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filteredRedirects.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-xs">
              No matching redirection rules found.
            </div>
          )}
        </div>
      </div>

      {/* Schema.org Inspector Drawer */}
      <div className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white">
              Automated Schema.org JSON-LD Structured Data Inspector
            </h2>
          </div>
          <button
            onClick={handleCopySchema}
            className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-semibold"
          >
            {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSchema ? 'Copied JSON-LD' : 'Copy JSON-LD'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
          {JSON.stringify(sampleJsonLd, null, 2)}
        </pre>
      </div>
    </div>
  );
}
