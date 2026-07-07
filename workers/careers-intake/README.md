# NGH Careers Intake Worker

Secure intake bridge for `nghpropertygroup.com/careers`.

## Flow

1. Frontend asks `POST /uploads/presign` with role slug, appId, Turnstile token, and upload metadata.
2. Worker verifies Turnstile, validates file metadata, stores upload session metadata, and returns short-lived direct-to-R2 PUT URLs for the SETUP.md R2 object contract.
3. Browser uploads resume and intro video directly to private R2.
4. Frontend calls `POST /applications` with candidate data, questionnaire answers, and uploaded object keys.
5. Worker checks uploaded objects, validates magic bytes and hard size caps, stores `metadata.json`, and sends a secondary Telegram ping with role only. The Mini mailer reads R2 and sends the durable email from the NGH mail server.
6. Daily Cron deletes `applications/{appId}/` after `role_close_date + 28 days < today`.

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
- Required consent text: `I consent to NGH Property Group processing my application data for recruitment purposes. We delete your application data within 28 days after the role is filled or closed.`
- No optional retention consent and no `keep me on file` branch.
