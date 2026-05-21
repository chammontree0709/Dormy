import type { Metadata, Viewport } from 'next'
import { Outfit, Playfair_Display } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Roomd — Shared Dorm Room Checklist', template: '%s | Roomd' },
  description: 'The shared dorm room supply list for you and your roommates. Check off items as you buy them, together.',
  metadataBase: new URL('https://roomdapp.com'),
  openGraph: {
    siteName: 'Roomd',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@roomdapp',
  },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Roomd' },
}

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable} h-full`}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-7336988558032518" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7336988558032518"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full antialiased">
        {children}
      </body>
    </html>
  )
}
