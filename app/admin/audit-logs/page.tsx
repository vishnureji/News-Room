'use client';

import React from 'react';
import { History, Shield, CheckCircle, Clock } from 'lucide-react';

export default function AuditLogsPage() {
  const logs = [
    { action: 'ARTICLE_PUBLISHED', entity: 'Article: India Budget 2026', user: 'Vishnu Reji', ip: '103.21.244.2', time: 'Today, 06:30 AM' },
    { action: 'SETTINGS_CHANGED', entity: 'Site Settings: Theme Accent Updated', user: 'Vishnu Reji', ip: '103.21.244.2', time: 'Yesterday, 18:20 PM' },
    { action: 'MEDIA_UPLOADED', entity: 'Asset: parliament-budget-session.webp', user: 'Rahul Varma', ip: '142.250.190.46', time: 'Yesterday, 14:00 PM' },
    { action: 'USER_ROLE_UPDATED', entity: 'Staff: Anu Sharma -> Senior Reporter', user: 'Vishnu Reji', ip: '103.21.244.2', time: 'Sep 15, 11:15 AM' },
    { action: 'REDIRECT_CREATED', entity: 'Rule: /budget-2026-news -> /article/...', user: 'Vishnu Reji', ip: '103.21.244.2', time: 'Sep 15, 09:00 AM' }
  ];

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
            Immutable Audit & Security Logs
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Append-only security log auditing editorial modifications, role escalations, and system updates.
          </p>
        </div>
      </div>

      <div className="bg-[#0e131f] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Action Event</th>
              <th className="px-5 py-3.5">Entity & Details</th>
              <th className="px-5 py-3.5">Actor</th>
              <th className="px-5 py-3.5">IP Address</th>
              <th className="px-5 py-3.5">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {logs.map((log, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-3.5 font-mono font-bold text-rose-400">{log.action}</td>
                <td className="px-5 py-3.5 font-medium text-slate-200">{log.entity}</td>
                <td className="px-5 py-3.5 text-slate-300">{log.user}</td>
                <td className="px-5 py-3.5 font-mono text-slate-400">{log.ip}</td>
                <td className="px-5 py-3.5 font-mono text-slate-400">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
