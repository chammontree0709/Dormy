import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <Link href="/" className="flex items-center gap-2.5 mb-12">
        <Image src="/logo.png" alt="Roomd" height={44} width={44} className="rounded-xl" />
        <span className="font-black text-zinc-950 text-2xl">Roomd</span>
      </Link>
      <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-4">404</p>
      <h1
        className="text-4xl md:text-5xl font-bold italic text-zinc-950 mb-4 leading-tight"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Page not found.
      </h1>
      <p className="text-zinc-500 mb-10 max-w-sm">That page doesn&apos;t exist. Maybe the link is broken or you mistyped the URL.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-zinc-950 text-white font-bold px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors active:scale-[0.98]"
        >
          Go home <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </Link>
        <Link
          href="/dashboard"
          className="font-bold px-6 py-3 rounded-xl border border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:text-zinc-950 transition-colors"
        >
          My rooms
        </Link>
      </div>
    </div>
  )
}
