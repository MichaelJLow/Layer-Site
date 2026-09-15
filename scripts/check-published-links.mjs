import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const errors = [];

function frontmatter(text) {
  if (!text.startsWith('---')) return '';
  const end = text.indexOf('\n---', 3);
  return end === -1 ? '' : text.slice(3, end);
}

function isDraft(fm) {
  return /^draft:\s*true\s*$/m.test(fm);
}

async function walk(folder) {
  const out = [];
  let entries = [];
  try {
    entries = await readdir(folder);
  } catch (error) {
    errors.push(`Missing directory: ${relative(root, folder)}`);
    return out;
  }
  for (const name of entries) {
    const path = join(folder, name);
    const info = await stat(path);
    if (info.isDirectory()) out.push(...(await walk(path)));
    else out.push(path);
  }
  return out;
}

async function publishedSlugs(collection) {
  const files = (await walk(join(root, 'src/content', collection))).filter((path) => path.endsWith('.mdx'));
  const published = new Set();
  const drafts = new Set();
  for (const path of files) {
    const slug = path.split('/').pop().replace(/\.mdx$/, '');
    const fm = frontmatter(await readFile(path, 'utf8'));
    if (isDraft(fm)) drafts.add(slug);
    else published.add(slug);
  }
  return { published, drafts };
}

function localHref(href) {
  if (!href || href.startsWith('mailto:') || href.startsWith('https://') || href.startsWith('http://') || href.startsWith('#')) {
    return null;
  }
  const path = href.split('#')[0].split('?')[0];
  if (!path.startsWith('/')) return null;
  return path.replace(/\/+$/, '') || '/';
}

function distPathFor(route) {
  if (route === '/') return join(distDir, 'index.html');
  return join(distDir, route.slice(1), 'index.html');
}

const projects = await publishedSlugs('projects');
const insights = await publishedSlugs('insights');
const htmlFiles = (await walk(distDir)).filter((path) => path.endsWith('.html'));

if (htmlFiles.some((path) => path.includes('-lab'))) {
  errors.push('Production build still contains a *-lab page');
}

const vercel = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));
const astroSource = await readFile(join(root, 'astro.config.mjs'), 'utf8');
const astroRedirectMatch = astroSource.match(/export const pathRedirects = \{([\s\S]*?)\};/);
if (!astroRedirectMatch) {
  errors.push('Could not read pathRedirects from astro.config.mjs');
} else {
  const astroPairs = [...astroRedirectMatch[1].matchAll(/'([^']+)': '([^']+)'/g)].map((m) => [m[1], m[2]]);
  const vercelPaths = (vercel.redirects || []).filter((rule) => !rule.has && rule.source && !rule.source.includes(':path'));
  for (const [source, destination] of astroPairs) {
    const withSlash = `${source}/`;
    const match = vercelPaths.find((rule) => rule.source === source || rule.source === withSlash);
    if (!match || match.destination !== destination && match.destination !== `${destination}/`) {
      errors.push(`Redirect ${source} is not mirrored in vercel.json`);
    }
  }
}

const insightsIndex = join(distDir, 'insights/index.html');
let insightsHtml = '';
try {
  insightsHtml = await readFile(insightsIndex, 'utf8');
} catch {
  errors.push('Insights index is missing from the build');
}

for (const slug of insights.published) {
  const href = `/insights/${slug}`;
  if (!insightsHtml.includes(href)) {
    errors.push(`Published insight ${slug} is missing from the Insights index`);
  }
}

const hrefPattern = /href="([^"]+)"/g;
const seen = new Set();
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  if (html.includes('formsubmit.co')) {
    errors.push(`${relative(root, file)} still references the removed form fallback`);
  }
  if (html.includes('never shared')) {
    errors.push(`${relative(root, file)} still claims information is never shared`);
  }
  let match;
  while ((match = hrefPattern.exec(html))) {
    const route = localHref(match[1]);
    if (!route || seen.has(`${file}:${route}`)) continue;
    seen.add(`${file}:${route}`);
    const project = route.match(/^\/projects\/([^/]+)$/);
    const insight = route.match(/^\/insights\/([^/]+)$/);
    if (project && projects.drafts.has(project[1])) {
      errors.push(`${relative(root, file)} links unpublished case study ${project[1]}`);
    }
    if (insight && insights.drafts.has(insight[1])) {
      errors.push(`${relative(root, file)} links unpublished insight ${insight[1]}`);
    }
    if ((project || insight) && !(await stat(distPathFor(route)).catch(() => null))) {
      errors.push(`${relative(root, file)} links missing page ${route}`);
    }
  }
}

const navSource = await readFile(join(root, 'src/components/Navbar.astro'), 'utf8');
const siteSource = await readFile(join(root, 'src/config/site.ts'), 'utf8');
if (navSource.includes('/builds') || /href: '\/builds'/.test(siteSource)) {
  errors.push('/builds must stay unlisted in primary navigation');
}

if (errors.length) {
  console.error(errors.map((line) => `✗ ${line}`).join('\n'));
  process.exit(1);
}

console.log(`ok: ${htmlFiles.length} HTML files, ${insights.published.size} insights, ${projects.published.size} published case studies`);
