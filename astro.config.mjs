import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

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

export default defineConfig({
  site: 'https://www.workwithlayer.com',
  redirects: {
    '/work': '/how-i-work',
    '/systems/invoiceflow-ap': '/insights/invoice-processing-automation',
    '/insights/invoice-and-document-processing': '/insights/invoice-processing-automation',
    '/insights/opsdesk-shared-inbox-control': '/insights/shared-inbox-routing-and-approval',
    '/insights/marketing-operations-workflow': '/insights/marketing-content-engine',
    '/insights/lead-qualification-and-follow-up': '/insights/sales-opportunity-intelligence',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !excludedFromSitemap(page),
    }),
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
