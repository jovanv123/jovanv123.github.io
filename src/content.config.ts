import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
	loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		slug: z.string(),
		context: z.string(),
		year: z.number().int(),
		result: z.string().optional(),
		summary: z.string(),
		media: z.string().optional(),
		tags: z.array(z.string()),
		repo_url: z.url().optional(),
		paper_url: z.url().optional(),
		featured: z.boolean(),
	}),
});

// Each top-level block of site.yaml becomes one entry (id = block name).
// The typed shape is enforced in src/lib/site.ts.
const site = defineCollection({
	loader: file('src/data/site.yaml'),
	schema: z.record(z.string(), z.unknown()),
});

export const collections = { projects, site };
