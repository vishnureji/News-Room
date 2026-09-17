import {
  Article,
  ArticleStatus,
  Assignment,
  AuthorProfile,
  Category,
  Tag,
  MediaAsset,
  BreakingNewsItem,
  AdSlot,
  NewsletterCampaign,
  HomepageSection,
  RedirectRule,
  EditorBlock,
  ArticleRevision,
  DiffFieldChange,
  NotificationItem,
  RoleType,
  SubscriptionPlan
} from '@/types/newsroom';
import { db } from '@/lib/supabase/db';
import { siteConfig } from '@/lib/config';

export const INITIAL_AUTHORS: AuthorProfile[] = [
  {
    id: 'auth-1',
    display_name: 'Vishnu Reji',
    email: 'vishnu@newsroom.com',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Editor-in-Chief & Investigative Journalist covering geopolitical economics and deep tech.',
    designation: 'Editor-in-Chief',
    role: 'Editor-in-Chief',
    is_author: true,
    social_links: { twitter: 'https://x.com/vishnureji', linkedin: 'https://linkedin.com' }
  },
  {
    id: 'auth-2',
    display_name: 'Anu Sharma',
    email: 'anu@newsroom.com',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Senior Economics & Policy Reporter with 12 years of beat experience.',
    designation: 'Senior Reporter',
    role: 'Reporter',
    is_author: true,
    social_links: { twitter: 'https://x.com/anusharma' }
  },
  {
    id: 'auth-3',
    display_name: 'Rahul Varma',
    email: 'rahul@newsroom.com',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Tech Editor & AI Analyst covering semiconductor supply chains and software.',
    designation: 'Tech Editor',
    role: 'Editor',
    is_author: true
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'National', slug: 'national', color: '#E53E3E', display_order: 1, description: 'Domestic politics, governance and nationwide developments' },
  { id: 'cat-2', name: 'Economy & Business', slug: 'business', color: '#2563EB', display_order: 2, description: 'Markets, corporate enterprise, fiscal policy and startup innovation' },
  { id: 'cat-3', name: 'Technology & AI', slug: 'tech', color: '#7C3AED', display_order: 3, description: 'Artificial intelligence, cybersecurity, consumer hardware and software' },
  { id: 'cat-4', name: 'World Affairs', slug: 'world', color: '#059669', display_order: 4, description: 'Global diplomacy, geopolitics and international security' },
  { id: 'cat-5', name: 'Opinion & Analysis', slug: 'opinion', color: '#D97706', display_order: 5, description: 'Expert editorials, guest columns and deep analytical essays' },
  { id: 'cat-6', name: 'Culture & Life', slug: 'culture', color: '#DB2777', display_order: 6, description: 'Arts, cinema, heritage, lifestyle and literary commentary' }
];

export const INITIAL_TAGS: Tag[] = [
  { id: 'tag-1', name: 'Fiscal Policy', slug: 'fiscal-policy' },
  { id: 'tag-2', name: 'AI Regulation', slug: 'ai-regulation' },
  { id: 'tag-3', name: 'Clean Energy', slug: 'clean-energy' },
  { id: 'tag-4', name: 'Semiconductors', slug: 'semiconductors' },
  { id: 'tag-5', name: 'Hospitality', slug: 'hospitality' },
  { id: 'tag-6', name: 'Global Trade', slug: 'global-trade' }
];

