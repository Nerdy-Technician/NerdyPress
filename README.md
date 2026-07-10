<p align="center">
  <img src="src/assets/nerdypress-logo.png" alt="NerdyPress" width="220" />
</p>

<p align="center">
  <a href="https://nerdytech.dev/docs/NerdyPress">Docs</a>
</p>


<p align="center">
  Build polished VitePress documentation sites without hand-writing the boring setup files.
</p>

<p align="center">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" />
  <img alt="VitePress" src="https://img.shields.io/badge/Output-VitePress-5C73E7" />
  <img alt="Status" src="https://img.shields.io/badge/status-building_the_good_stuff-c90000" />
</p>

NerdyPress is a visual generator for VitePress projects. Pick the theme, logos, fonts, navigation, social links, footer, homepage buttons, feature cards, plugins, and documentation pages, then download a ready-to-run VitePress site with GitHub Pages deployment included.

## Highlights

- Live VitePress-style preview while you design.
- Header logo, site logo, favicon, footer links, and social icon controls.
- Simple Icons-powered social picker with visible icon previews.
- Theme palettes, style presets, button styles, card styles, and font pairings.
- Proper page editor with page list, slug, description, markdown editor, and preview.
- Optional local search, Mermaid, sitemap, and auto-sidebar support.
- Generates a complete VitePress project ZIP with config, custom theme CSS, pages, package scripts, and GitHub Pages workflow.

## Quick Start

```bash
npm install
npm run dev
```

Open the local Vite URL, design your docs site, then download the generated project.

## Scripts

```bash
npm run dev      # Start the Vite dev server
npm run build    # Type-check and build the app
npm run preview  # Preview the production build
```

## What NerdyPress Generates

The downloaded site includes:

- `.vitepress/config.mts`
- `.vitepress/theme/index.ts`
- `.vitepress/theme/custom.css`
- `index.md`
- generated documentation pages
- logo and favicon assets
- `package.json`
- `.github/workflows/deploy.yml`
- `README.md`

## Tech Stack

- Vite
- TypeScript
- JSZip
- Simple Icons
- VitePress output

## Project Layout

```text
.
├── .github/workflows/release.yml
├── src/
│   ├── assets/
│   │   └── nerdypress-logo.png
│   ├── main.ts
│   └── style.css
├── index.html
├── package.json
└── tsconfig.json
```
