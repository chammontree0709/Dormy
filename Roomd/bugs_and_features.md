# Roomd — Bugs & Features Report
*Tested: May 2026 | Tester: Claude (automated browser testing)*

---

## How to read this doc

Each item has a **severity** rating:
- 🔴 **Critical** — broken, blocks users, or legal risk
- 🟠 **High** — significantly hurts UX or conversions
- 🟡 **Medium** — noticeable problem, workaround exists
- 🟢 **Low / Polish** — minor, cosmetic, or nice-to-have

---

## 🐛 BUGS

---

### BUG-01 — "Browse checklists" CTA routes to login, not a checklists page
**Severity:** 🔴 Critical  
**Page:** Homepage (`/`)  
**Steps to reproduce:** Click the "Browse checklists" button on the hero section  
**Expected:** Opens a page showing preset/curated dorm checklists that guests can browse without signing up  
**Actual:** Redirects to `/login`  
**Impact:** This is the second most prominent CTA on the landing page. Users who want to explore before committing are immediately blocked by a login wall with no context. Conversion killer — users will bounce.  
**Fix:** Either build a `/checklists` page that's publicly accessible, or rename/remove the button if browsing requires auth. If auth is required, at minimum add a message: "Create a free account to browse preset lists."

---

### BUG-02 — `/checklists` route returns a raw black Next.js 404 page
**Severity:** 🔴 Critical  
**Page:** `/checklists`  
**Steps to reproduce:** Navigate directly to `roomdapp.com/checklists`  
**Expected:** Either a checklists page or a branded 404  
**Actual:** Completely unstyled black screen with white "404 | This page could not be found." text — looks like a crash  
**Impact:** Destroys trust. Any user who bookmarks a link, follows a shared URL, or misremembers a route will see this. Also affects SEO — Google may index this.  
**Affected routes (all return this same raw 404):** `/checklists`, `/join`, `/privacy`, `/terms`, `/forgot-password`  
**Fix:** Add a custom `not-found.tsx` (Next.js App Router) or `404.tsx` (Pages Router) with your branded header, a friendly message, and a "Go home" button.

---

### BUG-03 — `/privacy` returns a 404
**Severity:** 🔴 Critical (legal risk)  
**Page:** `/privacy`  
**Steps to reproduce:** Navigate to `roomdapp.com/privacy`  
**Expected:** A privacy policy page  
**Actual:** Raw black 404  
**Impact:** You have an Amazon Associates disclosure in the footer, which means you're collecting affiliate revenue. A missing privacy policy is a legal liability — Amazon Associates program requires one, as do GDPR/CCPA if you have any EU/CA users. If you're collecting any user data at all (which you are — email + password at minimum), this is required.  
**Fix:** Create a `/privacy` route with a real privacy policy. You can use a generator (Termly, iubenda, etc.) as a starting point.

---

### BUG-04 — `/terms` returns a 404
**Severity:** 🔴 Critical (legal risk)  
**Page:** `/terms`  
**Steps to reproduce:** Navigate to `roomdapp.com/terms`  
**Expected:** Terms of service page  
**Actual:** Raw black 404  
**Impact:** Same as above — legal exposure. Users are creating accounts with no ToS they've agreed to.  
**Fix:** Create a `/terms` route with basic Terms of Service.

---

### BUG-05 — Invite code on signup truncates input to 6 characters and redirects mid-flow
**Severity:** 🔴 Critical  
**Page:** `/signup`  
**Steps to reproduce:** Fill out the signup form fully and enter any text in the "Room Invite Code" field, then submit  
**Expected:** Either validates the code server-side and creates the account, or shows an error if the code is invalid  
**Actual:** The form navigates the user away from signup to `/join/[first-6-chars]` — e.g. typing "BADCODE" takes you to `/join/BADCOD`. The account is never created. The user is stranded on a "Sign in first" screen despite being mid-signup.  
**Impact:** Any new user who received a room invite code and tries to use it during signup will fail to create an account and end up confused on an orphaned screen.  
**Fix:** The invite code field should not trigger navigation. Validate it server-side after account creation, then join the room post-signup. Remove the client-side redirect behavior from that field entirely.

---

### BUG-06 — `/join` (no code) returns raw 404
**Severity:** 🟠 High  
**Page:** `/join`  
**Steps to reproduce:** Navigate to `roomdapp.com/join` directly  
**Expected:** A branded page prompting the user to enter a code, or redirect to home  
**Actual:** Raw black 404  
**Fix:** Add a route at `/join` that renders a simple "Enter your room code" UI, or redirect to home.

---

