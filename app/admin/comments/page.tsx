'use client';

import React, { useState } from 'react';
import { MessageSquare, Check, X, ShieldAlert, Trash2 } from 'lucide-react';

export default function CommentsModerationPage() {
  const [comments, setComments] = useState([
    {
      id: 'c-1',
      author: 'David Kumar',
      email: 'david@example.com',
      article: 'Union Budget 2026 Unveils Landmark Infrastructure Package',
      content: 'The capital allocation toward freight corridors is crucial for long-term logistics cost reduction.',
      status: 'pending',
      date: '15 mins ago'
    },
    {
      id: 'c-2',
      author: 'Anonymous Reader',
      email: 'spam@bot.net',
      article: 'Breakthrough in Photonic AI Chips',
      content: 'Click here for guaranteed crypto investment returns!!!',
      status: 'spam',
      date: '1 hour ago'
    }
  ]);

  const handleAction = (id: string, action: 'approve' | 'reject' | 'spam') => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: action === 'approve' ? 'approved' : action } : c))
    );
  };

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
            Reader Comments Moderation Queue
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Automated profanity filtering, pending approvals, and community moderation.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comm) => (
          <div
            key={comm.id}
            className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-3 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-100">{comm.author}</span>
                <span className="text-xs text-slate-400 ml-2">({comm.email})</span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                  comm.status === 'approved'
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : comm.status === 'spam'
                    ? 'bg-red-500/15 text-red-300'
                    : 'bg-amber-500/15 text-amber-300'
                }`}
              >
                {comm.status}
              </span>
            </div>

            <p className="text-xs text-rose-400 font-mono">Story: {comm.article}</p>
            <p className="text-xs text-slate-200 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              {comm.content}
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => handleAction(comm.id, 'approve')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => handleAction(comm.id, 'spam')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 text-xs font-semibold"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Mark Spam</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
