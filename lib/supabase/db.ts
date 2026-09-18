import { Article, Category, Tag, MediaAsset, AuthorProfile, Assignment, BreakingNewsItem } from '@/types/newsroom';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
};

export const db = {
  // Articles
  async getArticles(status?: string, categoryId?: string, search?: string): Promise<Article[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (categoryId) params.set('categoryId', categoryId);
      if (search) params.set('search', search);

      const res = await fetch(`${getBaseUrl()}/api/articles?${params.toString()}`, {
        cache: 'no-store'
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.warn('db.getArticles error:', e);
      return [];
    }
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/articles/${encodeURIComponent(slug)}`, {
        cache: 'no-store'
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('db.getArticleBySlug error:', e);
      return null;
    }
  },

  async upsertArticle(article: Partial<Article>): Promise<Article | null> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('db.upsertArticle error:', e);
      return null;
    }
  },

  async deleteArticle(slugOrId: string): Promise<boolean> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/articles/${encodeURIComponent(slugOrId)}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (e) {
      console.warn('db.deleteArticle error:', e);
      return false;
    }
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/categories`, { cache: 'no-store' });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.warn('db.getCategories error:', e);
      return [];
    }
  },

  async upsertCategory(cat: Partial<Category>): Promise<Category | null> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // Tags
  async getTags(): Promise<Tag[]> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/tags`, { cache: 'no-store' });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async upsertTag(tag: Partial<Tag>): Promise<Tag | null> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tag)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Media
  async getMedia(): Promise<MediaAsset[]> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/media`, { cache: 'no-store' });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async uploadMedia(formData: FormData): Promise<MediaAsset | null> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/media`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async deleteMedia(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/media?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // Authors / Staff
  async getAuthors(): Promise<AuthorProfile[]> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/authors`, { cache: 'no-store' });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async upsertAuthor(profile: Partial<AuthorProfile>): Promise<AuthorProfile | null> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Assignments
  async getAssignments(): Promise<Assignment[]> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/assignments`, { cache: 'no-store' });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async upsertAssignment(assignment: Partial<Assignment>): Promise<Assignment | null> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignment)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async deleteAssignment(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/assignments?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // Breaking News
  async getBreakingNews(): Promise<BreakingNewsItem[]> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/breaking-news`, { cache: 'no-store' });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async upsertBreakingNews(item: Partial<BreakingNewsItem>): Promise<BreakingNewsItem | null> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/breaking-news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async deleteBreakingNews(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/breaking-news?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // Reader Bookmarks
  async getBookmarks(userId: string): Promise<string[]> {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(`newsroom_bookmarks_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async toggleBookmark(userId: string, articleId: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    try {
      const key = `newsroom_bookmarks_${userId}`;
      const stored = localStorage.getItem(key);
      let list: string[] = stored ? JSON.parse(stored) : [];
      const exists = list.includes(articleId);
      if (exists) {
        list = list.filter(id => id !== articleId);
      } else {
        list.push(articleId);
      }
      localStorage.setItem(key, JSON.stringify(list));
      return !exists;
    } catch {
      return false;
    }
  }
};
