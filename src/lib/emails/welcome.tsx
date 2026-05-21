export function WelcomeEmail() {
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

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f4f4f5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f4f4f5', padding: '40px 16px' }}>
          <tr>
            <td align="center">
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ maxWidth: '560px' }}>

                {/* Header */}
                <tr>
                  <td style={{ backgroundColor: '#09090b', borderRadius: '16px 16px 0 0', padding: '40px 40px 36px' }}>
                    {/* Logo */}
                    <table cellPadding="0" cellSpacing="0">
                      <tr>
                        <td>
                          <table cellPadding="0" cellSpacing="0">
                            <tr>
                              <td style={{
                                backgroundColor: '#10b981',
                                borderRadius: '10px',
                                width: '36px',
                                height: '36px',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                              }}>
                                <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: 900, lineHeight: '36px', display: 'block' }}>R</span>
                              </td>
                              <td style={{ paddingLeft: '10px', verticalAlign: 'middle' }}>
                                <span style={{ color: '#ffffff', fontSize: '22px', fontWeight: 900, letterSpacing: '-0.5px' }}>Roomd</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <div style={{ marginTop: '32px' }}>
                      <p style={{ color: '#10b981', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 12px' }}>
                        Welcome
                      </p>
                      <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: 900, lineHeight: 1.1, margin: '0 0 16px', letterSpacing: '-1px' }}>
                        Move-in day just got a whole lot easier.
                      </h1>
                      <p style={{ color: '#a1a1aa', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
                        Roomd is the free checklist app built for you and your roommates. See who&apos;s buying what in real time, never double-buy again, and actually show up on move-in day with everything you need.
                      </p>
                    </div>
                  </td>
                </tr>

                {/* CTA */}
                <tr>
                  <td style={{ backgroundColor: '#18181b', padding: '28px 40px' }}>
                    <p style={{ color: '#71717a', fontSize: '13px', margin: '0 0 16px' }}>
                      Takes 30 seconds. Free forever. No credit card.
                    </p>
                    <a
                      href="https://roomdapp.com/signup"
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        fontSize: '15px',
                        fontWeight: 700,
                        padding: '14px 28px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        letterSpacing: '-0.2px',
                      }}
                    >
                      Create your room — free
                    </a>
                  </td>
                </tr>

                {/* Divider */}
                <tr>
                  <td style={{ backgroundColor: '#ffffff', padding: '36px 40px 8px' }}>
                    <p style={{ color: '#09090b', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 4px' }}>
                      From the blog
                    </p>
                    <p style={{ color: '#71717a', fontSize: '14px', margin: '0 0 24px' }}>
                      Get ahead of move-in day with these guides.
                    </p>
                  </td>
                </tr>

                {/* Guide cards */}
                {guides.map((guide, i) => (
                  <tr key={guide.url}>
                    <td style={{ backgroundColor: '#ffffff', padding: `0 40px ${i === guides.length - 1 ? '36px' : '0'}` }}>
                      <a href={guide.url} style={{ textDecoration: 'none', display: 'block' }}>
                        <table width="100%" cellPadding="0" cellSpacing="0" style={{
                          borderTop: '1px solid #e4e4e7',
                          padding: '20px 0',
                        }}>
                          <tr>
                            <td style={{ paddingTop: '20px' }}>
                              <span style={{
                                display: 'inline-block',
                                backgroundColor: '#f0fdf4',
                                color: '#059669',
                                fontSize: '10px',
                                fontWeight: 700,
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                padding: '3px 10px',
                                borderRadius: '100px',
                                marginBottom: '8px',
                              }}>
                                {guide.tag}
                              </span>
                              <p style={{ color: '#09090b', fontSize: '15px', fontWeight: 700, margin: '0 0 4px', lineHeight: 1.3 }}>
                                {guide.title}
                              </p>
                              <p style={{ color: '#71717a', fontSize: '13px', margin: '0 0 10px', lineHeight: 1.5 }}>
                                {guide.description}
                              </p>
                              <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 700 }}>
                                Read guide →
                              </span>
                            </td>
                          </tr>
                        </table>
                      </a>
                    </td>
                  </tr>
                ))}

                {/* Footer */}
                <tr>
                  <td style={{ backgroundColor: '#09090b', borderRadius: '0 0 16px 16px', padding: '28px 40px' }}>
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tr>
                        <td>
                          {/* Social links */}
                          <table cellPadding="0" cellSpacing="0" style={{ marginBottom: '16px' }}>
                            <tr>
                              <td style={{ paddingRight: '16px' }}>
                                <a href="https://www.tiktok.com/@roomdapp" style={{ color: '#a1a1aa', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>
                                  TikTok
                                </a>
                              </td>
                              <td>
                                <a href="https://www.instagram.com/roomdapp" style={{ color: '#a1a1aa', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>
                                  Instagram
                                </a>
                              </td>
                            </tr>
                          </table>
                          <p style={{ color: '#52525b', fontSize: '12px', margin: 0, lineHeight: 1.6 }}>
                            You&apos;re receiving this because you signed up at roomdapp.com.
                            <br />
                            &copy; {new Date().getFullYear()} Roomd &mdash;{' '}
                            <a href="mailto:support@roomdapp.com" style={{ color: '#52525b' }}>support@roomdapp.com</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}