### BUG-07 — Auth-protected routes redirect silently to login with no context message
**Severity:** 🟠 High  
**Pages:** `/dashboard`, `/room`, and any other auth-protected route  
**Steps to reproduce:** Navigate to `roomdapp.com/dashboard` or `roomdapp.com/room` while logged out  
**Expected:** Redirect to login with a message like "Please sign in to access your room"  
**Actual:** Silently redirects to `/login` — the login page shows no context, so users don't know why they ended up there  
**Fix:** Pass a redirect message or query param (e.g. `?redirect=/dashboard&msg=signin_required`) and display it on the login page.

---

### BUG-08 — No "Forgot password?" link on the login page
**Severity:** 🟠 High  
**Page:** `/login`  
**Steps to reproduce:** Look at the login form  
**Expected:** A "Forgot password?" or "Reset password" link  
**Actual:** Not present  
**Impact:** Users who forget their password have no recovery path. They're locked out permanently unless they know to contact support — which also doesn't appear to have a channel.  
**Fix:** Add a "Forgot password?" link and build a `/forgot-password` route with email-based reset flow.

---

### BUG-09 — `/forgot-password` returns a 404
**Severity:** 🟠 High  
**Page:** `/forgot-password`  
**Steps to reproduce:** Navigate to `roomdapp.com/forgot-password`  
**Expected:** A password reset form  
**Actual:** Raw black 404  
**Note:** Tied directly to BUG-08. Even if you add the link, the destination page doesn't exist.

---

### BUG-10 — Footer copyright says "© 2025 Roomd" — year is stale
**Severity:** 🟢 Low  
**Page:** Homepage footer  
**Steps to reproduce:** Scroll to the bottom of the landing page  
**Expected:** Current year (2026)  
**Actual:** "© 2025 Roomd"  
**Fix:** Use a dynamic year: `© {new Date().getFullYear()} Roomd` so it auto-updates.

---

## 🔧 FEATURES THAT NEED WORK

---

### FEAT-01 — No publicly browsable checklists (missing core feature)
**Severity:** 🔴 Critical  
**Description:** The landing page prominently advertises "Preset Lists" as a key feature — "Browse curated lists of dorm essentials, sorted by priority. Freshman Essentials, Study Setup, and more." However, there is nowhere on the site to actually browse these lists without signing up. The "Browse checklists" button just hits a login wall.  
**Why it matters:** "Browse before you sign up" is a proven conversion tactic, especially for a college audience who are skeptical of apps. Letting them see the list content before creating an account dramatically reduces signup friction.  
**Recommendation:** Build a public `/checklists` page showing 2–4 preset lists (Freshman Essentials, Study Setup, etc.) with all items visible. Gate the "Copy to my room" action behind login — not the browsing itself.

---

### FEAT-02 — No password visibility toggle on login or signup
**Severity:** 🟡 Medium  
**Pages:** `/login`, `/signup`  
**Description:** Both password fields are plain `<input type="password">` with no show/hide toggle. On mobile especially, this is a pain point — typos in passwords are common and invisible.  
**Recommendation:** Add an eye icon to toggle password visibility on both forms.

---

### FEAT-03 — Signup form doesn't confirm what happens after account creation
**Severity:** 🟡 Medium  
**Page:** `/signup`  
**Description:** After filling out the form, users have no idea what they're signing up for in terms of next steps. Will they be taken to a room? Asked to create one? Sent a verification email? There's no post-signup expectation setting.  
**Recommendation:** Add a brief line under the CTA button like "You'll be taken to create or join your room." Also clarify whether email verification is required — if it is, make that very clear before submit.

---

### FEAT-04 — No email verification feedback / confirmation screen
**Severity:** 🟡 Medium  
**Page:** Post-signup  
**Description:** It's unclear from the outside whether Roomd sends a verification email after signup. If it does, there's no confirmation screen telling users to check their inbox. If it doesn't, that's a gap in account security and deliverability.  
**Recommendation:** If email verification is used, always show a clear "Check your inbox" screen immediately after signup with the user's email address shown so they can confirm they typed it correctly.

---

### FEAT-05 — No navigation back to homepage from auth pages
**Severity:** 🟡 Medium  
**Pages:** `/login`, `/signup`  
**Description:** The login and signup pages have the Roomd logo at the top, but it's not clickable as a home link. Users who navigated there by mistake have no obvious way back to the homepage except the browser back button.  
**Recommendation:** Make the logo a link to `/` on all auth pages.

---

### FEAT-06 — Invite code field on signup has no input validation feedback
**Severity:** 🟡 Medium  
**Page:** `/signup`  
**Description:** The invite code field (aside from the critical navigation bug in BUG-05) has no visible constraints or feedback. Users don't know if it's case-sensitive, exactly 6 characters, or alphanumeric only. The placeholder "E.G. ABC123" hints at 6 chars but doesn't enforce it clearly.  
**Recommendation:** Once BUG-05 is fixed, add inline validation: show a green checkmark or "Valid code" message when the format matches, and a clear error if the code is invalid after submission.

---

