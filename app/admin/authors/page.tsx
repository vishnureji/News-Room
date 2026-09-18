'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Mail, Globe, ExternalLink, Share2, RefreshCw } from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { AuthorProfile } from '@/types/newsroom';

export default function AuthorsAdminPage() {
  const [authors, setAuthors] = useState<AuthorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAuthors = async () => {
    setLoading(true);
    try {
      const live = await newsroomService.getAuthorsAsync();
      setAuthors(live);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-headline flex items-center gap-3">
            Authors & Editorial Staff
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Supabase Live DB
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Author profiles, bylines, social syndication links, and automated Person Schema generators.
          </p>
        </div>

        <button
          onClick={loadAuthors}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Refresh authors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Loading staff profiles from Supabase...</span>
        </div>
      ) : authors.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-[#0e131f] rounded-2xl border border-slate-800">
          No authors found in database.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((auth) => (
            <div
              key={auth.id}
              className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {auth.avatar_url ? (
                    <img
                      src={auth.avatar_url}
                      alt={auth.display_name}
                      className="w-12 h-12 rounded-full object-cover border border-rose-500/40"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center font-bold text-white text-sm border border-rose-500/40">
                      {auth.display_name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
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
                  {auth.role || 'Staff'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
