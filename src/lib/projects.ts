import { getCollection } from 'astro:content';

/** Featured first, then newest. Shared by the home list and "Next project". */
export async function getProjects() {
	return (await getCollection('projects')).sort(
		(a, b) => Number(b.data.featured) - Number(a.data.featured) || b.data.year - a.data.year,
	);
}
