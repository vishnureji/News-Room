'use client';

import React, { useState } from 'react';
import { Sparkles, Bot, Zap, Globe2, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';

export default function AIToolsNewsroomHub() {
  const [inputText, setInputText] = useState('');
  const [task, setTask] = useState<'headline' | 'seo' | 'translate' | 'readability'>('headline');
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRunAI = () => {
    if (!inputText.trim()) return;
    setIsLoading(true);

    setTimeout(() => {
      if (task === 'headline') {
        const list = newsroomService.generateAIHeadlines(inputText, 'Economy & Tech');
        setOutput(list.map((h, i) => `${i + 1}. ${h}`).join('\n\n'));
      } else if (task === 'seo') {
        const seo = newsroomService.generateAISEO(inputText, inputText);
        setOutput(`SEO Meta Title:\n${seo.title}\n\nMeta Description:\n${seo.description}\n\nKeywords: ${seo.keywords.join(', ')}`);
      } else if (task === 'translate') {
        setOutput(`[Hindi / देवनागरी Translation Preview]:\n\nकेंद्रीय बजट 2026: उद्योग और ऊर्जा के लिए ऐतिहासिक घोषणा। नीति निर्माताओं ने बुनियादी ढांचे में महत्वपूर्ण सुधार का प्रस्ताव रखा है।`);
      } else {
        setOutput(`Readability Grade: Flesch-Kincaid 8.2 (Executive Newsroom Grade)\n✓ Sentences are punchy and concise.\n✓ Active voice ratio: 88%\n⚠ Tip: Replace two passive clauses in paragraph 2 for greater narrative urgency.`);
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
              AI Newsroom Co-Pilot Studio
            </h1>
            <Sparkles className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Prompt tuning, multi-language translation, SEO generation, headline variations and readability metrics.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-5 shadow-2xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setTask('headline')}
            className={`py-2 rounded-lg transition-colors ${task === 'headline' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Headline Optimizer
          </button>
          <button
            onClick={() => setTask('seo')}
            className={`py-2 rounded-lg transition-colors ${task === 'seo' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            SEO Payload Generator
          </button>
          <button
            onClick={() => setTask('translate')}
            className={`py-2 rounded-lg transition-colors ${task === 'translate' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Multi-Language Preview
          </button>
          <button
            onClick={() => setTask('readability')}
            className={`py-2 rounded-lg transition-colors ${task === 'readability' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Readability & Audit
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Input Text / Draft Paragraph</label>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your headline, draft, or article summary here..."
            className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500"
          />
        </div>

        <button
          onClick={handleRunAI}
          disabled={isLoading || !inputText.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-950/50 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isLoading ? 'Synthesizing Intelligence...' : 'Execute AI Generation'}</span>
        </button>

        {output && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400">Generated Co-Pilot Output:</span>
            <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
