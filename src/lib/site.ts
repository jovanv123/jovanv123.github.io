import { getCollection } from 'astro:content';
import { z } from 'astro/zod';

const link = z.object({ label: z.string(), href: z.string() });
const heading = z.string();

const palette = z.object({
	background: z.string(),
	surface: z.string(),
	text: z.string(),
	muted: z.string(),
	accent: z.string(),
	border: z.string(),
	inverse: z.string(),
	'inverse-text': z.string(),
	'inverse-muted': z.string(),
});

export const siteSchema = z.object({
	site: z.object({
		title: z.string(),
		description: z.string(),
		url: z.string(),
		language: z.string(),
		favicon: z.string(),
		og_image: z.string(),
	}),
	theme: z.object({
		reference: z.string(),
		mode: z.literal('light'),
		layout: z.string(),
		project_pages: z.boolean(),
		max_width: z.string(),
		border_radius: z.string(),
		borders: z.string(),
		shadows: z.boolean(),
		spacing_scale: z.string(),
		animations: z.boolean(),
		cursor_effects: z.boolean(),
	}),
	colors: palette,
	typography: z.object({
		heading_font: z.string(),
		body_font: z.string(),
		mono_font: z.string(),
		base_size: z.string(),
		heading_weight: z.number(),
		line_height: z.number(),
	}),
	nav: z.object({
		logo_text: z.string(),
		sticky: z.boolean(),
		links: z.array(link),
	}),
	profile: z.object({
		name: z.string(),
		role: z.string(),
		location: z.string(),
		photo: z.string(),
		email: z.string(),
		cv: z.string(),
		status: z.string(),
	}),
	hero: z.object({
		headline: z.string(),
		rule: z.boolean(),
		lede: z.string(),
		link,
	}),
	about: z.object({ heading, text: z.string(), todo: z.string().optional() }),
	focus: z.object({
		heading,
		items: z.array(z.object({ title: z.string(), text: z.string(), topics: z.array(z.string()) })),
	}),
	projects: z.object({ heading, layout: z.string() }),
	experience: z.object({
		heading,
		items: z.array(
			z.object({
				role: z.string(),
				company: z.string(),
				company_url: z.string(),
				start: z.string(),
				end: z.string(),
				points: z.array(z.string()),
			}),
		),
	}),
	education: z.object({
		heading,
		items: z.array(
			z.object({
				degree: z.string(),
				school: z.string(),
				start: z.string(),
				end: z.string(),
				note: z.string(),
			}),
		),
	}),
	skills: z.object({
		heading,
		display: z.string(),
		groups: z.array(z.object({ name: z.string(), items: z.array(z.string()) })),
	}),
	contact: z.object({
		heading,
		message: z.string(),
		show_form: z.boolean(),
		show_email: z.boolean(),
	}),
	socials: z.record(z.string(), z.string()),
	footer: z.object({
		columns: z.array(z.object({ heading, text: z.string() })),
		text: z.string(),
		show_back_to_top: z.boolean(),
	}),
	analytics: z.object({ provider: z.string(), id: z.string() }),
});

export type Site = z.infer<typeof siteSchema>;

let cached: Site | undefined;

/** Reassembles the per-block entries of the `site` collection into one typed object. */
export async function getSite(): Promise<Site> {
	if (cached) return cached;
	const entries = await getCollection('site');
	const raw = Object.fromEntries(entries.map((entry) => [entry.id, entry.data]));
	cached = siteSchema.parse(raw);
	return cached;
}

const socialLabels: Record<string, string> = {
	github: 'GitHub',
	linkedin: 'LinkedIn',
	scholar: 'Google Scholar',
	youtube: 'YouTube',
};

/** Non-empty socials as label/href pairs, in the order they appear in site.yaml. */
export function socialLinks(site: Site) {
	return Object.entries(site.socials)
		.filter(([, href]) => href !== '')
		.map(([key, href]) => ({ label: socialLabels[key] ?? key, href }));
}

/**
 * Makes site.yaml hrefs work from any route: "#id" → "/#id",
 * "assets/cv.pdf" → "/assets/cv.pdf". Absolute URLs and mailto: pass through.
 */
export function resolveHref(href: string) {
	if (/^([a-z]+:|\/)/i.test(href)) return href;
	return `/${href}`;
}

/** "2023-09" → "Sep 2023", "2026" → "2026", "present" → "present". */
export function formatDate(value: string) {
	const match = /^(\d{4})-(\d{2})$/.exec(value);
	if (!match) return value;
	const month = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1)).toLocaleString('en', {
		month: 'short',
		timeZone: 'UTC',
	});
	return `${month} ${match[1]}`;
}
