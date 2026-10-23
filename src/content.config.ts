import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
	// One folder per project: <slug>/index.mdx with its images next to it.
	loader: glob({ pattern: '*/index.mdx', base: './src/content/projects' }),
	schema: ({ image }) => {
		// Image paths are relative to index.mdx, e.g. "./cover.jpg".
		const figure = z.object({ src: image(), alt: z.string(), caption: z.string().optional() });
		return z.object({
			title: z.string(),
			slug: z.string(),
			context: z.string(),
			year: z.number().int(),
			result: z.string().optional(),
			summary: z.string(),
			cover: figure.omit({ caption: true }).optional(),
			// Video loop in public/, e.g. "media/<slug>.mp4".
			media: z.string().optional(),
			gallery: z.array(figure).default([]),
			tags: z.array(z.string()),
			repo_url: z.url().optional(),
			paper_url: z.url().optional(),
			featured: z.boolean(),
		});
	},
});

// Each top-level block of site.yaml becomes one entry (id = block name).
// The typed shape is enforced in src/lib/site.ts.
const site = defineCollection({
	loader: file('src/data/site.yaml'),
	schema: z.record(z.string(), z.unknown()),
});

export const collections = { projects, site };
