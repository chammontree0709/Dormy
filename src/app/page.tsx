import Link from 'next/link'

const features = [
  { emoji: '✅', title: 'Shared Checklist', description: 'One list for all roommates. Mark items bought in real time — no more duplicate purchases.' },
  { emoji: '📦', title: 'Preset Lists', description: 'Browse curated lists of dorm essentials, sorted by priority. Freshman Essentials, Study Setup, and more.' },
  { emoji: '🛒', title: 'Buy in One Click', description: 'Every item links directly to Amazon. We find the best options so you don\'t have to.' },
  { emoji: '👥', title: 'Invite Roommates', description: 'Share a 6-digit code and your whole room is synced instantly.' },
]

const testimonials = [
  { quote: 'We used to fight about who was buying what. Dormy fixed that.', name: 'Emma & Jake', school: 'Penn State' },
  { quote: 'Saved us from buying three shower caddies and forgetting sheets.', name: 'Priya', school: 'UCLA' },
  { quote: 'The preset lists are so good. We just checked off what we had and bought the rest.', name: 'Marcus', school: 'UT Austin' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="font-black text-indigo-600 text-xl">Dormy</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900">Log in</Link>
            <Link href="/signup" className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <span>🎓</span> Built for college move-in day
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 leading-tight mb-6">
            Your dorm room,<br />
            <span className="text-indigo-600">packed together.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto">
            The shared checklist app for you and your roommates. Never buy the same thing twice. Never forget the essentials.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup" className="w-full sm:w-auto bg-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
              Create your room — it&apos;s free
            </Link>
            <Link href="/templates" className="w-full sm:w-auto bg-white text-indigo-600 font-bold text-lg px-8 py-4 rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 transition-colors">
              Browse checklists
            </Link>
          </div>
        </div>

        <div className="max-w-md mx-auto mt-16">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-indigo-600 px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-white font-bold">Room 204 — Johnson Hall</p>
                <p className="text-indigo-200 text-xs">Emma, Jake, Priya · 3 members</p>
              </div>
              <div className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">8/14 done</div>
            </div>
            <div className="p-4 space-y-2.5">
              {[
                { name: '🛏️ Twin XL Sheet Set', done: true, by: 'Emma' },
                { name: '🔌 Surge Protector', done: true, by: 'Jake' },
                { name: '🚿 Shower Caddy', done: false },
                { name: '☕ Electric Kettle', done: false },
                { name: '💡 LED Desk Lamp', done: false },
              ].map((item) => (
                <div key={item.name} className={`flex items-center gap-3 p-3 rounded-xl ${item.done ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-green-500' : 'border-2 border-gray-300'}`}>
                    {item.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className={`text-sm font-medium flex-1 ${item.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{item.name}</span>
                  {item.done && <span className="text-xs text-green-600">by {item.by}</span>}
                  {!item.done && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Buy</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-3">Everything you need. Nothing you don&apos;t.</h2>
          <p className="text-center text-gray-500 mb-12">Move-in is stressful enough. We handle the list.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-6">
                <div className="text-3xl mb-3">{f.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-indigo-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-center text-gray-900 mb-10">Roommates love it.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-gray-700 text-sm italic mb-4">&ldquo;{t.quote}&rdquo;</p>
                <p className="font-bold text-sm text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.school}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-4">Ready for move-in day?</h2>
        <p className="text-gray-500 mb-8">Create your room, invite your roommates, and start checking things off.</p>
        <Link href="/signup" className="inline-block bg-indigo-600 text-white font-bold text-lg px-10 py-4 rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
          Create your room — free
        </Link>
      </section>

      <footer className="border-t border-gray-100 py-8 px-4 text-center text-sm text-gray-400">
        <p>© 2025 Dormy. Built with ❤️ for college students.</p>
        <p className="mt-1 text-xs">As an Amazon Associate, Dormy earns from qualifying purchases.</p>
      </footer>
    </div>
  )
}
