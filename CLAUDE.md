# Portfolio site — Jovan Vasić (mechatronics / robotics)

## Stack
Astro, Tailwind, MDX. Static output only. No new dependencies without asking.

## Content
- `portfolio.md` (repo root) is the original content source. Its front-matter holds all config and content.
- Target structure:
  - `src/data/site.yaml`: site, theme, nav, profile, hero, focus, experience, education, skills, socials, footer
  - `src/content/projects/<slug>.mdx`: one file per project; frontmatter from `projects.items`, body from the case-study sections
- Project schema (zod): title, slug, context, year, result?, summary, media?, tags[], repo_url?, paper_url?, featured.

## Pages
- Home (single page): hero → focus → selected work → experience → education → tools → contact
- `/projects/[slug]`: Problem → Architecture → My contribution → Results → Links

## Design
- Reference: datameister.ai. Light lab aesthetic, text-led: white page (#FFFFFF), near-black text (#0A0A0A), muted #71717A, hairlines #E4E4E7.
- Nav: sticky, full-width solid black bar (`inverse`) with white logo, gray inactive links (`inverse-muted`) and white for hover/active. Footer sits on the light-gray `surface` (#F4F4F5).
- Light only; there are no dark-mode variants.
- Tokens come from the `theme`, `colors` and `typography` blocks in site.yaml and are mapped into the Tailwind config. Never use arbitrary inline values.
- Fonts: Geist and Geist Mono. Use mono for tags, dates, metadata and the status line.
- 1px hairline rules separate sections and list items. Never use boxes.
- Use the single accent color (#FF5F1F) only for hover, focus and the status dot. In the black nav, hover is white instead.
- Projects render as full-width list rows: year | title + context | result | tags. The media loop shows on the detail page.
- Banned:
  - card grids, box-shadow, gradients, glassmorphism
  - any border-radius > 0
  - icon or emoji feature grids, skill chips or progress bars
  - centered hero with buttons
  - hover scale, scroll animations

## Rules
- Semantic HTML, alt text, keyboard focus states, mobile-first.
- Use `<video autoplay muted loop playsinline>` for media, never GIFs.
- Make small, commit-sized changes. Explain what changed in 2–3 lines.
