# Portfolio admin setup

The portfolio includes a protected admin workspace at `/admin`. It manages the public profile, projects, experience, education, skills, services, statistics, images, and contact enquiries.

## Cloudflare binding

In the Cloudflare Pages project, add this production and preview binding under **Settings → Bindings**:

- A D1 database with the variable name `DB`.

No paid R2 subscription is required. The application creates its required D1 tables safely on first use. The matching SQL is also stored in `migrations/0001_portfolio_admin.sql` and `migrations/0002_d1_media.sql` for review or manual initialization.

## Secrets and variables

Under **Settings → Variables and Secrets**, add:

- `ADMIN_PASSWORD`: a long, unique password for `/admin`.
- `SESSION_SECRET`: at least 32 random characters used to sign admin sessions.
- `CONTACT_EMAIL`: the address that receives contact-form messages.
- `RESEND_API_KEY`: optional; enables email notifications. Messages are still stored in the admin inbox when email is not enabled.

Redeploy after adding or changing bindings and secrets. Do not commit real secret values; `.dev.vars` is ignored by Git.

## First sign-in

1. Open `https://your-domain/admin`.
2. Enter the `ADMIN_PASSWORD` value.
3. Edit any section and choose **Publish changes**.

The first publish seeds the database with the portfolio’s current content. Public visitors then receive the latest saved content without a new code deployment.

## Media

Uploaded JPG, PNG, WebP, and GIF files are stored in the same D1 database as the portfolio content. JPG, PNG, and WebP files are automatically resized and compressed in the browser before upload. Each stored image is limited to 1.5 MB so it remains within D1's free-tier row limit. Existing repository images continue to work normally.
