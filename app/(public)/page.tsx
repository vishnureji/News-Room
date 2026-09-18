'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Share2,
  Sparkles,
  ChevronRight,
  Megaphone,
  Radio,
  Play,
  Music,
  Tv,
  MessageSquare,
  Mail,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { Article, AdSlot, HomepageSection } from '@/types/newsroom';
import { formatDate } from '@/lib/utils';

export default function PublicHomepage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribedToast, setSubscribedToast] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [arts, cats] = await Promise.all([
          newsroomService.getArticlesAsync({ status: 'published' }),
          newsroomService.getCategoriesAsync()
        ]);
        setArticles(arts);
        setAdSlots(newsroomService.getAdSlots());
        setSections(newsroomService.getHomepageSections());
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribedToast(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribedToast(false), 3500);
  };

  const getFilteredArticles = (section: HomepageSection) => {
    if (section.category_id) {
      const filtered = articles.filter((a) => a.primary_category_id === section.category_id);
      return filtered.length > 0 ? filtered : articles;
    }
    return articles;
  };

  const topAd = adSlots.find((s) => s.slot_type === 'header' && s.is_active);
  const inFeedAd = adSlots.find((s) => s.slot_type === 'between_articles' && s.is_active);

  if (loading) {
    return (
      <div className="space-y-12 pb-16 animate-pulse">
        {/* Skeleton Top Bar */}
        <div className="h-24 rounded-2xl bg-slate-900/60 border border-slate-800/60" />
        {/* Skeleton Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <div className="aspect-[16/9] rounded-2xl bg-slate-900/80 border border-slate-800/80" />
            <div className="h-6 w-1/3 bg-slate-800 rounded" />
            <div className="h-8 w-4/5 bg-slate-800 rounded" />
            <div className="h-16 w-full bg-slate-900 rounded" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-6 w-1/2 bg-slate-800 rounded" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-900/60 rounded-xl border border-slate-800/50" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16">
      {/* Toast */}
      {subscribedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-950/95 border border-emerald-500/40 text-emerald-200 text-xs font-semibold shadow-2xl animate-in fade-in">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>You have been subscribed to the Daily Intelligence Briefing!</span>
        </div>
      )}

      {/* Top Header Leaderboard Ad */}
      {topAd && topAd.image_url && (
        <div className="p-3 bg-[#0b0f19] rounded-2xl border border-slate-800/80 text-center space-y-1 max-w-5xl mx-auto shadow-sm">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
            Sponsored Partner Message
          </span>
          <a
            href={topAd.destination_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl overflow-hidden border border-slate-700/60 max-h-32 group"
          >
            <img
              src={topAd.image_url}
              alt={topAd.name}
              className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
            />
          </a>
        </div>
      )}

      {/* DYNAMIC HOMEPAGE SECTIONS RENDERER */}
      {sections.map((sec) => {
        const secArticles = getFilteredArticles(sec);
        const lead = secArticles[0] || articles[0];
        const secondary = secArticles.slice(1, 4);

        if (sec.layout === 'hero_plus_two' && lead) {
          return (
            <section key={sec.id} className="space-y-6 pt-2">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Lead Story (8 Cols) */}
                <div className="lg:col-span-8 space-y-4 group">
                  <Link
                    href={`/article/${lead.slug}`}
                    className="block relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl"
                  >
                    {lead.featured_image && (
                      <img
                        src={lead.featured_image.url}
                        alt={lead.featured_image.alt_text}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{
                          objectPosition: `${lead.featured_image.focal_x || 50}% ${
                            lead.featured_image.focal_y || 50
                          }%`
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent opacity-90" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-rose-600 text-white shadow-lg">
                        {lead.primary_category?.name || 'Lead Investigation'}
                      </span>
                    </div>
                  </Link>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span>{lead.authors[0]?.display_name}</span>
                      <span>•</span>
                      <span>{formatDate(lead.published_at)}</span>
                      <span>•</span>
                      <span>{lead.reading_time_mins} min read</span>
                    </div>

                    <Link href={`/article/${lead.slug}`}>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-headline leading-tight hover:text-rose-400 transition-colors">
                        {lead.title}
                      </h1>
                    </Link>

                    {lead.excerpt && (
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-editorial">
                        {lead.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                {/* Secondary Stories Rail (4 Cols) */}
                <div className="lg:col-span-4 space-y-6 border-t lg:border-t-0 lg:border-l border-slate-800/80 lg:pl-8">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{sec.title}</span>
                    </h2>
                  </div>

                  <div className="divide-y divide-slate-800/80 space-y-4">
                    {secondary.map((story) => (
                      <div key={story.id} className="pt-4 first:pt-0 space-y-2 group">
                        <span className="text-[10px] font-mono uppercase font-semibold text-rose-400">
                          {story.primary_category?.name}
                        </span>
                        <Link href={`/article/${story.slug}`}>
                          <h3 className="text-base font-bold text-slate-100 group-hover:text-rose-400 transition-colors font-headline line-clamp-2">
                            {story.title}
                          </h3>
                        </Link>
                        {story.excerpt && (
                          <p className="text-xs text-slate-400 line-clamp-2 font-editorial">
                            {story.excerpt}
                          </p>
                        )}
                        <div className="text-[11px] text-slate-400 font-mono">
                          {formatDate(story.published_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        }

        if (sec.layout === 'trending_strip') {
          return (
            <section
              key={sec.id}
              className="p-4 rounded-2xl bg-[#0e131f] border border-slate-800 flex items-center gap-4 overflow-hidden shadow-md"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider whitespace-nowrap border-r border-slate-800 pr-4">
                <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>Real-Time Pulse:</span>
              </div>
              <div className="flex items-center gap-8 overflow-x-auto scrollbar-none text-xs text-slate-300">
                {articles.map((item) => (
                  <Link
                    key={item.id}
                    href={`/article/${item.slug}`}
                    className="flex items-center gap-2 whitespace-nowrap hover:text-white group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span className="font-semibold group-hover:underline">{item.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ({formatDate(item.published_at)})
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        }

        if (sec.layout === 'three_column_grid') {
          return (
            <section key={sec.id} className="space-y-6 pt-6 border-t border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-headline">
                    {sec.title}
                  </h2>
                  {sec.subtitle && (
                    <p className="text-xs text-slate-400 mt-0.5">{sec.subtitle}</p>
                  )}
                </div>
                <Link
                  href="/business"
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Explore Beat</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {secArticles.slice(0, 3).map((art) => (
                  <div
                    key={art.id}
                    className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group shadow-lg"
                  >
                    <div className="space-y-3">
                      {art.featured_image && (
                        <Link
                          href={`/article/${art.slug}`}
                          className="block aspect-[16/10] rounded-xl overflow-hidden bg-slate-950"
                        >
                          <img
                            src={art.featured_image.url}
                            alt={art.featured_image.alt_text}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            style={{
                              objectPosition: `${art.featured_image.focal_x || 50}% ${
                                art.featured_image.focal_y || 50
                              }%`
                            }}
                          />
                        </Link>
                      )}

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold uppercase">
                        {art.primary_category?.name || 'Analysis'}
                      </span>

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
                ))}
              </div>
            </section>
          );
        }

        if (sec.layout === 'magazine_split' && (secArticles[0] || articles[0])) {
          const featured = secArticles[0] || articles[0];
          const sidebarItems = secArticles.slice(1, 5);

          return (
            <section key={sec.id} className="space-y-6 pt-6 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-headline">
                    {sec.title}
                  </h2>
                  {sec.subtitle && (
                    <p className="text-xs text-slate-400 mt-0.5">{sec.subtitle}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Big Magazine Feature (7 Cols) */}
                <div className="lg:col-span-7 rounded-2xl bg-[#0e131f] border border-slate-800 overflow-hidden shadow-xl group">
                  {featured.featured_image && (
                    <Link href={`/article/${featured.slug}`} className="block aspect-video overflow-hidden">
                      <img
                        src={featured.featured_image.url}
                        alt={featured.featured_image.alt_text || featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{
                          objectPosition: `${featured.featured_image.focal_x || 50}% ${
                            featured.featured_image.focal_y || 50
                          }%`
                        }}
                      />
                    </Link>
                  )}
                  <div className="p-6 space-y-3">
                    <span className="text-xs font-mono font-bold text-purple-400 uppercase">
                      Featured Longform
                    </span>
                    <Link href={`/article/${featured.slug}`}>
                      <h3 className="text-xl sm:text-2xl font-bold text-white font-headline group-hover:text-purple-300 transition-colors">
                        {featured.title}
                      </h3>
                    </Link>
                    {featured.excerpt && (
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-editorial">
                        {featured.excerpt}
                      </p>
                    )}
                    <div className="pt-2 text-[11px] text-slate-400 font-mono">
                      By {featured.authors[0]?.display_name || 'Editorial Desk'} • {featured.reading_time_mins || 3} min read
                    </div>
                  </div>
                </div>

                {/* Compact Headlines with Numbers (5 Cols) */}
                <div className="lg:col-span-5 space-y-3">
                  {sidebarItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-[#0e131f] border border-slate-800 hover:border-slate-700 transition-all flex items-start gap-4 group"
                    >
                      <span className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-headline font-bold text-sm text-purple-400 flex-shrink-0">
                        0{idx + 1}
                      </span>
                      <div className="space-y-1 flex-1">
                        <Link href={`/article/${item.slug}`}>
                          <h4 className="text-sm font-bold text-slate-200 group-hover:text-purple-300 transition-colors line-clamp-2">
                            {item.title}
                          </h4>
                        </Link>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {item.primary_category?.name || 'Investigation'} • {formatDate(item.published_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (sec.layout === 'video_showcase') {
          const leadStory = secArticles[0] || articles[0];
          return (
            <section
              key={sec.id}
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#120a1e] via-[#0b0f19] to-slate-950 border border-purple-500/30 space-y-6 shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                    <Tv className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white font-headline">{sec.title}</h2>
                    <p className="text-xs text-purple-300/80">{sec.subtitle}</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 self-start sm:self-auto flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
                  <span>Broadcast Studio & Podcasts</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Video Card */}
                <div className="rounded-2xl bg-black/50 border border-slate-800 p-4 space-y-3 flex flex-col justify-between">
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-950 relative group flex items-center justify-center">
                    {leadStory?.featured_image ? (
                      <img
                        src={leadStory.featured_image.url}
                        alt={leadStory.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <Play className="w-12 h-12 text-purple-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white flex items-center justify-center shadow-xl shadow-purple-950/80 transition-all cursor-pointer">
                        <Play className="w-6 h-6 ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 text-[10px] font-mono font-bold text-white border border-white/10">
                      LIVE BRIEFING
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-purple-400">
                      Editorial Video Briefing
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">
                      {leadStory ? leadStory.title : 'Macro Policy & Global Semiconductor Dispatches'}
                    </h4>
                  </div>
                </div>

                {/* Podcast Card */}
                <div className="rounded-2xl bg-black/50 border border-slate-800 p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                      <Music className="w-4 h-4" />
                      <span>The Daily Dispatch Podcast</span>
                    </div>
                    <h4 className="text-base font-bold text-white font-headline">
                      Executive Intelligence Audio Edition: Weekly Macro & Technology Analysis
                    </h4>
                    <p className="text-xs text-slate-300 font-editorial">
                      Join our senior investigative correspondents as they break down sovereign fiscal strategies, high-compute datacenters, and emerging semiconductor supply chains.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                        <Play className="w-4 h-4 ml-0.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">Listen to Latest Episode</span>
                        <span className="text-[10px] text-slate-400 font-mono">18 mins • High-Bitrate Audio</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-purple-400 font-semibold">Available on Web & Feed</span>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        if (sec.layout === 'carousel') {
          return (
            <section key={sec.id} className="space-y-6 pt-6 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-headline">
                    {sec.title}
                  </h2>
                  {sec.subtitle && (
                    <p className="text-xs text-slate-400 mt-0.5">{sec.subtitle}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {secArticles.map((art) => (
                  <div
                    key={art.id}
                    className="p-5 rounded-2xl bg-gradient-to-b from-[#0e131f] to-slate-950 border border-slate-800/90 hover:border-slate-700 transition-all space-y-3.5 shadow-lg group"
                  >
                    <div className="flex items-center gap-3">
                      {art.authors[0]?.avatar_url && (
                        <img
                          src={art.authors[0].avatar_url}
                          alt={art.authors[0].display_name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                      )}
                      <div>
                        <p className="text-xs font-bold text-white">{art.authors[0]?.display_name}</p>
                        <p className="text-[10px] text-slate-400">{art.authors[0]?.designation || 'Contributing Fellow'}</p>
                      </div>
                    </div>

                    <Link href={`/article/${art.slug}`}>
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors font-headline line-clamp-2">
                        &ldquo;{art.title}&rdquo;
                      </h3>
                    </Link>

                    {art.excerpt && (
                      <p className="text-xs text-slate-300 font-editorial line-clamp-3 italic">
                        {art.excerpt}
                      </p>
                    )}

                    <div className="pt-2 text-[10px] font-mono text-cyan-400">
                      Editorial Perspective • {formatDate(art.published_at)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sec.layout === 'newsletter_cta') {
          return (
            <section
              key={sec.id}
              className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-rose-950/40 via-red-950/30 to-slate-900 border border-rose-500/30 shadow-2xl"
            >
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                  Daily Intelligence Briefing
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-headline">
                  {sec.title}
                </h2>
                <p className="text-sm text-slate-300 font-editorial">
                  {sec.subtitle ||
                    'Join 40,000+ senior executives, policymakers, and tech leaders receiving our curated analysis every morning.'}
                </p>
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2"
                >
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your corporate email address..."
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-950/50 transition-all"
                  >
                    Subscribe Free
                  </button>
                </form>
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
