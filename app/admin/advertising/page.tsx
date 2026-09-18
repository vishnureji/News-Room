'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Plus,
  CheckCircle2,
  TrendingUp,
  Eye,
  MousePointer,
  DollarSign,
  Layers,
  Trash2,
  ExternalLink,
  Edit2,
  Sliders,
  Check,
  X,
  Globe,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { AdSlot } from '@/types/newsroom';

export default function AdvertisingPage() {
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [monetizationStats, setMonetizationStats] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // New Ad Slot Form State
  const [name, setName] = useState('');
  const [advertiserName, setAdvertiserName] = useState('');
  const [slotType, setSlotType] = useState<AdSlot['slot_type']>('header');
  const [adType, setAdType] = useState<AdSlot['ad_type']>('custom_banner');
  const [imageUrl, setImageUrl] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [cpmRate, setCpmRate] = useState('20.00');
  const [categoryTarget, setCategoryTarget] = useState('');

  const reloadAds = () => {
    setAdSlots(newsroomService.getAdSlots());
    setMonetizationStats(newsroomService.getMonetizationOverview());
  };

  useEffect(() => {
    reloadAds();
  }, []);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    newsroomService.createAdSlot({
      name,
      advertiser_name: advertiserName || 'Direct Sponsor',
      slot_type: slotType,
      ad_type: adType,
      image_url: imageUrl || '',
      destination_url: destinationUrl || '',
      cpm_rate: parseFloat(cpmRate) || 20,
      category_target: categoryTarget || undefined,
      is_active: true
    });

    setName('');
    setAdvertiserName('');
    setImageUrl('');
    setDestinationUrl('');
    setCpmRate('20.00');
    setCategoryTarget('');
    setIsCreating(false);
    reloadAds();
  };

  const handleToggleActive = (id: string, current: boolean) => {
    newsroomService.updateAdSlot(id, { is_active: !current });
    reloadAds();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this advertising placement?')) {
      newsroomService.deleteAdSlot(id);
      reloadAds();
    }
  };

  const totalRevenue = adSlots.reduce(
    (acc, slot) => acc + (slot.impressions / 1000) * (slot.cpm_rate || 20),
    0
  );
  const totalImpressions = adSlots.reduce((acc, slot) => acc + slot.impressions, 0);
  const totalClicks = adSlots.reduce((acc, slot) => acc + slot.clicks, 0);
  const averageCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
              Advertising & Direct Sponsorship Desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span>Direct + Programmatic Inventory</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage high-yield header leaderboards, in-article sponsor units, sidebar billboards & impression telemetry.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/50 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Ad Placement</span>
        </button>
      </div>

      {/* Monetization Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ad Revenue Run Rate</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-white font-mono">
            ${Math.round(totalRevenue).toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-400 font-semibold">+18.4% vs last month</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Delivered Impressions</span>
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl font-bold text-white font-mono">
            {totalImpressions.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">Across {adSlots.length} active units</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Clicks & Actions</span>
            <MousePointer className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-bold text-white font-mono">
            {totalClicks.toLocaleString()}
          </p>
          <span className="text-[10px] text-purple-400 font-semibold font-mono">
            Avg CTR: {averageCTR}%
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Direct Sponsors</span>
            <Megaphone className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-white font-mono">
            {adSlots.filter((s) => s.is_active).length}
          </p>
          <span className="text-[10px] text-amber-400 font-semibold">100% fill rate</span>
        </div>
      </div>

      {/* New Placement Drawer Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-6 rounded-2xl bg-[#0e131f] border border-rose-500/40 space-y-4 shadow-2xl animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-rose-400" />
              <span>Create Ad Inventory Placement</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Direct CPM & Programmatic</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Campaign / Slot Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Header Leaderboard Summit"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Advertiser / Brand Name</label>
              <input
                type="text"
                placeholder="e.g. Global Tech Forum 2026"
                value={advertiserName}
                onChange={(e) => setAdvertiserName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Placement Slot Location</label>
              <select
                value={slotType}
                onChange={(e) => setSlotType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              >
                <option value="header">Header Leaderboard (728x90 / 970x250)</option>
                <option value="in_article">Mid-Article Inline Sponsorship (600x250)</option>
                <option value="sidebar">Sidebar Skyscraper (300x600)</option>
                <option value="between_articles">Between Homepage Sections</option>
                <option value="sticky_bottom">Sticky Bottom Footer Billboard</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Creative Banner Image URL</label>
              <input
                type="url"
                placeholder="https://your-domain.com/ad-banner.webp"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Target Destination URL</label>
              <input
                type="url"
                placeholder="https://advertiser.com/landing-page"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Negotiated CPM Rate ($)</label>
              <input
                type="number"
                step="0.5"
                placeholder="20.00"
                value={cpmRate}
                onChange={(e) => setCpmRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-500 shadow-lg shadow-rose-950/50"
            >
              Save & Activate Placement
            </button>
          </div>
        </form>
      )}

      {/* Ad Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adSlots.map((slot) => {
          const slotRevenue = (slot.impressions / 1000) * (slot.cpm_rate || 20);
          const slotCTR =
            slot.impressions > 0 ? ((slot.clicks / slot.impressions) * 100).toFixed(2) : '0.00';

          return (
            <div
              key={slot.id}
              className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold uppercase">
                      {slot.slot_type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      CPM: ${slot.cpm_rate || 20}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleActive(slot.id, slot.is_active)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                      slot.is_active
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{slot.is_active ? 'Active' : 'Paused'}</span>
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{slot.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sponsor: <span className="text-slate-200 font-semibold">{slot.advertiser_name || 'Direct Brand'}</span>
                  </p>
                </div>

                {slot.image_url && (
                  <div className="aspect-[3/1] rounded-xl overflow-hidden border border-slate-700 bg-slate-950 relative group">
                    <img src={slot.image_url} alt="" className="w-full h-full object-cover" />
                    <a
                      href={slot.destination_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 text-xs font-bold text-white transition-opacity"
                    >
                      <span>Preview Click Destination</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Stats Footer */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="font-mono font-bold text-white">
                      {slot.impressions.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">Impressions</div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="font-mono font-bold text-emerald-400">
                      {slot.clicks.toLocaleString()} ({slotCTR}%)
                    </div>
                    <div className="text-[10px] text-slate-400">Clicks / CTR</div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="font-mono font-bold text-rose-400">
                      ${Math.round(slotRevenue).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">Est. Yield</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] font-mono text-slate-500 truncate max-w-[260px]">
                    {slot.destination_url}
                  </span>
                  <button
                    onClick={() => handleDelete(slot.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove Placement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
