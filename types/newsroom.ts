export type RoleType =
  | 'Super Admin'
  | 'Administrator'
  | 'Editor-in-Chief'
  | 'Managing Editor'
  | 'Editor'
  | 'Sub Editor'
  | 'Reporter'
  | 'Contributor'
  | 'Photographer'
  | 'Video Editor'
  | 'SEO Manager'
  | 'Advertising Manager'
  | 'Analyst';

export type ArticleStatus =
  | 'draft'
  | 'in_review'
  | 'changes_requested'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'archived';

export type VisibilityType = 'public' | 'members_only' | 'paywall_premium';

export type BlockType =
  | 'paragraph'
  | 'heading'
  | 'image'
  | 'gallery'
  | 'video'
  | 'audio'
  | 'quote'
  | 'pullquote'
  | 'list'
  | 'table'
  | 'button'
  | 'divider'
  | 'embed'
  | 'advertisement'
  | 'related_articles'
  | 'newsletter_signup'
  | 'custom_html';

export interface EditorBlock {
  id: string;
  type: BlockType;
  content: Record<string, any>;
  settings?: {
    align?: 'left' | 'center' | 'right' | 'wide' | 'full';
    level?: 1 | 2 | 3 | 4;
    caption?: string;
    alt?: string;
    credit?: string;
    embedType?: 'youtube' | 'x' | 'instagram' | 'google_maps';
    embedUrl?: string;
    adSlotId?: string;
    dropcap?: boolean;
    styleVariant?: string;
  };
}

export interface AuthorProfile {
  id: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  designation?: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    website?: string;
  };
  role: RoleType;
  is_author: boolean;
}

export interface Category {
  id: string;
  parent_id?: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  display_order: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Series {
  id: string;
  title: string;
  slug: string;
  description?: string;
  cover_image_url?: string;
}

export type MediaCategory = 'images' | 'videos' | 'audio' | 'documents' | 'unused';

export interface MediaAsset {
  id: string;
  filename: string;
  mime_type: string;
  file_size: number;
  width?: number;
  height?: number;
  storage_path: string;
  r2_key?: string;
  bucket_name?: string;
  url: string;
  alt_text?: string;
  caption?: string;
  credit?: string;
  folder?: 'images' | 'videos' | 'audio' | 'documents';
  year?: string;
  focal_x: number;
  focal_y: number;
  usage_count: number;
  used_in?: {
    articles?: { id: string; title: string }[];
    pages?: string[];
    newsletters?: string[];
  };
  duration?: string;
  transcript?: string;
  variants?: {
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    xlarge?: string;
    webp?: string;
    avif?: string;
  };
  uploaded_by: string;
  created_at: string;
}

export interface SEOMetadata {
  meta_title: string;
  meta_description: string;
  canonical_url?: string;
  focus_keyword?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image_url?: string;
  schema_type: 'NewsArticle' | 'Article' | 'OpinionNewsArticle' | 'ReportageNewsArticle';
  score?: number;
  score_breakdown?: {
    passed: string[];
    warnings: string[];
  };
}

export interface DiffFieldChange {
  field: string;
  old_value: any;
  new_value: any;
}

export interface ArticleRevision {
  id: string;
  article_id: string;
  version_number: number;
  changed_by_name: string;
  title: string;
  content_blocks: EditorBlock[];
  created_at: string;
  diff_notes?: string;
  changes?: DiffFieldChange[];
}

export interface ArticleComment {
  id: string;
  article_id: string;
  user_name: string;
  user_avatar?: string;
  user_role?: string;
  content: string;
  is_resolved: boolean;
  created_at: string;
  replies?: ArticleComment[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  content_blocks: EditorBlock[];
  featured_image?: MediaAsset;
  featured_image_id?: string;
  primary_category?: Category;
  primary_category_id?: string;
  subcategory_id?: string;
  authors: AuthorProfile[];
  tags: Tag[];
  series?: Series;
  series_id?: string;
  series_order?: number;
  location?: string;
  status: ArticleStatus;
  visibility: VisibilityType;
  reading_time_mins: number;
  seo: SEOMetadata;
  scheduled_for?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  revisions_count?: number;
  revisions?: ArticleRevision[];
  comments?: ArticleComment[];
}

export interface Assignment {
  id: string;
  article_id?: string;
  article_title?: string;
  title: string;
  assigned_to_name: string;
  assigned_to_avatar?: string;
  assigned_by_name: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high' | 'breaking';
  status: 'assigned' | 'in_progress' | 'submitted' | 'completed';
  notes?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  type:
    | 'assignment_dispatched'
    | 'review_requested'
    | 'changes_requested'
    | 'article_approved'
    | 'article_published'
    | 'comment_mentioned'
    | 'deadline_approaching';
  title: string;
  message: string;
  target_url?: string;
  actor_name: string;
  actor_avatar?: string;
  is_read: boolean;
  created_at: string;
}

export interface BreakingNewsItem {
  id: string;
  title: string;
  summary?: string;
  target_url?: string;
  priority: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

export interface RedirectRule {
  id: string;
  old_path: string;
  new_path: string;
  status_code: 301 | 302 | 410;
  hit_count: number;
  is_active?: boolean;
  notes?: string;
  last_accessed?: string;
  created_at: string;
}

export interface AdSlot {
  id: string;
  name: string;
  advertiser_name?: string;
  slot_type: 'header' | 'in_article' | 'sidebar' | 'between_articles' | 'sticky_bottom';
  ad_type: 'custom_banner' | 'html_code' | 'google_ad_manager';
  image_url?: string;
  destination_url?: string;
  html_code?: string;
  cpm_rate?: number;
  category_target?: string;
  is_active: boolean;
  impressions: number;
  clicks: number;
}

export interface NewsletterCampaign {
  id: string;
  subject: string;
  preview_text: string;
  recipient_list: string;
  content_html?: string;
  article_ids?: string[];
  status: 'draft' | 'scheduled' | 'sent';
  sent_at?: string;
  scheduled_for?: string;
  recipients_count: number;
  open_rate?: number;
  click_rate?: number;
  created_at?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  price_annual: number;
  description: string;
  features: string[];
  is_popular?: boolean;
}

export interface HomepageSection {
  id: string;
  title: string;
  subtitle?: string;
  layout:
    | 'hero_plus_two'
    | 'three_column_grid'
    | 'four_column_cards'
    | 'magazine_split'
    | 'carousel'
    | 'video_showcase'
    | 'trending_strip'
    | 'newsletter_cta'
    | 'sponsor_leaderboard';
  category_id?: string;
  article_ids?: string[];
  display_order: number;
  show_ads?: boolean;
}