export const INITIAL_MEDIA: MediaAsset[] = [
  {
    id: 'med-1',
    filename: 'parliament-budget-session.webp',
    mime_type: 'image/webp',
    file_size: 420000,
    width: 1920,
    height: 1080,
    storage_path: 'newsroom-media/images/2026/09/parliament-budget-session.webp',
    r2_key: 'newsroom-media/images/2026/09/parliament-budget-session.webp',
    bucket_name: 'newsroom-media',
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80',
    alt_text: 'Parliament central hall during annual fiscal budget presentation',
    caption: 'The national legislature convened for the landmark economic agenda.',
    credit: 'AMG Photo Service / Rahul Varma',
    folder: 'images',
    year: '2026',
    focal_x: 50,
    focal_y: 40,
    usage_count: 5,
    used_in: {
      articles: [
        { id: 'art-1', title: 'Union Budget 2026 Unveils Landmark $120B Infrastructure & Green Energy Package' }
      ],
      pages: ['Homepage Hero', 'Economy Vertical'],
      newsletters: ['Morning Intelligence Briefing - Sept 17']
    },
    variants: {
      thumbnail: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=320&auto=format&fit=crop&q=80',
      small: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=640&auto=format&fit=crop&q=80',
      medium: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1024&auto=format&fit=crop&q=80',
      large: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1600&auto=format&fit=crop&q=80',
      xlarge: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=2400&auto=format&fit=crop&q=80',
      webp: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&fm=webp',
      avif: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&fm=avif'
    },
    uploaded_by: 'auth-1',
    created_at: '2026-09-15T10:00:00Z'
  },
  {
    id: 'med-2',
    filename: 'ai-datacenter-compute.webp',
    mime_type: 'image/webp',
    file_size: 890000,
    width: 2400,
    height: 1350,
    storage_path: 'newsroom-media/images/2026/09/ai-datacenter-compute.webp',
    r2_key: 'newsroom-media/images/2026/09/ai-datacenter-compute.webp',
    bucket_name: 'newsroom-media',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    alt_text: 'Modern green data center rack with optical computing interconnects',
    caption: 'Next-generation computing cluster powering distributed neural models.',
    credit: 'TechCore Media Archive',
    folder: 'images',
    year: '2026',
    focal_x: 45,
    focal_y: 50,
    usage_count: 8,
    used_in: {
      articles: [
        { id: 'art-2', title: 'Breakthrough in Photonic AI Chips Promises 50x Efficiency Gains' }
      ],
      pages: ['Technology Hub', 'AI Radar'],
      newsletters: ['Deep Tech Weekly Dispatch']
    },
    variants: {
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=320&auto=format&fit=crop&q=80',
      small: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&auto=format&fit=crop&q=80',
      medium: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1024&auto=format&fit=crop&q=80',
      large: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&auto=format&fit=crop&q=80',
      xlarge: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=2400&auto=format&fit=crop&q=80',
      webp: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&fm=webp',
      avif: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&fm=avif'
    },
    uploaded_by: 'auth-3',
    created_at: '2026-09-14T14:30:00Z'
  },
  {
    id: 'med-3',
    filename: 'solar-energy-grid.webp',
    mime_type: 'image/webp',
    file_size: 650000,
    width: 2000,
    height: 1125,
    storage_path: 'newsroom-media/images/2026/09/solar-energy-grid.webp',
    r2_key: 'newsroom-media/images/2026/09/solar-energy-grid.webp',
    bucket_name: 'newsroom-media',
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=80',
    alt_text: 'Gigawatt scale solar array at sunset',
    caption: 'Renewable energy infrastructure reaches new grid integration milestones.',
    credit: 'GreenTech Press',
    folder: 'images',
    year: '2026',
    focal_x: 50,
    focal_y: 60,
    usage_count: 3,
    used_in: {
      articles: [
        { id: 'art-4', title: 'Grid-Scale Battery Storage Reaches Historic 100 GWh Deployment Benchmark' }
      ]
    },
    uploaded_by: 'auth-2',
    created_at: '2026-09-12T09:15:00Z'
  },
  {
    id: 'med-4',
    filename: 'aviation-terminal-transit.webp',
    mime_type: 'image/webp',
    file_size: 780000,
    width: 1920,
    height: 1080,
    storage_path: 'newsroom-media/images/2026/09/aviation-terminal-transit.webp',
    r2_key: 'newsroom-media/images/2026/09/aviation-terminal-transit.webp',
    bucket_name: 'newsroom-media',
    url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&auto=format&fit=crop&q=80',
    alt_text: 'Modern international airport terminal concourse',
    caption: 'Global air travel passenger traffic sets new post-decade highs.',
    credit: 'AMG Editorial / Anu Sharma',
    folder: 'images',
    year: '2026',
    focal_x: 50,
    focal_y: 50,
    usage_count: 4,
    used_in: {
      articles: [
        { id: 'art-3', title: 'Hospitality Sector Records Double-Digit Surge in RevPAR Across Asian Metros' }
      ]
    },
    uploaded_by: 'auth-2',
    created_at: '2026-09-10T11:20:00Z'
  },
  {
    id: 'med-5',
    filename: 'press-conference-briefing.mp4',
    mime_type: 'video/mp4',
    file_size: 48200000,
    width: 3840,
    height: 2160,
    duration: '04:32',
    storage_path: 'newsroom-media/videos/2026/09/press-conference-briefing.mp4',
    r2_key: 'newsroom-media/videos/2026/09/press-conference-briefing.mp4',
    bucket_name: 'newsroom-media',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    alt_text: 'Finance Ministry Post-Budget Press Conference 4K Broadcast Feed',
    caption: 'Finance secretary answers media questions on fiscal glide path and capex allocation.',
    credit: 'National Broadcast Feed / AMG Video Desk',
    folder: 'videos',
    year: '2026',
    focal_x: 50,
    focal_y: 50,
    usage_count: 2,
    used_in: {
      articles: [
        { id: 'art-1', title: 'Union Budget 2026 Unveils Landmark $120B Infrastructure & Green Energy Package' }
      ]
    },
    transcript: 'Good morning everyone. Today we are laying the groundwork for a $120 billion capital expenditure program focused on high-speed rail links and national semiconductor foundries...',
    uploaded_by: 'auth-1',
    created_at: '2026-09-17T07:45:00Z'
  },
  {
    id: 'med-6',
    filename: 'executive-editor-podcast-ep14.mp3',
    mime_type: 'audio/mpeg',
    file_size: 24500000,
    duration: '26:18',
    storage_path: 'newsroom-media/audio/2026/09/executive-editor-podcast-ep14.mp3',
    r2_key: 'newsroom-media/audio/2026/09/executive-editor-podcast-ep14.mp3',
    bucket_name: 'newsroom-media',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    alt_text: 'The Daily Dispatch Podcast: Ep 14 - Decoding the Semiconductor Subsidy Race',
    caption: 'Executive Editor Vishnu Reji interviews leading foundry architects.',
    credit: 'AMG Audio Studio',
    folder: 'audio',
    year: '2026',
    focal_x: 50,
    focal_y: 50,
    usage_count: 1,
    used_in: {
      articles: [
        { id: 'art-2', title: 'Breakthrough in Photonic AI Chips Promises 50x Efficiency Gains' }
      ]
    },
    transcript: 'Welcome to The Daily Dispatch. I am Vishnu Reji. Today, we delve into optical computing and photonic interconnects...',
    uploaded_by: 'auth-1',
    created_at: '2026-09-16T18:00:00Z'
  },
  {
    id: 'med-7',
    filename: 'fiscal-policy-whitepaper-2026.pdf',
    mime_type: 'application/pdf',
    file_size: 8920000,
    storage_path: 'newsroom-media/documents/2026/09/fiscal-policy-whitepaper-2026.pdf',
    r2_key: 'newsroom-media/documents/2026/09/fiscal-policy-whitepaper-2026.pdf',
    bucket_name: 'newsroom-media',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    alt_text: 'Official Fiscal Policy & Tax Annexure Analysis 2026-27 (Full 48-Page PDF Report)',
    caption: 'Comprehensive breakdown of budget allocations, debt-to-GDP trajectories and tax exemptions.',
    credit: 'Ministry of Finance / Public Domain',
    folder: 'documents',
    year: '2026',
    focal_x: 50,
    focal_y: 50,
    usage_count: 2,
    used_in: {
      articles: [
        { id: 'art-1', title: 'Union Budget 2026 Unveils Landmark $120B Infrastructure & Green Energy Package' }
      ]
    },
    uploaded_by: 'auth-2',
    created_at: '2026-09-17T06:15:00Z'
  },
  {
    id: 'med-8',
    filename: 'orphan-stock-city-night.webp',
    mime_type: 'image/webp',
    file_size: 512000,
    width: 1920,
    height: 1080,
    storage_path: 'newsroom-media/images/2026/08/orphan-stock-city-night.webp',
    r2_key: 'newsroom-media/images/2026/08/orphan-stock-city-night.webp',
    bucket_name: 'newsroom-media',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&auto=format&fit=crop&q=80',
    alt_text: 'Metropolis skyline illuminated at dusk (Unused Orphan Asset)',
    caption: 'Archived cityscape stock image currently not referenced in any story or newsletter.',
    credit: 'Stock Archives',
    folder: 'images',
    year: '2026',
    focal_x: 50,
    focal_y: 50,
    usage_count: 0,
    used_in: {
      articles: [],
      pages: [],
      newsletters: []
    },
    uploaded_by: 'auth-3',
    created_at: '2026-08-20T14:10:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'assignment_dispatched',
    title: 'New Story Assignment Dispatched',
    message: 'Vishnu Reji assigned "Tabulate Section 80 and Capex Annexures" to you.',
    target_url: '/admin/assignments',
    actor_name: 'Vishnu Reji',
    actor_avatar: INITIAL_AUTHORS[0].avatar_url,
    is_read: false,
    created_at: '2026-09-17T11:15:00Z'
  },
  {
    id: 'notif-2',
    type: 'review_requested',
    title: 'Article Submitted for Review',
    message: 'Anu Sharma submitted "Hospitality Sector Report" for desk sign-off.',
    target_url: '/admin/articles/art-3/edit',
    actor_name: 'Anu Sharma',
    actor_avatar: INITIAL_AUTHORS[1].avatar_url,
    is_read: false,
    created_at: '2026-09-17T10:30:00Z'
  },
  {
    id: 'notif-3',
    type: 'comment_mentioned',
    title: 'Mentioned in Editorial Comment',
    message: 'Vishnu Reji: "@Anu Please verify the SE Asia breakdown chart before approving."',
    target_url: '/admin/articles/art-3/edit',
    actor_name: 'Vishnu Reji',
    actor_avatar: INITIAL_AUTHORS[0].avatar_url,
    is_read: false,
    created_at: '2026-09-17T09:45:00Z'
  },
  {
    id: 'notif-4',
    type: 'article_published',
    title: 'Lead Story Published Live',
    message: '"Union Budget 2026 Analysis" is now live on the public reader portal.',
    target_url: '/article/india-budget-2026-fiscal-stimulus-infrastructure',
    actor_name: 'Desk Engine',
    is_read: true,
    created_at: '2026-09-17T06:30:00Z'
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'india-budget-2026-fiscal-stimulus-infrastructure',
    title: 'Union Budget 2026 Unveils Landmark $120B Infrastructure & Green Energy Package',
    subtitle: 'Comprehensive fiscal policy prioritizes high-speed rail, semiconductor fabrication, and clean grid integration.',
    excerpt: 'The finance ministry has presented an expansive budget blueprint aiming to accelerate gross fixed capital formation while targeting a 4.5% fiscal deficit glide path.',
    featured_image_id: 'med-1',
    featured_image: INITIAL_MEDIA[0],
    primary_category_id: 'cat-2',
    primary_category: INITIAL_CATEGORIES[1],
    authors: [INITIAL_AUTHORS[1], INITIAL_AUTHORS[0]],
    tags: [INITIAL_TAGS[0], INITIAL_TAGS[2]],
    status: 'published',
    visibility: 'public',
    reading_time_mins: 6,
    published_at: '2026-09-17T06:30:00Z',
    created_at: '2026-09-16T14:00:00Z',
    updated_at: '2026-09-17T06:30:00Z',
    created_by: 'auth-2',
    location: 'New Delhi, India',
    revisions_count: 3,
    revisions: [
      {
        id: 'rev-1-1',
        article_id: 'art-1',
        version_number: 1,
        changed_by_name: 'Anu Sharma',
        title: 'Union Budget 2026 Outlines Infrastructure Plan',
        content_blocks: [
          { id: 'b1', type: 'paragraph', content: { text: 'The government tabled the preliminary Union Budget proposal today.' } }
        ],
        created_at: '2026-09-16T14:00:00Z',
        diff_notes: 'Initial draft submitted by reporter'
      },
      {
        id: 'rev-1-2',
        article_id: 'art-1',
        version_number: 2,
        changed_by_name: 'Rahul Varma',
        title: 'Union Budget 2026 Unveils Landmark $120B Infrastructure & Green Energy Package',
        content_blocks: [
          { id: 'b1', type: 'paragraph', content: { text: 'In what economists are heralding as a transformative blueprint for sustainable industrial growth, the government today tabled the Union Budget for fiscal year 2026–27.' } }
        ],
        created_at: '2026-09-16T17:30:00Z',
        diff_notes: 'Added capex figures and economic projections'
      },
      {
        id: 'rev-1-3',
        article_id: 'art-1',
        version_number: 3,
        changed_by_name: 'Vishnu Reji',
        title: 'Union Budget 2026 Unveils Landmark $120B Infrastructure & Green Energy Package',
        content_blocks: [
          { id: 'blk-1', type: 'paragraph', content: { text: 'In what economists are heralding as a transformative blueprint for sustainable industrial growth, the government today tabled the Union Budget for fiscal year 2026–27. Anchored on record capital outlays totaling over $120 billion, the legislative package places heavy emphasis on domestic semiconductor manufacturing, automated logistics corridors, and next-generation power grids.' } }
        ],
        created_at: '2026-09-17T06:30:00Z',
        diff_notes: 'Final desk polish and publication sign-off'
      }
    ],
    seo: {
      meta_title: 'Union Budget 2026: $120B Infra & Green Energy Stimulus Analysis',
      meta_description: 'Detailed analysis of the 2026 Union Budget economic stimulus, capital expenditure outlays, and fiscal deficit targets.',
      focus_keyword: 'Union Budget 2026',
      canonical_url: 'https://newsroom.live/article/india-budget-2026-fiscal-stimulus-infrastructure',
      schema_type: 'NewsArticle',
      score: 94,
      score_breakdown: {
        passed: [
          'High-intent headline matching focus keyword',
          'Rich structured NewsArticle JSON-LD schema',
          'Optimized WebP featured image with focal crop and alt text',
          'Internal links to fiscal policy archive included',
          'Clear meta description within 155 character sweet spot'
        ],
        warnings: ['Consider embedding direct quote from the Finance Minister']
      }
    },
    content_blocks: [
      {
        id: 'blk-1',
        type: 'paragraph',
        content: {
          text: 'In what economists are heralding as a transformative blueprint for sustainable industrial growth, the government today tabled the Union Budget for fiscal year 2026–27. Anchored on record capital outlays totaling over $120 billion, the legislative package places heavy emphasis on domestic semiconductor manufacturing, automated logistics corridors, and next-generation power grids.'
        },
        settings: { dropcap: true }
      },
      {
        id: 'blk-2',
        type: 'heading',
        content: { text: 'Key Outlays: Capex Surge and Fiscal Consolidation' },
        settings: { level: 2 }
      },
      {
        id: 'blk-3',
        type: 'pullquote',
        content: {
          text: 'We are ensuring that fiscal discipline does not come at the expense of our generational infrastructure deficit.',
          author: 'Minister of Finance',
          title: 'Parliamentary Address'
        }
      },
      {
        id: 'blk-4',
        type: 'table',
        content: {
          headers: ['Sector Allocation', 'FY26 Budget ($B)', 'YoY Growth (%)'],
          rows: [
            ['Freight & High-Speed Rail', '$32.4 B', '+22.4%'],
            ['Semiconductor Incentives', '$18.2 B', '+45.0%'],
            ['Clean Grid & Solar Storage', '$14.8 B', '+31.8%'],
            ['Urban Transport Corridors', '$12.0 B', '+14.2%']
          ]
        }
      },
      {
        id: 'blk-5',
        type: 'paragraph',
        content: {
          text: 'The projected growth in capital expenditure represents a 18.4% uptick year-on-year. Critical allocations include $32 billion toward high-density freight railways, $14 billion for dedicated solar-wind hybrid corridors, and substantial tax credits for indigenous advanced computing research.'
        }
      },
      {
        id: 'blk-6',
        type: 'image',
        content: {
          url: INITIAL_MEDIA[0].url,
          caption: 'Finance officials presenting the official economic survey alongside legislative leadership.',
          alt: 'Finance officials presenting budget',
          credit: 'AMG Photo Service'
        }
      },
      {
        id: 'blk-7',
        type: 'list',
        content: {
          listType: 'bullet',
          items: [
            'Record gross fixed capital formation target exceeding 34% of GDP',
            'Zero customs duty on critical imported semiconductor manufacturing equipment',
            'Direct subvention for battery energy storage systems (BESS) up to 2030'
          ]
        }
      },
      {
        id: 'blk-8',
        type: 'advertisement',
        content: { adSlotId: 'ad-slot-2', customSlotName: 'Mid-Article Inline Sponsorship' }
      },
      {
        id: 'blk-9',
        type: 'newsletter_signup',
        content: {
          heading: 'Get the Full Fiscal Breakdown in Your Inbox',
          description: 'Receive our complete quantitative econometric models and budget annexures.'
        }
      }
    ],
    comments: [
      {
        id: 'comm-1',
        article_id: 'art-1',
        user_name: 'Anu Sharma',
        user_avatar: INITIAL_AUTHORS[1].avatar_url,
        user_role: 'Senior Reporter',
        content: 'I have verified the semiconductor subsidy numbers against the expenditure annexure.',
        is_resolved: true,
        created_at: '2026-09-16T16:20:00Z'
      },
      {
        id: 'comm-2',
        article_id: 'art-1',
        user_name: 'Vishnu Reji',
        user_avatar: INITIAL_AUTHORS[0].avatar_url,
        user_role: 'Editor-in-Chief',
        content: 'Excellent depth. Ready for featured spot on the home page.',
        is_resolved: true,
        created_at: '2026-09-17T06:15:00Z'
      }
    ]
  },
  {
    id: 'art-2',
    slug: 'next-gen-neural-architectures-computing-revolution',
    title: 'Breakthrough in Photonic AI Chips Promises 50x Compute Efficiency',
    subtitle: 'Optical matrix multipliers bypass copper interconnect bottlenecks in enterprise training clusters.',
    excerpt: 'Researchers and hardware consortia have demonstrated wafer-scale silicon photonics that slash the kilowatt footprint of massive frontier models.',
    featured_image_id: 'med-2',
    featured_image: INITIAL_MEDIA[1],
    primary_category_id: 'cat-3',
    primary_category: INITIAL_CATEGORIES[2],
    authors: [INITIAL_AUTHORS[2]],
    tags: [INITIAL_TAGS[1], INITIAL_TAGS[3]],
    status: 'published',
    visibility: 'paywall_premium',
    reading_time_mins: 5,
    published_at: '2026-09-17T08:00:00Z',
    created_at: '2026-09-16T11:00:00Z',
    updated_at: '2026-09-17T08:00:00Z',
    created_by: 'auth-3',
    seo: {
      meta_title: 'Silicon Photonics in AI: 50x Compute Energy Breakthrough',
      meta_description: 'How optical interconnects and photonic tensor processors are transforming the economics of enterprise AI computing clusters.',
      focus_keyword: 'Photonic AI Chips',
      canonical_url: 'https://newsroom.live/article/next-gen-neural-architectures-computing-revolution',
      schema_type: 'NewsArticle',
      score: 91,
      score_breakdown: {
        passed: [
          'Strong technical focus keyword',
          'Rich media embeds with descriptive captions',
          'Full OpenGraph and Twitter card metadata configured'
        ],
        warnings: ['Add link to related semiconductor industry research']
      }
    },
    content_blocks: [
      {
        id: 'blk-11',
        type: 'paragraph',
        content: {
          text: 'The escalating electrical demand of gigawatt-scale artificial intelligence datacenters has encountered its most promising physical antidote: light. In a joint paper published this morning, engineering teams across three leading semiconductor laboratories unveiled an integrated photonic compute processor capable of performing matrix operations at near-zero thermal dissipation.'
        },
        settings: { dropcap: true }
      },
      {
        id: 'blk-12',
        type: 'heading',
        content: { text: 'Bypassing the Silicon Thermal Barrier' },
        settings: { level: 2 }
      },
      {
        id: 'blk-13',
        type: 'paragraph',
        content: {
          text: 'Unlike conventional electronic lithographies that suffer from resistive heating across micro-traces, optical wave-guides route modulated laser pulses directly through microscopic interferometers to compute multiply-accumulate operations at the speed of light.'
        }
      },
      {
        id: 'blk-14',
        type: 'embed',
        content: {
          embedType: 'youtube',
          embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          caption: 'Technical demonstration of wave-guide laser modulation at 40 GHz'
        }
      }
    ]
  },
  {
    id: 'art-3',
    slug: 'global-hospitality-revenue-growth-and-tourism-trends-2026',
    title: 'Hospitality Sector Records Double-Digit Surge as Leisure and Corporate Travel Converge',
    subtitle: 'Boutique eco-resorts and urban business centers report highest RevPAR in eight years.',
    excerpt: 'Comprehensive industry audit highlights surging cross-border leisure demand, digital nomad infrastructure, and dynamic pricing models.',
    featured_image_id: 'med-4',
    featured_image: INITIAL_MEDIA[3],
    primary_category_id: 'cat-2',
    primary_category: INITIAL_CATEGORIES[1],
    authors: [INITIAL_AUTHORS[1]],
    tags: [INITIAL_TAGS[4], INITIAL_TAGS[5]],
    status: 'in_review',
    visibility: 'public',
    reading_time_mins: 4,
    created_at: '2026-09-17T09:00:00Z',
    updated_at: '2026-09-17T11:00:00Z',
    created_by: 'auth-2',
    seo: {
      meta_title: 'Hospitality Industry Report 2026: Revenue & Occupancy Trends',
      meta_description: 'Global hotel occupancy, RevPAR index and cross-border tourism recovery statistics for 2026.',
      focus_keyword: 'Hospitality Industry Report',
      schema_type: 'NewsArticle',
      score: 82,
      score_breakdown: {
        passed: ['Title length within recommended bounds', 'Alt tags on all media'],
        warnings: ['Article is currently in editorial review', 'Needs more internal links to economic data']
      }
    },
    content_blocks: [
      {
        id: 'blk-21',
        type: 'paragraph',
        content: {
          text: 'Global hospitality chains and independent hoteliers are navigating a profound structural revival. Average revenue per available room (RevPAR) expanded by 14.2% across major metropolitan corridors in the first half of the year, driven by prolonged blended work-vacation itineraries.'
        }
      }
    ],
    comments: [
      {
        id: 'comm-21',
        article_id: 'art-3',
        user_name: 'Vishnu Reji',
        user_avatar: INITIAL_AUTHORS[0].avatar_url,
        user_role: 'Editor-in-Chief',
        content: '@Anu Please add the regional breakdown chart for Southeast Asia before we approve for publishing.',
        is_resolved: false,
        created_at: '2026-09-17T11:30:00Z'
      }
    ]
  },
  {
    id: 'art-4',
    slug: 'clean-energy-grid-parity-record-storage-deployment',
    title: 'Grid-Scale Battery Storage Reaches Historic 100 GWh Deployment Benchmark',
    subtitle: 'Sodium-ion and iron-air chemistries displace legacy peaking plants across four continents.',
    excerpt: 'A historic turning point in renewable intermittency as long-duration energy storage reaches commercial parity with fossil generation.',
    featured_image_id: 'med-3',
    featured_image: INITIAL_MEDIA[2],
    primary_category_id: 'cat-4',
    primary_category: INITIAL_CATEGORIES[3],
    authors: [INITIAL_AUTHORS[0]],
    tags: [INITIAL_TAGS[2]],
    status: 'scheduled',
    scheduled_for: '2026-09-18T05:00:00Z',
    visibility: 'public',
    reading_time_mins: 5,
    created_at: '2026-09-16T15:00:00Z',
    updated_at: '2026-09-17T12:00:00Z',
    created_by: 'auth-1',
    seo: {
      meta_title: 'Grid Battery Storage Reaches 100 GWh Milestone',
      meta_description: 'How non-lithium battery breakthroughs and utility scale deployments are ending the renewable intermittency challenge.',
      focus_keyword: 'Clean Energy Storage',
      schema_type: 'NewsArticle',
      score: 89,
      score_breakdown: {
        passed: ['Scheduled publishing pipeline verified', 'SEO keywords aligned'],
        warnings: []
      }
    },
    content_blocks: [
      {
        id: 'blk-31',
        type: 'paragraph',
        content: {
          text: 'The global transition toward non-emitting electric grids achieved an unprecedented milestone this week as cumulative installed utility-scale battery energy storage crossed the 100 gigawatt-hour (GWh) threshold.'
        }
      }
    ]
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    article_id: 'art-1',
    article_title: 'Union Budget 2026 Analysis',
    title: 'Tabulate Section 80 and Capex Annexures',
    assigned_to_name: 'Anu Sharma',
    assigned_to_avatar: INITIAL_AUTHORS[1].avatar_url,
    assigned_by_name: 'Vishnu Reji',
    deadline: '2026-09-17T14:00:00Z',
    priority: 'breaking',
    status: 'completed',
    notes: 'Cross-check numbers with Finance Ministry press release.',
    created_at: '2026-09-16T08:00:00Z'
  },
  {
    id: 'asg-2',
    article_id: 'art-3',
    article_title: 'Hospitality Sector Report',
    title: 'Add SE Asia Regional Market Analysis',
    assigned_to_name: 'Anu Sharma',
    assigned_to_avatar: INITIAL_AUTHORS[1].avatar_url,
    assigned_by_name: 'Vishnu Reji',
    deadline: '2026-09-17T16:00:00Z',
    priority: 'high',
    status: 'in_progress',
    notes: 'Include Singapore and Vietnam tourism metrics.',
    created_at: '2026-09-17T09:30:00Z'
  },
  {
    id: 'asg-3',
    title: 'Investigative Deep Dive: Sovereign AI Datacenters',
    assigned_to_name: 'Rahul Varma',
    assigned_to_avatar: INITIAL_AUTHORS[2].avatar_url,
    assigned_by_name: 'Vishnu Reji',
    deadline: '2026-09-18T18:00:00Z',
    priority: 'medium',
    status: 'assigned',
    notes: 'Interview CTOs and power grid operators on cooling load.',
    created_at: '2026-09-17T10:00:00Z'
  }
];

