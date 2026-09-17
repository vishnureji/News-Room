'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Plus,
  Send,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  TrendingUp,
  FileText,
  Trash2,
  Eye,
  Check,
  X,
  Calendar,
  Layers,
  ExternalLink
} from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { NewsletterCampaign, Article } from '@/types/newsroom';

export default function NewslettersAdminPage() {
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [previewCampaign, setPreviewCampaign] = useState<NewsletterCampaign | null>(null);

  // New Campaign Form State
  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [recipientList, setRecipientList] = useState('All Executive Subscribers (42,800)');
  const [contentHtml, setContentHtml] = useState('');
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const reloadCampaigns = () => {
    setCampaigns(newsroomService.getNewsletterCampaigns());
    setArticles(newsroomService.getArticles({ status: 'published' }));
  };

  useEffect(() => {
    reloadCampaigns();
  }, []);

  const handleAutoCurate = () => {
    const latest = articles.slice(0, 3);
    const htmlSnippet = latest
      .map(
        (art, i) => `
<div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #334155;">
  <span style="font-size: 10px; font-family: monospace; color: #f43f5e; text-transform: uppercase; font-weight: bold;">
    ${art.primary_category?.name || 'Investigation'}
  </span>
  <h3 style="font-size: 18px; color: #ffffff; margin: 6px 0;">${art.title}</h3>
  <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6;">${art.excerpt || ''}</p>
  <a href="https://newsroom.live/article/${art.slug}" style="font-size: 12px; color: #f43f5e; text-decoration: none; font-weight: bold;">
    Read Full Investigation →
  </a>
</div>`
      )
      .join('');

    setContentHtml(htmlSnippet);
    setSelectedArticleIds(latest.map((a) => a.id));
    if (!subject) setSubject(`The Morning Dispatch: ${latest[0]?.title.slice(0, 50)}...`);
    if (!previewText) setPreviewText(latest[0]?.excerpt?.slice(0, 100) || 'Today’s curated newsroom briefing...');
  };

  const handleCreateSubmit = (e: React.FormEvent, isSendNow: boolean = false) => {
    e.preventDefault();
    if (!subject.trim()) return;

    const newCamp = newsroomService.createNewsletterCampaign({
      subject,
      preview_text: previewText || subject,
      recipient_list: recipientList,
      content_html: contentHtml || '<p>Daily Newsroom Briefing content...</p>',
      article_ids: selectedArticleIds,
      status: isSendNow ? 'sent' : 'scheduled',
      sent_at: isSendNow ? new Date().toISOString() : undefined,
      scheduled_for: isSendNow ? undefined : '2026-09-18T06:00:00Z',
      recipients_count: recipientList.includes('42,800') ? 42800 : 18500,
      open_rate: isSendNow ? 49.5 : undefined,
      click_rate: isSendNow ? 15.2 : undefined
    });

    setSubject('');
    setPreviewText('');
    setContentHtml('');
    setSelectedArticleIds([]);
    setIsComposing(false);
    setStatusMessage(
      isSendNow
        ? `Campaign "${newCamp.subject}" broadcasted to ${newCamp.recipients_count.toLocaleString()} subscribers.`
        : `Campaign "${newCamp.subject}" scheduled for dispatch.`
    );
    setTimeout(() => setStatusMessage(null), 4000);
    reloadCampaigns();
  };

  const handleSendImmediately = (id: string) => {
    newsroomService.sendNewsletterCampaign(id);
    setStatusMessage('Campaign dispatched to queue.');
    setTimeout(() => setStatusMessage(null), 3000);
    reloadCampaigns();
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Delete this newsletter campaign?')) {
      newsroomService.deleteNewsletterCampaign(id);
      reloadCampaigns();
    }
  };

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      {/* Toast */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs font-semibold shadow-2xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
              Editorial Newsletters & Dispatches
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
              42,800 Active Subscribers
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated morning briefings, sector digest campaigns, subscriber segmentation and open-rate telemetry.
          </p>
        </div>

        <button
          onClick={() => setIsComposing(!isComposing)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/50 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Compose Newsletter</span>
        </button>
      </div>

      {/* Newsletter KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Subscriber Reach</span>
            <Users className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-xl font-bold text-white font-mono">42,800</p>
          <span className="text-[10px] text-emerald-400 font-semibold">+14.2% MoM growth</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Open Rate</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-emerald-400 font-mono">49.8%</p>
          <span className="text-[10px] text-slate-400">Industry avg: 24.2%</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Click-to-Open (CTR)</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl font-bold text-blue-400 font-mono">15.4%</p>
          <span className="text-[10px] text-slate-400">High engagement</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Deliverability</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-bold text-white font-mono">99.4%</p>
          <span className="text-[10px] text-purple-400 font-semibold">SPF / DKIM verified</span>
        </div>
      </div>

      {/* Composer Drawer Modal */}
      {isComposing && (
        <form
          onSubmit={(e) => handleCreateSubmit(e, false)}
          className="p-6 rounded-2xl bg-[#0e131f] border border-rose-500/40 space-y-5 shadow-2xl animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-rose-400" />
              <span>Compose Executive Intelligence Dispatch</span>
            </h2>
            <button
              type="button"
              onClick={handleAutoCurate}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-600/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Curate Latest Stories</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Subject Line</label>
              <input
                type="text"
                required
                placeholder="e.g. Morning Intelligence: $120B Infrastructure Stimulus"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Audience Segment</label>
              <select
                value={recipientList}
                onChange={(e) => setRecipientList(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              >
                <option value="All Executive Subscribers (42,800)">All Executive Subscribers (42,800)</option>
                <option value="Technology & AI Segment (18,500)">Technology & AI Segment (18,500)</option>
                <option value="Macro & Policy Analysts (12,400)">Macro & Policy Analysts (12,400)</option>
                <option value="Founding Pro Members (2,840)">Founding Pro Members (2,840)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-300">Preheader Preview Text</label>
              <input
                type="text"
                placeholder="Short teaser snippet displayed in inbox notification..."
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-300">Newsletter HTML / Body Content</label>
            <textarea
              rows={6}
              value={contentHtml}
              onChange={(e) => setContentHtml(e.target.value)}
              placeholder="Paste HTML or click '1-Click Curate Latest Stories' to auto-generate newsletter..."
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500 font-mono text-[11px]"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsComposing(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
            >
              Cancel
            </button>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700"
              >
                Schedule for 06:00 AM
              </button>
              <button
                type="button"
                onClick={(e) => handleCreateSubmit(e, true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-500 shadow-lg shadow-rose-950/50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Broadcast Now</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Campaigns List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Campaign Broadcast History & Scheduled Dispatches
        </h2>

        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase ${
                    camp.status === 'sent'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : camp.status === 'scheduled'
                      ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {camp.status}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {camp.recipient_list}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-headline">{camp.subject}</h3>
              <p className="text-xs text-slate-400 font-editorial line-clamp-1">{camp.preview_text}</p>
            </div>

            {/* Performance Analytics on the Right */}
            <div className="flex items-center gap-6 text-xs border-t md:border-t-0 pt-3 md:pt-0 border-slate-800 shrink-0">
              <div className="text-center">
                <div className="font-mono font-bold text-white">
                  {camp.recipients_count.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400">Recipients</div>
              </div>

              <div className="text-center">
                <div className="font-mono font-bold text-emerald-400">
                  {camp.open_rate ? `${camp.open_rate}%` : '—'}
                </div>
                <div className="text-[10px] text-slate-400">Open Rate</div>
              </div>

              <div className="text-center">
                <div className="font-mono font-bold text-rose-400">
                  {camp.click_rate ? `${camp.click_rate}%` : '—'}
                </div>
                <div className="text-[10px] text-slate-400">CTR</div>
              </div>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                {camp.status === 'scheduled' && (
                  <button
                    onClick={() => handleSendImmediately(camp.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition-all"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send Now</span>
                  </button>
                )}
                <button
                  onClick={() => handleDeleteCampaign(camp.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                  title="Delete campaign"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
