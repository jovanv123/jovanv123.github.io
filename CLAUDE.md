# Portfolio site — Jovan Vasić (mechatronics / robotics)

## Stack
Astro, Tailwind, MDX. Static output only. No new dependencies without asking.

## Content
- `portfolio.md` (repo root) is the original content source. Its front-matter holds all config and content.
- Target structure:
  - `src/data/site.yaml`: site, theme, nav, profile (name + role make the hero), focus, experience, education, skills, socials, footer
  - `src/content/projects/<slug>/index.mdx`: one folder per project; frontmatter from `projects.items`, body from the case-study sections
  - Project images (cover, gallery) are colocated in the project folder and referenced relatively (`./cover.jpg`). They go through the `image()` schema helper and render with `<Image>` from `astro:assets`, never `<img>` or `public/`.
  - Videos stay in `public/media/` with a same-name `.jpg` poster next to each. `media` is the hero loop (`media/<name>.mp4`); `videos` holds extra loops shown in the case study with `<VideoCompare items={frontmatter.videos} />`.
- Project schema (zod): title, slug, context, year, result?, summary, role?, cover? `{ src: image(), alt }`, media?, videos[] `{ src, poster?, caption }` (default []), gallery[] `{ src: image(), alt, caption? }` (default []), tags[], repo_url?, paper_url?, featured.

## Pages
- Home (single page): hero (status line, name, role) → selected work → focus → experience → education → tools → contact
- `/projects/[slug]`: one centred column (`theme.column_width`, 800px), body text capped at `theme.text_width` (680px). ← Work breadcrumb → title → mono context → hairline → Year · Role · Result · Stack row → 16:9 media loop (cover alone if no video) → summary → numbered sections (01 Problem …) → Gallery → Links (only if repo/paper) → hairline → Next project →
  - Gallery: full-width images stacked vertically, hairlines between, mono caption below each. Never a grid.

## Design
- Reference: datameister.ai. Light lab aesthetic, text-led: white page (#FFFFFF), near-black text (#0A0A0A), muted #71717A, hairlines #E4E4E7.
- Nav: sticky, full-width solid black bar (`inverse`) with white logo, gray inactive links (`inverse-muted`) and white for hover/active. Footer sits on the light-gray `surface` (#F4F4F5).
- Light only; there are no dark-mode variants.
- Tokens come from the `theme`, `colors` and `typography` blocks in site.yaml and are mapped into the Tailwind config. Never use arbitrary inline values.
- Fonts: Geist and Geist Mono. Use mono for tags, dates, metadata and the status line.
- 1px hairline rules separate sections and list items. Never use boxes.
- Use the single accent color (#FF5F1F) only for hover, focus and the status dot. In the black nav, hover is white instead.
- Projects render as full-width list rows, each one link: year | title + context | result | tags. Hover/focus turns the title accent and slides in a →. Rows with media end with a 240px 16:9 poster thumbnail (`preload="none"`) that plays on desktop hover and resets on leave; static poster below the text on mobile. Thumbnails stay posters under `prefers-reduced-motion`.
- Banned:
  - card grids, box-shadow, gradients, glassmorphism
  - any border-radius > 0
  - icon or emoji feature grids, skill chips or progress bars
  - centered hero with buttons
  - hover scale, scroll animations

## Rules
- Semantic HTML, alt text, keyboard focus states, mobile-first.
- Use `VideoLoop` (`autoplay muted loop playsinline preload="metadata"` + poster, no controls) for media, never GIFs.
- Make small, commit-sized changes. Explain what changed in 2–3 lines.
