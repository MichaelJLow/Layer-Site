import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { featuredProjectSlugs, homeFeaturedProjectSlugs } from '../config/site';

export async function getPublishedProjects() {
  const projects = await getCollection('projects');
  return projects
    .filter((p) => !p.data.draft)
    .sort((a, b) => a.data.order - b.data.order || b.data.date.valueOf() - a.data.date.valueOf());
}

async function getProjectsBySlugs(slugs: readonly string[]) {
  const projects = await getPublishedProjects();
  return slugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is CollectionEntry<'projects'> => Boolean(project));
}

export async function getFeaturedProjects() {
  return getProjectsBySlugs(featuredProjectSlugs);
}

export async function getHomeFeaturedProjects() {
  return getProjectsBySlugs(homeFeaturedProjectSlugs);
}

export async function getPublishedBuilds() {
  const builds = await getCollection('builds');
  return builds
    .filter((build) => !build.data.draft)
    .sort((a, b) => a.data.order - b.data.order || b.data.date.valueOf() - a.data.date.valueOf());
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function readingTime(text: string): string {
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export type ProjectEntry = CollectionEntry<'projects'>;
export type BuildEntry = CollectionEntry<'builds'>;
