const guides = [
  {
    title: 'What to Pack for Your First Year of College',
    description: 'The complete packing list — bedding, bathroom, tech, and more.',
    url: 'https://roomdapp.com/guides/what-to-pack-for-college',
    tag: 'Packing',
  },
  {
    title: 'How to Split Dorm Costs with Your Roommate',
    description: 'A simple system so nobody buys the same thing twice.',
    url: 'https://roomdapp.com/guides/how-to-split-dorm-costs',
    tag: 'Roommates',
  },
  {
    title: 'The College Move-In Day Checklist',
    description: 'Everything to do before, during, and after move-in day.',
    url: 'https://roomdapp.com/guides/move-in-day-checklist',
    tag: 'Move-In',
  },
]

export function buildWelcomeEmail(): string {
  const guideCards = guides.map((g) => `
    <tr>
      <td style="padding: 0 40px;">
        <a href="${g.url}" style="text-decoration: none; display: block; border-top: 1px solid #e4e4e7; padding: 20px 0;">
          <span style="display:inline-block;background:#f0fdf4;color:#059669;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:3px 10px;border-radius:100px;margin-bottom:8px;">${g.tag}</span>
          <p style="color:#09090b;font-size:15px;font-weight:700;margin:0 0 4px;line-height:1.3;">${g.title}</p>
          <p style="color:#71717a;font-size:13px;margin:0 0 10px;line-height:1.5;">${g.description}</p>
          <span style="color:#10b981;font-size:13px;font-weight:700;">Read guide &rarr;</span>
        </a>
      </td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background-color:#09090b;border-radius:16px 16px 0 0;padding:40px 40px 36px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#10b981;border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:20px;font-weight:900;line-height:36px;display:block;">R</span>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">Roomd</span>
                  </td>
                </tr>
              </table>
              <div style="margin-top:32px;">
                <p style="color:#10b981;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px;">Welcome</p>
                <h1 style="color:#ffffff;font-size:32px;font-weight:900;line-height:1.1;margin:0 0 16px;letter-spacing:-1px;">Move-in day just got a whole lot easier.</h1>
                <p style="color:#a1a1aa;font-size:15px;line-height:1.6;margin:0;">Roomd is the free checklist app built for you and your roommates. See who&apos;s buying what in real time, never double-buy again, and actually show up on move-in day with everything you need.</p>
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background-color:#18181b;padding:28px 40px;">
              <p style="color:#71717a;font-size:13px;margin:0 0 16px;">Takes 30 seconds. Free forever. No credit card.</p>
              <a href="https://roomdapp.com/signup" style="display:inline-block;background-color:#10b981;color:#ffffff;font-size:15px;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;letter-spacing:-0.2px;">Create your room &mdash; free</a>
            </td>
          </tr>

          <!-- Guide intro -->
          <tr>
            <td style="background-color:#ffffff;padding:36px 40px 8px;">
              <p style="color:#09090b;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 4px;">From the blog</p>
              <p style="color:#71717a;font-size:14px;margin:0 0 24px;">Get ahead of move-in day with these guides.</p>
            </td>
          </tr>

          <!-- Guide cards -->
          <tr><td style="background-color:#ffffff;padding-bottom:36px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${guideCards}
            </table>
          </td></tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#09090b;border-radius:0 0 16px 16px;padding:28px 40px;">
              <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="padding-right:16px;">
                    <a href="https://www.tiktok.com/@roomdapp" style="color:#a1a1aa;font-size:13px;text-decoration:none;font-weight:600;">TikTok</a>
                  </td>
                  <td>
                    <a href="https://www.instagram.com/roomdapp" style="color:#a1a1aa;font-size:13px;text-decoration:none;font-weight:600;">Instagram</a>
                  </td>
                </tr>
              </table>
              <p style="color:#52525b;font-size:12px;margin:0;line-height:1.6;">
                You&apos;re receiving this because you signed up at roomdapp.com.<br/>
                &copy; ${new Date().getFullYear()} Roomd &mdash; <a href="mailto:support@roomdapp.com" style="color:#52525b;">support@roomdapp.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
