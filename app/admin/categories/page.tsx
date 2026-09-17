'use client';

import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit, Trash2 } from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { Category } from '@/types/newsroom';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(newsroomService.getCategories());
  }, []);

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
            Categories & Beat Taxonomies
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure primary verticals, navigation tags, and beat metadata.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: cat.color || '#E53E3E' }}
                />
                <h2 className="text-base font-bold text-slate-100">{cat.name}</h2>
              </div>
              <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                /{cat.slug}
              </span>
            </div>
            {cat.description && (
              <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
