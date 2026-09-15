import { defineCollection, z } from 'astro:content';

const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  /** Optional second hero paragraph below description (case study pages). */
  descriptionExtra: z.string().optional(),
  /** Optional case-study label shown above the hero title. */
  heroLabel: z.string().optional(),
  date: z.coerce.date(),
  status: z.enum(['Live', 'Built', 'Prototype', 'In Progress', 'Concept']),
  category: z.string(),
  type: z.enum(['product', 'workflow']),
  stack: z.array(z.string()),
  featured: z.boolean().default(false),
  order: z.number().default(99),
  role: z.string().default('Solo builder · design, implementation, deployment'),
  /** Overview content integrated into the case-study hero. */
  caseOverview: z
    .object({
      lead: z.string(),
      body: z.string(),
      note: z.string().optional(),
      factsHeading: z.string().optional(),
      facts: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
          /** Optional external/internal link for the fact value (e.g. repo URL). */
          href: z.string().url().optional(),
        }),
      ),
    })
    .optional(),
  outcomes: z.array(z.string()).default([]),
  audience: z.array(z.enum(['smb', 'employer', 'personal'])).default([]),
  coverImage: z.string().optional(),
  /** Optional smaller cover tuned for homepage/grid cards (sharper than browser-downscaled HQ). */
  cardImage: z.string().optional(),
  /** Card thumbnail: contain = full UI visible; cover = fill crop (best for designed SVGs). */
  coverFit: z.enum(['cover', 'contain']).optional(),
  coverPosition: z.enum(['center', 'top']).optional(),
  /** Optional product-window treatment for case-study screenshots. */
  coverFrame: z.enum(['browser', 'window']).optional(),
  coverFrameLabel: z.string().optional(),
  /** Hide the standard hero artifact when a case study provides its own opening-screen composition. */
  showHeroCover: z.boolean().default(true),
  /** Optional one-line operating loop shown on homepage feature cards. */
  systemLine: z.string().optional(),
  github: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  /** Case study hero CTA label (e.g. View live site, Open live demo). */
  liveLabel: z.string().optional(),
  /** Secondary line under the live URL button on case study heroes. */
  liveCtaNote: z.string().optional(),
  /** Optional secondary hero action (e.g. public product demo). */
  demoUrl: z.string().url().optional(),
  demoLabel: z.string().optional(),
  /** Optional curated related case-study slugs (Related systems). */
  related: z.array(z.string()).max(2).optional(),
  video: z.string().optional(),
  closing: z
    .object({
      title: z.string(),
      body: z.string(),
      label: z.string().default('Request an AI Opportunity Audit'),
      href: z.string().default('/#contact'),
    })
    .optional(),
  draft: z.boolean().default(false),
  /** Keep personal/trading case studies out of search while still public on the site. */
  noindex: z.boolean().default(false),
});

const insightSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  series: z.string(),
  seriesNumber: z.number().int().positive().optional(),
  topic: z.string(),
  coverImage: z.string(),
  coverAlt: z.string(),
  bodyImage: z.string().optional(),
  bodyImageAlt: z.string().optional(),
  bodyImageCaption: z.string().optional(),
  railSummary: z.string().optional(),
  closing: z.object({
    title: z.string(),
    body: z.string(),
    label: z.string().default('Request an AI Opportunity Audit'),
    href: z.string().default('/#contact'),
  }),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  disclaimer: z.string().optional(),
});

const buildSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  status: z.enum(['Live', 'Built', 'Prototype', 'In Progress', 'Concept']),
  category: z.string(),
  order: z.number().default(99),
  role: z.string(),
  stack: z.array(z.string()).default([]),
  proofLine: z.string().optional(),
  cardImage: z.string().optional(),
  coverImage: z.string().optional(),
  videoUrl: z.string().optional(),
  relatedProject: z.string().optional(),
  draft: z.boolean().default(false),
});

export const collections = {
  projects: defineCollection({ type: 'content', schema: projectSchema }),
  insights: defineCollection({ type: 'content', schema: insightSchema }),
  builds: defineCollection({ type: 'content', schema: buildSchema }),
};
