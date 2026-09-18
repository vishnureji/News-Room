'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Send,
  CheckCircle,
  Eye,
  Sparkles,
  Search,
  MessageSquare,
  History,
  Image as ImageIcon,
  Heading as HeadingIcon,
  Type,
  Quote,
  List as ListIcon,
  Film,
  Megaphone,
  Trash2,
  MoveUp,
  MoveDown,
  Plus,
  AlertCircle,
  Clock,
  Share2,
  Check,
  Languages,
  Layers,
  ChevronDown,
  Table as TableIcon,
  Link as LinkIcon,
  Volume2,
  Maximize2,
  Smartphone,
  Tablet,
  Monitor,
  X,
  RotateCcw,
  Tag as TagIcon,
  MapPin,
  Bookmark,
  FileCode,
  LayoutGrid,
  Percent,
  Compass,
  Mail
} from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { Article, EditorBlock, BlockType, ArticleStatus, VisibilityType, ArticleRevision } from '@/types/newsroom';
import { calculateReadingTime } from '@/lib/utils';

export default function ArticleEditorPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [activeSidePanel, setActiveSidePanel] = useState<'seo' | 'ai' | 'comments' | 'revisions' | 'links'>('seo');
  const [saveStatus, setSaveStatus] = useState<string>('Saved');
  const [commentInput, setCommentInput] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedRevisionForDiff, setSelectedRevisionForDiff] = useState<ArticleRevision | null>(null);

  const categories = newsroomService.getCategories();
  const tags = newsroomService.getTags();
  const mediaList = newsroomService.getMediaAssets();
  const adSlots = newsroomService.getAdSlots();
  const allArticles = newsroomService.getArticles();

  useEffect(() => {
    async function init() {
      let loaded = newsroomService.getArticleById(articleId);
      if (!loaded) {
        const dbArt = await newsroomService.getArticleBySlugAsync(articleId);
        if (dbArt) loaded = dbArt;
      }
      if (loaded) {
        setArticle({ ...loaded });
        if (loaded.revisions && loaded.revisions.length > 0) {
          setSelectedRevisionForDiff(loaded.revisions[0]);
        }
      } else {
        const freshDraft = newsroomService.saveArticle({
          id: articleId,
          title: 'New Editorial Article Draft',
          status: 'draft',
          content_blocks: [
            { id: 'b1', type: 'paragraph', content: { text: 'Start writing your news piece here...' } }
          ]
        });
        setArticle(freshDraft);
      }
    }
    init();
  }, [articleId]);

  if (!article) {
    return <div className="p-12 text-center text-slate-400">Loading editor canvas...</div>;
  }

  const handleUpdateField = (field: keyof Article, value: any) => {
    setArticle((prev) => {
      if (!prev) return null;
      const updated = { ...prev, [field]: value };
      
      // Auto-recalculate reading time if blocks changed
      if (field === 'content_blocks') {
        updated.reading_time_mins = calculateReadingTime(value);
      }

      setSaveStatus('Saving...');
      setTimeout(() => {
        newsroomService.saveArticle(updated, false);
        setSaveStatus('Saved');
      }, 400);
      return updated;
    });
  };

  const handleManualSave = () => {
    if (!article) return;
    setSaveStatus('Saving Revision...');
    const saved = newsroomService.saveArticle(article, true);
    setArticle({ ...saved });
    setSaveStatus('Revision Saved');
    setTimeout(() => setSaveStatus('Saved'), 1500);
  };

  const handleAddBlock = (type: BlockType) => {
    let initialContent: Record<string, any> = { text: '' };
    let initialSettings: Record<string, any> = {};

    if (type === 'heading') {
      initialContent = { text: 'Section Heading' };
      initialSettings = { level: 2 };
    } else if (type === 'pullquote') {
      initialContent = { text: 'Notable statement quote from source', author: 'Key Official', title: 'Ministry of Finance' };
    } else if (type === 'quote') {
      initialContent = { text: 'Direct attributed statement', author: 'Source Name' };
    } else if (type === 'image') {
      initialContent = {
        url: mediaList[0]?.url || '',
        caption: '',
        alt: 'Editorial photograph',
        credit: 'Staff Photo Desk'
      };
      initialSettings = { align: 'center' };
    } else if (type === 'gallery') {
      initialContent = {
        images: [
          { url: mediaList[0]?.url || '', caption: '' },
          { url: mediaList[1]?.url || '', caption: '' }
        ],
        layout: 'grid'
      };
    } else if (type === 'video') {
      initialContent = {
        url: '',
        title: 'Video Report: Key Insights',
        caption: 'Special broadcast coverage',
        duration: '00:00'
      };
    } else if (type === 'audio') {
      initialContent = {
        url: '',
        title: 'Newsroom Audio Dispatch',
        host: 'Editorial Desk',
        duration: '00:00'
      };
    } else if (type === 'list') {
      initialContent = {
        listType: 'bullet',
        items: ['Key analytical point', 'Critical economic indicator', 'Policy and regulatory impact']
      };
    } else if (type === 'table') {
      initialContent = {
        headers: ['Indicator', 'Target Metric', 'Growth / Delta'],
        rows: [
          ['Primary Metric', '—', '—'],
          ['Secondary Metric', '—', '—']
        ]
      };
    } else if (type === 'button') {
      initialContent = { label: 'Explore Story Dataset', url: '#', target: '_blank', variant: 'primary' };
    } else if (type === 'divider') {
      initialContent = { style: 'ornament' };
    } else if (type === 'embed') {
      initialContent = { embedType: 'youtube', embedUrl: '', caption: 'Broadcast stream / embed' };
    } else if (type === 'advertisement') {
      initialContent = { adSlotId: adSlots[0]?.id || 'ad-slot-1', customSlotName: 'In-Article Inline Responsive' };
    } else if (type === 'related_articles') {
      initialContent = { articleIds: allArticles.slice(0, 2).map(a => a.id) };
    } else if (type === 'newsletter_signup') {
      initialContent = { heading: 'Subscribe to Morning Intelligence', description: 'Get our unredacted daily quantitative economic dossier.' };
    } else if (type === 'custom_html') {
      initialContent = { htmlCode: '<div class="p-4 bg-slate-900 border border-slate-700 text-center text-xs text-rose-400 font-mono">Custom Interactive Data Widget</div>' };
    }

    const newBlock: EditorBlock = {
      id: `blk-${Date.now()}`,
      type,
      content: initialContent,
      settings: initialSettings
    };

    const updatedBlocks = [...article.content_blocks, newBlock];
    handleUpdateField('content_blocks', updatedBlocks);
  };

  const handleUpdateBlockContent = (blockId: string, contentUpdates: Record<string, any>) => {
    const updatedBlocks = article.content_blocks.map((b) =>
      b.id === blockId ? { ...b, content: { ...b.content, ...contentUpdates } } : b
    );
    handleUpdateField('content_blocks', updatedBlocks);
  };

  const handleUpdateBlockSettings = (blockId: string, settingsUpdates: Record<string, any>) => {
    const updatedBlocks = article.content_blocks.map((b) =>
      b.id === blockId ? { ...b, settings: { ...b.settings, ...settingsUpdates } } : b
    );
    handleUpdateField('content_blocks', updatedBlocks);
  };

  const handleDeleteBlock = (blockId: string) => {
    const updatedBlocks = article.content_blocks.filter((b) => b.id !== blockId);
    handleUpdateField('content_blocks', updatedBlocks);
  };

  const handleDuplicateBlock = (blockId: string) => {
    const blockIdx = article.content_blocks.findIndex(b => b.id === blockId);
    if (blockIdx < 0) return;
    const original = article.content_blocks[blockIdx];
    const duplicated: EditorBlock = {
      ...original,
      id: `blk-${Date.now()}`,
      content: JSON.parse(JSON.stringify(original.content))
    };
    const blocks = [...article.content_blocks];
    blocks.splice(blockIdx + 1, 0, duplicated);
    handleUpdateField('content_blocks', blocks);
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= article.content_blocks.length) return;
    const blocks = [...article.content_blocks];
    const [moved] = blocks.splice(index, 1);
    blocks.splice(newIndex, 0, moved);
    handleUpdateField('content_blocks', blocks);
  };

  const handleStatusChange = (newStatus: ArticleStatus) => {
    handleUpdateField('status', newStatus);
    if (newStatus === 'published' && !article.published_at) {
      handleUpdateField('published_at', new Date().toISOString());
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    newsroomService.addComment(article.id, commentInput);
    setCommentInput('');
    setArticle({ ...newsroomService.getArticleById(article.id)! });
  };

  const handleTriggerAI = (task: 'headlines' | 'seo' | 'excerpt') => {
    setAiGenerating(true);
    setTimeout(() => {
      if (task === 'headlines') {
        setAiSuggestions(newsroomService.generateAIHeadlines(article.title, article.primary_category?.name || ''));
      } else if (task === 'excerpt') {
        const genExcerpt = newsroomService.generateAIExcerpt(article.title);
        handleUpdateField('excerpt', genExcerpt);
      } else if (task === 'seo') {
        const seoData = newsroomService.generateAISEO(article.title, article.excerpt || '');
        handleUpdateField('seo', {
          ...article.seo,
          meta_title: seoData.title,
          meta_description: seoData.description,
          score: 95
        });
      }
      setAiGenerating(false);
    }, 600);
  };

  const handleRestoreRevision = (revisionId: string) => {
    if (!confirm('Are you sure you want to restore this historical revision? Current canvas will be overwritten with the revision state.')) return;
    const restored = newsroomService.restoreRevision(article.id, revisionId);
    if (restored) {
      setArticle({ ...restored });
      alert('Revision successfully restored to canvas.');
    }
  };

  const internalLinks = newsroomService.getInternalLinkingSuggestions(article.title);

  return (
    <div className="space-y-6 pb-24 font-sans">
      {/* Top Fixed Newsroom Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e131f] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {saveStatus}
              </span>
              <span className="text-xs font-semibold text-slate-400 capitalize">
                Workflow: <strong className="text-rose-400">{article.status.replace('_', ' ')}</strong>
              </span>
            </div>
            <h1 className="text-sm font-bold text-slate-200 truncate max-w-md mt-0.5">
              {article.title || 'Untitled Draft'}
            </h1>
          </div>
        </div>

        {/* Workflow & Publish Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Dropdown */}
          <select
            value={article.status}
            onChange={(e) => handleStatusChange(e.target.value as ArticleStatus)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="draft">Draft (Authoring)</option>
            <option value="in_review">Submit for Review</option>
            <option value="changes_requested">Request Changes</option>
            <option value="approved">Approve Story</option>
            <option value="scheduled">Schedule Publishing</option>
            <option value="published">Publish Live</option>
            <option value="archived">Archive</option>
          </select>

          {/* Visibility Dropdown */}
          <select
            value={article.visibility}
            onChange={(e) => handleUpdateField('visibility', e.target.value as VisibilityType)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none"
          >
            <option value="public">Public (Open)</option>
            <option value="paywall_premium">Paywall (Premium Subscribers)</option>
            <option value="members_only">Members Only (Registered)</option>
          </select>

          {/* Device Preview Modal Trigger */}
          <button
            type="button"
            onClick={() => setPreviewModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Responsive Preview</span>
          </button>

          {/* Manual Save Revision Trigger */}
          <button
            type="button"
            onClick={handleManualSave}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Revision</span>
          </button>

          {/* Direct Publish / Update */}
          <button
            onClick={() => handleStatusChange('published')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/50 transition-all"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{article.status === 'published' ? 'Update Live' : 'Publish Story'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout (Editor + Side Tool Panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Canvas & Block Editor (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Article Fields & Metadata Card */}
          <div className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4">
            {/* Title Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Primary Headline
              </label>
              <textarea
                rows={2}
                value={article.title}
                onChange={(e) => handleUpdateField('title', e.target.value)}
                placeholder="Enter compelling journalistic headline..."
                className="w-full text-xl md:text-2xl font-bold font-headline bg-transparent border-0 border-b border-slate-800 focus:border-rose-500 text-slate-100 placeholder-slate-400 focus:outline-none resize-none py-1 transition-colors"
              />
            </div>

            {/* Subtitle / Deck */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Deck / Subtitle
              </label>
              <input
                type="text"
                value={article.subtitle || ''}
                onChange={(e) => handleUpdateField('subtitle', e.target.value)}
                placeholder="Secondary headline providing vital context..."
                className="w-full text-sm font-medium bg-transparent border-0 border-b border-slate-800 focus:border-rose-500 text-slate-300 placeholder-slate-400 focus:outline-none py-1 transition-colors"
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Article Lead Excerpt
                </label>
                <button
                  type="button"
                  onClick={() => handleTriggerAI('excerpt')}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI Summarize</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={article.excerpt || ''}
                onChange={(e) => handleUpdateField('excerpt', e.target.value)}
                placeholder="Concise lead summary for feed cards, newsletters, and social previews..."
                className="w-full text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            {/* Category, Location & Slug Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Primary Beat</label>
                <select
                  value={article.primary_category_id || categories[0]?.id}
                  onChange={(e) => {
                    const cat = categories.find(c => c.id === e.target.value);
                    handleUpdateField('primary_category_id', e.target.value);
                    handleUpdateField('primary_category', cat);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Dateline / Location</label>
                <input
                  type="text"
                  value={article.location || ''}
                  onChange={(e) => handleUpdateField('location', e.target.value)}
                  placeholder="e.g. New Delhi, India"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">URL Slug</label>
                <input
                  type="text"
                  value={article.slug}
                  onChange={(e) => handleUpdateField('slug', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Block Content Canvas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Article Narrative Blocks ({article.content_blocks.length})
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                ~{article.reading_time_mins} min reading time
              </span>
            </div>

            {/* Render Each Block */}
            <div className="space-y-3">
              {article.content_blocks.map((block, index) => (
                <div
                  key={block.id}
                  className="p-4 rounded-xl bg-[#0e131f] border border-slate-800 hover:border-slate-700 transition-all space-y-3 relative group shadow-md"
                >
                  {/* Block Header Toolbar */}
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {block.type.replace('_', ' ')}
                      </span>
                      {block.type === 'paragraph' && (
                        <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer ml-2">
                          <input
                            type="checkbox"
                            checked={block.settings?.dropcap || false}
                            onChange={(e) => handleUpdateBlockSettings(block.id, { dropcap: e.target.checked })}
                            className="accent-rose-500 rounded"
                          />
                          <span>Dropcap</span>
                        </label>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDuplicateBlock(block.id)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400"
                        title="Duplicate Block"
                      >
                        <Layers className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveBlock(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-400"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveBlock(index, 'down')}
                        disabled={index === article.content_blocks.length - 1}
                        className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-400"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlock(block.id)}
                        className="p-1 rounded hover:bg-red-950/60 text-red-400 transition-colors ml-2"
                        title="Delete Block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 1. Paragraph Block */}
                  {block.type === 'paragraph' && (
                    <div className="space-y-1">
                      <textarea
                        rows={4}
                        value={block.content.text || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, { text: e.target.value })}
                        placeholder="Type narrative paragraph..."
                        className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-400 focus:outline-none resize-y leading-relaxed font-editorial"
                      />
                      <div className="text-[10px] text-slate-400 font-mono text-right">
                        {(block.content.text || '').split(/\s+/).filter(Boolean).length} words • {(block.content.text || '').length} characters
                      </div>
                    </div>
                  )}

                  {/* 2. Heading Block */}
                  {block.type === 'heading' && (
                    <div className="flex items-center gap-3">
                      <select
                        value={block.settings?.level || 2}
                        onChange={(e) => handleUpdateBlockSettings(block.id, { level: Number(e.target.value) })}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
                      >
                        <option value={1}>H1</option>
                        <option value={2}>H2</option>
                        <option value={3}>H3</option>
                        <option value={4}>H4</option>
                      </select>
                      <input
                        type="text"
                        value={block.content.text || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, { text: e.target.value })}
                        placeholder="Section Heading..."
                        className="w-full bg-transparent text-lg font-bold text-slate-100 placeholder-slate-400 focus:outline-none font-headline"
                      />
                    </div>
                  )}

                  {/* 3. Pullquote Block */}
                  {block.type === 'pullquote' && (
                    <div className="space-y-2 p-3 bg-slate-900/60 rounded-lg border-l-4 border-rose-500">
                      <textarea
                        rows={2}
                        value={block.content.text || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, { text: e.target.value })}
                        placeholder="Quoted statement..."
                        className="w-full bg-transparent text-sm italic text-slate-200 placeholder-slate-400 focus:outline-none font-headline"
                      />
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                        <input
                          type="text"
                          value={block.content.author || ''}
                          onChange={(e) => handleUpdateBlockContent(block.id, { author: e.target.value })}
                          placeholder="Attributed Person..."
                          className="bg-transparent text-xs text-slate-300 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={block.content.title || ''}
                          onChange={(e) => handleUpdateBlockContent(block.id, { title: e.target.value })}
                          placeholder="Designation / Affiliation..."
                          className="bg-transparent text-xs text-slate-400 focus:outline-none text-right"
                        />
                      </div>
                    </div>
                  )}

                  {/* 4. Standard Quote Block */}
                  {block.type === 'quote' && (
                    <div className="space-y-2 p-3 bg-slate-900/60 rounded-lg border-l-4 border-slate-600">
                      <textarea
                        rows={2}
                        value={block.content.text || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, { text: e.target.value })}
                        placeholder="Quote content..."
                        className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={block.content.author || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, { author: e.target.value })}
                        placeholder="Source / Speaker..."
                        className="bg-transparent text-xs text-slate-400 focus:outline-none"
                      />
                    </div>
                  )}

                  {/* 5. Image Block */}
                  {block.type === 'image' && (
                    <div className="space-y-3">
                      {block.content.url && (
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 max-h-56">
                          <img
                            src={block.content.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={block.content.url || ''}
                          onChange={(e) => handleUpdateBlockContent(block.id, { url: e.target.value })}
                          placeholder="Image URL / R2 Key..."
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                        />
                        <input
                          type="text"
                          value={block.content.caption || ''}
                          onChange={(e) => handleUpdateBlockContent(block.id, { caption: e.target.value })}
                          placeholder="Caption text..."
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                        />
                        <input
                          type="text"
                          value={block.content.credit || ''}
                          onChange={(e) => handleUpdateBlockContent(block.id, { credit: e.target.value })}
                          placeholder="Photo Credit..."
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                        />
                      </div>
                    </div>
                  )}

                  {/* 6. List Block */}
                  {block.type === 'list' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={block.content.listType || 'bullet'}
                          onChange={(e) => handleUpdateBlockContent(block.id, { listType: e.target.value })}
                          className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
                        >
                          <option value="bullet">Bullet List</option>
                          <option value="ordered">Numbered List</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        {(block.content.items || []).map((itemText: string, itmIdx: number) => (
                          <div key={itmIdx} className="flex items-center gap-2">
                            <span className="text-xs font-mono text-slate-400">
                              {block.content.listType === 'ordered' ? `${itmIdx + 1}.` : '•'}
                            </span>
                            <input
                              type="text"
                              value={itemText}
                              onChange={(e) => {
                                const newItems = [...(block.content.items || [])];
                                newItems[itmIdx] = e.target.value;
                                handleUpdateBlockContent(block.id, { items: newItems });
                              }}
                              className="w-full px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = (block.content.items || []).filter((_: any, i: number) => i !== itmIdx);
                                handleUpdateBlockContent(block.id, { items: newItems });
                              }}
                              className="p-1 rounded text-red-400 hover:bg-slate-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = [...(block.content.items || []), 'New bullet point item'];
                            handleUpdateBlockContent(block.id, { items: newItems });
                          }}
                          className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold"
                        >
                          + Add Item
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 7. Table Block */}
                  {block.type === 'table' && (
                    <div className="space-y-3 overflow-x-auto">
                      <div className="text-xs font-semibold text-slate-300">Data Table Content</div>
                      <table className="w-full text-xs text-slate-200 border border-slate-800">
                        <thead>
                          <tr className="bg-slate-900">
                            {(block.content.headers || []).map((h: string, hIdx: number) => (
                              <th key={hIdx} className="p-2 border border-slate-800">
                                <input
                                  type="text"
                                  value={h}
                                  onChange={(e) => {
                                    const newHeaders = [...block.content.headers];
                                    newHeaders[hIdx] = e.target.value;
                                    handleUpdateBlockContent(block.id, { headers: newHeaders });
                                  }}
                                  className="bg-transparent font-bold text-slate-100 w-full focus:outline-none"
                                />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(block.content.rows || []).map((row: string[], rIdx: number) => (
                            <tr key={rIdx}>
                              {row.map((cell: string, cIdx: number) => (
                                <td key={cIdx} className="p-2 border border-slate-800">
                                  <input
                                    type="text"
                                    value={cell}
                                    onChange={(e) => {
                                      const newRows = [...block.content.rows];
                                      newRows[rIdx][cIdx] = e.target.value;
                                      handleUpdateBlockContent(block.id, { rows: newRows });
                                    }}
                                    className="bg-transparent text-slate-300 w-full focus:outline-none"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 8. Video Block */}
                  {block.type === 'video' && (
                    <div className="space-y-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2 text-xs text-rose-400 font-bold">
                        <Film className="w-4 h-4" />
                        <span>R2 Video Embed Player</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={block.content.url || ''}
                          onChange={(e) => handleUpdateBlockContent(block.id, { url: e.target.value })}
                          placeholder="Video URL (.mp4 / R2)..."
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                        />
                        <input
                          type="text"
                          value={block.content.title || ''}
                          onChange={(e) => handleUpdateBlockContent(block.id, { title: e.target.value })}
                          placeholder="Video Title..."
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                        />
                      </div>
                    </div>
                  )}

                  {/* 9. Audio Block */}
                  {block.type === 'audio' && (
                    <div className="space-y-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2 text-xs text-blue-400 font-bold">
                        <Volume2 className="w-4 h-4" />
                        <span>Audio Story / Podcast Dispatch</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={block.content.url || ''}
                          onChange={(e) => handleUpdateBlockContent(block.id, { url: e.target.value })}
                          placeholder="Audio URL (.mp3)..."
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                        />
                        <input
                          type="text"
                          value={block.content.title || ''}
                          onChange={(e) => handleUpdateBlockContent(block.id, { title: e.target.value })}
                          placeholder="Episode Title..."
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                        />
                        <input
                          type="text"
                          value={block.content.host || ''}
                          onChange={(e) => handleUpdateBlockContent(block.id, { host: e.target.value })}
                          placeholder="Byline / Hosts..."
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                        />
                      </div>
                    </div>
                  )}

                  {/* 10. Advertisement Block */}
                  {block.type === 'advertisement' && (
                    <div className="p-4 rounded-lg bg-amber-500/10 border border-dashed border-amber-500/30 text-center space-y-1">
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                        <Megaphone className="w-3.5 h-3.5" />
                        <span>Dynamic In-Article Ad Slot Unit</span>
                      </div>
                      <select
                        value={block.content.adSlotId || 'ad-slot-2'}
                        onChange={(e) => handleUpdateBlockContent(block.id, { adSlotId: e.target.value })}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 mt-2"
                      >
                        {adSlots.map((slot) => (
                          <option key={slot.id} value={slot.id}>
                            {slot.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* 11. Embed Block (YouTube, X, Maps) */}
                  {block.type === 'embed' && (
                    <div className="space-y-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2">
                        <select
                          value={block.content.embedType || 'youtube'}
                          onChange={(e) => handleUpdateBlockContent(block.id, { embedType: e.target.value })}
                          className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
                        >
                          <option value="youtube">YouTube</option>
                          <option value="x">X / Twitter</option>
                          <option value="instagram">Instagram</option>
                          <option value="google_maps">Google Maps</option>
                        </select>
                        <input
                          type="text"
                          value={block.content.embedUrl || ''}
                          onChange={(e) => handleUpdateBlockContent(block.id, { embedUrl: e.target.value })}
                          placeholder="Embed URL / Tweet link / Video ID..."
                          className="flex-1 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* 12. Button / CTA Block */}
                  {block.type === 'button' && (
                    <div className="grid grid-cols-2 gap-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                      <input
                        type="text"
                        value={block.content.label || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, { label: e.target.value })}
                        placeholder="Button Text..."
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                      />
                      <input
                        type="text"
                        value={block.content.url || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, { url: e.target.value })}
                        placeholder="Destination Link..."
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                      />
                    </div>
                  )}

                  {/* 13. Newsletter Signup Block */}
                  {block.type === 'newsletter_signup' && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-500/30 text-center space-y-2">
                      <div className="text-xs font-bold text-rose-400">Newsletter Subscription Unit</div>
                      <input
                        type="text"
                        value={block.content.heading || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, { heading: e.target.value })}
                        placeholder="Newsletter Heading..."
                        className="w-full px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-200"
                      />
                    </div>
                  )}

                  {/* 14. Custom HTML Block */}
                  {block.type === 'custom_html' && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-mono text-slate-400">Raw Embed / HTML Code:</div>
                      <textarea
                        rows={3}
                        value={block.content.htmlCode || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, { htmlCode: e.target.value })}
                        placeholder="<iframe ...> or custom snippet..."
                        className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Complete Palette of 15 Block Insert Buttons */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-dashed border-slate-700 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center">
                + Insert Block Into Canvas
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddBlock('paragraph')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <Type className="w-3.5 h-3.5 text-rose-400" />
                  <span>Paragraph</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddBlock('heading')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <HeadingIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Heading</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddBlock('pullquote')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <Quote className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pull Quote</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddBlock('image')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Media Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddBlock('list')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <ListIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Bullet List</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddBlock('table')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <TableIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Data Table</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddBlock('video')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <Film className="w-3.5 h-3.5 text-rose-500" />
                  <span>Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddBlock('audio')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Audio Dispatch</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddBlock('embed')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-orange-400" />
                  <span>Embed (YouTube/X)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddBlock('advertisement')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <Megaphone className="w-3.5 h-3.5 text-purple-400" />
                  <span>Ad Slot</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddBlock('newsletter_signup')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-rose-400" />
                  <span>Newsletter Unit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddBlock('custom_html')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <FileCode className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Custom HTML</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Utilities Tabs (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Side Utility Tabs */}
          <div className="grid grid-cols-5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-center">
            <button
              onClick={() => setActiveSidePanel('seo')}
              className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeSidePanel === 'seo' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="SEO Audit"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SEO</span>
            </button>

            <button
              onClick={() => setActiveSidePanel('ai')}
              className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeSidePanel === 'ai' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="AI Co-Pilot"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI</span>
            </button>

            <button
              onClick={() => setActiveSidePanel('comments')}
              className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeSidePanel === 'comments' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Desk Notes"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Notes</span>
            </button>

            <button
              onClick={() => setActiveSidePanel('revisions')}
              className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeSidePanel === 'revisions' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Version Diff"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Diff</span>
            </button>

            <button
              onClick={() => setActiveSidePanel('links')}
              className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeSidePanel === 'links' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Internal Links"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Links</span>
            </button>
          </div>

          {/* Panel 1: Editorial SEO Score & Meta */}
          {activeSidePanel === 'seo' && (
            <div className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Editorial SEO Score
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    {article.seo?.score || 94}
                  </span>
                  <span className="text-[10px] text-slate-400">/ 100</span>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Meta Title & Focus Keyword configured</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>NewsArticle Schema JSON-LD ready</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>OpenGraph & Twitter cards active</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Featured image focal crop optimized</span>
                </div>
              </div>

              {/* Meta Inputs */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">SEO Meta Title</label>
                  <input
                    type="text"
                    value={article.seo?.meta_title || article.title}
                    onChange={(e) =>
                      handleUpdateField('seo', { ...article.seo, meta_title: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Focus Keyword</label>
                  <input
                    type="text"
                    value={article.seo?.focus_keyword || ''}
                    onChange={(e) =>
                      handleUpdateField('seo', { ...article.seo, focus_keyword: e.target.value })
                    }
                    placeholder="e.g. Union Budget 2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Meta Description</label>
                  <textarea
                    rows={3}
                    value={article.seo?.meta_description || article.excerpt || ''}
                    onChange={(e) =>
                      handleUpdateField('seo', { ...article.seo, meta_description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Panel 2: AI Co-Pilot Assistant */}
          {activeSidePanel === 'ai' && (
            <div className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    AI Newsroom Co-Pilot
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400">
                  Ready
                </span>
              </div>

              {/* AI Trigger Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleTriggerAI('headlines')}
                  disabled={aiGenerating}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 text-left flex items-center justify-between transition-colors"
                >
                  <span>Generate Headline Variations</span>
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerAI('seo')}
                  disabled={aiGenerating}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 text-left flex items-center justify-between transition-colors"
                >
                  <span>Auto-Optimize SEO Metadata</span>
                  <Search className="w-3.5 h-3.5 text-blue-400" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerAI('excerpt')}
                  disabled={aiGenerating}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 text-left flex items-center justify-between transition-colors"
                >
                  <span>Summarize Lead Excerpt</span>
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>

              {/* AI Generated Suggestions Box */}
              {aiSuggestions.length > 0 && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-300">Generated Headlines:</span>
                  <div className="space-y-1.5">
                    {aiSuggestions.map((sug, sIdx) => (
                      <div
                        key={sIdx}
                        onClick={() => handleUpdateField('title', sug)}
                        className="p-2 rounded-lg bg-slate-800/70 hover:bg-rose-950/40 text-xs text-slate-200 hover:text-rose-300 cursor-pointer transition-colors border border-transparent hover:border-rose-500/30"
                      >
                        {sug}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Panel 3: Threaded Editorial Comments */}
          {activeSidePanel === 'comments' && (
            <div className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Desk Comments & Notes
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {article.comments?.length || 0} threads
                </span>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto">
                {(!article.comments || article.comments.length === 0) && (
                  <p className="text-xs text-slate-400 text-center py-4">No comments on this story yet.</p>
                )}
                {article.comments?.map((comm) => (
                  <div key={comm.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{comm.user_name}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(comm.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{comm.content}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment} className="pt-2 border-t border-slate-800 space-y-2">
                <textarea
                  rows={2}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Mention colleagues with @ or add note..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-rose-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-all"
                >
                  Post Note to Desk
                </button>
              </form>
            </div>
          )}

          {/* Panel 4: Version History & Visual Diff Viewer */}
          {activeSidePanel === 'revisions' && (
            <div className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-rose-400" />
                  <span>Version History ({article.revisions?.length || 0})</span>
                </h3>
              </div>

              {/* Revision List */}
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {article.revisions?.map((rev) => (
                  <div
                    key={rev.id}
                    onClick={() => setSelectedRevisionForDiff(rev)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedRevisionForDiff?.id === rev.id
                        ? 'bg-rose-950/40 border-rose-500 text-white'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono">v{rev.version_number}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(rev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-[11px] text-rose-400 font-medium">{rev.changed_by_name}</div>
                    {rev.diff_notes && (
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{rev.diff_notes}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Visual Diff Comparison Box */}
              {selectedRevisionForDiff && (
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="font-bold text-slate-200">
                      Comparing v{selectedRevisionForDiff.version_number} with Current
                    </span>
                    <button
                      onClick={() => handleRestoreRevision(selectedRevisionForDiff.id)}
                      className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-[10px] font-bold text-white flex items-center gap-1 transition-all"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore This</span>
                    </button>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-2 rounded bg-red-950/40 border border-red-800/60 text-red-300">
                      <span className="text-[10px] font-bold block text-red-400">- Old Headline:</span>
                      {selectedRevisionForDiff.title}
                    </div>

                    <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
                      <span className="text-[10px] font-bold block text-emerald-400">+ Current Headline:</span>
                      {article.title}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Panel 5: Internal Linking Suggestions */}
          {activeSidePanel === 'links' && (
            <div className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-rose-400" />
                  <span>Internal Linking Suggestions</span>
                </h3>
              </div>

              <div className="space-y-2.5">
                {internalLinks.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-400">"{item.phrase}"</span>
                      <button
                        type="button"
                        onClick={() => alert(`Inserted contextual hyperlink to /article/${item.articleSlug}`)}
                        className="text-[10px] px-2 py-0.5 rounded bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white transition-all font-semibold"
                      >
                        + Insert Link
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium line-clamp-1">
                      → {item.articleTitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Device Live Responsive Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-[#0e131f] border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0a0d14]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Live Responsive Simulator
                </span>
                <span className="text-[10px] font-mono text-slate-400">{article.title}</span>
              </div>

              {/* Viewport Selectors */}
              <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800">
                <button
                  onClick={() => setPreviewViewport('desktop')}
                  className={`p-1.5 rounded ${previewViewport === 'desktop' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Desktop 1200px"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewViewport('tablet')}
                  className={`p-1.5 rounded ${previewViewport === 'tablet' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Tablet 768px"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewViewport('mobile')}
                  className={`p-1.5 rounded ${previewViewport === 'mobile' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Mobile 375px"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setPreviewModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Simulation */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#050811] flex justify-center">
              <div
                className={`bg-[#0b0f19] text-slate-100 p-6 sm:p-8 rounded-2xl border border-slate-800 transition-all shadow-2xl overflow-y-auto space-y-6 ${
                  previewViewport === 'desktop'
                    ? 'w-full max-w-3xl'
                    : previewViewport === 'tablet'
                    ? 'w-[768px]'
                    : 'w-[375px]'
                }`}
              >
                <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">
                  {article.primary_category?.name || 'Newsroom Vertical'}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-headline">
                  {article.title}
                </h1>
                {article.subtitle && (
                  <p className="text-sm sm:text-base text-slate-300 font-editorial">
                    {article.subtitle}
                  </p>
                )}

                {article.featured_image && (
                  <div className="rounded-xl overflow-hidden border border-slate-800">
                    <img src={article.featured_image.url} alt="" className="w-full h-auto object-cover" />
                  </div>
                )}

                <div className="space-y-4 text-sm text-slate-300 font-editorial leading-relaxed">
                  {article.content_blocks.map((b) => (
                    <div key={b.id}>
                      {b.type === 'paragraph' && (
                        <p className={b.settings?.dropcap ? 'editorial-dropcap' : ''}>{b.content.text}</p>
                      )}
                      {b.type === 'heading' && (
                        <h2 className="text-xl font-bold font-headline text-white pt-2">{b.content.text}</h2>
                      )}
                      {b.type === 'pullquote' && (
                        <div className="my-4 p-4 border-l-4 border-rose-500 bg-slate-900 italic font-headline text-base text-white">
                          "{b.content.text}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
