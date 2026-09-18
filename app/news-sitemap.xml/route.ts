import { NextResponse } from 'next/server';
import { newsroomService } from '@/lib/services/newsroom-service';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const recentArticles = await newsroomService.getArticlesAsync({ status: 'published' });
  const baseUrl = siteConfig.url.replace(/\/$/, '');

  const newsItems = recentArticles
    .map(
      (art) => `
    <url>
      <loc>${baseUrl}/article/${art.slug}</loc>
      <news:news>
        <news:publication>
          <news:name>${siteConfig.name}</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${new Date(art.published_at || art.created_at).toISOString()}</news:publication_date>
        <news:title><![CDATA[${art.title}]]></news:title>
        <news:keywords>${art.seo?.focus_keyword || 'News, Investigation'}</news:keywords>
      </news:news>
    </url>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${newsItems}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=1800, stale-while-revalidate',
    },
  });
}
