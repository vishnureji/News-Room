'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  MoveUp,
  MoveDown,
  Plus,
  Trash2,
  Check,
  LayoutGrid,
  Sparkles,
  Eye,
  Sliders,
  Tv,
  MessageSquare,
  Mail,
  Megaphone,
  Radio,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { HomepageSection, Category } from '@/types/newsroom';

export default function HomepageBuilderPage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    setSections(newsroomService.getHomepageSections());
    setCategories(newsroomService.getCategories());
  }, []);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const copy = [...sections];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIndex, 0, moved);
    const reordered = copy.map((sec, idx) => ({ ...sec, display_order: idx + 1 }));
    setSections(reordered);
    newsroomService.saveHomepageSections(reordered);
  };

  const handleAddSection = (layoutType: HomepageSection['layout'] = 'three_column_grid') => {
    const layoutNames: Record<HomepageSection['layout'], string> = {
      hero_plus_two: 'Lead Investigation & Featured Rail',
      trending_strip: 'Real-Time Market & Editorial Pulse',
      three_column_grid: 'Curated 3-Column Story Triad',
      magazine_split: 'Magazine Split (Feature + 4 Headlines)',
      four_column_cards: '4-Column Editorial Quadrant',
      video_showcase: '4K Video & Audio Multimedia Showcase',
      carousel: 'Opinion & Columnist Carousel',
      newsletter_cta: 'Intelligence Briefing Newsletter Unit',
      sponsor_leaderboard: 'Sponsor Leaderboard Billboard'
    };

    const newSec: HomepageSection = {
      id: `sec-${Date.now()}`,
      title: layoutNames[layoutType] || 'Curated Section',
      subtitle: 'Editorial package covering major developments.',
      layout: layoutType,
      display_order: sections.length + 1,
      show_ads: layoutType !== 'newsletter_cta' && layoutType !== 'trending_strip'
    };
    const updated = [...sections, newSec];
    setSections(updated);
    newsroomService.saveHomepageSections(updated);
  };

  const handleDeleteSection = (id: string) => {
    const updated = sections
      .filter((s) => s.id !== id)
      .map((sec, idx) => ({ ...sec, display_order: idx + 1 }));
    setSections(updated);
    newsroomService.saveHomepageSections(updated);
  };

  const handleUpdateSection = (id: string, updates: Partial<HomepageSection>) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setSections(updated);
    newsroomService.saveHomepageSections(updated);
  };

  const handleSave = () => {
    newsroomService.saveHomepageSections(sections);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const getLayoutIcon = (layout: HomepageSection['layout']) => {
    switch (layout) {
      case 'hero_plus_two':
        return <LayoutGrid className="w-4 h-4 text-rose-400" />;
      case 'trending_strip':
        return <Radio className="w-4 h-4 text-emerald-400" />;
      case 'three_column_grid':
        return <Layers className="w-4 h-4 text-blue-400" />;
      case 'magazine_split':
        return <Sliders className="w-4 h-4 text-purple-400" />;
      case 'video_showcase':
        return <Tv className="w-4 h-4 text-amber-400" />;
      case 'carousel':
        return <MessageSquare className="w-4 h-4 text-cyan-400" />;
      case 'newsletter_cta':
        return <Mail className="w-4 h-4 text-rose-400" />;
      case 'sponsor_leaderboard':
        return <Megaphone className="w-4 h-4 text-yellow-400" />;
      default:
        return <LayoutGrid className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
              Homepage Layout Builder & Curator
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Live Edge Sync
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Reorder, configure and curate dynamic layout modules for the public reader homepage in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold"
          >
            <span>Live Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/50 transition-all"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
            <span>{isSaved ? 'Layout Published!' : 'Publish Layout'}</span>
          </button>
        </div>
      </div>

      {/* Quick Add Palette */}
      <div className="p-4 rounded-2xl bg-[#0e131f] border border-slate-800/90 space-y-2.5">
        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
          Add New Section Module
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleAddSection('hero_plus_two')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs border border-slate-800 transition-colors"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-rose-400" />
            <span>+ Hero + 2 Rail</span>
          </button>
          <button
            onClick={() => handleAddSection('trending_strip')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs border border-slate-800 transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Trending Pulse</span>
          </button>
          <button
            onClick={() => handleAddSection('three_column_grid')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs border border-slate-800 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>+ 3-Column Grid</span>
          </button>
          <button
            onClick={() => handleAddSection('magazine_split')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs border border-slate-800 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>+ Magazine Split</span>
          </button>
          <button
            onClick={() => handleAddSection('video_showcase')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs border border-slate-800 transition-colors"
          >
            <Tv className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Multimedia Showcase</span>
          </button>
          <button
            onClick={() => handleAddSection('carousel')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs border border-slate-800 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>+ Opinion Carousel</span>
          </button>
          <button
            onClick={() => handleAddSection('newsletter_cta')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs border border-slate-800 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-rose-400" />
            <span>+ Newsletter Unit</span>
          </button>
        </div>
      </div>

      {/* Sections Configurator List */}
      <div className="space-y-3.5">
        {sections.map((sec, index) => (
          <div
            key={sec.id}
            className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800/90 hover:border-slate-700 transition-all shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Order badge + Title + Layout icon */}
              <div className="flex items-center gap-3 flex-1">
                <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-rose-400 flex-shrink-0">
                  #{sec.display_order}
                </span>

                <div className="flex items-center gap-2">
                  {getLayoutIcon(sec.layout)}
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => handleUpdateSection(sec.id, { title: e.target.value })}
                    className="text-sm font-bold text-white bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800 focus:border-rose-500 focus:outline-none w-full sm:w-80"
                  />
                </div>
              </div>

              {/* Order Controls & Delete */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 border border-slate-800"
                  title="Move section up"
                >
                  <MoveUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === sections.length - 1}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 border border-slate-800"
                  title="Move section down"
                >
                  <MoveDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSection(sec.id)}
                  className="p-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-500/20 ml-1.5"
                  title="Remove section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Subtitle and Module Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-800/60 text-xs">
              <div className="sm:col-span-5 space-y-1">
                <label className="text-[11px] text-slate-400 font-semibold">Section Subtitle / Tagline</label>
                <input
                  type="text"
                  placeholder="Optional section description..."
                  value={sec.subtitle || ''}
                  onChange={(e) => handleUpdateSection(sec.id, { subtitle: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-[11px] text-slate-400 font-semibold">Layout Architecture</label>
                <select
                  value={sec.layout}
                  onChange={(e) => handleUpdateSection(sec.id, { layout: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500 font-mono text-[11px]"
                >
                  <option value="hero_plus_two">Hero + 2 Rail</option>
                  <option value="trending_strip">Trending Pulse</option>
                  <option value="three_column_grid">3-Column Grid</option>
                  <option value="magazine_split">Magazine Split</option>
                  <option value="four_column_cards">4-Column Cards</option>
                  <option value="video_showcase">Video & Multimedia</option>
                  <option value="carousel">Opinion Carousel</option>
                  <option value="newsletter_cta">Newsletter Unit</option>
                  <option value="sponsor_leaderboard">Sponsor Billboard</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] text-slate-400 font-semibold">Category Filter</label>
                <select
                  value={sec.category_id || ''}
                  onChange={(e) =>
                    handleUpdateSection(sec.id, { category_id: e.target.value || undefined })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500 font-mono text-[11px]"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                  <input
                    type="checkbox"
                    checked={sec.show_ads !== false}
                    onChange={(e) => handleUpdateSection(sec.id, { show_ads: e.target.checked })}
                    className="rounded accent-rose-600 cursor-pointer"
                  />
                  <span>Show Ad Slot</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
