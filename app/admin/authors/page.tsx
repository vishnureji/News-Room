'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Mail, Globe, ExternalLink, Share2 } from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { AuthorProfile } from '@/types/newsroom';

export default function AuthorsAdminPage() {
  const [authors, setAuthors] = useState<AuthorProfile[]>([]);

  useEffect(() => {
    setAuthors(newsroomService.getAuthors());
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
            Authors & Editorial Staff
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Author profiles, bio blurbs, social syndication links, and automated Person Schema generators.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((auth) => (
          <div
            key={auth.id}
            className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4 shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={auth.avatar_url}
                  alt={auth.display_name}
                  className="w-12 h-12 rounded-full object-cover border border-rose-500/40"
                />
                <div>
                  <h2 className="text-base font-bold text-slate-100">{auth.display_name}</h2>
                  <span className="text-xs text-rose-400 font-medium">{auth.designation}</span>
                </div>
              </div>
              {auth.bio && <p className="text-xs text-slate-300 leading-relaxed">{auth.bio}</p>}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{auth.email}</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                {auth.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
