import type { Site } from './site';

type Palette = Site['colors']['dark'];

const paletteVars = (palette: Palette) =>
	Object.entries(palette)
		.map(([name, value]) => `--site-color-${name}: ${value};`)
		.join(' ');

/**
 * Emits the theme, colors and typography blocks of site.yaml as --site-* custom
 * properties. src/styles/global.css maps these into Tailwind's @theme, so
 * site.yaml stays the single source of truth for design tokens.
 */
export function themeCss({ theme, colors, typography }: Site) {
	const other = theme.mode === 'dark' ? 'light' : 'dark';
	return [
		`:root {`,
		paletteVars(colors[theme.mode]),
		`--site-max-width: ${theme.max_width};`,
		`--site-base-size: ${typography.base_size};`,
		`--site-line-height: ${typography.line_height};`,
		`--site-heading-weight: ${typography.heading_weight};`,
		`}`,
		`:root[data-theme="${other}"] { ${paletteVars(colors[other])} }`,
	].join(' ');
}
