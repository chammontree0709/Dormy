import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Roomd terms of service — the rules for using Roomd.',
  alternates: { canonical: 'https://roomdapp.com/terms' },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Roomd" height={30} width={30} className="rounded-lg" />
            <span className="font-black text-emerald-600 text-xl">Roomd</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-10">Last updated: May 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>By creating an account or using Roomd, you agree to these Terms of Service. If you do not agree, do not use the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Description of Service</h2>
            <p>Roomd is a shared dorm room supply checklist application that allows college students and their roommates to coordinate purchases in real time. We provide curated product lists with links to Amazon and other retailers.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Accounts</h2>
            <p>You are responsible for maintaining the security of your account and password. You agree to provide accurate information when creating your account. You must be at least 13 years old to use Roomd.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Acceptable Use</h2>
            <p>You agree not to use Roomd to: violate any laws, harass or harm other users, attempt to gain unauthorized access to any part of the service, or interfere with the proper functioning of the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Affiliate Links & Advertising</h2>
            <p>Roomd participates in the Amazon Associates affiliate program. Product links on our site may be affiliate links that earn us a commission when you make a purchase. We also display advertisements via Google AdSense. These commissions help us keep Roomd free for all users.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Product Recommendations</h2>
            <p>The product recommendations on Roomd are provided for informational purposes only. We do not guarantee the availability, price, or quality of any product. Always verify product details before purchasing.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Termination</h2>
            <p>We reserve the right to suspend or terminate your account at any time if you violate these terms. You may also delete your account at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Disclaimer of Warranties</h2>
            <p>Roomd is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or that defects will be corrected.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Roomd shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:support@roomdapp.com" className="text-emerald-600 hover:underline">support@roomdapp.com</a>.</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 px-4 text-center text-sm text-gray-400 mt-12">
        <p>© {new Date().getFullYear()} Roomd. <Link href="/terms" className="hover:underline">Terms</Link> · <Link href="/privacy" className="hover:underline">Privacy</Link></p>
      </footer>
    </div>
  )
}
