'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  CheckSquare,
  Clock,
  AlertCircle,
  User,
  Calendar,
  Filter,
  FilePlus,
  CheckCircle2,
  ExternalLink,
  Flame,
  Search
} from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { Assignment } from '@/types/newsroom';

export default function AssignmentsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('Anu Sharma');
  const [priority, setPriority] = useState<Assignment['priority']>('medium');
  const [deadline, setDeadline] = useState('2026-09-18T18:00');
  const [notes, setNotes] = useState('');

  const authors = newsroomService.getAuthors();

  useEffect(() => {
    setAssignments(newsroomService.getAssignments());
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    newsroomService.createAssignment({
      title,
      assigned_to_name: assignedTo,
      assigned_by_name: 'Vishnu Reji (Editor-in-Chief)',
      deadline: new Date(deadline).toISOString(),
      priority,
      status: 'assigned',
      notes
    });

    setAssignments([...newsroomService.getAssignments()]);
    setTitle('');
    setNotes('');
    setIsCreating(false);
  };

  const handleStatusUpdate = (id: string, newStatus: Assignment['status']) => {
    newsroomService.updateAssignmentStatus(id, newStatus);
    setAssignments([...newsroomService.getAssignments()]);
  };

  const handleStartDraftingArticle = (asg: Assignment) => {
    const artId = `art-${Date.now()}`;
    const slug = asg.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    newsroomService.saveArticle({
      id: artId,
      slug,
      title: asg.title,
      status: 'draft',
      content_blocks: [
        {
          id: `blk-${Date.now()}`,
          type: 'paragraph',
          content: { text: asg.notes || 'Start investigative draft based on assignment brief...' }
        }
      ]
    });

    newsroomService.updateAssignmentStatus(asg.id, 'in_progress');
    router.push(`/admin/articles/${artId}/edit`);
  };

  const filtered = assignments.filter((a) => {
    const matchesTab = activeTab === 'all' || a.status === activeTab;
    const matchesPriority = priorityFilter === 'all' || a.priority === priorityFilter;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.assigned_to_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.notes && a.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-headline">
              Newsroom Assignments Desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {assignments.length} Total Briefs
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Dispatch reporting beats, link assignments to articles, enforce deadlines, and manage coverage briefs.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/50 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch New Assignment</span>
        </button>
      </div>

      {/* Creation Modal */}
      {isCreating && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl bg-[#0e131f] border border-rose-500/40 space-y-4 shadow-2xl">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-rose-400" />
            <span>Dispatch Story Brief to Reporter</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Assignment Brief / Headline</label>
              <input
                type="text"
                required
                placeholder="e.g. Investigative coverage on domestic lithium refining plants..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Assigned Reporter</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                {authors.map((auth) => (
                  <option key={auth.id} value={auth.display_name}>
                    {auth.display_name} ({auth.designation})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                <option value="low">Low (Standard)</option>
                <option value="medium">Medium (Daily Beat)</option>
                <option value="high">High (Lead Feature)</option>
                <option value="breaking">Breaking (Flash Urgency)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Publishing Deadline</label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Editorial Notes & Angle</label>
              <input
                type="text"
                placeholder="Key questions to answer, required interviews, data sources..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
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
              className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-500 shadow-md"
            >
              Dispatch Assignment & Notify Staff
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto text-xs font-medium">
          {[
            { id: 'all', label: 'All Assignments', count: assignments.length },
            { id: 'assigned', label: 'Assigned', count: assignments.filter(a => a.status === 'assigned').length },
            { id: 'in_progress', label: 'In Progress', count: assignments.filter(a => a.status === 'in_progress').length },
            { id: 'completed', label: 'Completed', count: assignments.filter(a => a.status === 'completed').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] font-mono opacity-80">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Priority & Search */}
        <div className="flex items-center gap-3">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="breaking">Breaking Only</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div className="relative w-48 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search briefs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Assignments Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((asg) => (
          <div
            key={asg.id}
            className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase flex items-center gap-1 ${
                    asg.priority === 'breaking'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : asg.priority === 'high'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {asg.priority === 'breaking' && <Flame className="w-3 h-3 text-red-400" />}
                  {asg.priority}
                </span>

                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Due: {new Date(asg.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-100 font-headline leading-snug">
                {asg.title}
              </h2>

              {asg.notes && (
                <p className="text-xs text-slate-400 leading-relaxed font-editorial bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  {asg.notes}
                </p>
              )}
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[11px]">Assigned to: </span>
                  <strong className="text-slate-200 font-semibold">{asg.assigned_to_name}</strong>
                </div>

                <select
                  value={asg.status}
                  onChange={(e) => handleStatusUpdate(asg.id, e.target.value as any)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none"
                >
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="submitted">Submitted</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* 1-Click Action to Launch Article Canvas pre-linked to Assignment */}
              <button
                type="button"
                onClick={() => handleStartDraftingArticle(asg)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-200 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <FilePlus className="w-3.5 h-3.5 text-rose-400" />
                <span>Open in Story Canvas</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
