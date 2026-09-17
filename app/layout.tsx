import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AMG Newsroom | Global Journalism & Editorial Intelligence',
  description: 'A production-grade newsroom operating system delivering investigative reporting, real-time economic intelligence, and deep-tech analysis.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'AMG Newsroom',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0b0f19] text-[#e2e8f0] antialiased selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
