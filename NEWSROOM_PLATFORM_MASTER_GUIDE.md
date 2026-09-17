# AMG Newsroom Operating System — Complete Production Guide & Architecture Manual

> **Version:** 1.0.0-PROD  
> **Target Audience:** Engineering Leads, DevOps, Editors-in-Chief, Editorial Teams & System Administrators.  
> **Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Supabase (PostgreSQL with RLS), Cloudflare R2 ($0-egress edge storage).

---

## 📑 Table of Contents
1. [Executive Product Overview](#1-executive-product-overview)
2. [High-Level Architecture & Data Flow](#2-high-level-architecture--data-flow)
3. [Comprehensive Feature Catalog](#3-comprehensive-feature-catalog)
   - [3.1 Editorial CMS & 15+ Block Canvas](#31-editorial-cms--15-block-canvas)
   - [3.2 Newsroom Collaboration & Publishing Workflow](#32-newsroom-collaboration--publishing-workflow)
   - [3.3 Cloudflare R2 Media Management & Focal Crop Studio](#33-cloudflare-r2-media-management--focal-crop-studio)
   - [3.4 Modular Homepage Builder & Public Reader Portal](#34-modular-homepage-builder--public-reader-portal)
   - [3.5 Editorial SEO Suite, XML Sitemaps & Redirect Engine](#35-editorial-seo-suite-xml-sitemaps--redirect-engine)
   - [3.6 Monetization, Advertising & Newsletter Automation](#36-monetization-advertising--newsletter-automation)
   - [3.7 Editorial AI Co-Pilot & 1st-Party Analytics](#37-editorial-ai-co-pilot--1st-party-analytics)
   - [3.8 Granular Role-Based Access Control (RBAC)](#38-granular-role-based-access-control-rbac)
4. [Database Schema & Supabase Setup](#4-database-schema--supabase-setup)
5. [Cloudflare R2 Bucket & Edge CDN Configuration](#5-cloudflare-r2-bucket--edge-cdn-configuration)
6. [Environment Variables Reference](#6-environment-variables-reference)
7. [Deployment & Production Hosting Guide](#7-deployment--production-hosting-guide)
   - [Deploying to Vercel](#deploying-to-vercel)
   - [Deploying with Docker](#deploying-with-docker)
   - [Self-Hosting on Linux VPS (Ubuntu / NGINX / Node.js)](#self-hosting-on-linux-vps)
8. [Local Development, Verification & Operations](#8-local-development-verification--operations)

---

## 1. Executive Product Overview

The **AMG Newsroom Operating System** is an enterprise-grade digital publishing platform engineered for investigative publications, media companies, macroeconomic intelligence desks, and high-volume news organizations. 

### Core Design Principles:
- **Visual Distinction:** Curated dark-themed newsroom aesthetic with high contrast, editorial serif headlines (`Playfair Display` / `Cinzel`), clean sans-serif UI typography (`Inter` / `Outfit`), and smooth micro-animations.
- **Decoupled Architecture:** The Next.js frontend interacts exclusively through a unified Service Layer (`lib/services/newsroom-service.ts`), enabling instant local evaluation or seamless backend binding to live Supabase PostgreSQL and Cloudflare R2 buckets.
- **Zero-Egress Media Economics:** All high-resolution photography, 4K video feeds, podcasts, and PDF annexures are routed through Cloudflare R2, eliminating expensive cloud egress fees.
- **Full SEO & Google News Syndication:** Instant generation of Google News XML sitemaps, master post sitemaps, RSS 2.0 feeds, `robots.txt`, and automated `NewsArticle` JSON-LD schemas.

---

## 2. High-Level Architecture & Data Flow

```
                                   [ WEB BROWSER / READERS ]
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      │                                               │
             [ Public Reader Portal ]                        [ Admin Newsroom Shell ]
           - Homepage (8 Dynamic Layouts)                  - Command Desk & Story Canvas
           - Article Reader (15+ Blocks)                   - Assignment Desk & Calendar
           - Category Archives                             - Cloudflare R2 Media Studio
           - Search, Account & Paywall                     - SEO & Redirect Engine
           - RSS 2.0 & News Sitemaps                       - Ads & Newsletter Desks
                      │                                               │
                      └───────────────────────┬───────────────────────┘
                                              │
                                   [ UNIFIED SERVICE LAYER ]
                                (lib/services/newsroom-service.ts)
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         [ SUPABASE POSTGRESQL + RLS ]                     [ CLOUDFLARE R2 BUCKET ]
       - 18 Relational Tables                            - newsroom-assets-prod
       - Row-Level Security (RBAC)                       - WebP / AVIF Variants
       - Full-Text Search Indices                        - 4K Video Streams & Audio Podcasts
       - Realtime Revisions & Comments                   - Immutable Edge Caching
```

---

## 3. Comprehensive Feature Catalog

### 3.1 Editorial CMS & 15+ Block Canvas
- **15+ Specialized Block Types:**
  1. `Paragraph`: Dropcap styling option, rich inline formatting, link annotations.
  2. `Heading (H1-H4)`: Hierarchical story anchors.
  3. `Image`: Cloudflare R2 URL integration, focal point crop, caption, and photographer credit.
  4. `Gallery`: Multi-image responsive grid with lightbox support.
  5. `Video`: 4K / 1080p streamable video player with chapter markers and transcript snippet.
  6. `Audio`: Podcast player with waveform simulation and speech-to-text transcript.
  7. `Pullquote`: Highlighted editorial quotes with author title and red accent borders.
  8. `Quote`: Classic blockquote with citation.
  9. `List`: Ordered and unordered bulleted items.
  10. `Table`: Multi-column financial and tabular comparison matrix.
  11. `Button / CTA`: Outbound external action button with target routing.
  12. `Divider`: Clean horizontal section demarcation.
  13. `Embed`: YouTube, X (Twitter), Instagram, and Google Maps embed codes.
  14. `Advertisement`: In-feed sponsorship banner placeholder.
  15. `Newsletter Signup`: Embedded subscription unit.
  16. `Custom HTML`: Raw code injector for interactive charts, TradingView widgets, etc.
- **Story Version Control & Diffs:** Visual side-by-side diff viewer showing exact character/block changes between revisions with 1-click restore.
- **Real-Time SEO Scorer (0-100):** Evaluates keyword density, title character bounds, meta descriptions, image alt tags, and internal link suggestions.
- **Responsive Simulator:** 1-click preview across **Desktop**, **Tablet**, and **Mobile** viewports.

### 3.2 Newsroom Collaboration & Publishing Workflow
- **Newsroom Command Desk (`/admin`):** Real-time pipeline counters (Draft, In Review, Scheduled, Published), concurrent reader gauge, activity timeline, and urgent assignment alerts.
- **Live Notification Center:** Top navigation bell icon with unread badge and dropdown alert drawer.
- **Assignments Desk (`/admin/assignments`):** Assign story briefs, set priorities (`Breaking`, `High`, `Medium`, `Low`), track countdown timers, and click **"Open in Story Canvas"** to launch a linked draft.
- **Editorial Publishing Calendar (`/admin/calendar`):** Switch between **Month**, **Week**, and **Day** views with interactive story rescheduling.
- **Breaking News Broadcast (`/admin/breaking-news`):** Broadcast high-priority red alert banners across the public header with target URLs.
- **Threaded Review Comments:** In-editor comment system with `@mentions` and resolve/reopen states.

### 3.3 Cloudflare R2 Media Management & Focal Crop Studio
- **Storage Metrics Bar:** Live tracking of storage utilized, total assets, WebP/AVIF images, 4K videos, audio podcasts, PDF whitepapers, and **$0 egress fees saved**.
- **Categorized Folder Views:** `/images/`, `/videos/`, `/audio/`, `/documents/`, and `unused` (orphan media detection).
- **Interactive Focal-Point Crop Studio:** Click or drag on the canvas to set exact `focal_x` and `focal_y` coordinates.
- **Live Multi-Aspect Simulator:** Live preview for `16:9` (Lead Hero), `4:3` (Story Card), `1:1` (Square/Social), `9:16` (Vertical Story), and `3:2` (Editorial Classic).
- **Deep Usage Audit:** Lists every published article, section hub, and newsletter referencing each media asset with 1-click jump links directly into the story editor.
- **Safe Deletion & Bulk Purge:** Blocks deletion of assets in active use while enabling 1-click bulk cleanup of orphan assets.
- **Presigned R2 Upload Drawer:** Mime-type auto-detection, credit attribution, alt text, and simulated WebP/AVIF multi-device variant generation (`320w`, `1024w`, `1600w`, `2400w`).

### 3.4 Modular Homepage Builder & Public Reader Portal
- **Homepage Layout Builder (`/admin/homepage-builder`):**
  - Instant Move Up / Down section reordering with real-time public site synchronization.
  - **8 Layout Archetypes:**
    1. `hero_plus_two`: 8-column lead investigation + 4-column strategic briefing rail.
    2. `trending_strip`: Real-time developments ticker with red pulse and timestamps.
    3. `three_column_grid`: Triad coverage cards with reading time badges and category tags.
    4. `magazine_split`: 7-column featured story + 4 numbered (`01-04`) compact headlines.
    5. `video_showcase`: 4K video player + audio podcast player with transcript drawer.
    6. `carousel`: Opinion & analyst commentary cards with circular author avatars.
    7. `newsletter_cta`: Morning Intelligence Briefing subscription unit.
    8. `sponsor_leaderboard`: Dynamic in-feed sponsorship banner.
- **Public Reader Experience (`/`):**
  - Breaking news banner linked to live bulletins.
  - Category archive hubs (`/national`, `/business`, `/tech`, `/world`, `/opinion`, `/culture`).
  - Search engine (`/search`) with real-time keyword filtering.
  - Reader membership portal (`/account`) with saved bookmarks and subscriber tiers.
  - Full article renderer (`/article/[slug]`) with JSON-LD schema, author bio cards, reader comments, and paywall gates.

### 3.5 Editorial SEO Suite, XML Sitemaps & Redirect Engine
- **Health Diagnostic Engine (`/admin/seo`):** Real-time 96/100 Grade A+ score tracking schema compliance, self-referencing canonicals, OpenGraph cards, and alt-text completeness.
- **Discovery Feeds Hub:**
  - `Google News Dedicated XML Sitemap` (`/news-sitemap.xml`)
  - `Master Post XML Sitemap` (`/sitemap.xml`)
  - `Global RSS 2.0 Feed` (`/feed.xml`)
  - `Search Robots Directive` (`/robots.txt`)
  - `IndexNow & Search Engine Ping` with live response console.
- **URL Redirection Engine:** 301 Permanent, 302 Temporary, and 410 Content Gone redirect rules with hit counters, last-accessed timestamps, and active/paused toggles.
- **Google SERP Visual Simulator:** Desktop and Mobile preview simulator of Google search snippets.

### 3.6 Monetization, Advertising & Newsletter Automation
- **Advertising Desk (`/admin/advertising`):** Header leaderboards (`728x90`/`970x250`), in-article banners (`600x250`), sidebar skyscrapers (`300x600`), and footer billboards with CPM yield calculations, impressions, clicks, and CTR telemetry.
- **Newsletter Automation (`/admin/newsletters`):**
  - Audience segments: `All Executive Subscribers` (42.8k), `Technology & AI Leaders` (18.5k), `Macro & Policy Analysts` (12.4k), `Founding Pro Members` (2.8k).
  - **1-Click Auto-Curation:** Automatically queries the latest published investigations and builds email-ready HTML briefings.
  - Scheduling (06:00 AM) or instant broadcast with open rate and click rate tracking.
- **Paywall & Subscriptions (`/account`):** Free ($0), Intelligence Pro ($9/mo or $89/yr), and Founding Institutional ($29/mo or $249/yr).

### 3.7 Editorial AI Co-Pilot & 1st-Party Analytics
- **AI Tools (`/admin/ai-tools`):** Real-time generation of 4 compelling headline variations, concise executive excerpts, SEO meta titles/descriptions, and multi-language translations.
- **First-Party Analytics (`/admin/analytics`):** Real-time concurrent reader gauge, dwell time tracking, top stories leaderboard, traffic acquisition breakdown (Direct, Organic Search, Newsletters, Social), and device telemetry (Mobile, Desktop, Tablet).

### 3.8 Granular Role-Based Access Control (RBAC)
- 13 Granular Roles (`Super Admin`, `Administrator`, `Editor-in-Chief`, `Managing Editor`, `Editor`, `Sub Editor`, `Reporter`, `Contributor`, `Photographer`, `Video Editor`, `SEO Manager`, `Advertising Manager`, `Analyst`).
- Permissions matrix for article creation, editorial review, one-click publishing, breaking news override, media library upload, ad management, and audit log inspection.

---

## 4. Database Schema & Supabase Setup

The database is built on **PostgreSQL** with **Row-Level Security (RLS)**. The full migration file is located at `supabase/migrations/20260917000000_newsroom_core_schema.sql`.

### Relational Tables Included:
1. `authors` — Profile metadata, designations, bio, avatars, social links.
2. `categories` — Parent/child vertical taxonomy, display order, slugs.
3. `tags` — Story topic tags and slugs.
4. `media_assets` — Cloudflare R2 keys, focal coordinates (`focal_x`, `focal_y`), dimensions, variants, transcripts.
5. `articles` — Slugs, headlines, excerpts, visibility (`public`/`members_only`/`paywall_premium`), reading time.
6. `editor_blocks` — Structured block content JSON (ordered by `position_order`).
7. `article_authors` — Multi-author byline join table with lead/contributor flags.
8. `article_tags` — Article-to-tag mapping.
9. `article_revisions` — Version history snapshots, diff notes, author tracking.
10. `article_comments` — Threaded desk review comments with resolved flags.
11. `assignments` — Story briefs, priority matrix, deadlines, assignee tracking.
12. `breaking_news` — Emergency bulletin broadcast queue.
13. `ad_slots` — Direct banner placements, CPM rates, impressions, clicks.
14. `redirect_rules` — 301, 302, 410 redirect mapping with hit counters.
15. `homepage_sections` — Dynamic homepage layout order and category filters.
16. `newsletter_campaigns` — Subject lines, recipient segments, open rates.
17. `reader_bookmarks` — Reader account saved stories.
18. `audit_logs` — Immutable audit trail of newsroom actions.

### Running Supabase Migrations:
```bash
# 1. Install Supabase CLI (if not already installed)
npm install -g supabase

# 2. Login to your Supabase account
supabase login

# 3. Link to your cloud Supabase project
supabase link --project-ref your-project-ref

# 4. Push migration schema to PostgreSQL database
supabase db push
```

---

## 5. Cloudflare R2 Bucket & Edge CDN Configuration

### Step 1: Create R2 Bucket
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **R2 Object Storage** > **Create Bucket**.
3. Name the bucket: `newsroom-assets-prod`.
4. Set default storage class to **Standard**.

### Step 2: Configure Custom Domain (Zero-Egress CDN)
1. Inside bucket settings, click **Connect Domain**.
2. Attach your custom media domain: `media.yourdomain.com` (e.g. `media.newsroom.com`).
3. Cloudflare automatically issues a global SSL certificate and caches assets across 300+ edge PoPs.

### Step 3: CORS Configuration
In bucket settings, add the following CORS policy:
```json
[
  {
    "AllowedOrigins": [
      "https://yourdomain.com",
      "https://*.yourdomain.com",
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

### Step 4: S3-Compatible API Credentials
1. Under Cloudflare R2, navigate to **Manage R2 API Tokens**.
2. Click **Create API Token** with `Object Read & Write` permissions.
3. Note down:
   - **Access Key ID**
   - **Secret Access Key**
   - **Endpoint URL**: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`

---

## 6. Environment Variables Reference

Create a `.env.local` file in your project root:

```env
# ==========================================
# 1. PUBLIC PLATFORM CONFIGURATION
# ==========================================
NEXT_PUBLIC_SITE_URL=https://newsroom.live
NEXT_PUBLIC_SITE_NAME="AMG Newsroom"
NEXT_PUBLIC_SITE_DESCRIPTION="Global Journalism & Macroeconomic Intelligence"

# ==========================================
# 2. SUPABASE POSTGRESQL & AUTH
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ==========================================
# 3. CLOUDFLARE R2 MEDIA STORAGE
# ==========================================
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=newsroom-assets-prod
NEXT_PUBLIC_R2_PUBLIC_URL=https://media.newsroom.com

# ==========================================
# 4. STRIPE / MONETIZATION (Optional for Live Billing)
# ==========================================
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 7. Deployment & Production Hosting Guide

### Deploying to Vercel (Recommended)

1. Push your repository to GitHub / GitLab.
2. Go to [Vercel Dashboard](https://vercel.com) > **Add New Project**.
3. Import your newsroom repository.
4. Framework Preset: **Next.js**.
5. Add the environment variables from [Section 6](#6-environment-variables-reference).
6. Click **Deploy**. Vercel will build all 32 static/dynamic routes in ~25 seconds.

---

### Deploying with Docker

A production `Dockerfile` is provided below:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run the container:
```bash
# Build Docker image
docker build -t amg-newsroom-os:latest .

# Run container on port 3000
docker run -d -p 3000:3000 --env-file .env.local --name newsroom-app amg-newsroom-os:latest
```

---

### Self-Hosting on Linux VPS (Ubuntu / NGINX / Node.js)

```bash
# 1. Update packages & install Node.js 20 & PM2
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2

# 2. Clone repository & install dependencies
git clone https://github.com/your-org/newsroom-platform.git /var/www/newsroom
cd /var/www/newsroom
npm ci

# 3. Create .env.local and compile production bundle
nano .env.local # (paste environment variables)
npm run build

# 4. Start application with PM2 process manager
pm2 start npm --name "newsroom-os" -- start
pm2 save
pm2 startup

# 5. Configure NGINX Reverse Proxy
sudo nano /etc/nginx/sites-available/newsroom
```

NGINX Configuration (`/etc/nginx/sites-available/newsroom`):
```nginx
server {
    listen 80;
    server_name newsroom.live www.newsroom.live;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable NGINX site and install free SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/newsroom /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install SSL with Certbot
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d newsroom.live -d www.newsroom.live
```

---

## 8. Local Development, Verification & Operations

### Quick Start Commands:
```bash
# 1. Install dependencies
npm install

# 2. Start local development server (with hot-reloading)
npm run dev
# -> Opens http://localhost:3000 or http://localhost:3001

# 3. Type-check TypeScript codebase (Strict zero-error mode)
npx tsc --noEmit

# 4. Compile optimized production build (32/32 routes)
npm run build

# 5. Run production build locally
npm run start
```

### Route Sitemap & Key Endpoints:
| Route | Description |
|---|---|
| `/` | Curated public reader homepage (8 dynamic layouts) |
| `/article/[slug]` | Complete 15+ block article reader with JSON-LD schema |
| `/[category]` | Beat archives (`/national`, `/business`, `/tech`, `/world`, etc.) |
| `/search` | Real-time archive search engine |
| `/account` | Reader account, bookmarks & Pro subscription tiers |
| `/newsletter` | Public newsletter signup portal |
| `/admin` | Newsroom Command Desk & activity stream |
| `/admin/articles` | Article CMS & publishing pipeline |
| `/admin/articles/[id]/edit` | 15+ block canvas editor with focal crop & diff viewer |
| `/admin/assignments` | Story assignment desk with priority matrix & countdowns |
| `/admin/calendar` | Multi-view editorial calendar (Month/Week/Day) |
| `/admin/breaking-news` | Emergency bulletin broadcast desk |
| `/admin/media` | Cloudflare R2 media hub & focal point studio |
| `/admin/homepage-builder`| Reorderable section layout composer |
| `/admin/seo` | SEO health audit & 301/302 redirect engine |
| `/admin/advertising` | Programmatic & direct CPM ad desk |
| `/admin/newsletters` | Campaign composer with 1-click auto-curation |
| `/admin/analytics` | 1st-party dwell time & concurrent readers dashboard |
| `/admin/roles` | Granular 13-role RBAC permissions matrix |
| `/admin/ai-tools` | Headline generators, SEO payload builders & translations |
| `/news-sitemap.xml` | Google News Dedicated XML Sitemap |
| `/sitemap.xml` | Master Post XML Sitemap |
| `/feed.xml` | Global RSS 2.0 Syndication Feed |
| `/robots.txt` | Search Robots Crawler Directive |

---

*© 2026 AMG Newsroom Operating System. Built with Next.js 15, Supabase, and Cloudflare R2.*
