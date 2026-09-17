'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Upload,
  Search,
  Filter,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Trash2,
  ExternalLink,
  Sliders,
  Sparkles,
  Layers,
  FileCheck,
  Check,
  Copy,
  AlertTriangle,
  HardDrive,
  Globe,
  Zap,
  Info,
  ChevronRight,
  Maximize2,
  RefreshCw,
  Folder,
  Tag as TagIcon,
  Play,
  Pause,
  Download,
  ShieldCheck,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { MediaAsset } from '@/types/newsroom';

type FolderFilter = 'all' | 'images' | 'videos' | 'audio' | 'documents' | 'unused';
type AspectRatioMode = '16:9' | '4:3' | '1:1' | '9:16' | '3:2';

export default function MediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState<MediaAsset[]>([]);
  const [activeFolder, setActiveFolder] = useState<FolderFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [previewAspect, setPreviewAspect] = useState<AspectRatioMode>('16:9');
  
  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);

  // Upload Modal State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFolder, setUploadFolder] = useState<'images' | 'videos' | 'audio' | 'documents'>('images');
  const [uploadFilename, setUploadFilename] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadAltText, setUploadAltText] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadCredit, setUploadCredit] = useState('');
  const [uploadDuration, setUploadDuration] = useState('');
  const [uploadTranscript, setUploadTranscript] = useState('');
  const [isGeneratingVariants, setIsGeneratingVariants] = useState(false);

  // Metadata Edit state for selected asset
  const [editAltText, setEditAltText] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editCredit, setEditCredit] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Audio preview state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load items
  const reloadMedia = () => {
    const items = newsroomService.getMediaAssets(
      searchQuery,
      activeFolder === 'all' ? undefined : activeFolder
    );
    setMediaItems(items);
    if (selectedAsset) {
      const refreshed = items.find((m) => m.id === selectedAsset.id);
      if (refreshed) {
        setSelectedAsset(refreshed);
        setEditAltText(refreshed.alt_text || '');
        setEditCaption(refreshed.caption || '');
        setEditCredit(refreshed.credit || '');
      }
    }
  };

  useEffect(() => {
    reloadMedia();
  }, [activeFolder, searchQuery]);

  useEffect(() => {
    if (selectedAsset) {
      setEditAltText(selectedAsset.alt_text || '');
      setEditCaption(selectedAsset.caption || '');
      setEditCredit(selectedAsset.credit || '');
    }
  }, [selectedAsset]);

  const stats = newsroomService.getR2StorageStats();

  const handleSelectAsset = (asset: MediaAsset) => {
    if (isBulkMode) {
      toggleSelectId(asset.id);
    } else {
      setSelectedAsset(asset);
    }
  };

  const toggleSelectId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mediaItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mediaItems.map((m) => m.id));
    }
  };

  const handleFocalPointChange = (focal_x: number, focal_y: number) => {
    if (!selectedAsset) return;
    const boundedX = Math.max(0, Math.min(100, Math.round(focal_x)));
    const boundedY = Math.max(0, Math.min(100, Math.round(focal_y)));
    newsroomService.updateMediaFocalPoint(selectedAsset.id, boundedX, boundedY);
    setSelectedAsset({ ...selectedAsset, focal_x: boundedX, focal_y: boundedY });
    reloadMedia();
  };

  const handleImageCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedAsset) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    handleFocalPointChange(x, y);
  };

  const handleSaveMetadata = () => {
    if (!selectedAsset) return;
    newsroomService.updateMediaMetadata(selectedAsset.id, {
      alt_text: editAltText,
      caption: editCaption,
      credit: editCredit
    });
    setStatusMessage({ type: 'success', text: 'Asset metadata saved to R2 catalog.' });
    setTimeout(() => setStatusMessage(null), 3000);
    reloadMedia();
  };

  const handleDeleteAsset = (asset: MediaAsset) => {
    if (asset.usage_count > 0) {
      setStatusMessage({
        type: 'error',
        text: `Cannot delete: Asset is currently referenced in ${asset.usage_count} published stories.`
      });
      setTimeout(() => setStatusMessage(null), 4000);
      return;
    }

    if (confirm(`Permanently delete "${asset.filename}" from Cloudflare R2 bucket?`)) {
      const res = newsroomService.deleteMediaAsset(asset.id);
      if (res.success) {
        if (selectedAsset?.id === asset.id) setSelectedAsset(null);
        setSelectedIds((prev) => prev.filter((i) => i !== asset.id));
        setStatusMessage({ type: 'success', text: 'Asset deleted from Cloudflare R2.' });
        setTimeout(() => setStatusMessage(null), 3000);
        reloadMedia();
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (
      confirm(
        `Are you sure you want to delete ${selectedIds.length} selected assets? (Assets currently in use will be skipped for safety)`
      )
    ) {
      const res = newsroomService.bulkDeleteMedia(selectedIds);
      setStatusMessage({
        type: 'success',
        text: `Bulk purge complete: ${res.deletedCount} deleted, ${res.skippedCount} skipped (in active use).`
      });
      setTimeout(() => setStatusMessage(null), 4000);
      setSelectedIds([]);
      reloadMedia();
    }
  };

  const handleCopyCDN = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl.trim() || !uploadFilename.trim()) return;

    setIsGeneratingVariants(true);

    setTimeout(() => {
      let mimeType = 'image/webp';
      if (uploadFolder === 'videos') mimeType = 'video/mp4';
      else if (uploadFolder === 'audio') mimeType = 'audio/mpeg';
      else if (uploadFolder === 'documents') mimeType = 'application/pdf';

      const created = newsroomService.uploadMedia({
        filename: uploadFilename,
        mime_type: mimeType,
        file_size: uploadFolder === 'videos' ? 32000000 : uploadFolder === 'audio' ? 14000000 : 540000,
        url: uploadUrl,
        alt_text: uploadAltText || uploadFilename.replace(/\.[^/.]+$/, ''),
        caption: uploadCaption,
        credit: uploadCredit || 'AMG Media Desk',
        folder: uploadFolder,
        duration: uploadDuration || (uploadFolder === 'videos' ? '03:15' : uploadFolder === 'audio' ? '18:40' : undefined),
        transcript: uploadTranscript
      });

      setIsGeneratingVariants(false);
      setIsUploading(false);
      setUploadFilename('');
      setUploadUrl('');
      setUploadAltText('');
      setUploadCaption('');
      setUploadCredit('');
      setUploadDuration('');
      setUploadTranscript('');

      setSelectedAsset(created);
      setStatusMessage({
        type: 'success',
        text: `Asset uploaded to Cloudflare R2 bucket (${created.r2_key}) with WebP/AVIF variants generated.`
      });
      setTimeout(() => setStatusMessage(null), 4000);
      reloadMedia();
    }, 900);
  };

  const getAspectClass = (aspect: AspectRatioMode) => {
    switch (aspect) {
      case '16:9':
        return 'aspect-video';
      case '4:3':
        return 'aspect-[4/3]';
      case '1:1':
        return 'aspect-square';
      case '9:16':
        return 'aspect-[9/16] max-h-[380px] mx-auto';
      case '3:2':
        return 'aspect-[3/2]';
      default:
        return 'aspect-video';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-5 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          )}
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Storage Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
              Cloudflare R2 Media Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <HardDrive className="w-3 h-3" />
              <span>newsroom-assets-prod</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Zap className="w-3 h-3" />
              <span>Zero-Egress CDN</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global edge-accelerated asset pipeline with responsive focal point cropping, WebP/AVIF auto-variants, video streaming & deep usage audits.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => {
              setIsBulkMode(!isBulkMode);
              if (isBulkMode) setSelectedIds([]);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isBulkMode
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            {isBulkMode ? `Exit Bulk (${selectedIds.length})` : 'Bulk Actions'}
          </button>
          <button
            onClick={() => setIsUploading(!isUploading)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/50 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Presigned R2 Upload</span>
          </button>
        </div>
      </div>

      {/* Cloudflare R2 Storage Dashboard Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0b0f19] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Total Storage</span>
            <HardDrive className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-lg font-bold text-white font-mono">{stats.totalFormatted}</p>
          <p className="text-[10px] text-slate-500">{stats.totalCount} total assets stored</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0b0f19] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Images (WebP/AVIF)</span>
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-bold text-white font-mono">{stats.imageCount}</p>
          <p className="text-[10px] text-emerald-400/80">Auto multi-crop ready</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0b0f19] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Videos (4K/1080p)</span>
            <Video className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-lg font-bold text-white font-mono">{stats.videoCount}</p>
          <p className="text-[10px] text-purple-400/80">HLS / MP4 streamable</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0b0f19] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Audio & Podcasts</span>
            <Music className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-lg font-bold text-white font-mono">{stats.audioCount}</p>
          <p className="text-[10px] text-amber-400/80">AI transcript enabled</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0b0f19] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Documents / PDFs</span>
            <FileText className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <p className="text-lg font-bold text-white font-mono">{stats.docCount}</p>
          <p className="text-[10px] text-rose-400/80">Whitepapers & reports</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0b0f19] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Egress Saved</span>
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-lg font-bold text-cyan-400 font-mono">{stats.egressBandwidthSaved}</p>
          <p className="text-[10px] text-slate-500">$0 egress fee model</p>
        </div>
      </div>

      {/* Upload Drawer / Modal */}
      {isUploading && (
        <form
          onSubmit={handleUploadSubmit}
          className="p-6 rounded-2xl bg-[#0e131f] border border-rose-500/40 space-y-5 shadow-2xl animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-rose-400" />
              <span>Direct Cloudflare R2 Presigned Ingestion</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              Target Key: media/{uploadFolder}/2026/09/{uploadFilename || '<filename>'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Asset Category / Folder</label>
              <select
                value={uploadFolder}
                onChange={(e) => setUploadFolder(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="images">Images (/media/images/)</option>
                <option value="videos">Videos (/media/videos/)</option>
                <option value="audio">Audio / Podcasts (/media/audio/)</option>
                <option value="documents">Documents / PDFs (/media/documents/)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Filename with Extension</label>
              <input
                type="text"
                required
                placeholder="e.g. quantum-computing-lab.webp"
                value={uploadFilename}
                onChange={(e) => setUploadFilename(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Source Asset URL (Remote or Upload URL)</label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/... or https://domain.com/asset.mp4"
                value={uploadUrl}
                onChange={(e) => setUploadUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Alt Text (Accessibility & SEO)</label>
              <input
                type="text"
                placeholder="Descriptive alt text for screen readers..."
                value={uploadAltText}
                onChange={(e) => setUploadAltText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Attribution Credit</label>
              <input
                type="text"
                placeholder="e.g. AMG Photo / Rahul Varma"
                value={uploadCredit}
                onChange={(e) => setUploadCredit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Editorial Caption</label>
              <input
                type="text"
                placeholder="Official caption displayed in article figures..."
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Video / Audio Specific fields */}
          {(uploadFolder === 'videos' || uploadFolder === 'audio') && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/60">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Duration (MM:SS)</label>
                <input
                  type="text"
                  placeholder="e.g. 14:20"
                  value={uploadDuration}
                  onChange={(e) => setUploadDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Transcript Preview / Speech-to-Text</label>
                <input
                  type="text"
                  placeholder="Audio or video transcript snippet..."
                  value={uploadTranscript}
                  onChange={(e) => setUploadTranscript(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Automatic WebP, AVIF & multi-device resolution variant builder enabled.</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsUploading(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGeneratingVariants}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-500 disabled:opacity-50"
              >
                {isGeneratingVariants ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Ingesting & Generating Crops...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Ingest into R2 Bucket</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Navigation Tabs + Search + Bulk Operations */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Folder Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveFolder('all')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFolder === 'all'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>All Media ({stats.totalCount})</span>
          </button>

          <button
            onClick={() => setActiveFolder('images')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFolder === 'images'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Images ({stats.imageCount})</span>
          </button>

          <button
            onClick={() => setActiveFolder('videos')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFolder === 'videos'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Videos ({stats.videoCount})</span>
          </button>

          <button
            onClick={() => setActiveFolder('audio')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFolder === 'audio'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Audio ({stats.audioCount})</span>
          </button>

          <button
            onClick={() => setActiveFolder('documents')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFolder === 'documents'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documents ({stats.docCount})</span>
          </button>

          <button
            onClick={() => setActiveFolder('unused')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFolder === 'unused'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/40'
                : 'bg-slate-900 text-amber-400/80 hover:text-amber-300 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Unused Media ({stats.unusedCount})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by filename, caption or credit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Bulk Action Bar if activated */}
      {isBulkMode && (
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-200 animate-in fade-in">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.length === mediaItems.length && mediaItems.length > 0}
              onChange={handleSelectAll}
              className="rounded accent-indigo-500 cursor-pointer"
            />
            <span className="font-semibold">{selectedIds.length} assets selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-[11px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bulk Purge Unused</span>
            </button>
          </div>
        </div>
      )}

      {/* Media Grid (Left 7 Cols) + Detailed Studio / Inspector (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Media Grid Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {mediaItems.map((asset) => {
              const isSelected = selectedAsset?.id === asset.id;
              const isChecked = selectedIds.includes(asset.id);
              const isVideo = asset.folder === 'videos' || asset.mime_type.startsWith('video');
              const isAudio = asset.folder === 'audio' || asset.mime_type.startsWith('audio');
              const isDoc = asset.folder === 'documents' || asset.mime_type.includes('pdf');

              return (
                <div
                  key={asset.id}
                  onClick={() => handleSelectAsset(asset)}
                  className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-rose-500 ring-2 ring-rose-500/30 bg-slate-900'
                      : isChecked
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-slate-900'
                      : 'border-slate-800/90 hover:border-slate-700 bg-[#0e131f]'
                  }`}
                >
                  {/* Selection Checkbox */}
                  {isBulkMode && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectId(asset.id);
                      }}
                      className="absolute top-2 left-2 z-20"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded accent-indigo-500 cursor-pointer"
                      />
                    </div>
                  )}

                  {/* Asset Media Preview Box */}
                  <div className="aspect-video w-full bg-slate-950 overflow-hidden relative flex items-center justify-center">
                    {isVideo ? (
                      <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center gap-2 p-2">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                          <Play className="w-5 h-5 ml-0.5" />
                        </div>
                        <span className="text-[10px] font-mono text-purple-300">
                          {asset.duration || '04:32'} • 4K
                        </span>
                      </div>
                    ) : isAudio ? (
                      <div className="w-full h-full bg-gradient-to-br from-amber-950/40 to-slate-950 flex flex-col items-center justify-center gap-1.5 p-2">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                          <Music className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-amber-300">
                          {asset.duration || 'Podcast Episode'}
                        </span>
                      </div>
                    ) : isDoc ? (
                      <div className="w-full h-full bg-gradient-to-br from-rose-950/40 to-slate-950 flex flex-col items-center justify-center gap-1.5 p-2">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-rose-300">PDF Report</span>
                      </div>
                    ) : (
                      <img
                        src={asset.url}
                        alt={asset.alt_text}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    {/* Format Badge */}
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      {isVideo && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 text-[9px] font-mono border border-purple-500/30">
                          MP4
                        </span>
                      )}
                      {isAudio && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 text-[9px] font-mono border border-amber-500/30">
                          MP3
                        </span>
                      )}
                      {isDoc && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 text-[9px] font-mono border border-rose-500/30">
                          PDF
                        </span>
                      )}
                      {!isVideo && !isAudio && !isDoc && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-300 text-[9px] font-mono border border-slate-700">
                          WebP
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadata footer */}
                  <div className="p-2.5 space-y-1">
                    <p className="text-xs font-semibold text-slate-200 truncate">{asset.filename}</p>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-mono">
                        {(asset.file_size / 1024).toFixed(0)} KB
                      </span>
                      {asset.usage_count > 0 ? (
                        <span className="text-emerald-400 font-medium">
                          {asset.usage_count} {asset.usage_count === 1 ? 'story' : 'stories'}
                        </span>
                      ) : (
                        <span className="text-amber-400/90 font-medium">Unused</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {mediaItems.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-[#0e131f] border border-slate-800 space-y-3">
              <Folder className="w-10 h-10 mx-auto text-slate-400" />
              <p className="text-sm font-semibold text-slate-300">No media assets found</p>
              <p className="text-xs text-slate-400">
                Try adjusting your folder filter or search query.
              </p>
            </div>
          )}
        </div>

        {/* Selected Asset Studio & Inspector (Right 5 Cols) */}
        <div className="lg:col-span-5">
          {selectedAsset ? (
            <div className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-5 shadow-2xl sticky top-6">
              {/* Title Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Asset Inspector & CDN Studio
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-[260px]">
                    {selectedAsset.filename}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteAsset(selectedAsset)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                  title="Delete asset from R2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Media Preview & Interactive Focal Point Mode */}
              {selectedAsset.folder === 'videos' || selectedAsset.mime_type.startsWith('video') ? (
                <div className="space-y-3">
                  <div className="aspect-video rounded-xl overflow-hidden bg-black border border-slate-700">
                    <video
                      controls
                      src={selectedAsset.url}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5" />
                        <span>4K Video Stream Profile</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Duration: {selectedAsset.duration || '04:32'}
                      </span>
                    </div>
                    {selectedAsset.transcript && (
                      <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                        <span className="text-slate-400 block mb-1 font-semibold">Speech-to-Text Transcript:</span>
                        <p className="italic bg-slate-950 p-2 rounded border border-slate-800 text-slate-300">
                          &ldquo;{selectedAsset.transcript}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : selectedAsset.folder === 'audio' || selectedAsset.mime_type.startsWith('audio') ? (
                <div className="space-y-3">
                  <div className="p-5 rounded-xl bg-gradient-to-br from-amber-950/30 to-slate-950 border border-slate-800 space-y-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
                      <Music className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{selectedAsset.filename}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Duration: {selectedAsset.duration || '26:18'} • 320 kbps AAC
                      </p>
                    </div>
                    <audio
                      ref={audioRef}
                      controls
                      src={selectedAsset.url}
                      className="w-full h-8 accent-amber-500"
                    />
                  </div>
                  {selectedAsset.transcript && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <span className="text-slate-400 font-semibold block mb-1">
                        Speech-to-Text Transcript:
                      </span>
                      <p className="text-[11px] text-slate-300 italic bg-slate-950 p-2.5 rounded border border-slate-800">
                        &ldquo;{selectedAsset.transcript}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              ) : selectedAsset.folder === 'documents' || selectedAsset.mime_type.includes('pdf') ? (
                <div className="space-y-3">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-rose-950/30 to-slate-950 border border-slate-800 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{selectedAsset.filename}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        PDF Report • {(selectedAsset.file_size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <a
                      href={selectedAsset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download / Open PDF</span>
                    </a>
                  </div>
                </div>
              ) : (
                /* Image Focal Point Studio with Aspect Simulator */
                <div className="space-y-3">
                  {/* Aspect Ratio Simulator Switcher */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-rose-400" />
                      <span>Crop Preview Aspect:</span>
                    </span>
                    <div className="flex items-center gap-1">
                      {(['16:9', '4:3', '1:1', '9:16', '3:2'] as AspectRatioMode[]).map((aspect) => (
                        <button
                          key={aspect}
                          onClick={() => setPreviewAspect(aspect)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                            previewAspect === aspect
                              ? 'bg-rose-600 text-white font-bold'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {aspect}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Click-to-Focus Image Canvas */}
                  <div
                    onClick={handleImageCanvasClick}
                    className={`relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 cursor-crosshair group ${getAspectClass(
                      previewAspect
                    )}`}
                  >
                    <img
                      src={selectedAsset.url}
                      alt=""
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />

                    {/* Target Focal Point Dot */}
                    <div
                      className="absolute w-6 h-6 rounded-full border-2 border-white bg-rose-600 shadow-xl -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-[10px] font-bold text-white ring-4 ring-rose-500/40 transition-transform"
                      style={{
                        left: `${selectedAsset.focal_x}%`,
                        top: `${selectedAsset.focal_y}%`
                      }}
                    >
                      +
                    </div>

                    <div className="absolute bottom-2 right-2 bg-black/75 px-2 py-0.5 rounded text-[9px] font-mono text-white pointer-events-none">
                      Click image to position focal point
                    </div>
                  </div>

                  {/* Precise Coordinate Sliders */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span>Focal Coordinates</span>
                      <span className="font-mono text-[11px] text-rose-400">
                        X: {selectedAsset.focal_x}% | Y: {selectedAsset.focal_y}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Horizontal (X)</span>
                          <span className="font-mono">{selectedAsset.focal_x}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={selectedAsset.focal_x}
                          onChange={(e) =>
                            handleFocalPointChange(Number(e.target.value), selectedAsset.focal_y)
                          }
                          className="w-full accent-rose-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Vertical (Y)</span>
                          <span className="font-mono">{selectedAsset.focal_y}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={selectedAsset.focal_y}
                          onChange={(e) =>
                            handleFocalPointChange(selectedAsset.focal_x, Number(e.target.value))
                          }
                          className="w-full accent-rose-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CDN Delivery & Edge Key Info */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>Cloudflare Edge Delivery</span>
                  </span>
                  <button
                    onClick={() => handleCopyCDN(selectedAsset.url)}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300"
                  >
                    {copiedUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrl ? 'Copied CDN URL' : 'Copy URL'}</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-slate-400">R2 Key: </span>
                    <span className="font-mono text-slate-200 break-all">{selectedAsset.r2_key}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Cache-Control: </span>
                    <span className="font-mono text-emerald-400">
                      public, max-age=31536000, immutable
                    </span>
                  </div>
                  {selectedAsset.variants && (
                    <div className="pt-1.5 border-t border-slate-800">
                      <span className="text-slate-400 block mb-1">Generated Edge Formats:</span>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 text-[10px] font-mono border border-slate-800">
                          Thumb 320w
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 text-[10px] font-mono border border-slate-800">
                          Med 1024w
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 text-[10px] font-mono border border-slate-800">
                          Large 1600w
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 text-[10px] font-mono border border-slate-800">
                          WebP
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 text-[10px] font-mono border border-slate-800">
                          AVIF
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Deep Usage Audit */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Deep Usage Audit</span>
                  </span>
                  <span
                    className={`font-semibold font-mono text-[11px] ${
                      selectedAsset.usage_count > 0 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {selectedAsset.usage_count} References
                  </span>
                </div>

                {selectedAsset.used_in?.articles && selectedAsset.used_in.articles.length > 0 ? (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] text-slate-400">Referenced in published articles:</p>
                    {selectedAsset.used_in.articles.map((art) => (
                      <Link
                        key={art.id}
                        href={`/admin/articles/${art.id}/edit`}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-200 transition-colors group"
                      >
                        <span className="truncate pr-2">{art.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400 flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-400/90 italic pt-1">
                    This asset is currently not linked to any article or newsletter. Safe to purge.
                  </p>
                )}
              </div>

              {/* Editable Metadata Form */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Alt Text (Accessibility)</label>
                  <input
                    type="text"
                    value={editAltText}
                    onChange={(e) => setEditAltText(e.target.value)}
                    placeholder="Descriptive alt text..."
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Editorial Caption</label>
                  <input
                    type="text"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    placeholder="Caption displayed under story figures..."
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Attribution Credit</label>
                  <input
                    type="text"
                    value={editCredit}
                    onChange={(e) => setEditCredit(e.target.value)}
                    placeholder="Photographer / Agency..."
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSaveMetadata}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-950/40"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Metadata</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 rounded-2xl bg-[#0e131f] border border-slate-800 text-center text-slate-400 space-y-3 sticky top-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-300">No Asset Selected</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click any asset card on the left to inspect Cloudflare R2 edge keys, tune interactive focal point crops, or review article usage audits.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
