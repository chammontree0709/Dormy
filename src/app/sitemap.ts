import type { MetadataRoute } from 'next'
import { PRESET_LISTS } from '@/data/presets'

const BASE_URL = 'https://roomdapp.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const guideSlugs = [
    'what-to-pack-for-college',
    'how-to-split-dorm-costs',
    'dorm-room-setup-ideas',
    'move-in-day-checklist',
  ]

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/checklists`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/guides`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const listRoutes: MetadataRoute.Sitemap = PRESET_LISTS.map((list) => ({
    url: `${BASE_URL}/checklists/${list.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const guideRoutes: MetadataRoute.Sitemap = guideSlugs.map((slug) => ({
    url: `${BASE_URL}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...listRoutes, ...guideRoutes]
}
