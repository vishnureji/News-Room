'use client';

import React, { useState, useEffect } from 'react';
import { Tags, Plus, Hash } from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { Tag } from '@/types/newsroom';

export default function TagsAdminPage() {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    setTags(newsroomService.getTags());
  }, []);

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
            Tags & Editorial Topics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Maintain indexable subject tags for cross-article syndication.
          </p>
        </div>
      </div>

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
    </div>
  );
}
