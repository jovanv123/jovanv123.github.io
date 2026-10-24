# Portfolio site — Jovan Vasić (mechatronics / robotics)

## Stack
Astro, Tailwind, MDX. Static output only. No new dependencies without asking.

## Content
- `portfolio.md` (repo root) is the original content source. Its front-matter holds all config and content.
- Target structure:
  - `src/data/site.yaml`: site, theme, colors, nav, profile (greeting + name + tagline + status make the hero; photo is a file in `src/assets/`), focus, featured, projects, experience, education, skills, socials, footer
  - `src/content/projects/<slug>/index.mdx`: one folder per project; frontmatter from `projects.items`, body from the case-study sections
  - Project images (cover, gallery) are colocated in the project folder and referenced relatively (`./cover.jpg`). They go through the `image()` schema helper and render with `<Image>` from `astro:assets`, never `<img>` or `public/`.
  - Videos stay in `public/media/` with a same-name `.jpg` poster next to each. `media` is the hero loop (`media/<name>.mp4`); `videos` holds extra loops shown in the case study with `<VideoCompare items={frontmatter.videos} />`.
- Project schema (zod): title, slug, context, year, result?, summary, role?, cover? `{ src: image(), alt }`, media?, videos[] `{ src, poster?, caption }` (default []), gallery[] `{ src: image(), alt, caption? }` (default []), tags[], repo_url?, paper_url?, featured.

## Pages
- Home (single page), each section labeled in mono (`01 — Featured work`) over a hairline, hairlines between sections:
  - Hero (`#about`, white, `theme.hero_height` 90vh): left: "Hey, I'm <name>." with the name in accent, tagline, mono status line with accent dot, text links "View work →" and "CV ↓". Right: square photo (`theme.photo_size` 360px) from `src/assets/<profile.photo>` via `<Image>`, 1px hairline frame, mono corner labels (FIG. 0 / location). Mobile: photo first. Missing photo → framed placeholder.
  - Hero background: `RobotArm` canvas: planar 3-link line-art arm (`line` color), accent end-effector, base bottom-right, dotted workspace circle, live mono joint readout. CCD IK follows the mouse with damping and joint limits; idle/off-hero/touch traces a figure-8. rAF paused off-screen (IntersectionObserver), DPR-aware, static pose under reduced motion. Plain TS, no libraries, low contrast, never over text legibility.
  - 01 Featured work (`#work`): full-width `surface` band, first `featured.count` (3) projects as cards in a row (stacked on mobile): 16:9 poster that plays its loop on desktop hover, title, mono context, mono result. White fill, hairline border, accent border on hover, whole card is the link.
  - 02 All projects (`#projects`) → 03 Focus → 04 Experience → 05 Education → 06 Tools → 07 Contact.
- `/projects/[slug]`: one centred column (`theme.column_width`, 800px), body text capped at `theme.text_width` (680px). ← Work breadcrumb → title → mono context → hairline → Year · Role · Result · Stack row → 16:9 media loop (cover alone if no video) → summary → numbered sections (01 Problem …) → Gallery → Links (only if repo/paper) → hairline → Next project →
  - Gallery: full-width images stacked vertically, hairlines between, mono caption below each. Never a grid.

## Design
- Reference: datameister.ai. Light lab aesthetic, text-led: white page (#FFFFFF), near-black text (#0A0A0A), muted #71717A, hairlines #E4E4E7.
- Nav: sticky, full-width solid black bar (`inverse`): name left; Work · About · CV · Contact right as white mono text links with an accent underline on hover.
- Footer: black (`inverse`) like the nav, columns About · Contact · Elsewhere (filled from profile/socials, "—" when empty), mono copyright line.
- Light only; there are no dark-mode variants.
- Tokens come from the `theme`, `colors` and `typography` blocks in site.yaml and are mapped into the Tailwind config. Never use arbitrary inline values.
- Fonts: Geist and Geist Mono. Use mono for tags, dates, metadata and the status line.
- 1px hairline rules separate sections and list items. Never use boxes.
- Use the single accent color (#FF5F1F) only for hover, focus, the status dot, the hero name and the arm end-effector. On black (nav, footer) hover is an accent underline on white text.
- Light-gray `surface` (#F4F4F5) is for full-width bands (featured work). `line` (#D4D4D8) is only for the hero arm.
- Projects render as full-width list rows, each one link: year | title + context | result | tags. Hover/focus turns the title accent and slides in a →. Rows with media end with a 240px 16:9 poster thumbnail (`preload="none"`) that plays on desktop hover and resets on leave; static poster below the text on mobile. Thumbnails stay posters under `prefers-reduced-motion`.
- Banned:
  - card grids (the 3 featured cards are the only cards), box-shadow, gradients, glassmorphism
  - any border-radius > 0
  - icon or emoji feature grids, skill chips or progress bars
  - centered hero, circular photo, button CTAs (text links only)
  - hover scale, scroll animations; the hero arm is the only motion
  - from the structure reference (zachjordan.io): green, rounded corners, thick black borders, emoji, icon cards

## Rules
- Semantic HTML, alt text, keyboard focus states, mobile-first.
- Use `VideoLoop` (`autoplay muted loop playsinline preload="metadata"` + poster, no controls) for media, never GIFs.
- Make small, commit-sized changes. Explain what changed in 2–3 lines.
