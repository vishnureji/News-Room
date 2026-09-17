import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/admin/'],
      },
      {
        userAgent: 'Googlebot-News',
        allow: '/',
      },
    ],
    sitemap: [
      'https://newsroom.live/sitemap.xml',
      'https://newsroom.live/news-sitemap.xml',
    ],
  };
}
