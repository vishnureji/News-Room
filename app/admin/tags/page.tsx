'use client';

import React, { useState, useEffect } from 'react';
import { Tags, Plus, Hash, RefreshCw } from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { Tag } from '@/types/newsroom';

export default function TagsAdminPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [tagName, setTagName] = useState('');
  const [tagSlug, setTagSlug] = useState('');

  const loadTags = async () => {
    setLoading(true);
    try {
      const live = await newsroomService.getTagsAsync();
      setTags(live);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    const slug = tagSlug.trim() || tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = newsroomService.saveTag({
      name: tagName.trim(),
      slug
    });

    setTags((prev) => [...prev, created]);
    setShowAdd(false);
    setTagName('');
    setTagSlug('');
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-headline flex items-center gap-3">
            Tags & Editorial Topics
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Supabase Live DB
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Maintain indexable subject tags for cross-article syndication in PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadTags}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh tags"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/50 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Topic Tag</span>
          </button>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleCreateTag} className="p-4 bg-[#0e131f] border border-slate-800 rounded-2xl flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Tag Name (e.g. Geopolitics)"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white flex-1 min-w-[180px] focus:outline-none focus:border-rose-500"
            required
          />
          <input
            type="text"
            placeholder="Slug (optional)"
            value={tagSlug}
            onChange={(e) => setTagSlug(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white flex-1 min-w-[140px] focus:outline-none focus:border-rose-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
          >
            Save Tag
          </button>
          <button
            type="button"
            onClick={() => setShowAdd(false)}
            className="px-3 py-2 text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </button>
        </form>
      )}

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Loading tags from Supabase...</span>
        </div>
      ) : tags.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-[#0e131f] rounded-2xl border border-slate-800">
          No tags found. Click &quot;Add Topic Tag&quot; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="p-4 rounded-xl bg-[#0e131f] border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-semibold text-slate-200">{tag.name}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">/{tag.slug}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
