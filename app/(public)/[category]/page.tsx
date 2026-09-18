'use client';

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Clock } from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { Article, Category } from '@/types/newsroom';
import { formatDate } from '@/lib/utils';

export default function CategoryArchivePage() {
  const params = useParams();
  const catSlug = (params?.category as string) || '';

  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!catSlug) return;
    async function loadCategory() {
      setLoading(true);
      try {
        const [cats, arts] = await Promise.all([
          newsroomService.getCategoriesAsync(),
          newsroomService.getArticlesAsync({ status: 'published' })
        ]);
        const foundCat = cats.find(c => c.slug === catSlug);
        setCategory(foundCat || null);
        setArticles(arts.filter(a => a.primary_category?.slug === catSlug || (foundCat && a.primary_category_id === foundCat.id)));
      } catch (e) {
        console.error('Error loading category:', e);
      } finally {
        setLoading(false);
      }
    }
    loadCategory();
  }, [catSlug]);

  if (!catSlug) return null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Category Header */}
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/" className="hover:text-rose-400">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-rose-400 uppercase font-semibold">{category?.name || catSlug}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-headline">
          {category?.name || catSlug.toUpperCase()}
        </h1>
        {category?.description && (
          <p className="text-sm text-slate-400 max-w-2xl">{category.description}</p>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-slate-400 text-sm">
            No published stories in this vertical yet. Check back soon for fresh reporting.
          </div>
        ) : (
          articles.map((art) => (
            <div
              key={art.id}
              className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {art.featured_image && (
                  <Link href={`/article/${art.slug}`} className="block aspect-[16/10] rounded-xl overflow-hidden bg-slate-950">
                    <img
                      src={art.featured_image.url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                )}

                <Link href={`/article/${art.slug}`}>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-rose-400 transition-colors font-headline line-clamp-2">
                    {art.title}
                  </h3>
                </Link>

                {art.excerpt && (
                  <p className="text-xs text-slate-300 font-editorial line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>By {art.authors[0]?.display_name}</span>
                <span>{art.reading_time_mins} min read</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
