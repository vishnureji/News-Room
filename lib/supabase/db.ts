import { supabase } from './client';
import { Article, Category, Tag, MediaAsset, AuthorProfile } from '@/types/newsroom';

export const db = {
  // Articles
  async getArticles(status?: string): Promise<Article[] | null> {
    try {
      let query = supabase.from('articles').select(`
        *,
        primary_category:categories(*),
        featured_image:media(*),
        article_authors(profiles(*)),
        article_tags(tags(*))
      `).order('published_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error || !data) return null;

      return data.map((item: any) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        subtitle: item.subtitle,
        excerpt: item.excerpt,
        content_blocks: item.content_blocks || [],
        primary_category_id: item.primary_category_id,
        primary_category: item.primary_category,
        featured_image_id: item.featured_image_id,
        featured_image: item.featured_image,
        authors: item.article_authors?.map((a: any) => a.profiles).filter(Boolean) || [],
        tags: item.article_tags?.map((t: any) => t.tags).filter(Boolean) || [],
        status: item.status,
        visibility: item.visibility,
        reading_time_mins: item.reading_time_mins || 3,
        seo: item.seo || {
          meta_title: item.title,
          meta_description: item.excerpt || '',
          schema_type: 'NewsArticle',
          score: 85
        },
        scheduled_for: item.scheduled_for,
        published_at: item.published_at,
        created_by: item.created_by || 'auth-1',
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    } catch (e) {
      console.warn('Supabase getArticles fallback:', e);
      return null;
    }
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          primary_category:categories(*),
          featured_image:media(*),
          article_authors(profiles(*)),
          article_tags(tags(*))
        `)
        .eq('slug', slug)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        subtitle: data.subtitle,
        excerpt: data.excerpt,
        content_blocks: data.content_blocks || [],
        primary_category_id: data.primary_category_id,
        primary_category: data.primary_category,
        featured_image_id: data.featured_image_id,
        featured_image: data.featured_image,
        authors: data.article_authors?.map((a: any) => a.profiles).filter(Boolean) || [],
        tags: data.article_tags?.map((t: any) => t.tags).filter(Boolean) || [],
        status: data.status,
        visibility: data.visibility,
        reading_time_mins: data.reading_time_mins || 3,
        seo: data.seo || {
          meta_title: data.title,
          meta_description: data.excerpt || '',
          schema_type: 'NewsArticle',
          score: 85
        },
        scheduled_for: data.scheduled_for,
        published_at: data.published_at,
        created_by: data.created_by || 'auth-1',
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (e) {
      console.warn('Supabase getArticleBySlug fallback:', e);
      return null;
    }
  },

  async upsertArticle(article: Partial<Article>): Promise<boolean> {
    try {
      const { error } = await supabase.from('articles').upsert({
        id: article.id,
        slug: article.slug,
        title: article.title,
        subtitle: article.subtitle,
        excerpt: article.excerpt,
        content_blocks: article.content_blocks,
        primary_category_id: article.primary_category_id,
        featured_image_id: article.featured_image_id,
        status: article.status,
        visibility: article.visibility,
        reading_time_mins: article.reading_time_mins,
        published_at: article.published_at,
        updated_at: new Date().toISOString()
      });
      return !error;
    } catch (e) {
      console.warn('Supabase upsertArticle error:', e);
      return false;
    }
  },

  // Categories
  async getCategories(): Promise<Category[] | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error || !data) return null;
      return data;
    } catch (e) {
      return null;
    }
  },

  // Tags
  async getTags(): Promise<Tag[] | null> {
    try {
      const { data, error } = await supabase.from('tags').select('*');
      if (error || !data) return null;
      return data;
    } catch (e) {
      return null;
    }
  },

  // Media & Storage
  async getMedia(): Promise<MediaAsset[] | null> {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;
      return data;
    } catch (e) {
      return null;
    }
  },

  async uploadStorageFile(
    bucket: string,
    path: string,
    fileBody: File | Blob | ArrayBuffer
  ): Promise<{ url: string | null; error: string | null }> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, fileBody, { upsert: true });

      if (error) return { url: null, error: error.message };

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return { url: publicUrlData.publicUrl, error: null };
    } catch (err: any) {
      return { url: null, error: err?.message || 'Storage upload failed' };
    }
  },

  // Reader Bookmarks
  async getBookmarks(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('reader_bookmarks')
        .select('article_id')
        .eq('user_id', userId);

      if (error || !data) return [];
      return data.map((b: any) => b.article_id);
    } catch {
      return [];
    }
  },

  async toggleBookmark(userId: string, articleId: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('reader_bookmarks')
        .select('id')
        .eq('user_id', userId)
        .eq('article_id', articleId)
        .maybeSingle();

      if (data) {
        await supabase
          .from('reader_bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('article_id', articleId);
        return false;
      } else {
        await supabase
          .from('reader_bookmarks')
          .insert({ user_id: userId, article_id: articleId });
        return true;
      }
    } catch {
      return false;
    }
  }
};
