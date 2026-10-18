# NGH Careers Intake Worker

Secure intake bridge for `nghpropertygroup.com/careers`.

## Flow

1. Frontend asks `POST /uploads/presign` with role slug, appId, Turnstile token, and upload metadata.
2. Worker verifies Turnstile, validates file metadata, stores upload session metadata, and returns short-lived direct-to-R2 PUT URLs for the SETUP.md R2 object contract.
3. Browser uploads resume and intro video directly to private R2.
4. Frontend calls `POST /applications` with candidate data, questionnaire answers, and uploaded object keys.
5. Worker checks uploaded objects, validates magic bytes and hard size caps, stores `metadata.json`, and sends a secondary Telegram ping with role only. The Mini mailer reads R2 and sends the durable email from the NGH mail server.
6. Daily Cron deletes `applications/{appId}/` after `role_close_date + RETENTION_DAYS_AFTER_ROLE_CLOSE < today` (12 months since 2026-09-17, was 28 days).

## Production secrets Dev must provision

Do not hardcode these and do not expose them in the frontend bundle.

- `TURNSTILE_SECRET_KEY`
- `TELEGRAM_NOTIFY_BOT_TOKEN`
- `TELEGRAM_NOTIFY_CHAT_ID`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- optional `ADMIN_DELETE_TOKEN`

Development-only variable:

- `TURNSTILE_TEST_MODE=true`, allows local/test presign when `TURNSTILE_SECRET_KEY` is absent. Do not set in production.

Public frontend variable:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

## Privacy rules

- R2 bucket private, EU jurisdiction where configurable.
- No public or permanent candidate-data links.
- Worker stores `metadata.json` at `applications/<appId>/metadata.json` with SETUP.md fields, CV key, and intro-video link.
- Telegram notification is secondary and contains only the role title, no candidate PII.
- The Mini mailer reads R2 with a read-only token and sends the full email through the NGH mail server.
- Retention notice shown to the candidate: `We keep your application for up to 12 months after the role is closed or filled, so we can consider you for other roles. After that it is deleted automatically. Email info@nghpropertygroup.com any time and we will delete it sooner.` It appears on the application form and, in fuller form, in the privacy policy. The consent checkbox itself covers background and reference checks, not retention.
- Changing the retention period means changing three things in one go: `RETENTION_DAYS_AFTER_ROLE_CLOSE` in `src/security.ts`, `components/sections/career/ApplicationForm.tsx` in ngh-website-2026, and `app/privacy-policy/page.tsx` in this repo. A test in `test/security.test.ts` fails if the constant moves, so the copy cannot silently drift away from what the Worker actually does.
