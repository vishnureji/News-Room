import { NextResponse } from 'next/server';
import { INITIAL_ARTICLES, INITIAL_CATEGORIES } from '@/lib/services/newsroom-service';

export async function GET() {
  const articles = INITIAL_ARTICLES.filter((a) => a.status === 'published');

  const articleUrls = articles
    .map(
      (art) => `
    <url>
      <loc>https://newsroom.live/article/${art.slug}</loc>
      <lastmod>${new Date(art.updated_at).toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>`
    )
    .join('');

  const categoryUrls = INITIAL_CATEGORIES.map(
    (c) => `
    <url>
      <loc>https://newsroom.live/${c.slug}</loc>
      <changefreq>hourly</changefreq>
      <priority>0.8</priority>
    </url>`
  ).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://newsroom.live</loc>
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
