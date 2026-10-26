import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getImage } from 'astro:assets';
import { getCollection, type CollectionEntry } from 'astro:content';
import { posterFor } from './site';

/** Featured first, then newest. Shared by the home list and "Next project". */
export async function getProjects() {
	return (await getCollection('projects')).sort(
		(a, b) => Number(b.data.featured) - Number(a.data.featured) || b.data.year - a.data.year,
	);
}

/** The cover as an optimized URL (for video posters), or undefined without a cover. */
export async function coverUrl(data: CollectionEntry<'projects'>['data'], width = 720) {
	return data.cover && (await getImage({ src: data.cover.src, width, format: 'jpg' })).src;
}

/** A video's poster: its `poster`, else the .jpg next to it, else the fallback (the cover). */
export function videoPoster(video: { src: string; poster?: string }, fallback?: string) {
	if (video.poster) return video.poster;
	const sibling = posterFor(video.src);
	return existsSync(join(process.cwd(), 'public', sibling)) || !fallback ? sibling : fallback;
}
