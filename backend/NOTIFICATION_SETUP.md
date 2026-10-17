# Matchet notification delivery setup

## Required environment variables (staging)

Keep these values in the backend's staging environment only. Do not commit secrets.

- `EMAIL_PROVIDER=smtp` (or `resend`, if that is the configured provider).
- SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `EMAIL_FROM`.
- `CLIENT_URL`: the public staging frontend URL.
- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT`: needed for browser push.
- `NOTIFICATION_TOKEN_SECRET`: a long, random secret used to sign optional-email unsubscribe links.
- `CRON_SECRET`: a long, random secret used by the scheduled recommendation endpoint and existing scheduled reservation cleanup.

Generate a matching VAPID key pair from the backend folder with:

```sh
node scripts/generate-vapid-keys.js
```

Copy the public/private values into the backend staging environment. Keep the private key secret and use the same pair for the lifetime of existing subscriptions. Rotating it requires users' browsers to subscribe again.

Generate independent random values for the two other secrets (for example, with `openssl rand -hex 32`). Configure `CRON_SECRET` in the Vercel backend project so scheduled requests receive its bearer token.

## Scheduled recommendations

The backend Vercel project schedules `GET /api/notifications/recommendations` for Tuesday and Friday at 10:00 UTC. It authenticates using `Authorization: Bearer $CRON_SECRET`. The job sends to verified accounts with a saved country and recommendation email enabled, ranks listings by city/state/country, rotates recent listing IDs, and skips users who received a digest in the previous six days.

## Delivery semantics

Order, booking, payment, application, account and security emails are treated as essential transactional notices. Email preferences control optional message and recommendation emails. Push categories remain individually configurable. Unsubscribe links are signed for the specific account, category and notification.
