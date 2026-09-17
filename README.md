# AMG Newsroom Operating System

A production-ready, dark-themed newsroom operating system built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Supabase (PostgreSQL with RLS)**, and **Cloudflare R2** ($0-egress edge storage).

---

## 📖 Complete Master Guide & Architecture Manual
For complete documentation, architectural diagrams, feature walkthroughs, database schemas, and step-by-step hosting instructions, see:
👉 **[NEWSROOM_PLATFORM_MASTER_GUIDE.md](./NEWSROOM_PLATFORM_MASTER_GUIDE.md)**

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or [http://localhost:3001](http://localhost:3001)) in your browser.

### 3. Type Checking & Production Build
```bash
# Type check (0 errors)
npx tsc --noEmit

# Compile production build (32/32 routes)
npm run build

# Start production server
npm start
```

---

## 🌟 Core Feature Modules

- **Editorial CMS & 15+ Block Canvas**: Paragraphs with dropcap, Headings H1-H4, Pullquotes, Quotes, R2 Images with focal-crop, Galleries, 4K Video, Podcast Audio, Tables, Lists, CTAs, Embeds, Ads, Newsletter Units, and Custom HTML.
- **Newsroom Collaboration & Workflows**: Multi-user assignments desk, priority matrix (Breaking/High/Medium/Low), deadline countdowns, threaded editorial comments with `@mentions`, editorial publishing calendar (Month/Week/Day), real-time notification drawer.
- **Cloudflare R2 Media Hub**: Zero-egress bucket integration (`newsroom-assets-prod`), folder taxonomy (`/images/`, `/videos/`, `/audio/`, `/documents/`, `unused`), interactive focal point crop studio (`16:9`, `4:3`, `1:1`, `9:16`, `3:2`), video player, audio player with Speech-to-Text transcript drawer, deep usage audit, bulk purge.
- **Modular Homepage Builder & Public Reader Portal**: Drag & drop section reordering, 8 layout archetypes (`hero_plus_two`, `trending_strip`, `three_column_grid`, `magazine_split`, `video_showcase`, `carousel`, `newsletter_cta`, `sponsor_leaderboard`), category hubs, keyword search archive, reader account & bookmarking portal.
- **Editorial SEO Suite & Syndication**: 96/100 health diagnostics, Google News XML sitemap (`/news-sitemap.xml`), Master post sitemap (`/sitemap.xml`), RSS 2.0 feed (`/feed.xml`), robots.txt, 301/302/410 redirect engine, SERP desktop/mobile preview simulator, Schema.org JSON-LD generator.
- **Monetization, Advertising & Newsletters**: Multi-format direct CPM ad inventory, 1-click auto-curated email dispatches, subscriber segmentation, 3-tier reader membership ($0, $9/mo Pro, $29/mo Founding Member) with paywall gates.
- **Editorial AI Co-Pilot & First-Party Analytics**: Headline generators, SEO payload builders, dwell time & concurrent readers telemetry.
- **Granular RBAC**: 13 roles and permissions matrix.

---

## 🗄️ Database & Cloudflare Storage
- **PostgreSQL Schema**: Complete Supabase SQL migration with RLS policies located in [`supabase/migrations/20260917000000_newsroom_core_schema.sql`](./supabase/migrations/20260917000000_newsroom_core_schema.sql).
- **Cloudflare R2 Bucket**: Bound to custom domain `media.newsroom.com` with immutable edge caching headers (`Cache-Control: public, max-age=31536000, immutable`).

---

*© 2026 AMG Newsroom Operating System. All rights reserved.*
