import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

export async function getPublishedProjects() {
  const projects = await getCollection('projects');
  return projects
    .filter((p) => !p.data.draft)
    .sort((a, b) => a.data.order - b.data.order || b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getFeaturedProjects() {
  const projects = await getPublishedProjects();
  return projects.filter((project) => project.data.featured);
}

export async function getPublishedInsights() {
  const insights = await getCollection('insights');
  return insights
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => {
      if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
      return b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf();
    });
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
export type InsightEntry = CollectionEntry<'insights'>;
export type BuildEntry = CollectionEntry<'builds'>;
