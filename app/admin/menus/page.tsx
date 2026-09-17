'use client';

import React from 'react';
import { Sliders, Plus, ExternalLink } from 'lucide-react';

export default function MenusAdminPage() {
  const menus = [
    {
      name: 'Main Public Navigation Bar',
      items: [
        { label: 'Economy & Business', link: '/business' },
        { label: 'Technology & AI', link: '/tech' },
        { label: 'National', link: '/national' },
        { label: 'World Affairs', link: '/world' },
        { label: 'Opinion & Analysis', link: '/opinion' }
      ]
    },
    {
      name: 'Footer Legal & Utility Navigation',
      items: [
        { label: 'About Newsroom', link: '/about' },
        { label: 'Editorial Code of Ethics', link: '/ethics' },
        { label: 'Careers & Fellows', link: '/careers' },
        { label: 'Privacy Policy', link: '/privacy' },
        { label: 'RSS Intelligence Feed', link: '/feed.xml' }
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
            Menus & Navigation Links
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure header bars, category links, mobile drawers and footer clusters.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {menus.map((menu, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-slate-200">{menu.name}</h2>
            <div className="divide-y divide-slate-800/60">
              {menu.items.map((it, iIdx) => (
                <div key={iIdx} className="py-2.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{it.label}</span>
                  <span className="font-mono text-slate-400">{it.link}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
