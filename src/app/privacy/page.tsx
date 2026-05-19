import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="font-black text-indigo-600 text-xl">Roomd</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-10">Last updated: May 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>When you create an account, we collect your name and email address. When you use Roomd, we store the rooms you create or join, the checklist items in those rooms, and actions you take (such as marking items as bought or claimed).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p>We use your information to provide the Roomd service — specifically to sync your shared room checklist with your roommates in real time. We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Amazon Affiliate Disclosure</h2>
            <p>Roomd participates in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. When you click a product link and make a purchase on Amazon, we may earn a small commission at no additional cost to you.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Advertising</h2>
            <p>Roomd uses Google AdSense to display advertisements. Google may use cookies to serve ads based on your visits to this and other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-indigo-600 hover:underline">Google Ads Settings</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Storage</h2>
            <p>Your data is stored securely using Supabase, which uses industry-standard encryption. We retain your data for as long as your account is active. You may request deletion of your account and associated data at any time by emailing us.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Cookies</h2>
            <p>We use cookies to keep you logged in and to enable core functionality of the app. We do not use tracking cookies beyond what is required for authentication and advertising (Google AdSense).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at <a href="mailto:support@roomdapp.com" className="text-indigo-600 hover:underline">support@roomdapp.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Children's Privacy</h2>
            <p>Roomd is intended for users 13 years of age and older. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@roomdapp.com" className="text-indigo-600 hover:underline">support@roomdapp.com</a>.</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 px-4 text-center text-sm text-gray-400 mt-12">
        <p>© {new Date().getFullYear()} Roomd. <Link href="/terms" className="hover:underline">Terms</Link> · <Link href="/privacy" className="hover:underline">Privacy</Link></p>
      </footer>
    </div>
  )
}
