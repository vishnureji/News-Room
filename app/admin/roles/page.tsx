'use client';

import React from 'react';
import { ShieldCheck, Check, Lock, Users } from 'lucide-react';

export default function RolesRBACPage() {
  const roles = [
    {
      name: 'Super Admin',
      users: 1,
      desc: 'Complete platform configuration, billing, security, and schema authority',
      perms: ['All Permissions Granted']
    },
    {
      name: 'Editor-in-Chief',
      users: 1,
      desc: 'Final publishing approval, homepage curation, assignment dispatch, and SEO authority',
      perms: ['articles:publish', 'articles:edit_any', 'editorial:override', 'homepage:curate', 'media:manage']
    },
    {
      name: 'Senior Reporter',
      users: 4,
      desc: 'Article drafting, block authoring, photo attachments, submit for review',
      perms: ['articles:create', 'articles:edit_own', 'media:upload', 'assignments:accept']
    },
    {
      name: 'SEO Manager',
      users: 2,
      desc: 'Sitemap maintenance, keyword auditing, redirect rule orchestration, schema optimization',
      perms: ['seo:audit', 'redirects:manage', 'sitemaps:generate', 'articles:edit_seo']
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
            Roles & Granular RBAC Permissions
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Server-side enforced permission matrix and staff access boundaries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((r, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-500" />
                  <span>{r.name}</span>
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {r.users} active staff
                </span>
              </div>
              <p className="text-xs text-slate-400">{r.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Granted Capabilities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {r.perms.map((p, pIdx) => (
                  <span
                    key={pIdx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400"
                  >
                    ✓ {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
