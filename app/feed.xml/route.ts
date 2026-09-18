import { NextResponse } from 'next/server';
import { newsroomService } from '@/lib/services/newsroom-service';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const articles = await newsroomService.getArticlesAsync({ status: 'published' });
  const baseUrl = siteConfig.url.replace(/\/$/, '');

  const itemsXml = articles
    .map(
      (art) => `
    <item>
      <title><![CDATA[${art.title}]]></title>
      <link>${baseUrl}/article/${art.slug}</link>
      <guid>${baseUrl}/article/${art.slug}</guid>
      <pubDate>${new Date(art.published_at || art.created_at).toUTCString()}</pubDate>
      <description><![CDATA[${art.excerpt || art.title}]]></description>
      <author>${art.authors[0]?.email || 'desk@newsroom.com'} (${art.authors[0]?.display_name || 'Staff'})</author>
      <category>${art.primary_category?.name || 'General'}</category>
    </item>`
    )
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name} | ${siteConfig.description}</title>
    <link>${baseUrl}</link>
    <description>${siteConfig.description}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
