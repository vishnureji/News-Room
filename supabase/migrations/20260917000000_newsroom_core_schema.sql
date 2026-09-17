-- =====================================================================
-- AMG NEWSROOM OPERATING SYSTEM - MASTER DATABASE SCHEMA & RLS POLICIES
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Roles & Granular Permissions
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT UNIQUE NOT NULL, -- e.g. 'articles:publish', 'media:delete'
    module TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    designation TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    is_author BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Taxonomies
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT,
    display_order INT DEFAULT 0,
    seo_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS series (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Media (Cloudflare R2 Integration)
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    width INT,
    height INT,
    r2_key TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    credit TEXT,
    focal_x NUMERIC(5,2) DEFAULT 50.0,
    focal_y NUMERIC(5,2) DEFAULT 50.0,
    variants JSONB DEFAULT '{}'::jsonb,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Articles & Editorial Workflow
DO $$ BEGIN
    CREATE TYPE article_status AS ENUM (
        'draft', 'in_review', 'changes_requested', 'approved', 'scheduled', 'published', 'archived'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    excerpt TEXT,
    content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
    featured_image_id UUID REFERENCES media(id),
    primary_category_id UUID REFERENCES categories(id),
    series_id UUID REFERENCES series(id),
    series_order INT,
    status article_status NOT NULL DEFAULT 'draft',
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'members_only', 'paywall_premium')),
    reading_time_mins INT DEFAULT 1,
    scheduled_for TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS article_authors (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'primary_author',
    display_order INT DEFAULT 0,
    PRIMARY KEY (article_id, author_id)
);

CREATE TABLE IF NOT EXISTS article_tags (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE IF NOT EXISTS article_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    content_blocks JSONB NOT NULL,
    diff_summary JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    assigned_to UUID REFERENCES auth.users(id),
    assigned_by UUID REFERENCES auth.users(id),
    deadline TIMESTAMPTZ,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'breaking')),
    status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'submitted', 'completed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS breaking_news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    summary TEXT,
    target_url TEXT,
    priority INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seo_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    canonical_url TEXT,
    focus_keyword TEXT,
    og_title TEXT,
    og_description TEXT,
    og_image_url TEXT,
    twitter_title TEXT,
    twitter_description TEXT,
    twitter_image_url TEXT,
    schema_type TEXT DEFAULT 'NewsArticle',
    score NUMERIC(5,2),
    score_breakdown JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS redirects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    old_path TEXT UNIQUE NOT NULL,
    new_path TEXT NOT NULL,
    status_code INT DEFAULT 301 CHECK (status_code IN (301, 302, 410)),
    hit_count INT DEFAULT 0,
    last_accessed TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS) Policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public can read published articles
CREATE POLICY "Public Read Published Articles" ON articles
    FOR SELECT USING (status = 'published');

-- Authenticated editorial staff can view and manage articles
CREATE POLICY "Staff Full Article Access" ON articles
    FOR ALL TO authenticated USING (true);
