'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  Share2,
  Bookmark,
  ChevronRight,
  MessageSquare,
  Lock,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Film,
  Volume2,
  ExternalLink,
  Mail,
  Check
} from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { siteConfig } from '@/lib/config';
import { Article } from '@/types/newsroom';
import { formatDate } from '@/lib/utils';

export default function PublicArticlePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [comments, setComments] = useState<{ author: string; text: string; date: string }[]>([
    {
      author: 'Vikram Joshi',
      text: 'Remarkable depth on the semiconductor supply chain and capex outlays. Essential reading.',
      date: '2 hours ago'
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      try {
        const [art, arts] = await Promise.all([
          newsroomService.getArticleBySlugAsync(slug),
          newsroomService.getArticlesAsync({ status: 'published' })
        ]);
        setArticle(art || null);
        setAllArticles(arts);
      } catch (err) {
        console.error('Failed to load article:', err);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-32 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium">Loading investigative story from live database...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-rose-500">
          <ArrowLeft className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white font-headline">Story Not Found</h1>
        <p className="text-sm text-slate-400">
          The requested article may have been archived, rescheduled, or the link may be inaccurate.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
          >
            <span>Return to Frontpage</span>
          </Link>
        </div>
      </div>
    );
  }

  const primaryAuthor = article.authors[0] || {
    display_name: 'Staff Investigative Team',
    designation: 'Editorial Desk',
    bio: 'Covering global economics and policy.'
  };

  const relatedArticles = allArticles.filter(a => a.id !== article.id).slice(0, 3);

  // Generate JSON-LD Structured Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': article.seo?.schema_type || 'NewsArticle',
    headline: article.title,
    description: article.excerpt || article.seo?.meta_description,
    image: [article.featured_image?.url],
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at,
    author: article.authors.map(a => ({
      '@type': 'Person',
      name: a.display_name,
      url: `${siteConfig.url}/author/${a.id}`
    })),
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`
      }
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([...comments, { author: 'Reader Member', text: newComment, date: 'Just now' }]);
    setNewComment('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 font-sans">
      {/* Inject JSON-LD Rich Snippet for Google News SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
        <Link href="/" className="hover:text-rose-400">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link
          href={`/${article.primary_category?.slug || 'news'}`}
          className="hover:text-rose-400 text-rose-400 font-semibold"
        >
          {article.primary_category?.name || 'National'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="truncate max-w-[200px] text-slate-400">{article.title}</span>
      </div>

      {/* Article Header */}
      <header className="space-y-4">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wide">
          {article.primary_category?.name || 'Exclusive Report'}
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-headline leading-tight tracking-tight">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-lg sm:text-xl text-slate-300 font-editorial leading-relaxed">
            {article.subtitle}
          </p>
        )}

        {/* Byline & Metadata Bar */}
        <div className="pt-4 border-t border-b border-slate-800/80 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {primaryAuthor.avatar_url && (
              <img
                src={primaryAuthor.avatar_url}
                alt={primaryAuthor.display_name}
                className="w-10 h-10 rounded-full object-cover border border-rose-500/40"
              />
            )}
            <div>
              <div className="text-xs font-bold text-slate-200">{primaryAuthor.display_name}</div>
              <div className="text-[11px] text-slate-400">{primaryAuthor.designation}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span>{formatDate(article.published_at || article.created_at)}</span>
            <span>•</span>
            <span>{article.reading_time_mins} min read</span>
            <span>•</span>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isBookmarked ? 'bg-rose-600 border-rose-500 text-white' : 'border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Bookmark story"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Featured Media Hero */}
      {article.featured_image && (
        <div className="space-y-2">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
            <img
              src={article.featured_image.url}
              alt={article.featured_image.alt_text}
              className="w-full h-full object-cover"
            />
          </div>
          {article.featured_image.caption && (
            <p className="text-xs text-slate-400 italic px-1 flex items-center justify-between">
              <span>{article.featured_image.caption}</span>
              {article.featured_image.credit && (
                <span className="font-mono text-[10px] text-slate-400">
                  Photo: {article.featured_image.credit}
                </span>
              )}
            </p>
          )}
        </div>
      )}

      {/* Story Body Blocks with Full 15+ Block Renderer */}
      <article className="space-y-6 text-slate-200 font-editorial text-base sm:text-lg leading-relaxed">
        {article.content_blocks.map((block, idx) => {
          if (block.type === 'paragraph') {
            return (
              <p
                key={block.id}
                className={block.settings?.dropcap || idx === 0 ? 'editorial-dropcap text-slate-200' : 'text-slate-300'}
              >
                {block.content.text}
              </p>
            );
          }
          if (block.type === 'heading') {
            const LevelTag = block.settings?.level === 1 ? 'h1' : block.settings?.level === 3 ? 'h3' : block.settings?.level === 4 ? 'h4' : 'h2';
            return (
              <LevelTag
                key={block.id}
                className="text-2xl font-bold font-headline text-white pt-4 pb-1 border-b border-slate-800"
              >
                {block.content.text}
              </LevelTag>
            );
          }
          if (block.type === 'pullquote') {
            return (
              <div
                key={block.id}
                className="my-6 p-6 rounded-2xl bg-slate-900/90 border-l-4 border-rose-500 space-y-2 font-headline italic text-lg sm:text-xl text-slate-100 shadow-lg"
              >
                <p>"{block.content.text}"</p>
                {block.content.author && (
                  <div className="text-xs not-italic font-mono text-rose-400 font-semibold pt-1">
                    — {block.content.author} {block.content.title ? `(${block.content.title})` : ''}
                  </div>
                )}
              </div>
            );
          }
          if (block.type === 'quote') {
            return (
              <blockquote
                key={block.id}
                className="my-4 pl-4 border-l-2 border-slate-600 italic text-slate-300 text-sm"
              >
                <p>"{block.content.text}"</p>
                {block.content.author && (
                  <cite className="block text-xs font-mono text-slate-400 not-italic mt-1">— {block.content.author}</cite>
                )}
              </blockquote>
            );
          }
          if (block.type === 'image') {
            return (
              <div key={block.id} className="my-6 space-y-2">
                <div className="rounded-xl overflow-hidden border border-slate-800 max-h-96">
                  <img src={block.content.url} alt="" className="w-full h-full object-cover" />
                </div>
                {block.content.caption && (
                  <p className="text-xs text-slate-400 italic">{block.content.caption}</p>
                )}
              </div>
            );
          }
          if (block.type === 'list') {
            return block.content.listType === 'ordered' ? (
              <ol key={block.id} className="my-4 list-decimal pl-6 space-y-1.5 text-sm text-slate-300">
                {(block.content.items || []).map((it: string, i: number) => (
                  <li key={i}>{it}</li>
                ))}
              </ol>
            ) : (
              <ul key={block.id} className="my-4 list-disc pl-6 space-y-1.5 text-sm text-slate-300">
                {(block.content.items || []).map((it: string, i: number) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            );
          }
          if (block.type === 'table') {
            return (
              <div key={block.id} className="my-6 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <table className="w-full text-left text-xs text-slate-200">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 font-semibold uppercase font-mono">
                      {(block.content.headers || []).map((h: string, i: number) => (
                        <th key={i} className="p-2.5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {(block.content.rows || []).map((row: string[], rIdx: number) => (
                      <tr key={rIdx} className="hover:bg-slate-800/30">
                        {row.map((cell: string, cIdx: number) => (
                          <td key={cIdx} className="p-2.5">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          if (block.type === 'video') {
            return (
              <div key={block.id} className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                  <Film className="w-4 h-4" />
                  <span>{block.content.title || 'Video Broadcast'}</span>
                </div>
                <video src={block.content.url} controls className="w-full rounded-xl aspect-video bg-black" />
              </div>
            );
          }
          if (block.type === 'audio') {
            return (
              <div key={block.id} className="my-6 p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-800/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                  <Volume2 className="w-4 h-4" />
                  <span>{block.content.title || 'Audio Story'}</span>
                </div>
                {block.content.host && (
                  <p className="text-xs text-slate-400">Hosted by: {block.content.host}</p>
                )}
                <audio src={block.content.url} controls className="w-full" />
              </div>
            );
          }
          if (block.type === 'button') {
            return (
              <div key={block.id} className="my-6 text-center">
                <a
                  href={block.content.url}
                  target={block.content.target || '_blank'}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold tracking-wide uppercase transition-all shadow-lg"
                >
                  <span>{block.content.label || 'Read More'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          }
          if (block.type === 'advertisement') {
            return (
              <div
                key={block.id}
                className="my-8 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1"
              >
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  Sponsored Partner Content
                </span>
                <div className="p-6 rounded-lg bg-slate-950 border border-slate-800 text-sm font-bold text-slate-200">
                  Global Energy Transition Summit 2026 • Registration Now Open
                </div>
              </div>
            );
          }
          if (block.type === 'newsletter_signup') {
            return (
              <div
                key={block.id}
                className="my-8 p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-500/30 text-center space-y-3"
              >
                <h4 className="text-lg font-bold font-headline text-white">
                  {block.content.heading || 'Get the Morning Newsroom Intelligence'}
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  {block.content.description || 'Receive our daily quantitative intelligence in your inbox.'}
                </p>
                <div className="flex max-w-sm mx-auto gap-2">
                  <input
                    type="email"
                    placeholder="Enter work email..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
                  />
                  <button className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold">
                    Subscribe
                  </button>
                </div>
              </div>
            );
          }
          if (block.type === 'custom_html') {
            return (
              <div
                key={block.id}
                className="my-6"
                dangerouslySetInnerHTML={{ __html: block.content.htmlCode || '' }}
              />
            );
          }
          return null;
        })}

        {/* Paywall Gate if Premium */}
        {article.visibility === 'paywall_premium' && (
          <div className="my-10 p-8 rounded-3xl bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-950 border border-rose-500/40 text-center space-y-4 shadow-2xl">
            <Lock className="w-8 h-8 mx-auto text-rose-400" />
            <h3 className="text-2xl font-bold font-headline text-white">
              Unlock Full Investigative Access
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              This report is part of AMG Newsroom Premium Intelligence. Support independent journalism and read uninterrupted.
            </p>
            <Link
              href="/account"
              className="inline-block px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-950/50 transition-all"
            >
              Get Premium Access for $9/mo
            </Link>
          </div>
        )}
      </article>

      {/* Author Bio Card */}
      <div className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-xl">
        {primaryAuthor.avatar_url && (
          <img
            src={primaryAuthor.avatar_url}
            alt=""
            className="w-16 h-16 rounded-full object-cover border-2 border-rose-500"
          />
        )}
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-sm font-bold text-slate-100">{primaryAuthor.display_name}</div>
          <div className="text-xs text-rose-400 font-medium">{primaryAuthor.designation}</div>
          {primaryAuthor.bio && (
            <p className="text-xs text-slate-300 leading-relaxed font-editorial pt-1">
              {primaryAuthor.bio}
            </p>
          )}
        </div>
      </div>

      {/* Related Stories Rail */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <h3 className="text-lg font-bold font-headline text-white">Related Investigative Intelligence</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedArticles.map((rel) => (
            <Link
              key={rel.id}
              href={`/article/${rel.slug}`}
              className="p-4 rounded-xl bg-[#0e131f] border border-slate-800 hover:border-slate-700 transition-all space-y-2 group"
            >
              <span className="text-[10px] font-mono uppercase text-rose-400 font-bold">
                {rel.primary_category?.name}
              </span>
              <h4 className="text-xs font-bold text-slate-100 group-hover:text-rose-400 transition-colors font-headline line-clamp-2">
                {rel.title}
              </h4>
            </Link>
          ))}
        </div>
      </div>

      {/* Reader Comments Section */}
      <section className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-headline text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-rose-500" />
            <span>Reader Discussion ({comments.length})</span>
          </h3>
        </div>

        {/* Existing Comments */}
        <div className="space-y-3">
          {comments.map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">{c.author}</span>
                <span className="text-[10px] font-mono text-slate-400">{c.date}</span>
              </div>
              <p className="text-slate-300">{c.text}</p>
            </div>
          ))}
        </div>

        {/* Post Comment */}
        <form onSubmit={handleAddComment} className="p-4 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-3">
          <label className="text-xs font-semibold text-slate-300">Join the Conversation</label>
          <textarea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your analytical perspective on this report..."
            className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 resize-none"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-all"
          >
            Submit Comment
          </button>
        </form>
      </section>
    </div>
  );
}
