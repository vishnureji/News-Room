import { NextResponse } from 'next/server';
import { INITIAL_ARTICLES } from '@/lib/services/newsroom-service';

export async function GET() {
  const articles = INITIAL_ARTICLES.filter((a) => a.status === 'published');

  const itemsXml = articles
    .map(
      (art) => `
    <item>
      <title><![CDATA[${art.title}]]></title>
      <link>https://newsroom.live/article/${art.slug}</link>
      <guid>https://newsroom.live/article/${art.slug}</guid>
      <pubDate>${new Date(art.published_at || art.created_at).toUTCString()}</pubDate>
      <description><![CDATA[${art.excerpt || art.title}]]></description>
      <author>${art.authors[0]?.email || 'desk@newsroom.live'} (${art.authors[0]?.display_name || 'Staff'})</author>
      <category>${art.primary_category?.name || 'General'}</category>
    </item>`
    )
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AMG Newsroom | Global Journalism &amp; Intelligence</title>
    <link>https://newsroom.live</link>
    <description>Investigative reporting, macroeconomic intelligence, and tech analysis.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://newsroom.live/feed.xml" rel="self" type="application/rss+xml" />
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
