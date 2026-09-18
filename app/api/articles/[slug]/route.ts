import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    let query = supabaseServer
      .from('articles')
      .select(`
        *,
        primary_category:categories(*),
        featured_image:media(*),
        article_authors(profiles(*)),
        article_tags(tags(*))
      `);

    if (slug.length === 36 && slug.includes('-') && !slug.includes(' ')) {
      // Could be UUID
      query = query.or(`slug.eq.${slug},id.eq.${slug}`);
    } else {
      query = query.eq('slug', slug);
    }

    const { data: item, error } = await query.maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!item) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const article = {
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
    };

    return NextResponse.json(article);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    let query = supabaseServer.from('articles').delete();
    if (slug.length === 36) {
      query = query.or(`slug.eq.${slug},id.eq.${slug}`);
    } else {
      query = query.eq('slug', slug);
    }

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
