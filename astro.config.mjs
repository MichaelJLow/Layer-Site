import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdir, rm, stat } from 'node:fs/promises';
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
        async function walk(folder) {
          let entries = [];
          try {
            entries = await readdir(folder);
          } catch {
            return;
          }
          for (const name of entries) {
            const path = join(folder, name);
            const info = await stat(path);
            if (name.includes('-lab')) {
              await rm(path, { recursive: true, force: true });
              continue;
            }
            if (info.isDirectory()) await walk(path);
          }
        }
        await walk(root);
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
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