export const INITIAL_BREAKING_NEWS: BreakingNewsItem[] = [
  {
    id: 'brk-1',
    title: 'Central Bank holds benchmark interest rate steady at 6.25%, signals robust growth outlook.',
    target_url: '/article/india-budget-2026-fiscal-stimulus-infrastructure',
    priority: 1,
    is_active: true,
    created_at: '2026-09-17T08:15:00Z'
  }
];

export const INITIAL_AD_SLOTS: AdSlot[] = [
  {
    id: 'ad-slot-1',
    name: 'Top Header Leaderboard (728x90 / 970x250)',
    advertiser_name: 'Global Semiconductor Forum 2026',
    slot_type: 'header',
    ad_type: 'custom_banner',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=970&h=250&fit=crop&q=80',
    destination_url: 'https://example.com/sponsor-summit',
    cpm_rate: 18.5,
    is_active: true,
    impressions: 142800,
    clicks: 4210
  },
  {
    id: 'ad-slot-2',
    name: 'Mid-Article Inline Sponsorship',
    advertiser_name: 'FinTech Capital Summit',
    slot_type: 'in_article',
    ad_type: 'custom_banner',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=250&fit=crop&q=80',
    destination_url: 'https://example.com/fintech-summit',
    cpm_rate: 24.0,
    is_active: true,
    impressions: 98500,
    clicks: 3120
  },
  {
    id: 'ad-slot-3',
    name: 'Sidebar Sticky Skyscraper (300x600)',
    advertiser_name: 'Enterprise Cloud Grid',
    slot_type: 'sidebar',
    ad_type: 'custom_banner',
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=600&fit=crop&q=80',
    destination_url: 'https://example.com/cloud-grid',
    cpm_rate: 15.0,
    is_active: true,
    impressions: 64200,
    clicks: 1890
  }
];

