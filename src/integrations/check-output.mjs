// Build check (astro:build:done): fails the build when a built page contains "TODO",
// or when an internal href / src / srcset / poster / content URL points to a file
// that is not in the output. External URLs, mailto:, tel:, data: and pure #hash links are skipped.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const pages = (dir) =>
	readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? pages(path) : name.endsWith('.html') ? [path] : [];
	});

// Every URL-valued attribute, plus each candidate of a srcset.
const urls = (html) => {
	const found = [];
	for (const [, name, value] of html.matchAll(/\s(href|src|poster|srcset|content)="([^"]*)"/g)) {
		if (name === 'srcset') found.push(...value.split(',').map((part) => part.trim().split(/\s+/)[0]));
		else if (name !== 'content' || value.startsWith('/')) found.push(value);
	}
	return found.filter(Boolean);
};

export default function checkOutput() {
	let base = '/';
	return {
		name: 'check-output',
		hooks: {
			'astro:config:done': ({ config }) => {
				base = config.base.endsWith('/') ? config.base : `${config.base}/`;
			},
			'astro:build:done': ({ dir, logger }) => {
				const out = fileURLToPath(dir);
				const errors = [];
				for (const page of pages(out)) {
					const html = readFileSync(page, 'utf8');
					const where = relative(out, page);
					if (html.includes('TODO')) errors.push(`${where}: contains "TODO"`);
					for (const url of urls(html)) {
						if (/^([a-z]+:|\/\/|#)/i.test(url)) continue;
						const path = decodeURIComponent(url.split(/[?#]/)[0]);
						if (!path.startsWith('/')) continue; // relative URLs: none are emitted
						if (!path.startsWith(base) && `${path}/` !== base) {
							errors.push(`${where}: ${url} is outside the base ${base}`);
							continue;
						}
						const file = join(out, path.slice(base.length));
						const ok = path.endsWith('/') || path === base.slice(0, -1) ? existsSync(join(file, 'index.html')) : existsSync(file) && statSync(file).isFile();
						if (!ok) errors.push(`${where}: broken link ${url}`);
					}
				}
				if (errors.length > 0) throw new Error(`Build output check failed:\n  ${[...new Set(errors)].join('\n  ')}`);
				logger.info('links, assets and TODOs OK');
			},
		},
	};
}
