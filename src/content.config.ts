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
			role: z.string().optional(),
			// Sort key; `period` (e.g. "2023 – present"), if set, is shown instead.
			year: z.number().int(),
			period: z.string().optional(),
			// Short result for the card footer; result_detail (if set) replaces it on the project page.
			result: z.string().optional(),
			result_detail: z.string().optional(),
			summary: z.string(),
			cover: figure.omit({ caption: true }).optional(),
			// Video loop in public/, e.g. "media/<slug>.mp4": the card's hover preview, and the
			// project page hero when there are no `slides`. Poster is the .jpg next to it.
			media: z.string().optional(),
			// object-position for the card's 4:3 crop of the poster/loop, e.g. "50% 60%". Default centre.
			focus: z.string().optional(),
			// Project page media carousel, in order. Video slides are files in public/ (poster: the
			// .jpg next to it, else the cover); image slides are relative to index.mdx, e.g. "./robot.jpg".
			// Card thumbnail: the cover, else the first video's poster.
			slides: z
				.array(
					z.discriminatedUnion('type', [
						z.object({
							type: z.literal('video'),
							src: z.string(),
							poster: z.string().optional(),
							title: z.string(),
							text: z.string(),
							speed: z.string().optional(),
						}),
						z.object({
							type: z.literal('image'),
							src: image(),
							alt: z.string(),
							title: z.string(),
							text: z.string(),
						}),
					]),
				)
				.default([]),
			gallery: z.array(figure).default([]),
			// Project page "Seasons" carousel (SeasonCarousel), newest first; image relative to index.mdx.
			seasons: z
				.array(
					z.object({
						season: z.string(),
						result: z.string(),
						result_label: z.string(),
						role: z.string(),
						text: z.string(),
						image: image().optional(),
						image_alt: z.string().optional(),
					}),
				)
				.default([]),
			// Shown as large figures at the top of the Results section.
			stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
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
