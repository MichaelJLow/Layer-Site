# Layer marketing site

Public marketing site for [Layer](https://www.workwithlayer.com), built with Astro, Tailwind CSS, and MDX.

## Stack

- [Astro 5](https://astro.build)
- Tailwind CSS 4
- MDX content collections
- Deployed on Vercel

## Development

```bash
npm ci
npm run dev
```

Open [http://localhost:4321](http://localhost:4321). Node 22–24 is required (`engines` in `package.json`; Vercel production uses 24.x).

## Build and checks

```bash
npm run build
npm run typecheck
npm run check:links
```

`npm run ci` runs build, typecheck, and the published-link check. Pull requests also run this in GitHub Actions.

Design sandboxes (`*-lab` routes) are available in `astro dev` and are omitted from the production build. `/builds` stays off the primary navigation and out of the sitemap.

## Content

- Case studies: `src/content/projects/`
- Insights: `src/content/insights/`
- Selected builds (unlisted): `src/content/builds/`

Mark unpublished case studies with `draft: true`. The production build does not emit draft canonical routes, lab pages, or links to unpublished slugs.

## Contact mailer

The enquiry form posts only to `api/contact.js`. Production needs `RESEND_API_KEY` and `RESEND_FROM` set (values stay in Vercel; do not commit them). There is no third-party form fallback.

## Rollback

Production deploys on Vercel from `main`.

1. Open the Vercel project → **Deployments**.
2. Find the previous production deployment in `READY` state.
3. Use **Instant Rollback** / promote that deployment to production.

If GitHub `main` should also move back, revert the merge commit and push. The Vercel rollback can be done first so the live site does not wait on the Git revert.

The extra `*.vercel.app` production alias is a platform default. Custom domains are `www.workwithlayer.com` and the host redirects in `vercel.json`.