### FEAT-07 — No "Sign in with Google" or social auth
**Severity:** 🟢 Low / Future  
**Pages:** `/login`, `/signup`  
**Description:** College students heavily use Google accounts (via their .edu email). There's no Google OAuth option.  
**Recommendation:** Adding "Continue with Google" would reduce signup friction significantly for this audience. Low priority to ship now but worth planning.

---

### FEAT-08 — No favicon or branded tab icon
**Severity:** 🟢 Low  
**Description:** The browser tab shows a generic favicon (or none). The 🏠 emoji is used well in the logo — a simple icon based on it would polish the brand and help with tab recognition.  
**Recommendation:** Export a 32×32 and 180×180 PNG version of the logo mark and add it as `/favicon.ico` and an Apple touch icon.

---

### FEAT-09 — No visible support or contact channel
**Severity:** 🟡 Medium  
**Description:** There is no "Contact us," "Support," or "Help" link anywhere on the site — not in the nav, not in the footer. If a user has a problem, there's no way to reach out.  
**Recommendation:** At minimum, add a support email to the footer. A simple mailto link (e.g. `support@roomdapp.com`) is fine at this stage.

---

### FEAT-10 — Footer has no links (privacy, terms, contact)
**Severity:** 🟠 High  
**Description:** The footer only has the copyright notice and Amazon affiliate disclosure. There are no links to Privacy Policy, Terms of Service, or Contact. Standard footer links are expected by users and required for legal compliance.  
**Recommendation:** Add footer links to: Privacy Policy (`/privacy`), Terms of Service (`/terms`), and Contact/Support. These should be built out as part of fixing BUG-03 and BUG-04.

---

### FEAT-11 — Landing page feature cards are not interactive / don't link anywhere
**Severity:** 🟢 Low  
**Description:** The four feature cards on the homepage (Shared Checklist, Preset Lists, Buy in One Click, Invite Roommates) are purely informational — they don't link to demos, screenshots, or examples. Clicking them does nothing.  
**Recommendation:** Either make them link to relevant sections of the app (even behind auth) or add a subtle "Learn more →" or modal with a short demo. This is low priority but helps convert curious visitors.

---

## 📋 SUMMARY TABLE

| ID | Issue | Severity | Type |
|---|---|---|---|
| BUG-01 | "Browse checklists" routes to login | 🔴 Critical | Bug |
| BUG-02 | Raw black 404 on multiple routes | 🔴 Critical | Bug |
| BUG-03 | `/privacy` is a 404 | 🔴 Critical | Bug + Legal |
| BUG-04 | `/terms` is a 404 | 🔴 Critical | Bug + Legal |
| BUG-05 | Invite code redirects mid-signup | 🔴 Critical | Bug |
| BUG-06 | `/join` (no code) is a 404 | 🟠 High | Bug |
| BUG-07 | Silent redirect to login, no message | 🟠 High | Bug |
| BUG-08 | No "Forgot password" link on login | 🟠 High | Bug |
| BUG-09 | `/forgot-password` is a 404 | 🟠 High | Bug |
| BUG-10 | Footer year shows 2025 | 🟢 Low | Bug |
| FEAT-01 | No public checklists page | 🔴 Critical | Missing Feature |
| FEAT-02 | No password visibility toggle | 🟡 Medium | Feature Gap |
| FEAT-03 | No post-signup expectation setting | 🟡 Medium | Feature Gap |
| FEAT-04 | No email verification feedback | 🟡 Medium | Feature Gap |
| FEAT-05 | Logo not a home link on auth pages | 🟡 Medium | Feature Gap |
| FEAT-06 | No invite code inline validation | 🟡 Medium | Feature Gap |
| FEAT-07 | No Google / social auth | 🟢 Low | Future Feature |
| FEAT-08 | No favicon | 🟢 Low | Polish |
| FEAT-09 | No support/contact channel | 🟡 Medium | Feature Gap |
| FEAT-10 | Footer has no links | 🟠 High | Feature Gap |
| FEAT-11 | Feature cards not interactive | 🟢 Low | Polish |

---

## 🚦 Recommended Fix Order

**Do these first (critical / legal):**
1. BUG-03 + BUG-04 — Write and publish Privacy Policy and Terms of Service
2. BUG-05 — Fix the invite code signup redirect bug
3. BUG-01 + FEAT-01 — Build the public `/checklists` page
4. BUG-02 — Add a custom branded 404 page

**Do these next (high impact on UX):**
5. BUG-08 + BUG-09 — Add forgot password link + build the reset flow
6. FEAT-10 — Add footer links (privacy, terms, contact)
7. BUG-07 — Add context message on silent auth redirects
8. FEAT-09 — Add a support email somewhere visible

**Polish pass:**
9. FEAT-02 — Password visibility toggle
10. FEAT-05 — Make logo a home link
11. BUG-10 — Dynamic copyright year
12. FEAT-08 — Favicon

*Last updated: May 2026*
