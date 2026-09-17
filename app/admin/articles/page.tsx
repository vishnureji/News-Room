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
  ArrowUpDown
} from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { Article, ArticleStatus } from '@/types/newsroom';
import { formatDate } from '@/lib/utils';

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setArticles(newsroomService.getArticles());
  }, []);

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
          <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
            Articles & Editorial Desk
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage, review, verify SEO and publish journalistic pieces across all beats.
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/50 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Article</span>
        </Link>
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
            placeholder="Search headline, tag, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-[#0e131f] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Headline & Category</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Author</th>
                <th className="px-5 py-3.5">SEO Score</th>
                <th className="px-5 py-3.5">Updated</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    No articles found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-5 py-4 max-w-md">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            {art.primary_category?.name || 'General'}
                          </span>
                          {art.visibility === 'paywall_premium' && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                              PREMIUM
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/admin/articles/${art.id}/edit`}
                          className="font-bold text-slate-100 hover:text-rose-400 transition-colors text-sm line-clamp-2"
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
                          {art.authors[0]?.display_name || 'Staff Editor'}
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
