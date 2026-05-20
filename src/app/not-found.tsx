import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white flex flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <Image src="/logo.png" alt="Roomd" height={44} width={44} className="rounded-xl" />
          <span className="font-black text-emerald-600 text-2xl">Roomd</span>
      </Link>
      <div className="text-6xl mb-6">🤔</div>
      <h1 className="text-3xl font-black text-gray-900 mb-3">Page not found</h1>
      <p className="text-gray-500 mb-8 max-w-sm">That page doesn&apos;t exist. Maybe the link is broken or you mistyped the URL.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
          Go home
        </Link>
        <Link href="/dashboard" className="bg-white text-emerald-600 border-2 border-emerald-200 font-bold px-6 py-3 rounded-xl hover:border-emerald-400 transition-colors">
          My rooms
        </Link>
      </div>
    </div>
  )
}