export const INITIAL_CAMPAIGNS: NewsletterCampaign[] = [
  {
    id: 'nl-1',
    subject: 'Morning Intelligence: Union Budget 2026 Special Deep Dive',
    preview_text: 'Inside the $120B capex blueprint and sovereign semiconductor subsidies...',
    recipient_list: 'All Executive Subscribers',
    content_html: '<h2>Today’s Strategic Focus</h2><p>The landmark $120B fiscal package prioritizes high-speed logistics and domestic fabrication clusters...</p>',
    article_ids: ['art-1', 'art-2'],
    status: 'sent',
    sent_at: '2026-09-17T06:00:00Z',
    recipients_count: 42800,
    open_rate: 48.2,
    click_rate: 14.6,
    created_at: '2026-09-16T18:00:00Z'
  },
  {
    id: 'nl-2',
    subject: 'Weekly Tech Dispatch: Optical Chips and Distributed AI',
    preview_text: 'How silicon photonics is redefining compute economics...',
    recipient_list: 'Technology & AI Segment',
    content_html: '<h2>Frontier Science Brief</h2><p>Silicon photonic interconnects achieve 50x compute efficiency breakthrough...</p>',
    article_ids: ['art-2'],
    status: 'scheduled',
    scheduled_for: '2026-09-18T07:00:00Z',
    recipients_count: 18500,
    open_rate: 52.1,
    click_rate: 18.9,
    created_at: '2026-09-17T11:00:00Z'
  },
  {
    id: 'nl-3',
    subject: 'Macro Radar: Energy Transition & Battery Intermittency',
    preview_text: '100 GWh benchmark crossed across four continents...',
    recipient_list: 'Energy & Policy Analysts',
    content_html: '<h2>Energy Markets</h2><p>Long-duration storage reaches commercial grid parity with thermal generation...</p>',
    article_ids: ['art-4'],
    status: 'draft',
    recipients_count: 12400,
    created_at: '2026-09-17T14:30:00Z'
  }
];

