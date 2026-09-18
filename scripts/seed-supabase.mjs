import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://orfnpgersbbytnjnxrvt.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Service Role Key in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function runDatabaseSeed() {
  console.log('--- EXECUTING SUPABASE DATABASE SEED ---');

  // 1. Authors & Profiles
  console.log('1. Seeding Profiles & Authors...');
  const authorsData = [
    {
      email: 'vishnu@newsroom.com',
      password: 'NewsroomPassword2026!',
      display_name: 'Vishnu Reji',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Editor-in-Chief & Investigative Journalist covering geopolitical economics and deep tech.',
      designation: 'Editor-in-Chief',
      social_links: { twitter: 'https://x.com/vishnureji', linkedin: 'https://linkedin.com' }
    },
    {
      email: 'anu@newsroom.com',
      password: 'NewsroomPassword2026!',
      display_name: 'Anu Sharma',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      bio: 'Senior Economics & Policy Reporter with 12 years of financial investigative experience.',
      designation: 'Senior Reporter',
      social_links: { twitter: 'https://x.com/anusharma' }
    },
    {
      email: 'rahul@newsroom.com',
      password: 'NewsroomPassword2026!',
      display_name: 'Rahul Varma',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      bio: 'Tech Editor & AI Analyst covering semiconductor supply chains and software.',
      designation: 'Tech Editor',
      social_links: { twitter: 'https://x.com/rahulvarma' }
    },
    {
      email: 'priya@newsroom.com',
      password: 'NewsroomPassword2026!',
      display_name: 'Priya Nair',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      bio: 'Macroeconomics Correspondent specializing in central bank monetary regimes.',
      designation: 'Macroeconomics Lead',
      social_links: { twitter: 'https://x.com/priyanair' }
    }
  ];

  const authorMap = {};

  for (const authUser of authorsData) {
    let userId = null;
    try {
      const { data: created, error: cErr } = await supabase.auth.admin.createUser({
        email: authUser.email,
        password: authUser.password,
        email_confirm: true,
        user_metadata: { display_name: authUser.display_name }
      });
      if (created?.user) {
        userId = created.user.id;
      } else {
        const { data: usersData } = await supabase.auth.admin.listUsers();
        const existing = usersData?.users?.find(u => u.email === authUser.email);
        if (existing) userId = existing.id;
      }
    } catch {
      const { data: usersData } = await supabase.auth.admin.listUsers();
      const existing = usersData?.users?.find(u => u.email === authUser.email);
      if (existing) userId = existing.id;
    }

    if (userId) {
      authorMap[authUser.email] = userId;
      await supabase.from('profiles').upsert({
        id: userId,
        display_name: authUser.display_name,
        email: authUser.email,
        avatar_url: authUser.avatar_url,
        bio: authUser.bio,
        designation: authUser.designation,
        social_links: authUser.social_links,
        is_author: true,
        status: 'active'
      });
    }
  }

  // 2. Categories
  console.log('2. Seeding Categories...');
  const categoriesData = [
    { name: 'National', slug: 'national', color: '#E53E3E', display_order: 1, description: 'Domestic politics, governance and nationwide policy developments' },
    { name: 'Economy & Business', slug: 'business', color: '#2563EB', display_order: 2, description: 'Markets, corporate enterprise, fiscal policy and startup innovation' },
    { name: 'Technology & AI', slug: 'tech', color: '#7C3AED', display_order: 3, description: 'Artificial intelligence, cybersecurity, consumer hardware and software' },
    { name: 'World Affairs', slug: 'world', color: '#059669', display_order: 4, description: 'Global diplomacy, geopolitics and international security' },
    { name: 'Opinion & Analysis', slug: 'opinion', color: '#D97706', display_order: 5, description: 'Expert editorials, guest columns and deep analytical essays' },
    { name: 'Culture & Life', slug: 'culture', color: '#DB2777', display_order: 6, description: 'Arts, cinema, heritage, lifestyle and literary commentary' }
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const { data } = await supabase.from('categories').upsert(cat, { onConflict: 'slug' }).select();
    if (data && data[0]) {
      categoryMap[cat.slug] = data[0].id;
    }
  }

  // 3. Tags
  console.log('3. Seeding Tags...');
  const tagsData = [
    { name: 'Fiscal Policy', slug: 'fiscal-policy', description: 'Budgetary matters, tax reforms, and sovereign spending' },
    { name: 'AI Regulation', slug: 'ai-regulation', description: 'Legal frameworks for artificial general intelligence' },
    { name: 'Clean Energy', slug: 'clean-energy', description: 'Renewables, nuclear fission, and grid infrastructure' },
    { name: 'Semiconductors', slug: 'semiconductors', description: 'Silicon chip architecture, fabs, and supply chains' },
    { name: 'Hospitality', slug: 'hospitality', description: 'Global tourism, luxury services, and travel logistics' },
    { name: 'Global Trade', slug: 'global-trade', description: 'Maritime routes, tariffs, and currency settlements' },
    { name: 'Macroeconomics', slug: 'macroeconomics', description: 'Inflation dynamics, liquidity, and interest rates' }
  ];

  const tagMap = {};
  for (const t of tagsData) {
    const { data } = await supabase.from('tags').upsert(t, { onConflict: 'slug' }).select();
    if (data && data[0]) {
      tagMap[t.slug] = data[0].id;
    }
  }

  // 4. Media
  console.log('4. Seeding Media Assets...');
  const mediaData = [
    {
      filename: 'parliament-budget-session.webp',
      mime_type: 'image/webp',
      file_size: 420000,
      width: 1920,
      height: 1080,
      r2_key: 'newsroom-media/images/2026/09/parliament-budget-session.webp',
      url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1400&auto=format&fit=crop&q=80',
      alt_text: 'Parliament central hall during annual fiscal budget presentation',
      caption: 'The national legislature convened for the landmark economic agenda.',
      credit: 'AMG Photo Service / Rahul Varma',
      focal_x: 50,
      focal_y: 40
    },
    {
      filename: 'ai-datacenters-energy.webp',
      mime_type: 'image/webp',
      file_size: 610000,
      width: 1920,
      height: 1080,
      r2_key: 'newsroom-media/images/2026/09/ai-datacenters-energy.webp',
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&auto=format&fit=crop&q=80',
      alt_text: 'High density AI accelerator racks in liquid cooled data facility',
      caption: 'Hyper-scale computing centers driving global energy grid transformation.',
      credit: 'Reuters / Media Archive',
      focal_x: 50,
      focal_y: 50
    },
    {
      filename: 'global-trade-ports.webp',
      mime_type: 'image/webp',
      file_size: 580000,
      width: 1920,
      height: 1080,
      r2_key: 'newsroom-media/images/2026/09/global-trade-ports.webp',
      url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1400&auto=format&fit=crop&q=80',
      alt_text: 'Automated container terminal at maritime shipping hub',
      caption: 'Indo-Pacific sea routes expand with automated transshipment hubs.',
      credit: 'Bloomberg / Getty',
      focal_x: 50,
      focal_y: 50
    },
    {
      filename: 'semiconductor-cleanroom.webp',
      mime_type: 'image/webp',
      file_size: 720000,
      width: 1920,
      height: 1080,
      r2_key: 'newsroom-media/images/2026/09/semiconductor-cleanroom.webp',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&auto=format&fit=crop&q=80',
      alt_text: 'Silicon wafer fabrication cleanroom photolithography unit',
      caption: 'Next generation sub-2nm foundry node operations.',
      credit: 'TSMC Media Release',
      focal_x: 50,
      focal_y: 50
    },
    {
      filename: 'central-bank-monetary-policy.webp',
      mime_type: 'image/webp',
      file_size: 490000,
      width: 1920,
      height: 1080,
      r2_key: 'newsroom-media/images/2026/09/central-bank-monetary-policy.webp',
      url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1400&auto=format&fit=crop&q=80',
      alt_text: 'Stock exchange electronic tickers displaying market liquidity indices',
      caption: 'Central bank rate decisions spark historic bond yield adjustments.',
      credit: 'Financial Times Archives',
      focal_x: 50,
      focal_y: 50
    }
  ];

  const mediaMap = {};
  for (const m of mediaData) {
    const { data: existing } = await supabase.from('media').select('id').eq('filename', m.filename).maybeSingle();
    if (existing) {
      mediaMap[m.filename] = existing.id;
    } else {
      const { data } = await supabase.from('media').insert(m).select();
      if (data && data[0]) {
        mediaMap[m.filename] = data[0].id;
      }
    }
  }

  // 5. Articles
  console.log('5. Seeding Real Published Investigative Articles...');
  const vishnuId = authorMap['vishnu@newsroom.com'];
  const anuId = authorMap['anu@newsroom.com'];
  const rahulId = authorMap['rahul@newsroom.com'];
  const priyaId = authorMap['priya@newsroom.com'];

  const articlesData = [
    {
      slug: 'union-budget-2026-infrastructure-green-energy-package',
      title: 'Union Budget 2026 Unveils Landmark $120B Infrastructure & Green Energy Package',
      subtitle: 'Comprehensive fiscal roadmap targets semiconductor fabrication, high-speed freight corridors, and hydrogen energy hubs.',
      excerpt: 'The finance ministry has presented a transformative economic package prioritizing deep-tech manufacturing subsidies, cross-country transmission corridors, and domestic semiconductor fabs.',
      primary_category_id: categoryMap['national'],
      featured_image_id: mediaMap['parliament-budget-session.webp'],
      status: 'published',
      visibility: 'public',
      reading_time_mins: 4,
      published_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      content_blocks: [
        {
          id: 'blk-1',
          type: 'paragraph',
          content: { text: 'In what fiscal analysts are characterizing as the most consequential budget presentation in a decade, the Union Finance Ministry today unveiled a sweeping $120 billion capital expenditure framework aimed at transforming national manufacturing competitiveness and accelerating the transition to sovereign green hydrogen hubs.' }
        },
        {
          id: 'blk-2',
          type: 'heading',
          content: { text: 'Key Pillars of the 2026 Capital Strategy', level: 2 }
        },
        {
          id: 'blk-3',
          type: 'key_takeaways',
          content: {
            title: 'Executive Summary & Core Outlays',
            items: [
              '$42 Billion dedicated to semiconductor fabrication lines and advanced packaging facilities.',
              '$38 Billion allocated for ultra-high voltage DC clean energy transmission grids connecting renewable zones.',
              '100% duty exemptions on imported capital machinery utilized in wafer lithography and photovoltaic cells.',
              'Creation of a sovereign AI compute cluster offering subsidized GPU compute to domestic enterprise startups.'
            ]
          }
        },
        {
          id: 'blk-4',
          type: 'paragraph',
          content: { text: 'Addressing a packed parliament session, the Finance Minister emphasized that capital efficiency and private sector co-investment will anchor every major allocation, ensuring minimal fiscal slippage while maintaining a glide path toward a 4.1% fiscal deficit target.' }
        },
        {
          id: 'blk-5',
          type: 'pull_quote',
          content: {
            quote: 'This budget does not merely spend capital; it orchestrates long-term sovereign capabilities across energy, silicon, and intelligence infrastructure.',
            attribution: 'Union Finance Minister, Budget Address 2026'
          }
        },
        {
          id: 'blk-6',
          type: 'callout',
          content: {
            type: 'info',
            title: 'Market Reaction Snapshot',
            text: 'Benchmark equity indices surged 2.4% following the speech, led by industrial capital goods, power transmission utilities, and electronics manufacturers. Sovereign 10-year bond yields softened by 7 basis points to 6.78%.'
          }
        }
      ],
      author_ids: [vishnuId, anuId],
      tag_ids: [tagMap['fiscal-policy'], tagMap['clean-energy'], tagMap['semiconductors']]
    },
    {
      slug: 'deepseek-sovereign-ai-compute-geopolitics-breakthrough',
      title: 'DeepSeek, Sovereign AI & The New Geopolitics of High-Density Compute',
      subtitle: 'How architectural breakthroughs in algorithmic distillation are challenging Silicon Valley hardware dominance.',
      excerpt: 'Recent advances in open-weights reasoning models have recalibrated national AI strategies, shifting focus from raw GPU cluster size to efficiency distillation and domestic inference clusters.',
      primary_category_id: categoryMap['tech'],
      featured_image_id: mediaMap['ai-datacenters-energy.webp'],
      status: 'published',
      visibility: 'public',
      reading_time_mins: 6,
      published_at: new Date(Date.now() - 3600000 * 8).toISOString(),
      content_blocks: [
        {
          id: 'blk-1',
          type: 'paragraph',
          content: { text: 'The global artificial intelligence landscape is undergoing a tectonic realignment. For three years, national strategies were measured strictly by the aggregate count of high-end accelerator chips within sovereign borders. Today, that calculus has been shattered by breakthroughs in algorithmic compression, Mixture-of-Experts architectures, and post-training distillation.' }
        },
        {
          id: 'blk-2',
          type: 'heading',
          content: { text: 'The Shift from Brute Force to Algorithmic Precision', level: 2 }
        },
        {
          id: 'blk-3',
          type: 'paragraph',
          content: { text: 'State-backed compute initiatives in Tokyo, Paris, New Delhi, and Singapore are rapidly pivoting away from multi-billion dollar mega-clusters toward distributed, sovereign reasoning nodes optimized for national languages, local regulatory compliances, and critical infrastructure control.' }
        },
        {
          id: 'blk-4',
          type: 'pull_quote',
          content: {
            quote: 'Compute sovereignty is no longer about who can buy 100,000 GPUs, but who can distill world-class intelligence onto 2,000 efficient accelerators.',
            attribution: 'Rahul Varma, Tech Editor'
          }
        }
      ],
      author_ids: [rahulId],
      tag_ids: [tagMap['ai-regulation'], tagMap['semiconductors']]
    },
    {
      slug: 'global-supply-chains-shift-indo-pacific-trade-corridors',
      title: 'Global Supply Chains Shift as Indo-Pacific Maritime Corridors Expand',
      subtitle: 'New multimodal transport pacts and automated deep-water container terminals reshape East-West commercial routes.',
      excerpt: 'Commercial shipping conglomerates are diversifying freight corridors away from single chokepoints, investing heavily in automated transshipment hubs across South and Southeast Asia.',
      primary_category_id: categoryMap['world'],
      featured_image_id: mediaMap['global-trade-ports.webp'],
      status: 'published',
      visibility: 'public',
      reading_time_mins: 5,
      published_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      content_blocks: [
        {
          id: 'blk-1',
          type: 'paragraph',
          content: { text: 'Maritime commerce is recording its most significant routing overhaul since the opening of the expanded Panama Canal. Driven by geopolitical risk mitigation and nearshoring mandates, global freight consortia are scaling multimodal freight routes spanning the Arabian Sea, the Bay of Bengal, and the Malacca Strait.' }
        }
      ],
      author_ids: [anuId, vishnuId],
      tag_ids: [tagMap['global-trade'], tagMap['macroeconomics']]
    },
    {
      slug: 'sub-2nm-foundry-race-gallium-nitride-power-breakthrough',
      title: 'The Sub-2nm Foundry Race: Advanced Packaging & Next-Gen Power Delivery',
      subtitle: 'Backside power delivery and gate-all-around nanosheets redefine high-performance silicon fabrication.',
      excerpt: 'Leading chipmakers are transitioning from FinFET to Gate-All-Around nanosheets and backside power delivery, overcoming thermal limits in generative AI silicon.',
      primary_category_id: categoryMap['tech'],
      featured_image_id: mediaMap['semiconductor-cleanroom.webp'],
      status: 'published',
      visibility: 'members_only',
      reading_time_mins: 5,
      published_at: new Date(Date.now() - 3600000 * 20).toISOString(),
      content_blocks: [
        {
          id: 'blk-1',
          type: 'paragraph',
          content: { text: 'In the microscopic battlegrounds of photolithography, the physical laws governing silicon interconnects have reached a critical juncture. The introduction of Backside Power Delivery Networks (BSPDN) is eliminating resistance bottlenecks that have constrained clock speeds for half a decade.' }
        }
      ],
      author_ids: [rahulId],
      tag_ids: [tagMap['semiconductors']]
    },
    {
      slug: 'central-bank-liquidity-monetary-pivot-analysis',
      title: 'Macro Resilience Demands Strategic Capital Allocation: An Editorial',
      subtitle: 'Why navigating synchronized global rate cuts requires fiscal discipline rather than speculative stimulus.',
      excerpt: 'As major central banks initiate easing cycles, sovereign treasuries must resist the urge to inflate asset bubbles and instead channel cheap credit into productive industrial capacity.',
      primary_category_id: categoryMap['opinion'],
      featured_image_id: mediaMap['central-bank-monetary-policy.webp'],
      status: 'published',
      visibility: 'public',
      reading_time_mins: 4,
      published_at: new Date(Date.now() - 3600000 * 28).toISOString(),
      content_blocks: [
        {
          id: 'blk-1',
          type: 'paragraph',
          content: { text: 'The era of aggressive quantitative tightening has formally drawn to a close. With central banks across four continents loosening monetary policy simultaneously, the global financial system is poised for a deluge of fresh liquidity. How governments allocate this capital will dictate economic stability for the next two decades.' }
        }
      ],
      author_ids: [priyaId],
      tag_ids: [tagMap['macroeconomics'], tagMap['fiscal-policy']]
    }
  ];

  for (const art of articlesData) {
    const { author_ids, tag_ids, ...artFields } = art;
    const { data: existing } = await supabase.from('articles').select('id').eq('slug', art.slug).maybeSingle();
    let articleId = existing?.id;

    if (existing) {
      await supabase.from('articles').update(artFields).eq('id', existing.id);
    } else {
      const { data: created } = await supabase.from('articles').insert(artFields).select();
      if (created && created[0]) articleId = created[0].id;
    }

    if (articleId) {
      // Authors
      if (author_ids && author_ids.length > 0) {
        await supabase.from('article_authors').delete().eq('article_id', articleId);
        const authorRows = author_ids.filter(Boolean).map((aid, idx) => ({
          article_id: articleId,
          author_id: aid,
          role: idx === 0 ? 'primary_author' : 'co_author',
          display_order: idx
        }));
        if (authorRows.length > 0) {
          await supabase.from('article_authors').insert(authorRows);
        }
      }

      // Tags
      if (tag_ids && tag_ids.length > 0) {
        await supabase.from('article_tags').delete().eq('article_id', articleId);
        const tagRows = tag_ids.filter(Boolean).map(tid => ({
          article_id: articleId,
          tag_id: tid
        }));
        if (tagRows.length > 0) {
          await supabase.from('article_tags').insert(tagRows);
        }
      }
    }
  }

  // 6. Breaking News
  console.log('6. Seeding Breaking News Ticker...');
  const breakingData = [
    {
      title: 'Union Cabinet Approves $120B Infrastructure & Green Energy Budget Framework',
      summary: 'Major spending package cleared with bipartisan consensus.',
      target_url: '/article/union-budget-2026-infrastructure-green-energy-package',
      priority: 1,
      is_active: true
    },
    {
      title: 'Global Chipmakers Announce New Sub-2nm Semiconductor Fab in Bengaluru Corridor',
      summary: 'Commercial foundry operations slated for Q4 2027.',
      target_url: '/article/sub-2nm-foundry-race-gallium-nitride-power-breakthrough',
      priority: 2,
      is_active: true
    },
    {
      title: 'International Maritime Taskforce Opens New Automated Transshipment Route',
      summary: 'Freight shipping transit times reduced by 48 hours.',
      target_url: '/article/global-supply-chains-shift-indo-pacific-trade-corridors',
      priority: 3,
      is_active: true
    }
  ];

  for (const b of breakingData) {
    const { data: existing } = await supabase.from('breaking_news').select('id').eq('title', b.title).maybeSingle();
    if (!existing) {
      await supabase.from('breaking_news').insert(b);
    }
  }

  // 7. Assignments
  console.log('7. Seeding Editorial Assignments...');
  const assignmentsData = [
    {
      title: 'Special Investigation: Clean Energy Grid Bottlenecks in Western Corridor',
      priority: 'high',
      status: 'in_progress',
      notes: 'Investigating high-voltage transmission delays and land acquisition challenges.',
      deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
      assigned_to: anuId,
      assigned_by: vishnuId
    },
    {
      title: 'Deep Dive: Sovereign AI Compute Clusters and National Language Models',
      priority: 'medium',
      status: 'assigned',
      notes: 'Interviewing chief scientists at leading domestic AI institutes.',
      deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
      assigned_to: rahulId,
      assigned_by: vishnuId
    }
  ];

  for (const a of assignmentsData) {
    const { data: existing } = await supabase.from('assignments').select('id').eq('title', a.title).maybeSingle();
    if (!existing) {
      await supabase.from('assignments').insert(a);
    }
  }

  console.log('--- SUPABASE DATABASE SEED COMPLETED SUCCESSFULLY ---');
  return { success: true };
}

if (process.argv[1]?.endsWith('seed-supabase.mjs')) {
  runDatabaseSeed().catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}
