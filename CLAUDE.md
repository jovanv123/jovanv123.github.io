# Portfolio site — Jovan Vasić (mechatronics / robotics)

## Stack
Astro, Tailwind, MDX, astro-icon (`@iconify-json/simple-icons` for brands, `@iconify-json/tabler` for generic icons). Static output only. No new dependencies without asking.

## Content
- `portfolio.md` (repo root) is the original content source. Its front-matter holds all config and content.
- Target structure:
  - `src/data/site.yaml`: site, theme, colors, nav, profile (greeting + name + tagline + status make the hero; photo is `{ bw, color }`, two files in `src/assets/`), focus (kept, not rendered), featured (aria label only), projects, experience, education, skills (groups: name, `icon`, items as label or `{ label, icon? }`; icons are iconify names like `simple-icons:ros`, `tabler:cpu`), socials, footer
  - `src/content/projects/<slug>/index.mdx`: one folder per project; frontmatter from `projects.items`, body from the case-study sections
  - Project images (cover, gallery) are colocated in the project folder and referenced relatively (`./cover.jpg`). They go through the `image()` schema helper and render with `<Image>` from `astro:assets`, never `<img>` or `public/`.
  - Videos stay in `public/media/` with a same-name `.jpg` poster next to each. `media` is the hero loop (`media/<name>.mp4`); `videos` holds extra loops shown in the case study with `<VideoCompare items={frontmatter.videos} />`.
- Project schema (zod): title, slug, context, year, result?, summary, role?, cover? `{ src: image(), alt }`, media?, videos[] `{ src, poster?, caption }` (default []), gallery[] `{ src: image(), alt, caption? }` (default []), tags[], repo_url?, paper_url?, featured.

## Pages
- Home (single page), each section labeled in mono (`01 — Featured work`) over a hairline, hairlines between sections:
  - Hero (`#about`, white, content height: `pt-24 pb-20` desktop, `pt-12 pb-10` mobile; headline `text-hero` = clamp(2.25rem, 4.5vw, 3.75rem), tagline 1.25rem, tight gaps): left: "Hey, I'm <name>." with the name in accent, tagline, mono status line with accent dot, text links "View work →" and "CV ↓". Right: square photo (`theme.photo_size` 280px, vertically centred with the text): `profile.photo.bw` and `.color` stacked via `<Image>` in one frame, B&W by default, color crossfades in on desktop hover (300 ms opacity, instant under reduced motion, B&W only on touch), alt = name; 1px hairline frame, mono corner labels (FIG. 0 / location). Mobile: photo first. Missing photo → framed placeholder.
  - Hero background: `FieldRobot` canvas, a mini nav stack on a 3000 × 2000 mm field scaled to the hero (origin bottom-left, y up). Faint `border` grid (~48px) with mono mm ticks. Hidden random obstacles (6–8 rects, 2–3 circles, rasterized once into a truth grid, never on the robot or no-go zones, never cutting off free space). 2D lidar (72 rays/5°, 1200 mm, 10 Hz, DDA) into a log-odds Int8 occupancy grid at 25 mm; costmap colors: free `surface`, occupied `text`, inflated `accent` at ~15% (robot radius + 50 mm, incremental circular kernel), rendered via a 1 px-per-cell ImageData with dirty-rect uploads. A* (octile, binary heap, preallocated typed arrays; unknown traversable at higher cost) with line-of-sight smoothing, dashed `accent` path; replans on blocked path, goal change, or every 1 s. Pure pursuit (150 mm lookahead, v_max 400 mm/s, a_max 600 mm/s², ω_max 2 rad/s, rotate in place over 60°) at a fixed 100 Hz. Idle it explores the nearest frontier; click/tap sets the goal (accent +, snapped if unreachable); "reset map" link top-right. Robot drawing: diff-drive body, wheels, accent heading triangle, ArUco DICT_4X4_50 id 7, dashed `aruco id=7` detection box. Fixed-width mono readout bottom-right (x y θ v ω, goal, path, explored, replan). `[data-nogo]` elements (text block, photo figure, readout, reset link) are never mapped or driven through. Paused off-screen or on a hidden tab, DPR-aware; reduced motion shows a pre-explored static map with one path. Under 768px: 50 mm cells, 36 rays, no grid lines or readout. Plain TS, no libraries.
  - 01 Projects (`#work`): full-width `surface` band with every project as a card, featured first then year descending, 3 per row (stacked on mobile): 16:9 poster that plays its loop on desktop hover, title, mono context, mono result. White fill, hairline border, accent border on hover, whole card is the link. No list rows.
  - 02 Experience: full-width rows, date | role + company | points.
  - 03 Technical skills: cards 4/2/1 per row (desktop/tablet/mobile): group icon on top, group name, items as small icon + label in muted text. Icons monochrome near-black, accent on card hover with the border. Hairline border, no radius, no shadow.
  - 04 Education (`EducationTimeline`): vertical line on the left with a square node per entry, most recent on top. Entry: mono date range in accent, degree (semibold), school, muted note. The faint dashed hairline fills with solid accent as the section scrolls (CSS `animation-timeline` view timelines; JS fallback sets `--timeline-progress` / `.is-on` in Firefox/Safari). A node fills when the line reaches it; the current entry (`end: present`) is always filled with a subtle pulse ring. Reduced motion: fully drawn, no pulse.
  - 05 Contact.
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
- Use the single accent color, royal blue (#4169E1, `accent-hover` #2F55C9 for hover/active), only for hover, focus, the status dot, the hero name, the field robot (heading, detection box, goal) and the education timeline (dates, line, nodes). On black (nav, footer) hover is an accent underline on white text.
- Light-gray `surface` (#F4F4F5) is for full-width bands (project cards). `line` (#D4D4D8) is only for the hero robot trail.
- Project card posters use `preload="none"`, play on desktop hover and reset on leave; they stay posters under `prefers-reduced-motion`.
- Banned:
  - card grids other than the project cards and the skill cards; box-shadow, gradients, glassmorphism
  - any border-radius > 0
  - emoji, colored or multicolor icons, bordered skill chips, progress bars (icons only as monochrome glyphs in the skill cards)
  - centered hero, circular photo, button CTAs (text links only)
  - hover scale; the only motion is the hero robot, hover video loops and the scroll-drawn education timeline
  - from the structure reference (zachjordan.io): green, rounded corners, thick black borders, emoji, icon cards

## Rules
- Semantic HTML, alt text, keyboard focus states, mobile-first.
- Use `VideoLoop` (`autoplay muted loop playsinline preload="metadata"` + poster, no controls) for media, never GIFs.
- Make small, commit-sized changes. Explain what changed in 2–3 lines.