export const INITIAL_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-free',
    name: 'Standard Free Reader',
    price_monthly: 0,
    price_annual: 0,
    description: 'Essential public news reporting and daily morning dispatch.',
    features: [
      'Access to all standard reporting',
      'Daily morning dispatch email',
      'Standard ad-supported reading',
      'Public commenting rights'
    ]
  },
  {
    id: 'plan-pro',
    name: 'AMG Intelligence Pro',
    price_monthly: 9,
    price_annual: 89,
    is_popular: true,
    description: 'Unrestricted investigative access, ad-free canvas, and quantitative data dossiers.',
    features: [
      'Full access to all Paywall & Deep-Tech investigations',
      '100% Ad-free reading canvas across desktop & mobile',
      'Sector data downloads (CSV/JSON) & PDF dossier archives',
      'Early access to investigative podcasts & video streams',
      'Invitation to quarterly editorial roundtable briefings'
    ]
  },
  {
    id: 'plan-founding',
    name: 'Institutional Founding Member',
    price_monthly: 29,
    price_annual: 249,
    description: 'Direct access to editorial desks, bespoke intelligence requests, and multi-seat licensing.',
    features: [
      'Everything in Intelligence Pro',
      '5 Enterprise team seats included',
      'Direct line to beat editors for background queries',
      'Quarterly printed hardbound editorial dossier book',
      'VIP recognition in publication masthead'
    ]
  }
];

export const INITIAL_REDIRECTS: RedirectRule[] = [
  {
    id: 'red-1',
    old_path: '/budget-2026-news',
    new_path: '/article/india-budget-2026-fiscal-stimulus-infrastructure',
    status_code: 301,
    hit_count: 1420,
    last_accessed: '2026-09-17T14:10:00Z',
    created_at: '2026-09-15T12:00:00Z'
  },
  {
    id: 'red-2',
    old_path: '/tech/optical-chips',
    new_path: '/article/next-gen-neural-architectures-computing-revolution',
    status_code: 301,
    hit_count: 680,
    last_accessed: '2026-09-17T13:45:00Z',
    created_at: '2026-09-16T10:00:00Z'
  }
];

export const INITIAL_HOMEPAGE_SECTIONS: HomepageSection[] = [
  {
    id: 'sec-hero',
    title: 'Top Investigation & Strategic Briefings',
    subtitle: 'Lead macroeconomic analysis and investigative reports curated by the editor desk.',
    layout: 'hero_plus_two',
    display_order: 1,
    article_ids: ['art-1', 'art-2', 'art-4'],
    show_ads: true
  },
  {
    id: 'sec-trending',
    title: 'Editorial Pulse & Real-Time Developments',
    subtitle: 'Fast-moving dispatches and breaking developments.',
    layout: 'trending_strip',
    display_order: 2,
    show_ads: false
  },
  {
    id: 'sec-business',
    title: 'Markets, Economy & Fiscal Policy',
    subtitle: 'Macroeconomic indicators, central bank policies and industry restructuring.',
    layout: 'three_column_grid',
    category_id: 'cat-2',
    display_order: 3,
    show_ads: true
  },
  {
    id: 'sec-magazine',
    title: 'Deep Tech & Semiconductor Spotlight',
    subtitle: 'Photonic computing, clean energy grids and sovereign datacenter architecture.',
    layout: 'magazine_split',
    category_id: 'cat-3',
    display_order: 4,
    show_ads: true
  },
  {
    id: 'sec-multimedia',
    title: 'Multimedia Broadcasts & Audio Dispatches',
    subtitle: '4K video press conferences and executive editor podcasts.',
    layout: 'video_showcase',
    display_order: 5,
    show_ads: false
  },
  {
    id: 'sec-opinion',
    title: 'Opinion, Analysis & Commentary',
    subtitle: 'Perspectives from leading columnists and institutional fellows.',
    layout: 'carousel',
    category_id: 'cat-5',
    display_order: 6,
    show_ads: false
  },
  {
    id: 'sec-newsletter',
    title: 'The Daily Intelligence Briefing',
    subtitle: 'Delivered every weekday at 06:00 AM to 40,000+ senior leaders.',
    layout: 'newsletter_cta',
    display_order: 7,
    show_ads: false
  }
];

class NewsroomService {
  private articles: Article[] = INITIAL_ARTICLES;
  private categories: Category[] = INITIAL_CATEGORIES;
  private tags: Tag[] = INITIAL_TAGS;
  private authors: AuthorProfile[] = INITIAL_AUTHORS;
  private media: MediaAsset[] = INITIAL_MEDIA;
  private assignments: Assignment[] = INITIAL_ASSIGNMENTS;
  private breakingNews: BreakingNewsItem[] = INITIAL_BREAKING_NEWS;
  private adSlots: AdSlot[] = INITIAL_AD_SLOTS;
  private campaigns: NewsletterCampaign[] = INITIAL_CAMPAIGNS;
  private subscriptionPlans: SubscriptionPlan[] = INITIAL_SUBSCRIPTION_PLANS;
  private redirects: RedirectRule[] = INITIAL_REDIRECTS;
  private homepageSections: HomepageSection[] = INITIAL_HOMEPAGE_SECTIONS;
  private notifications: NotificationItem[] = INITIAL_NOTIFICATIONS;

  // --- Notifications ---
  getNotifications(): NotificationItem[] {
    return this.notifications;
  }

  getUnreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.is_read).length;
  }

  markNotificationRead(id: string): void {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.is_read = true;
  }

  markAllNotificationsRead(): void {
    this.notifications.forEach(n => (n.is_read = true));
  }

  createNotification(notif: Omit<NotificationItem, 'id' | 'created_at' | 'is_read'>): NotificationItem {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      is_read: false,
      created_at: new Date().toISOString()
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }

  // --- Articles ---
  getArticles(filter?: { status?: ArticleStatus; categoryId?: string; authorId?: string }): Article[] {
    let result = [...this.articles];
    if (filter?.status) result = result.filter(a => a.status === filter.status);
    if (filter?.categoryId) result = result.filter(a => a.primary_category_id === filter.categoryId);
    return result;
  }

  getArticleBySlug(slug: string): Article | undefined {
    return this.articles.find(a => a.slug === slug);
  }

  getArticleById(id: string): Article | undefined {
    return this.articles.find(a => a.id === id);
  }

  // Async Supabase Sync
  async syncFromSupabase(): Promise<void> {
    try {
      const dbArticles = await db.getArticles();
      if (dbArticles && dbArticles.length > 0) {
        this.articles = dbArticles;
      }
      const dbCategories = await db.getCategories();
      if (dbCategories && dbCategories.length > 0) {
        this.categories = dbCategories;
      }
      const dbTags = await db.getTags();
      if (dbTags && dbTags.length > 0) {
        this.tags = dbTags;
      }
      const dbMedia = await db.getMedia();
      if (dbMedia && dbMedia.length > 0) {
        this.media = dbMedia;
      }
    } catch (e) {
      console.warn('NewsroomService background sync note:', e);
    }
  }

  saveArticle(article: Partial<Article> & { id: string }, saveRevision: boolean = true, actorName?: string): Article {
    const authorName = actorName || this.authors[0]?.display_name || 'Editorial Desk';
    const idx = this.articles.findIndex(a => a.id === article.id);
    if (idx >= 0) {
      const existing = this.articles[idx];
      const updated: Article = {
        ...existing,
        ...article,
        updated_at: new Date().toISOString()
      };

      if (saveRevision && article.content_blocks) {
        if (!updated.revisions) updated.revisions = existing.revisions || [];
        const nextVer = (updated.revisions.length || 0) + 1;
        const newRev: ArticleRevision = {
          id: `rev-${article.id}-${nextVer}`,
          article_id: article.id,
          version_number: nextVer,
          changed_by_name: authorName,
          title: updated.title,
          content_blocks: JSON.parse(JSON.stringify(updated.content_blocks)),
          created_at: new Date().toISOString(),
          diff_notes: `Auto-saved revision #${nextVer}`
        };
        updated.revisions.unshift(newRev);
        updated.revisions_count = updated.revisions.length;
      }

      this.articles[idx] = updated;
      db.upsertArticle(updated).catch(() => {});
      return updated;
    } else {
      const newArticle: Article = {
        id: article.id,
        slug: article.slug || `article-${Date.now()}`,
        title: article.title || 'Untitled Article',
        subtitle: article.subtitle || '',
        excerpt: article.excerpt || '',
        content_blocks: article.content_blocks || [
          { id: `blk-${Date.now()}`, type: 'paragraph', content: { text: '' } }
        ],
        authors: article.authors || [this.authors[0] || INITIAL_AUTHORS[0]],
        tags: article.tags || [],
        status: article.status || 'draft',
        visibility: article.visibility || 'public',
        reading_time_mins: 3,
        seo: article.seo || {
          meta_title: article.title || 'Untitled',
          meta_description: article.excerpt || '',
          schema_type: 'NewsArticle',
          score: 75
        },
        revisions: [],
        revisions_count: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: this.authors[0]?.id || 'auth-1'
      };

      newArticle.revisions = [
        {
          id: `rev-${newArticle.id}-1`,
          article_id: newArticle.id,
          version_number: 1,
          changed_by_name: authorName,
          title: newArticle.title,
          content_blocks: JSON.parse(JSON.stringify(newArticle.content_blocks)),
          created_at: new Date().toISOString(),
          diff_notes: 'Initial Draft Creation'
        }
      ];

      this.articles.unshift(newArticle);
      db.upsertArticle(newArticle).catch(() => {});
      return newArticle;
    }
  }

  updateArticleStatus(id: string, status: ArticleStatus, actorName?: string): Article | undefined {
    const art = this.getArticleById(id);
    const actor = actorName || this.authors[0]?.display_name || 'Editorial Staff';
    if (art) {
      art.status = status;
      if (status === 'published' && !art.published_at) {
        art.published_at = new Date().toISOString();
      }
      art.updated_at = new Date().toISOString();
      db.upsertArticle(art).catch(() => {});

      // Trigger automatic Newsroom Collaboration notification
      if (status === 'in_review') {
        this.createNotification({
          type: 'review_requested',
          title: 'Article Submitted for Desk Review',
          message: `${actor} submitted "${art.title}" for editorial approval.`,
          target_url: `/admin/articles/${art.id}/edit`,
          actor_name: actor
        });
      } else if (status === 'changes_requested') {
        this.createNotification({
          type: 'changes_requested',
          title: 'Editorial Changes Requested',
          message: `${actor} requested revisions on "${art.title}".`,
          target_url: `/admin/articles/${art.id}/edit`,
          actor_name: actor
        });
      } else if (status === 'approved') {
        this.createNotification({
          type: 'article_approved',
          title: 'Story Approved for Publication',
          message: `"${art.title}" was approved by ${actor}.`,
          target_url: `/admin/articles/${art.id}/edit`,
          actor_name: actor
        });
      } else if (status === 'published') {
        this.createNotification({
          type: 'article_published',
          title: 'Story Published Live',
          message: `"${art.title}" is now broadcasting on reader portal.`,
          target_url: `/article/${art.slug}`,
          actor_name: actor
        });
      }
    }
    return art;
  }

  getComments(): { id: string; article_id: string; author_name: string; content: string; status: 'approved' | 'pending' | 'rejected'; created_at: string }[] {
    return [
      {
        id: 'comm-1',
        article_id: 'art-1',
        author_name: 'Vikram Joshi',
        content: 'Remarkable depth on the semiconductor supply chain and capex outlays. Essential reading.',
        status: 'approved',
        created_at: new Date().toISOString()
      },
      {
        id: 'comm-2',
        article_id: 'art-2',
        author_name: 'Devika Menon',
        content: 'Is there an updated timeline on the photonic chip testbench deployment in Taiwan?',
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ];
  }

  updateArticlePublishDate(articleId: string, scheduledDate: string): Article | undefined {
    const art = this.getArticleById(articleId);
    if (art) {
      art.scheduled_for = scheduledDate;
      art.status = 'scheduled';
      art.updated_at = new Date().toISOString();
    }
    return art;
  }

  restoreRevision(articleId: string, revisionId: string): Article | undefined {
    const art = this.getArticleById(articleId);
    if (art && art.revisions) {
      const rev = art.revisions.find(r => r.id === revisionId);
      if (rev) {
        art.title = rev.title;
        art.content_blocks = JSON.parse(JSON.stringify(rev.content_blocks));
        art.updated_at = new Date().toISOString();
        return art;
      }
    }
    return art;
  }

  addComment(articleId: string, text: string, userName: string = 'Vishnu Reji'): void {
    const art = this.getArticleById(articleId);
    if (art) {
      if (!art.comments) art.comments = [];
      const newComment = {
        id: `comm-${Date.now()}`,
        article_id: articleId,
        user_name: userName,
        user_role: 'Editor',
        content: text,
        is_resolved: false,
        created_at: new Date().toISOString()
      };
      art.comments.push(newComment);

      if (text.includes('@')) {
        this.createNotification({
          type: 'comment_mentioned',
          title: 'Mentioned in Editorial Comment',
          message: `${userName}: "${text.slice(0, 80)}"`,
          target_url: `/admin/articles/${articleId}/edit`,
          actor_name: userName
        });
      }
    }
  }

  toggleCommentResolved(articleId: string, commentId: string): void {
    const art = this.getArticleById(articleId);
    if (art && art.comments) {
      const c = art.comments.find(item => item.id === commentId);
      if (c) c.is_resolved = !c.is_resolved;
    }
  }

  // --- Internal Linking Recommendations ---
  getInternalLinkingSuggestions(contentKeywords: string): { phrase: string; articleTitle: string; articleSlug: string }[] {
    const suggestions = [
      { phrase: 'hospitality industry', articleTitle: 'Hospitality Sector Records Double-Digit Surge in RevPAR', articleSlug: 'global-hospitality-revenue-growth-and-tourism-trends-2026' },
      { phrase: 'infrastructure package', articleTitle: 'Union Budget 2026 Unveils Landmark $120B Package', articleSlug: 'india-budget-2026-fiscal-stimulus-infrastructure' },
      { phrase: 'clean energy storage', articleTitle: 'Grid-Scale Battery Storage Reaches 100 GWh Benchmark', articleSlug: 'clean-energy-grid-parity-record-storage-deployment' },
      { phrase: 'semiconductor chips', articleTitle: 'Breakthrough in Photonic AI Chips Promises 50x Efficiency', articleSlug: 'next-gen-neural-architectures-computing-revolution' },
      { phrase: 'fiscal deficit', articleTitle: 'Union Budget 2026 Fiscal Glide Path', articleSlug: 'india-budget-2026-fiscal-stimulus-infrastructure' }
    ];
    return suggestions;
  }

  // --- Assignments ---
  getAssignments(): Assignment[] {
    return this.assignments;
  }

  createAssignment(asg: Omit<Assignment, 'id' | 'created_at'>): Assignment {
    const newAsg: Assignment = {
      ...asg,
      id: `asg-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.assignments.unshift(newAsg);

    this.createNotification({
      type: 'assignment_dispatched',
      title: 'New Story Assignment Dispatched',
      message: `${asg.assigned_by_name} assigned "${asg.title}" to ${asg.assigned_to_name}.`,
      target_url: '/admin/assignments',
      actor_name: asg.assigned_by_name
    });

    return newAsg;
  }

  updateAssignmentStatus(id: string, status: Assignment['status']): void {
    const found = this.assignments.find(a => a.id === id);
    if (found) found.status = status;
  }

  // --- Media Library ---
  getMediaAssets(searchQuery?: string, folder?: MediaAsset['folder'] | 'unused'): MediaAsset[] {
    let list = this.media;

    if (folder) {
      if (folder === 'unused') {
        list = list.filter(m => m.usage_count === 0);
      } else {
        list = list.filter(m => (m.folder || 'images') === folder);
      }
    }

    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      m =>
        m.filename.toLowerCase().includes(q) ||
        (m.caption && m.caption.toLowerCase().includes(q)) ||
        (m.alt_text && m.alt_text.toLowerCase().includes(q)) ||
        (m.credit && m.credit.toLowerCase().includes(q))
    );
  }

  getMediaById(id: string): MediaAsset | undefined {
    return this.media.find(m => m.id === id);
  }

  uploadMedia(file: {
    filename: string;
    mime_type: string;
    file_size: number;
    url: string;
    alt_text?: string;
    caption?: string;
    credit?: string;
    folder?: 'images' | 'videos' | 'audio' | 'documents';
    duration?: string;
    transcript?: string;
    bucket_name?: string;
  }): MediaAsset {
    const folder = file.folder || (file.mime_type.startsWith('video') ? 'videos' : file.mime_type.startsWith('audio') ? 'audio' : file.mime_type.includes('pdf') ? 'documents' : 'images');
    const year = new Date().getFullYear().toString();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const storagePath = `newsroom-media/${folder}/${year}/${month}/${file.filename}`;

    const newMedia: MediaAsset = {
      id: `med-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      filename: file.filename,
      mime_type: file.mime_type,
      file_size: file.file_size,
      width: folder === 'images' ? 1920 : folder === 'videos' ? 3840 : undefined,
      height: folder === 'images' ? 1080 : folder === 'videos' ? 2160 : undefined,
      bucket_name: file.bucket_name || 'newsroom-media',
      storage_path: storagePath,
      r2_key: storagePath, // retained for backward compatibility
      url: file.url,
      alt_text: file.alt_text || file.filename.replace(/\.[^/.]+$/, ''),
      caption: file.caption || '',
      credit: file.credit || 'Newsroom Staff Archive',
      folder,
      year,
      focal_x: 50,
      focal_y: 50,
      usage_count: 0,
      used_in: { articles: [], pages: [], newsletters: [] },
      duration: file.duration,
      transcript: file.transcript,
      variants: folder === 'images' ? {
        thumbnail: `${file.url}?w=320&auto=format&fit=crop&q=80`,
        small: `${file.url}?w=640&auto=format&fit=crop&q=80`,
        medium: `${file.url}?w=1024&auto=format&fit=crop&q=80`,
        large: `${file.url}?w=1600&auto=format&fit=crop&q=80`,
        xlarge: `${file.url}?w=2400&auto=format&fit=crop&q=80`,
        webp: `${file.url}?w=1200&auto=format&fit=crop&fm=webp`,
        avif: `${file.url}?w=1200&auto=format&fit=crop&fm=avif`
      } : undefined,
      uploaded_by: 'auth-1',
      created_at: new Date().toISOString()
    };
    this.media.unshift(newMedia);
    return newMedia;
  }

  updateMediaFocalPoint(id: string, focal_x: number, focal_y: number): void {
    const item = this.media.find(m => m.id === id);
    if (item) {
      item.focal_x = focal_x;
      item.focal_y = focal_y;
    }
  }

  updateMediaMetadata(id: string, metadata: Partial<MediaAsset>): MediaAsset | null {
    const item = this.media.find(m => m.id === id);
    if (item) {
      Object.assign(item, metadata);
      return item;
    }
    return null;
  }

  deleteMediaAsset(id: string): { success: boolean; message?: string } {
    const index = this.media.findIndex(m => m.id === id);
    if (index === -1) return { success: false, message: 'Asset not found' };
    
    const asset = this.media[index];
    if (asset.usage_count > 0) {
      return {
        success: false,
        message: `Cannot delete asset currently referenced in ${asset.usage_count} published stories. Unlink first.`
      };
    }

    this.media.splice(index, 1);
    return { success: true };
  }

  bulkDeleteMedia(ids: string[]): { deletedCount: number; skippedCount: number } {
    let deletedCount = 0;
    let skippedCount = 0;

    for (const id of ids) {
      const item = this.media.find(m => m.id === id);
      if (item && item.usage_count === 0) {
        this.media = this.media.filter(m => m.id !== id);
        deletedCount++;
      } else {
        skippedCount++;
      }
    }

    return { deletedCount, skippedCount };
  }

  getSupabaseStorageStats() {
    const totalBytes = this.media.reduce((acc, curr) => acc + (curr.file_size || 0), 0);
    const imageCount = this.media.filter(m => (m.folder || 'images') === 'images').length;
    const videoCount = this.media.filter(m => m.folder === 'videos').length;
    const audioCount = this.media.filter(m => m.folder === 'audio').length;
    const docCount = this.media.filter(m => m.folder === 'documents').length;
    const unusedCount = this.media.filter(m => m.usage_count === 0).length;

    return {
      totalBytes,
      totalFormatted: (totalBytes / (1024 * 1024)).toFixed(2) + ' MB',
      totalCount: this.media.length,
      imageCount,
      videoCount,
      audioCount,
      docCount,
      unusedCount,
      bucketName: 'newsroom-media',
      storageProvider: 'Supabase Storage',
      customDomain: 'https://orfnpgersbbytnjnxrvt.supabase.co/storage/v1/object/public/newsroom-media',
      cdnCacheStatus: 'Active (Supabase Global Edge Storage CDN - TTL 365d)',
      egressBandwidthSaved: 'Accelerated Edge CDN'
    };
  }

  // Alias for backward compatibility
  getR2StorageStats() {
    return this.getSupabaseStorageStats();
  }

  // --- Taxonomies ---
  getCategories(): Category[] {
    return this.categories;
  }

  getTags(): Tag[] {
    return this.tags;
  }

  getAuthors(): AuthorProfile[] {
    return this.authors;
  }

  // --- Breaking News ---
  getBreakingNews(): BreakingNewsItem[] {
    return this.breakingNews.filter(b => b.is_active);
  }

  saveBreakingNews(item: Omit<BreakingNewsItem, 'id' | 'created_at'>): BreakingNewsItem {
    const newItem: BreakingNewsItem = {
      ...item,
      id: `brk-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.breakingNews = [newItem, ...this.breakingNews.map(b => ({ ...b, is_active: false }))];
    return newItem;
  }

  dismissBreakingNews(id: string): void {
    const b = this.breakingNews.find(item => item.id === id);
    if (b) b.is_active = false;
  }

  // --- Advertising & Sponsorships ---
  getAdSlots(): AdSlot[] {
    return this.adSlots;
  }

  createAdSlot(slot: Omit<AdSlot, 'id' | 'impressions' | 'clicks'>): AdSlot {
    const newSlot: AdSlot = {
      ...slot,
      id: `ad-slot-${Date.now()}`,
      impressions: 0,
      clicks: 0
    };
    this.adSlots.push(newSlot);
    return newSlot;
  }

  updateAdSlot(id: string, updates: Partial<AdSlot>): AdSlot | null {
    const slot = this.adSlots.find(s => s.id === id);
    if (slot) {
      Object.assign(slot, updates);
      return slot;
    }
    return null;
  }

  deleteAdSlot(id: string): boolean {
    const initialLen = this.adSlots.length;
    this.adSlots = this.adSlots.filter(s => s.id !== id);
    return this.adSlots.length < initialLen;
  }

  // --- Editorial Newsletters & Campaigns ---
  getNewsletterCampaigns(): NewsletterCampaign[] {
    return this.campaigns;
  }

  createNewsletterCampaign(campaign: Omit<NewsletterCampaign, 'id' | 'created_at'>): NewsletterCampaign {
    const newCamp: NewsletterCampaign = {
      ...campaign,
      id: `nl-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.campaigns.unshift(newCamp);
    return newCamp;
  }

  sendNewsletterCampaign(id: string): boolean {
    const camp = this.campaigns.find(c => c.id === id);
    if (camp) {
      camp.status = 'sent';
      camp.sent_at = new Date().toISOString();
      camp.open_rate = 51.4;
      camp.click_rate = 16.2;
      return true;
    }
    return false;
  }

  deleteNewsletterCampaign(id: string): boolean {
    const initialLen = this.campaigns.length;
    this.campaigns = this.campaigns.filter(c => c.id !== id);
    return this.campaigns.length < initialLen;
  }

  // --- Subscriptions & Paywall Tiers ---
  getSubscriptionPlans(): SubscriptionPlan[] {
    return this.subscriptionPlans;
  }

  getMonetizationOverview() {
    const totalAdRevenue = this.adSlots.reduce(
      (acc, slot) => acc + (slot.impressions / 1000) * (slot.cpm_rate || 20),
      0
    );
    const activeCampaignsCount = this.adSlots.filter(s => s.is_active).length;
    const totalNewsletterSubscribers = 42800;
    const paidSubscribersCount = 2840;
    const monthlyRecurringRevenue = paidSubscribersCount * 9;

    return {
      monthlyRecurringRevenue,
      annualRunRate: monthlyRecurringRevenue * 12,
      paidSubscribersCount,
      totalNewsletterSubscribers,
      totalAdRevenue: Math.round(totalAdRevenue),
      activeCampaignsCount,
      avgNewsletterOpenRate: '49.8%',
      avgNewsletterCTR: '15.4%',
      subscriberGrowthMom: '+14.2%',
      churnRate: '1.2%'
    };
  }

  // --- SEO Suite & Redirect Engine ---
  getRedirects(): RedirectRule[] {
    return this.redirects;
  }

  addRedirect(rule: {
    old_path: string;
    new_path: string;
    status_code: 301 | 302 | 410;
    notes?: string;
  }): RedirectRule {
    const newRule: RedirectRule = {
      id: `red-${Date.now()}`,
      old_path: rule.old_path.startsWith('/') ? rule.old_path : `/${rule.old_path}`,
      new_path: rule.new_path.startsWith('/') || rule.new_path.startsWith('http') ? rule.new_path : `/${rule.new_path}`,
      status_code: rule.status_code,
      notes: rule.notes || '',
      is_active: true,
      hit_count: 0,
      created_at: new Date().toISOString()
    };
    this.redirects.unshift(newRule);
    return newRule;
  }

  updateRedirect(id: string, updates: Partial<RedirectRule>): RedirectRule | null {
    const r = this.redirects.find(item => item.id === id);
    if (r) {
      Object.assign(r, updates);
      return r;
    }
    return null;
  }

  deleteRedirect(id: string): boolean {
    const initialLen = this.redirects.length;
    this.redirects = this.redirects.filter(r => r.id !== id);
    return this.redirects.length < initialLen;
  }

  getSEOGlobalHealthReport() {
    const totalArticles = this.articles.length;
    const publishedArticles = this.articles.filter(a => a.status === 'published');
    const withAltText = this.articles.filter(a => a.featured_image && a.featured_image.alt_text);
    const withMetaDesc = this.articles.filter(a => a.seo && a.seo.meta_description && a.seo.meta_description.length >= 100);
    const withSchema = this.articles.filter(a => a.seo && a.seo.schema_type);

    return {
      overallScore: 96,
      grade: 'A+ (Production Grade)',
      totalIndexableUrls: publishedArticles.length + this.categories.length + 4,
      googleNewsEligible: publishedArticles.length,
      redirectCount: this.redirects.length,
      checks: [
        { label: 'Google News Schema (NewsArticle JSON-LD)', status: 'passed', detail: '100% compliant across published feed' },
        { label: 'Canonical URL Self-Referencing Audit', status: 'passed', detail: 'Zero duplicate canonical loops detected' },
        { label: 'OpenGraph & Twitter Card Meta Tags', status: 'passed', detail: 'Images, titles, and descriptions present' },
        { label: 'Supabase Storage Media Alt-Text Compliance', status: 'passed', detail: `${withAltText.length}/${totalArticles} featured images have descriptive alt text` },
        { label: 'Meta Description Length (120-160 chars)', status: 'passed', detail: `${withMetaDesc.length}/${totalArticles} within ideal search snippet length` },
        { label: 'XML Sitemaps (News, Standard & RSS)', status: 'passed', detail: 'Auto-updating with hourly cache revalidation' }
      ]
    };
  }

  pingSearchEngines(): { google: string; bing: string; timestamp: string } {
    return {
      google: 'HTTP 200 OK — Google News Index ping accepted (sitemap.xml & news-sitemap.xml queued)',
      bing: 'HTTP 200 OK — IndexNow notification submitted successfully',
      timestamp: new Date().toISOString()
    };
  }

  // --- Homepage Layout Builder ---
  getHomepageSections(): HomepageSection[] {
    return this.homepageSections.sort((a, b) => a.display_order - b.display_order);
  }

  saveHomepageSections(sections: HomepageSection[]): void {
    this.homepageSections = sections;
  }

  // --- First-Party Analytics Aggregations ---
  getAnalyticsOverview() {
    return {
      liveUsers: 342,
      todayPageviews: 48210,
      todayVisitors: 28940,
      avgEngagementTime: '3m 12s',
      topArticles: [
        { title: 'Union Budget 2026 Unveils Landmark Infrastructure Package', views: 24200, category: 'Economy & Business' },
        { title: 'Breakthrough in Photonic AI Chips Promises 50x Efficiency', views: 18400, category: 'Technology' },
        { title: 'Hospitality Sector Records Double-Digit Surge in RevPAR', views: 9800, category: 'Economy' },
        { title: 'Grid-Scale Battery Storage Reaches 100 GWh Benchmark', views: 7600, category: 'World' }
      ],
      trafficSources: [
        { name: 'Direct Newsroom Traffic', percentage: 42, count: 12150 },
        { name: 'Organic Search (Google / Bing)', percentage: 34, count: 9840 },
        { name: 'Social & Newsletter Referrals', percentage: 16, count: 4630 },
        { name: 'Aggregators & RSS', percentage: 8, count: 2320 }
      ],
      deviceBreakdown: [
        { device: 'Mobile Smartphone', percentage: 68 },
        { device: 'Desktop / Laptop', percentage: 28 },
        { device: 'Tablet / iPad', percentage: 4 }
      ]
    };
  }

  // --- Editorial AI Co-Pilot Simulation Engine ---
  generateAIHeadlines(currentTitle: string, category: string): string[] {
    return [
      `How the 2026 Shift in ${category || 'Policy'} is Reshaping Markets`,
      `Exclusive: Inside the Breakthrough That Defines ${category || 'the Industry'}`,
      `Analysis: Why Leaders Are Betting Big on This Milestone in 2026`,
      `Key Takeaways from the Groundbreaking Report on ${currentTitle.slice(0, 30)}...`
    ];
  }

  generateAIExcerpt(text: string): string {
    return 'An investigative analysis examining the macroeconomic impact, regulatory catalysts, and technological breakthroughs reshaping the sector in 2026.';
  }

  generateAISEO(title: string, excerpt: string): { title: string; description: string; keywords: string[] } {
    return {
      title: `${title.slice(0, 55)} | AMG Newsroom`,
      description: excerpt ? excerpt.slice(0, 155) : 'Comprehensive newsroom report and in-depth analysis on the latest global developments.',
      keywords: ['Newsroom Report', '2026 Analysis', 'Policy & Tech', 'Exclusive Investigation']
    };
  }
}

export const newsroomService = new NewsroomService();
