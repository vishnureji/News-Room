import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');
    const categorySlug = searchParams.get('categorySlug');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const search = searchParams.get('search');

    let query = supabaseServer
      .from('articles')
      .select(`
        *,
        primary_category:categories(*),
        featured_image:media(*),
        article_authors(profiles(*)),
        article_tags(tags(*))
      `)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (categoryId) {
      query = query.eq('primary_category_id', categoryId);
    }

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let articles = (data || []).map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      subtitle: item.subtitle || '',
      excerpt: item.excerpt || '',
      content_blocks: item.content_blocks || [],
      primary_category_id: item.primary_category_id,
      primary_category: item.primary_category,
      featured_image_id: item.featured_image_id,
      featured_image: item.featured_image ? {
        ...item.featured_image,
        storage_path: item.featured_image.r2_key || item.featured_image.storage_path
      } : null,
      authors: item.article_authors?.map((a: any) => a.profiles).filter(Boolean) || [],
      tags: item.article_tags?.map((t: any) => t.tags).filter(Boolean) || [],
      status: item.status,
      visibility: item.visibility || 'public',
      reading_time_mins: item.reading_time_mins || 3,
      seo: item.seo || {
        meta_title: item.title,
        meta_description: item.excerpt || '',
        schema_type: 'NewsArticle',
        score: 88
      },
      scheduled_for: item.scheduled_for,
      published_at: item.published_at,
      created_by: item.created_by,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));

    if (categorySlug) {
      articles = articles.filter((a: any) => a.primary_category?.slug === categorySlug);
    }

    return NextResponse.json(articles);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, author_ids, tag_ids, primary_category, featured_image, authors, tags, revisions, ...articleData } = body;

    let articleId = id;

    if (articleId && articleId.length === 36 && !articleId.startsWith('art-')) {
      // Valid UUID
      const { data, error } = await supabaseServer
        .from('articles')
        .upsert({
          id: articleId,
          ...articleData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      articleId = data.id;
    } else {
      // Insert new
      const { data, error } = await supabaseServer
        .from('articles')
        .insert({
          ...articleData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      articleId = data.id;
    }

    // Authors relationship
    if (author_ids && Array.isArray(author_ids) && author_ids.length > 0) {
      await supabaseServer.from('article_authors').delete().eq('article_id', articleId);
      const authorRows = author_ids.map((aid: string, idx: number) => ({
        article_id: articleId,
        author_id: aid,
        role: idx === 0 ? 'primary_author' : 'co_author',
        display_order: idx
      }));
      await supabaseServer.from('article_authors').insert(authorRows);
    }

    // Tags relationship
    if (tag_ids && Array.isArray(tag_ids) && tag_ids.length > 0) {
      await supabaseServer.from('article_tags').delete().eq('article_id', articleId);
      const tagRows = tag_ids.map((tid: string) => ({
        article_id: articleId,
        tag_id: tid
      }));
      await supabaseServer.from('article_tags').insert(tagRows);
    }

    // Return the full updated article
    const { data: fullArticle } = await supabaseServer
      .from('articles')
      .select(`
        *,
        primary_category:categories(*),
        featured_image:media(*),
        article_authors(profiles(*)),
        article_tags(tags(*))
      `)
      .eq('id', articleId)
      .single();

    return NextResponse.json(fullArticle);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
