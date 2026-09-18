'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  MoreVertical,
  ExternalLink,
  Sparkles,
  ArrowUpDown,
  Trash2,
  RefreshCw,
  Database
} from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { Article, ArticleStatus } from '@/types/newsroom';
import { formatDate } from '@/lib/utils';

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const live = await newsroomService.getArticlesAsync();
      setArticles(live);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    const ok = newsroomService.deleteArticle(id);
    if (ok) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleSeedDatabase = async () => {
    if (!confirm('Re-seed Supabase database with fresh production journalism datasets?')) return;
    setSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        await fetchArticles();
        alert('Supabase database seeded successfully!');
      } else {
        alert('Failed to seed database.');
      }
    } catch {
      alert('Error connecting to seed endpoint.');
    } finally {
      setSeeding(false);
    }
  };

  const filteredArticles = articles.filter((art) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'published' && art.status === 'published') ||
      (activeTab === 'in_review' && art.status === 'in_review') ||
      (activeTab === 'draft' && art.status === 'draft') ||
      (activeTab === 'scheduled' && art.status === 'scheduled') ||
      (activeTab === 'changes_requested' && art.status === 'changes_requested');

    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.excerpt && art.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.primary_category?.name && art.primary_category.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: ArticleStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Published
          </span>
        );
      case 'in_review':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            In Review
          </span>
        );
      case 'changes_requested':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-500/15 text-orange-300 border border-orange-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
            Changes Req.
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Scheduled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-headline flex items-center gap-3">
            Articles & Editorial Desk
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Supabase Live DB
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage, review, verify SEO and publish journalistic pieces across all beats in PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={fetchArticles}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            title="Refresh from Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>

          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-xs font-semibold border border-indigo-700/50 transition-all"
            title="Re-seed database with complete dataset"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{seeding ? 'Seeding...' : 'Seed Data'}</span>
          </button>

          <Link
            href="/admin/articles/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/50 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto text-xs font-medium">
          {[
            { id: 'all', label: 'All Stories', count: articles.length },
            { id: 'published', label: 'Published', count: articles.filter(a => a.status === 'published').length },
            { id: 'in_review', label: 'In Review', count: articles.filter(a => a.status === 'in_review').length },
            { id: 'scheduled', label: 'Scheduled', count: articles.filter(a => a.status === 'scheduled').length },
            { id: 'draft', label: 'Drafts', count: articles.filter(a => a.status === 'draft').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] font-mono opacity-80">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search headline, excerpt, beat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-[#0e131f] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080b12] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-4 font-semibold">Article & Beat</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Author / Byline</th>
                <th className="px-5 py-4 font-semibold">SEO Score</th>
                <th className="px-5 py-4 font-semibold">Updated</th>
                <th className="px-5 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading articles from Supabase PostgreSQL...</span>
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    No articles found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr
                    key={art.id}
                    className="hover:bg-slate-850/40 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold"
                            style={{
                              backgroundColor: `${art.primary_category?.color || '#2563EB'}20`,
                              color: art.primary_category?.color || '#3b82f6',
                            }}
                          >
                            {art.primary_category?.name || 'General'}
                          </span>
                          {art.visibility === 'members_only' && (
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Members
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/admin/articles/${art.id}/edit`}
                          className="font-semibold text-slate-100 group-hover:text-rose-400 transition-colors block text-sm line-clamp-1"
                        >
                          {art.title}
                        </Link>
                        {art.excerpt && (
                          <p className="text-slate-400 text-xs line-clamp-1">{art.excerpt}</p>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      {getStatusBadge(art.status)}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {art.authors[0]?.avatar_url && (
                          <img
                            src={art.authors[0].avatar_url}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        )}
                        <span className="font-medium text-slate-200">
                          {art.authors[0]?.display_name || 'Editorial Desk'}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-emerald-400">
                          {art.seo?.score || 85}
                        </div>
                        <span className="text-[10px] text-slate-400">/ 100</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      {formatDate(art.updated_at)}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/articles/${art.id}/edit`}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Open Block Editor"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        {art.status === 'published' && (
                          <Link
                            href={`/article/${art.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View Public Article"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(art.id, art.title)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
