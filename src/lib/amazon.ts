const AFFILIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'roomd05-20'

export function buildAffiliateUrl(url: string): string {
  try {
    const parsed = new URL(url)
    parsed.searchParams.set('tag', AFFILIATE_TAG)
    return parsed.toString()
  } catch {
    return url
  }
}

export function buildAmazonSearchUrl(query: string): string {
  const base = new URL('https://www.amazon.com/s')
  base.searchParams.set('k', query)
  base.searchParams.set('tag', AFFILIATE_TAG)
  return base.toString()
}
