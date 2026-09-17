'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { Article } from '@/types/newsroom';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);

  useEffect(() => {
    const list = newsroomService.getArticles({ status: 'published' });
    setAllArticles(list);
    setResults(list);
  }, []);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults(allArticles);
      return;
    }
    const lower = q.toLowerCase();
    const filtered = allArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(lower) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(lower)) ||
        (a.primary_category?.name && a.primary_category.name.toLowerCase().includes(lower))
    );
    setResults(filtered);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-bold text-white font-headline">Search Newsroom Archives</h1>
        <p className="text-xs text-slate-400">
          Search investigative reporting, sector analyses, and macroeconomic archives.
        </p>

        <div className="relative max-w-xl mx-auto pt-2">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Type search terms e.g. Budget, Semiconductors, Energy..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-xl"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="text-xs font-mono text-slate-400">
          Showing {results.length} result(s) {query ? `for "${query}"` : ''}
        </div>

        <div className="divide-y divide-slate-800 bg-[#0e131f] border border-slate-800 rounded-2xl overflow-hidden">
          {results.map((art) => (
            <div key={art.id} className="p-5 hover:bg-slate-800/30 transition-colors space-y-1 group">
              <span className="text-[10px] font-mono uppercase text-rose-400 font-bold">
                {art.primary_category?.name}
              </span>
              <Link href={`/article/${art.slug}`}>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-rose-400 transition-colors font-headline">
                  {art.title}
                </h3>
              </Link>
              {art.excerpt && (
                <p className="text-xs text-slate-400 line-clamp-2">{art.excerpt}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
