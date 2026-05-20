-- ================================================================
-- Roomd — Security fixes (run in Supabase SQL Editor)
-- Addresses all warnings from the Supabase database linter
-- ================================================================


-- ── Fix 1 & 2: Revoke anon EXECUTE from SECURITY DEFINER functions ──
--
-- The schema already grants EXECUTE only to `authenticated`, but if the
-- production DB was created before these grants were finalised the `anon`
-- role may have inherited the default PUBLIC privilege.  Explicit revokes
-- silence the linter and are harmless if anon never had access.
--
-- is_room_member: used only in RLS policies / by authenticated callers.
-- join_room_by_invite_code: already raises 'not authenticated' for anon,
--   but removing the privilege is cleaner.

REVOKE EXECUTE ON FUNCTION public.is_room_member(uuid, uuid)
  FROM anon;

REVOKE EXECUTE ON FUNCTION public.join_room_by_invite_code(text, text)
  FROM anon;


-- ── Fix 3: Tighten the email_signups INSERT policy ──
--
-- Replace the always-true WITH CHECK with a lightweight email-format
-- guard.  Anonymous inserts are still allowed (needed for the landing-page
-- newsletter form), but garbage rows are rejected at the DB level.

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.email_signups;

CREATE POLICY "Anyone can subscribe" ON public.email_signups
  FOR INSERT
  WITH CHECK (
    email IS NOT NULL
    AND char_length(email) BETWEEN 5 AND 254
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );


-- ── Fix 4: Leaked password protection ──
--
-- This cannot be set via SQL — it lives in Supabase Auth configuration.
-- Enable it in the dashboard:
--
--   Supabase Dashboard
--     → Authentication
--     → Settings
--     → Password Security
--     → toggle "Leaked Password Protection" ON
--
-- This checks submitted passwords against HaveIBeenPwned.org's k-anonymity
-- API at sign-up / password-change time.  It never sends the actual
-- password — only the first 5 chars of the SHA-1 hash.
