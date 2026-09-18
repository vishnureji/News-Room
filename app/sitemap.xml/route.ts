import { NextResponse } from 'next/server';
import { newsroomService } from '@/lib/services/newsroom-service';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [articles, categories] = await Promise.all([
    newsroomService.getArticlesAsync({ status: 'published' }),
    newsroomService.getCategoriesAsync()
  ]);
  const baseUrl = siteConfig.url.replace(/\/$/, '');

  const articleUrls = articles
    .map(
      (art) => `
    <url>
      <loc>${baseUrl}/article/${art.slug}</loc>
      <lastmod>${new Date(art.updated_at || art.created_at).toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>`
    )
    .join('');

  const categoryUrls = categories
    .map(
      (c) => `
    <url>
      <loc>${baseUrl}/${c.slug}</loc>
      <changefreq>hourly</changefreq>
      <priority>0.8</priority>
    </url>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  ${categoryUrls}
  ${articleUrls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
