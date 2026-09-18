'use client';

import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { newsroomService } from '@/lib/services/newsroom-service';
import { Category } from '@/types/newsroom';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newColor, setNewColor] = useState('#2563EB');
  const [newDesc, setNewDesc] = useState('');

  const loadCategories = async () => {
    setLoading(true);
    try {
      const live = await newsroomService.getCategoriesAsync();
      setCategories(live);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSlug.trim()) return;

    const created = newsroomService.saveCategory({
      name: newName.trim(),
      slug: newSlug.trim().toLowerCase().replace(/\s+/g, '-'),
      color: newColor,
      description: newDesc.trim()
    });

    setCategories((prev) => [...prev, created]);
    setShowAddModal(false);
    setNewName('');
    setNewSlug('');
    setNewDesc('');
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (!confirm(`Delete category "${name}" from Supabase?`)) return;
    const ok = newsroomService.deleteCategory(id);
    if (ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-headline flex items-center gap-3">
            Categories & Beat Taxonomies
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Supabase Live DB
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure primary verticals, navigation links, and beat metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadCategories}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh categories"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/50 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Beat Category</span>
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e131f] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white">Create Beat Category</h2>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Energy & Commodities"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    if (!newSlug) {
                      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. energy"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Color Theme</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-slate-300">{newColor}</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Editorial Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of stories published in this beat..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Loading categories from Supabase...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-[#0e131f] rounded-2xl border border-slate-800">
          No categories found. Click &quot;Add Beat Category&quot; above to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800 space-y-3 hover:border-slate-700 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: cat.color || '#E53E3E' }}
                  />
                  <h2 className="text-base font-bold text-slate-100">{cat.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    /{cat.slug}
                  </span>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {cat.description && (
                <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
