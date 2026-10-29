export type SponsorCategory = 'technology' | 'commercial' | 'institutional'
export type SponsorTier = 'diamond' | 'platinum' | 'gold' | 'silver' | 'bronze'
export type SponsorStatus = 'prospective' | 'confirmed' | 'inactive'

export type Sponsor = {
  id: string
  name: string
  logo?: string
  website?: string
  description: string
  contribution?: string
  categories: SponsorCategory[]
  tier?: SponsorTier
  badgeUrl?: string
  status: SponsorStatus
  displayOrder: number
}

export const sponsors: Sponsor[] = [
  {
    id: 'sokrab-group',
    name: 'Sokrab Group',
    logo: '/sokrab-logo-black.png',
    website: 'https://sokrab.com',
    description: 'Sokrab Group supports Igira Provisoire through technology infrastructure, helping us deliver accessible and reliable digital learning experiences to aspiring drivers across Rwanda.',
    contribution: 'Hosting infrastructure and technical support.',
    categories: ['technology', 'commercial'],
    tier: 'diamond',
    status: 'confirmed',
    displayOrder: 1,
  },
  {
    id: 'rwanda-national-police',
    name: 'Rwanda National Police',
    description: 'Prospective institutional road safety partner for education, awareness and responsible driving initiatives.',
    categories: ['institutional'],
    status: 'prospective',
    displayOrder: 1,
  },
]

export const confirmedSponsors = sponsors.filter((sponsor) => sponsor.status === 'confirmed')
export const technologySponsors = confirmedSponsors.filter((sponsor) => sponsor.categories.includes('technology'))
export const commercialSponsors = confirmedSponsors.filter((sponsor) => sponsor.categories.includes('commercial'))
export const institutionalSponsors = confirmedSponsors.filter((sponsor) => sponsor.categories.includes('institutional'))

export const sponsorshipTiers: Array<{ id: SponsorTier; label: string; description: string }> = [
  { id: 'diamond', label: 'Diamond', description: 'Lead the way in making digital road-safety education more accessible.' },
  { id: 'platinum', label: 'Platinum', description: 'Support meaningful reach, content and platform growth.' },
  { id: 'gold', label: 'Gold', description: 'Help more learners access focused preparation.' },
  { id: 'silver', label: 'Silver', description: 'Join a growing network investing in better road users.' },
  { id: 'bronze', label: 'Bronze', description: 'Make a practical contribution to learner success.' },
]
