'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { newsroomService } from '@/lib/services/newsroom-service';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewArticleInitiator() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('cat-1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = newsroomService.getCategories();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const id = `art-${Date.now()}`;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const selectedCategory = categories.find(c => c.id === categoryId);

    newsroomService.saveArticle({
      id,
      slug,
      title,
      primary_category_id: categoryId,
      primary_category: selectedCategory,
      status: 'draft',
      content_blocks: [
        {
          id: `blk-${Date.now()}`,
          type: 'paragraph',
          content: { text: '' }
        }
      ]
    });

    router.push(`/admin/articles/${id}/edit`);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-6">
      <Link
        href="/admin/articles"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Articles Desk</span>
      </Link>

      <div className="p-8 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-6 shadow-2xl">
        <div>
          <h1 className="text-xl font-bold text-white font-headline">Initiate New Article Draft</h1>
          <p className="text-xs text-slate-400 mt-1">
            Provide the working headline and primary beat. You can compose blocks and configure SEO next.
          </p>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Working Headline</label>
            <input
              type="text"
              required
              placeholder="e.g. Central Bank Signals Easing Cycle Amid Moderating Core Inflation..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Primary Beat / Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-rose-500 transition-colors"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold tracking-wide uppercase shadow-lg shadow-rose-950/50 transition-all"
          >
            {isSubmitting ? 'Opening Canvas...' : 'Create Draft & Launch Editor'}
          </button>
        </form>
      </div>
    </div>
  );
}
