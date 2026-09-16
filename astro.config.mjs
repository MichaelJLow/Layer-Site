import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Keep path redirects in sync with the hosting table in vercel.json. */
export const pathRedirects = {
  '/work': '/how-i-work',
  '/systems/invoiceflow-ap': '/insights/invoice-processing-automation',
  '/insights/invoice-and-document-processing': '/insights/invoice-processing-automation',
  '/insights/opsdesk-shared-inbox-control': '/insights/shared-inbox-routing-and-approval',
  '/insights/marketing-operations-workflow': '/insights/marketing-content-engine',
  '/insights/lead-qualification-and-follow-up': '/insights/sales-opportunity-intelligence',
};

/** Design sandboxes, soft-redirect URLs, and the employer /builds surface stay out of the sitemap. */
const excludedFromSitemap = (page) => {
  const path = new URL(page).pathname;
  return (
    path.includes('/404') ||
    path.includes('-lab') ||
    path.includes('/work/') ||
    path.includes('/systems/') ||
    path.includes('/capabilities') ||
    path === '/builds' ||
    path === '/builds/' ||
    path.startsWith('/builds/')
  );
};

function omitLabPagesFromBuild() {
  return {
    name: 'omit-lab-pages',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const root = fileURLToPath(dir);
        let entries = [];
        try {
          entries = await readdir(root);
        } catch {
          return;
        }

        for (const name of entries) {
          // Lab routes are all top-level pages. Restrict cleanup to those route
          // outputs so shared, hashed assets in /_astro are never removed.
          if (name.includes('-lab')) {
            await rm(join(root, name), { recursive: true, force: true });
          }
        }
      },
    },
  };
}

export default defineConfig({
  site: 'https://www.workwithlayer.com',
  redirects: pathRedirects,
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !excludedFromSitemap(page),
    }),
    omitLabPagesFromBuild(),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) =>
            (assetInfo.names ?? [assetInfo.name ?? '']).some((name) => name.endsWith('.css'))
              ? '_astro/[hash][extname]'
              : '_astro/[name].[hash][extname]',
        },
      },
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
