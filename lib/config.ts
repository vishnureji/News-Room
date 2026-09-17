export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Newsroom',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Global Journalism, Macroeconomic Intelligence & Strategic Analysis',
  edition: 'Global / English',
  storageBucket: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'newsroom-media',
  storageCdnUrl:
    process.env.NEXT_PUBLIC_STORAGE_CDN_URL ||
    `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://orfnpgersbbytnjnxrvt.supabase.co'}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'newsroom-media'}`,
  currency: 'USD',
  membershipTiers: [
    {
      id: 'tier-free',
      name: 'Standard Reader',
      price: '$0',
      period: 'month',
      features: [
        'Unlimited access to public investigative stories',
        'Daily Morning Dispatch newsletter',
        'Standard reader commenting'
      ]
    },
    {
      id: 'tier-pro',
      name: 'Intelligence Pro',
      price: '$9',
      period: 'month',
      badge: 'POPULAR',
      features: [
        'Full access to all Paywall & Deep-Tech dossiers',
        'Ad-free reading experience',
        'Sector data tables & downloadable PDF archives',
        'Direct invitations to editor briefings'
      ]
    },
    {
      id: 'tier-founding',
      name: 'Founding Member',
      price: '$29',
      period: 'month',
      badge: 'EXECUTIVE',
      features: [
        'All Intelligence Pro privileges',
        'Priority editorial pitch submission & feedback',
        'Quarterly macro forecasting briefings with editors',
        'Permanent Founding Member accreditation'
      ]
    }
  ]
};

export type SiteConfig = typeof siteConfig;
