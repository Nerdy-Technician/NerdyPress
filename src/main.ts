import JSZip from 'jszip'
import * as simpleIcons from 'simple-icons'
import simpleIconsData from 'simple-icons/icons.json' with { type: 'json' }
import nerdyPressLogo from './assets/nerdypress-logo.png'
import './style.css'

type Mode = 'light' | 'dark' | 'auto'
type StylePreset = string
type ThemePalette = string
type SocialIcon = string
type FontPairing = string
type HeaderLogoPosition = 'left' | 'right'
type SiteLogoPosition = 'above-kicker' | 'between-kicker-title' | 'left-title' | 'right-title' | 'below-title'
type ButtonShape = 'pill' | 'rounded' | 'square'
type ButtonFill = 'solid' | 'outline' | 'soft' | 'ghost'
type ButtonSize = 'compact' | 'normal' | 'large'
type CardRadius = 'square' | 'soft' | 'rounded'
type CardStyle = 'plain' | 'bordered' | 'filled' | 'elevated'
type CardDensity = 'compact' | 'normal' | 'spacious'
type AnalyticsProvider = 'none' | 'plausible' | 'umami' | 'goatcounter' | 'google'
type DeploymentTarget = 'github-pages' | 'cloudflare-pages' | 'netlify' | 'vercel'

type LinkItem = { label: string; link: string }
type HeroAction = { text: string; link: string; theme: 'brand' | 'alt' }
type FeatureItem = { title: string; details: string; link: string }
type SocialLink = { icon: SocialIcon; url: string }
type SidebarSection = { title: string; items: LinkItem[] }
type PageItem = { title: string; slug: string; description: string; content: string }
type LogoFile = { dataUrl: string; fileName: string; extension: string; base64: string }
type SimpleIconData = { title: string; slug: string }
type SimpleIcon = { title: string; path: string }

type FormState = {
  title: string
  description: string
  slug: string
  slugTouched: boolean
  logo: LogoFile | null
  siteLogo: LogoFile | null
  favicon: LogoFile | null
  showHeaderLogo: boolean
  showSiteLogo: boolean
  siteLogoPosition: SiteLogoPosition
  showHeaderTitle: boolean
  headerLogoPosition: HeaderLogoPosition
  accentColor: string
  themePalette: ThemePalette
  mode: Mode
  fontPairing: FontPairing
  stylePreset: StylePreset
  buttons: {
    shape: ButtonShape
    fill: ButtonFill
    size: ButtonSize
    shadow: boolean
  }
  cards: {
    radius: CardRadius
    style: CardStyle
    density: CardDensity
    accentBar: boolean
  }
  nav: LinkItem[]
  socialLinks: SocialLink[]
  socialPlacement: {
    header: boolean
    footer: boolean
  }
  footerLinks: LinkItem[]
  heroActions: HeroAction[]
  features: FeatureItem[]
  sidebar: SidebarSection[]
  pages: PageItem[]
  footer: {
    message: string
    copyright: string
    alignment: 'center' | 'left'
  }
  plugins: {
    localSearch: boolean
    mermaid: boolean
    sitemap: boolean
    autoSidebar: boolean
    editLink: boolean
    lastUpdated: boolean
    pwa: boolean
    openGraph: boolean
    robots: boolean
  }
  integrations: {
    siteUrl: string
    repoUrl: string
    analyticsProvider: AnalyticsProvider
    analyticsId: string
    ogImage: string
    deploymentTarget: DeploymentTarget
  }
}

type SiteConfig = {
  title: string
  description: string
  slug: string
  logoUrl: string | null
  logoFileName: string | null
  logoBase64: string | null
  siteLogoUrl: string | null
  siteLogoFileName: string | null
  siteLogoBase64: string | null
  faviconFileName: string | null
  faviconBase64: string | null
  showHeaderLogo: boolean
  showSiteLogo: boolean
  siteLogoPosition: SiteLogoPosition
  showHeaderTitle: boolean
  headerLogoPosition: HeaderLogoPosition
  accentColor: string
  themePalette: ThemePalette
  mode: Mode
  fontPairing: FontPairing
  stylePreset: StylePreset
  buttons: FormState['buttons']
  cards: FormState['cards']
  nav: LinkItem[]
  socialLinks: SocialLink[]
  socialPlacement: FormState['socialPlacement']
  footerLinks: LinkItem[]
  heroActions: HeroAction[]
  features: FeatureItem[]
  sidebar: SidebarSection[]
  pages: PageItem[]
  footer: FormState['footer']
  plugins: FormState['plugins']
  integrations: FormState['integrations']
}

const steps = ['Basics', 'Theme', 'Navigation', 'Content', 'Plugins', 'Review']
const stylePresets: Array<{ id: StylePreset; title: string; copy: string }> = [
  { id: 'default', title: 'Default', copy: 'Hero, actions, and feature cards for familiar docs.' },
  { id: 'minimal', title: 'Minimal', copy: 'A calmer homepage with tighter type and fewer blocks.' },
  { id: 'terminal', title: 'Terminal', copy: 'Command-line flavored docs for tools and APIs.' },
  { id: 'product', title: 'Product', copy: 'Bolder hero, proof cards, and stronger conversion cues.' },
  { id: 'editorial', title: 'Editorial', copy: 'Article-like rhythm for handbooks, essays, and field notes.' },
  { id: 'api', title: 'API', copy: 'Dense reference layout with code-first cards and tighter spacing.' },
  { id: 'handbook', title: 'Handbook', copy: 'Calm knowledge-base style for internal teams and manuals.' },
  { id: 'showcase', title: 'Showcase', copy: 'Large product-story hero with more dramatic feature panels.' },
  { id: 'compact', title: 'Compact', copy: 'Information-dense docs for mature projects with lots to scan.' },
  { id: 'retro', title: 'Retro', copy: 'Chunky type, hard edges, and old-school utility character.' },
  { id: 'magazine', title: 'Magazine', copy: 'Editorial grid with stronger hierarchy and publication rhythm.' },
]
const themePalettes: Array<{ id: ThemePalette; title: string; accent: string; surface: string; copy: string }> = [
  { id: 'nerdy', title: 'Nerdy', accent: '#c90000', surface: '#1e1e1e', copy: 'Dark, sharp, red-lined.' },
  { id: 'ocean', title: 'Ocean', accent: '#0070f3', surface: '#eef6ff', copy: 'Clean blue docs.' },
  { id: 'forest', title: 'Forest', accent: '#0f9f6e', surface: '#effaf5', copy: 'Calm green guides.' },
  { id: 'violet', title: 'Violet', accent: '#7c3aed', surface: '#f5f1ff', copy: 'Polished dev-tool energy.' },
  { id: 'amber', title: 'Amber', accent: '#d97706', surface: '#fff7ed', copy: 'Warm product docs.' },
  { id: 'rose', title: 'Rose', accent: '#e11d48', surface: '#fff1f4', copy: 'Bright community docs.' },
  { id: 'graphite', title: 'Graphite', accent: '#52525b', surface: '#f4f4f5', copy: 'Neutral and enterprise.' },
  { id: 'mint', title: 'Mint', accent: '#14b8a6', surface: '#ecfdf8', copy: 'Fresh technical docs.' },
  { id: 'sky', title: 'Sky', accent: '#0284c7', surface: '#f0f9ff', copy: 'Open and lightweight.' },
  { id: 'indigo', title: 'Indigo', accent: '#4f46e5', surface: '#eef2ff', copy: 'Confident SaaS docs.' },
  { id: 'lime', title: 'Lime', accent: '#65a30d', surface: '#f7fee7', copy: 'Bright developer tools.' },
  { id: 'coral', title: 'Coral', accent: '#ea580c', surface: '#fff4ed', copy: 'Friendly launch energy.' },
  { id: 'mono', title: 'Mono', accent: '#111827', surface: '#f3f4f6', copy: 'Black and white docs.' },
  { id: 'night', title: 'Night', accent: '#38bdf8', surface: '#111827', copy: 'Dark blue technical.' },
]
const accentSwatches = themePalettes.map((palette) => palette.accent)
const simpleIconOptions = (simpleIconsData as SimpleIconData[])
  .map((icon) => ({ label: icon.title, value: icon.slug }))
  .sort((a, b) => a.label.localeCompare(b.label))
const socialIconFallbacks = ['github', 'x', 'discord', 'mastodon', 'rss', 'link']
const fontPairings: Record<FontPairing, { label: string; heading: string; body: string }> = {
  'inter-jetbrains': {
    label: 'Inter + JetBrains Mono',
    heading: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
    body: 'Inter, ui-sans-serif, system-ui, sans-serif',
  },
  'plex-space': {
    label: 'IBM Plex Sans + Space Mono',
    heading: '"Space Mono", "SFMono-Regular", Consolas, monospace',
    body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
  },
  'system-mono': {
    label: 'System Sans + Mono',
    heading: 'ui-monospace, "SFMono-Regular", Consolas, monospace',
    body: 'ui-sans-serif, system-ui, sans-serif',
  },
  'inter-space': { label: 'Inter + Space Mono', heading: '"Space Mono", ui-monospace, monospace', body: 'Inter, ui-sans-serif, system-ui, sans-serif' },
  'inter-plex-mono': { label: 'Inter + IBM Plex Mono', heading: '"IBM Plex Mono", ui-monospace, monospace', body: 'Inter, ui-sans-serif, system-ui, sans-serif' },
  'inter-geist': { label: 'Inter + Geist Mono', heading: '"Geist Mono", ui-monospace, monospace', body: 'Inter, ui-sans-serif, system-ui, sans-serif' },
  'inter-recursive': { label: 'Inter + Recursive', heading: 'Recursive, ui-monospace, monospace', body: 'Inter, ui-sans-serif, system-ui, sans-serif' },
  'plex-jetbrains': { label: 'IBM Plex Sans + JetBrains Mono', heading: '"JetBrains Mono", ui-monospace, monospace', body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif' },
  'plex-plex-mono': { label: 'IBM Plex Sans + IBM Plex Mono', heading: '"IBM Plex Mono", ui-monospace, monospace', body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif' },
  'plex-fira': { label: 'IBM Plex Sans + Fira Code', heading: '"Fira Code", ui-monospace, monospace', body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif' },
  'plex-mono-display': { label: 'IBM Plex Mono + IBM Plex Sans', heading: '"IBM Plex Mono", ui-monospace, monospace', body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif' },
  'system-jetbrains': { label: 'System Sans + JetBrains Mono', heading: '"JetBrains Mono", ui-monospace, monospace', body: 'ui-sans-serif, system-ui, sans-serif' },
  'system-space': { label: 'System Sans + Space Mono', heading: '"Space Mono", ui-monospace, monospace', body: 'ui-sans-serif, system-ui, sans-serif' },
  'system-fira': { label: 'System Sans + Fira Code', heading: '"Fira Code", ui-monospace, monospace', body: 'ui-sans-serif, system-ui, sans-serif' },
  'system-geist': { label: 'System Sans + Geist Mono', heading: '"Geist Mono", ui-monospace, monospace', body: 'ui-sans-serif, system-ui, sans-serif' },
  'geist-geist-mono': { label: 'Geist + Geist Mono', heading: '"Geist Mono", ui-monospace, monospace', body: 'Geist, ui-sans-serif, system-ui, sans-serif' },
  'geist-jetbrains': { label: 'Geist + JetBrains Mono', heading: '"JetBrains Mono", ui-monospace, monospace', body: 'Geist, ui-sans-serif, system-ui, sans-serif' },
  'source-source-code': { label: 'Source Sans 3 + Source Code Pro', heading: '"Source Code Pro", ui-monospace, monospace', body: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif' },
  'source-space': { label: 'Source Sans 3 + Space Mono', heading: '"Space Mono", ui-monospace, monospace', body: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif' },
  'public-sans-mono': { label: 'Public Sans + IBM Plex Mono', heading: '"IBM Plex Mono", ui-monospace, monospace', body: '"Public Sans", ui-sans-serif, system-ui, sans-serif' },
  'public-fira': { label: 'Public Sans + Fira Code', heading: '"Fira Code", ui-monospace, monospace', body: '"Public Sans", ui-sans-serif, system-ui, sans-serif' },
  'work-sans-space': { label: 'Work Sans + Space Mono', heading: '"Space Mono", ui-monospace, monospace', body: '"Work Sans", ui-sans-serif, system-ui, sans-serif' },
  'work-sans-jetbrains': { label: 'Work Sans + JetBrains Mono', heading: '"JetBrains Mono", ui-monospace, monospace', body: '"Work Sans", ui-sans-serif, system-ui, sans-serif' },
  'manrope-jetbrains': { label: 'Manrope + JetBrains Mono', heading: '"JetBrains Mono", ui-monospace, monospace', body: 'Manrope, ui-sans-serif, system-ui, sans-serif' },
  'manrope-space': { label: 'Manrope + Space Mono', heading: '"Space Mono", ui-monospace, monospace', body: 'Manrope, ui-sans-serif, system-ui, sans-serif' },
  'sora-plex': { label: 'Sora + IBM Plex Mono', heading: '"IBM Plex Mono", ui-monospace, monospace', body: 'Sora, ui-sans-serif, system-ui, sans-serif' },
  'sora-jetbrains': { label: 'Sora + JetBrains Mono', heading: '"JetBrains Mono", ui-monospace, monospace', body: 'Sora, ui-sans-serif, system-ui, sans-serif' },
  'outfit-space': { label: 'Outfit + Space Mono', heading: '"Space Mono", ui-monospace, monospace', body: 'Outfit, ui-sans-serif, system-ui, sans-serif' },
  'outfit-geist': { label: 'Outfit + Geist Mono', heading: '"Geist Mono", ui-monospace, monospace', body: 'Outfit, ui-sans-serif, system-ui, sans-serif' },
  'dm-sans-mono': { label: 'DM Sans + DM Mono', heading: '"DM Mono", ui-monospace, monospace', body: '"DM Sans", ui-sans-serif, system-ui, sans-serif' },
  'nunito-code': { label: 'Nunito Sans + Source Code Pro', heading: '"Source Code Pro", ui-monospace, monospace', body: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif' },
  'lato-fira': { label: 'Lato + Fira Code', heading: '"Fira Code", ui-monospace, monospace', body: 'Lato, ui-sans-serif, system-ui, sans-serif' },
  'rubik-jetbrains': { label: 'Rubik + JetBrains Mono', heading: '"JetBrains Mono", ui-monospace, monospace', body: 'Rubik, ui-sans-serif, system-ui, sans-serif' },
  'noto-sans-mono': { label: 'Noto Sans + Noto Sans Mono', heading: '"Noto Sans Mono", ui-monospace, monospace', body: '"Noto Sans", ui-sans-serif, system-ui, sans-serif' },
  'atkinson-jetbrains': { label: 'Atkinson Hyperlegible + JetBrains Mono', heading: '"JetBrains Mono", ui-monospace, monospace', body: '"Atkinson Hyperlegible", ui-sans-serif, system-ui, sans-serif' },
}
const visualFontStacks = [
  { heading: 'Georgia, "Times New Roman", serif', body: 'Arial, Helvetica, sans-serif' },
  { heading: '"Trebuchet MS", Verdana, sans-serif', body: 'Verdana, Geneva, sans-serif' },
  { heading: '"Arial Black", Impact, sans-serif', body: 'Arial, Helvetica, sans-serif' },
  { heading: 'Courier, "Courier New", monospace', body: 'Georgia, "Times New Roman", serif' },
  { heading: 'Palatino, "Palatino Linotype", Georgia, serif', body: '"Trebuchet MS", Verdana, sans-serif' },
  { heading: 'Impact, Haettenschweiler, sans-serif', body: '"Lucida Sans", "Lucida Grande", sans-serif' },
  { heading: '"Lucida Console", Monaco, monospace', body: '"Lucida Sans", "Lucida Grande", sans-serif' },
  { heading: 'Optima, Candara, "Segoe UI", sans-serif', body: 'Georgia, "Times New Roman", serif' },
]

const state: FormState = {
  title: 'My VitePress Site',
  description: 'A fast documentation site generated by NerdyPress.',
  slug: 'my-vitepress-site',
  slugTouched: false,
  logo: null,
  favicon: null,
  siteLogo: null,
  showHeaderLogo: true,
  showSiteLogo: false,
  siteLogoPosition: 'above-kicker',
  showHeaderTitle: true,
  headerLogoPosition: 'left',
  accentColor: '#c90000',
  themePalette: 'nerdy',
  mode: 'auto',
  fontPairing: 'inter-jetbrains',
  stylePreset: 'default',
  buttons: {
    shape: 'pill',
    fill: 'solid',
    size: 'normal',
    shadow: true,
  },
  cards: {
    radius: 'soft',
    style: 'bordered',
    density: 'normal',
    accentBar: false,
  },
  nav: [
    { label: 'Guide', link: '/guide' },
    { label: 'API', link: '/api' },
  ],
  socialLinks: [{ icon: 'github', url: 'https://github.com/' }],
  socialPlacement: {
    header: true,
    footer: false,
  },
  footerLinks: [
    { label: 'Privacy', link: '/privacy' },
    { label: 'GitHub', link: 'https://github.com/' },
  ],
  heroActions: [
    { text: 'Get Started', link: '/guide', theme: 'brand' },
    { text: 'View on GitHub', link: 'https://github.com/', theme: 'alt' },
  ],
  features: [
    { title: 'Fast setup', details: 'Generated config and theme files.', link: '/guide' },
    { title: 'GitHub Pages', details: 'Workflow included out of the box.', link: 'https://github.com/' },
    { title: 'Custom theme', details: 'Accent, fonts, and preset applied.', link: '/api' },
  ],
  sidebar: [
    {
      title: 'Guide',
      items: [
        { label: 'Getting Started', link: '/guide' },
        { label: 'API', link: '/api' },
      ],
    },
  ],
  pages: [
    { title: 'Guide', slug: 'guide', description: 'Install, configure, and publish your new docs site.', content: starterMarkdown('Guide') },
    { title: 'API', slug: 'api', description: 'Reference notes for options, commands, and generated files.', content: starterMarkdown('API') },
  ],
  footer: {
    message: 'Released under the MIT License.',
    copyright: `Copyright (c) ${new Date().getFullYear()} My VitePress Site`,
    alignment: 'center',
  },
  plugins: {
    localSearch: true,
    mermaid: false,
    sitemap: false,
    autoSidebar: false,
    editLink: true,
    lastUpdated: true,
    pwa: true,
    openGraph: true,
    robots: true,
  },
  integrations: {
    siteUrl: 'https://nerdytech.dev/docs/NerdyPress',
    repoUrl: 'https://github.com/Nerdy-Technician/NerdyPress',
    analyticsProvider: 'none',
    analyticsId: '',
    ogImage: '',
    deploymentTarget: 'github-pages',
  },
}

let currentStep = 0
let selectedPageIndex = 0
let previewTab: 'site' | 'tree' = 'site'
let previewTimer = 0
let downloaded = false
let draggingSiteLogo = false

function starterMarkdown(title: string) {
  return `# ${title}\n\nStart writing your ${title.toLowerCase()} page here.\n`
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'vitepress-site'
}

function normalizePath(value: string) {
  const slug = slugify(value.replace(/^\//, '').replace(/\.md$/, ''))
  return slug === 'index' ? 'home' : slug
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeAttr(value: string) {
  return escapeHtml(value).replace(/'/g, '&#039;')
}

function indent(value: string, spaces = 2) {
  const pad = ' '.repeat(spaces)
  return value.split('\n').map((line) => `${pad}${line}`).join('\n')
}

function quote(value: unknown) {
  return JSON.stringify(value)
}

function getFontPairing(id: FontPairing) {
  const base = fontPairings[id] || fontPairings['inter-jetbrains']
  const index = Math.abs([...id].reduce((total, char) => total + char.charCodeAt(0), 0)) % visualFontStacks.length
  const visual = visualFontStacks[index]
  return {
    label: base.label,
    heading: `${base.heading}, ${visual.heading}`,
    body: `${base.body}, ${visual.body}`,
  }
}

function buildSiteConfig(formState: FormState): SiteConfig {
  return {
    title: formState.title.trim() || 'Untitled VitePress Site',
    description: formState.description.trim() || 'Documentation generated by NerdyPress.',
    slug: slugify(formState.slug),
    logoUrl: formState.logo?.dataUrl ?? null,
    logoFileName: formState.logo ? `header-logo.${formState.logo.extension}` : null,
    logoBase64: formState.logo?.base64 ?? null,
    siteLogoUrl: formState.siteLogo?.dataUrl ?? null,
    siteLogoFileName: formState.siteLogo ? `site-logo.${formState.siteLogo.extension}` : null,
    siteLogoBase64: formState.siteLogo?.base64 ?? null,
    faviconFileName: formState.favicon ? `favicon.${formState.favicon.extension}` : null,
    faviconBase64: formState.favicon?.base64 ?? null,
    showHeaderLogo: formState.showHeaderLogo,
    showSiteLogo: formState.showSiteLogo,
    siteLogoPosition: formState.siteLogoPosition,
    showHeaderTitle: formState.showHeaderTitle,
    headerLogoPosition: formState.headerLogoPosition,
    accentColor: formState.accentColor,
    themePalette: formState.themePalette,
    mode: formState.mode,
    fontPairing: formState.fontPairing,
    stylePreset: formState.stylePreset,
    buttons: { ...formState.buttons },
    cards: { ...formState.cards },
    nav: formState.nav.filter((item) => item.label.trim() && item.link.trim()),
    socialLinks: formState.socialLinks.filter((item) => item.url.trim()),
    socialPlacement: { ...formState.socialPlacement },
    footerLinks: formState.footerLinks.filter((item) => item.label.trim() && item.link.trim()),
    heroActions: formState.heroActions
      .filter((item) => item.text.trim() && item.link.trim())
      .map((item) => ({ text: item.text.trim(), link: item.link.trim(), theme: item.theme })),
    features: formState.features
      .filter((item) => item.title.trim())
      .map((item) => ({ title: item.title.trim(), details: item.details.trim(), link: item.link.trim() })),
    sidebar: formState.sidebar
      .filter((section) => section.title.trim())
      .map((section) => ({
        title: section.title.trim(),
        items: section.items.filter((item) => item.label.trim() && item.link.trim()),
      })),
    pages: formState.pages
      .filter((page) => page.title.trim())
      .map((page) => ({
        title: page.title.trim(),
        slug: normalizePath(page.slug || page.title),
        description: page.description.trim(),
        content: page.content.trim() || starterMarkdown(page.title.trim()),
      })),
    footer: {
      message: formState.footer.message.trim(),
      copyright: formState.footer.copyright.trim(),
      alignment: formState.footer.alignment,
    },
    plugins: { ...formState.plugins },
    integrations: {
      siteUrl: formState.integrations.siteUrl.trim(),
      repoUrl: formState.integrations.repoUrl.trim().replace(/\/$/, ''),
      analyticsProvider: formState.integrations.analyticsProvider,
      analyticsId: formState.integrations.analyticsId.trim(),
      ogImage: formState.integrations.ogImage.trim(),
      deploymentTarget: formState.integrations.deploymentTarget,
    },
  }
}

function renderApp() {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <main class="app-shell">
      <section class="wizard-pane" aria-label="NerdyPress site generator">
        <header class="brand-bar">
          <div>
            <img class="brand-logo" src="${nerdyPressLogo}" alt="NerdyPress" />
            <div class="brand-copy">
              <h1>Answer a few questions, get a VitePress site ready to push.</h1>
              <nav class="brand-links" aria-label="NerdyPress links">
                <a href="https://github.com/Nerdy-Technician/NerdyPress" target="_blank" rel="noreferrer">GitHub</a>
                <a href="https://nerdytech.dev/docs/NerdyPress" target="_blank" rel="noreferrer">Docs</a>
                <a href="https://nerdytech.dev/" target="_blank" rel="noreferrer">NerdyTech</a>
                <a href="https://github.com/Nerdy-Technician/" target="_blank" rel="noreferrer">Personal GitHub</a>
                <a href="https://masto.nerdy-technician.social/@Roffo" target="_blank" rel="noreferrer">Mastodon</a>
              </nav>
              <p class="brand-credit">Made by <a href="https://nerdytech.dev/" target="_blank" rel="noreferrer">Nerdy Technician</a></p>
            </div>
          </div>
        </header>
        <nav class="stepper" aria-label="Generator steps">
          ${steps.map((step, index) => `
            <button class="step-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'done' : ''}" data-step="${index}" type="button">
              <span>${index + 1}</span>${step}
            </button>
          `).join('')}
        </nav>
        <form id="wizard-form" class="wizard-form">
          <div id="step-content"></div>
          <footer class="wizard-actions">
            <button class="quiet-btn" data-action="prev" type="button" ${currentStep === 0 ? 'disabled' : ''}>Back</button>
            <button class="primary-btn" data-action="${currentStep === steps.length - 1 ? 'download' : 'next'}" type="button">
              ${currentStep === steps.length - 1 ? 'Download NerdyPress site' : 'Next'}
            </button>
          </footer>
        </form>
      </section>
      <aside class="preview-pane" aria-label="Live preview">
        <div class="preview-sticky">
          <div class="preview-tabs" role="tablist">
            <button type="button" class="${previewTab === 'site' ? 'active' : ''}" data-preview-tab="site">Site Preview</button>
            <button type="button" class="${previewTab === 'tree' ? 'active' : ''}" data-preview-tab="tree">File Tree</button>
          </div>
          <div id="preview-content"></div>
        </div>
      </aside>
    </main>
  `
  bindEvents()
  renderStep()
  renderPreview()
}

function renderStep() {
  const target = document.querySelector<HTMLDivElement>('#step-content')!
  const config = buildSiteConfig(state)
  const renderers = [renderBasics, renderTheme, renderNavigation, renderContent, renderPlugins, () => renderReview(config)]
  target.innerHTML = renderers[currentStep]()
  document.querySelectorAll('.step-dot').forEach((button, index) => {
    button.classList.toggle('active', index === currentStep)
    button.classList.toggle('done', index < currentStep)
  })
  document.querySelector<HTMLButtonElement>('[data-action="prev"]')!.disabled = currentStep === 0
  document.querySelector<HTMLButtonElement>('.primary-btn')!.dataset.action = currentStep === steps.length - 1 ? 'download' : 'next'
  document.querySelector<HTMLButtonElement>('.primary-btn')!.textContent = currentStep === steps.length - 1 ? 'Download NerdyPress site' : 'Next'
}

function renderBasics() {
  return `
    <section class="form-step">
      <div class="step-heading">
        <p class="eyebrow">Step 1</p>
        <h2>Basics</h2>
      </div>
      ${field('Site title', 'title', state.title, 'My VitePress Site', true)}
      <label class="field">
        <span>Tagline / description</span>
        <textarea data-bind="description" rows="4" placeholder="A fast documentation site.">${escapeHtml(state.description)}</textarea>
      </label>
      ${field('Repo/site slug', 'slug', state.slug, 'my-vitepress-site')}
      <label class="field">
        <span>Header logo upload</span>
        <input data-logo-input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" />
        <small>${state.logo ? escapeHtml(state.logo.fileName) : 'Optional. Used only in the top navigation header.'}</small>
      </label>
      ${toggle('showHeaderLogo', 'Header logo', 'Show the uploaded logo or generated wordmark in the top navigation.', state.showHeaderLogo)}
      ${toggle('showHeaderTitle', 'Header title text', 'Show the site title text in the top navigation. Turn off for logo-only headers.', state.showHeaderTitle)}
      <label class="field">
        <span>Header logo position</span>
        <select data-bind="headerLogoPosition" ${state.showHeaderLogo ? '' : 'disabled'}>
          ${option('left', 'Left of site title in header', state.headerLogoPosition)}
          ${option('right', 'Far right of header row', state.headerLogoPosition)}
        </select>
      </label>
      <label class="field">
        <span>Site logo upload</span>
        <input data-site-logo-input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" />
        <small>${state.siteLogo ? escapeHtml(state.siteLogo.fileName) : 'Optional. Used only above the VitePress documentation hero text.'}</small>
      </label>
      ${toggle('showSiteLogo', 'Site logo', 'Show a separate main-page logo above the VitePress documentation text.', state.showSiteLogo)}
      <label class="field">
        <span>Site logo position</span>
        <select data-bind="siteLogoPosition" ${state.showSiteLogo ? '' : 'disabled'}>
          ${option('above-kicker', 'Above VitePress documentation text', state.siteLogoPosition)}
          ${option('between-kicker-title', 'Between documentation text and page title', state.siteLogoPosition)}
          ${option('left-title', 'Left of main page title', state.siteLogoPosition)}
          ${option('right-title', 'Right of main page title', state.siteLogoPosition)}
          ${option('below-title', 'Below main page title', state.siteLogoPosition)}
        </select>
      </label>
      <label class="field">
        <span>Favicon</span>
        <input data-favicon-input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp,image/x-icon" />
        <small>${state.favicon ? escapeHtml(state.favicon.fileName) : 'Optional. Written to public/favicon.* and linked in the generated config.'}</small>
      </label>
    </section>
  `
}

function renderTheme() {
  return `
    <section class="form-step">
      <div class="step-heading">
        <p class="eyebrow">Step 2</p>
        <h2>Theme</h2>
      </div>
      <label class="field compact-field">
        <span>Accent color</span>
        <div class="accent-control">
          <input data-bind="accentColor" type="color" value="${escapeAttr(state.accentColor)}" />
          <div class="swatch-row" aria-label="Accent presets">
            ${accentSwatches.map((swatch) => `
              <button class="swatch ${state.accentColor.toLowerCase() === swatch ? 'selected' : ''}" data-accent="${swatch}" type="button" style="--swatch:${swatch}" aria-label="Use ${swatch} accent"></button>
            `).join('')}
          </div>
        </div>
      </label>
      <div class="field">
        <span>Theme palette</span>
        <div class="theme-grid">
          ${themePalettes.map((palette) => `
            <button class="theme-card ${state.themePalette === palette.id ? 'selected' : ''}" data-palette="${palette.id}" type="button" style="--palette-accent:${palette.accent};--palette-surface:${palette.surface}">
              <span><i></i><i></i></span>
              <strong>${palette.title}</strong>
              <small>${palette.copy}</small>
            </button>
          `).join('')}
        </div>
      </div>
      <label class="field">
        <span>Default mode</span>
        <select data-bind="mode">
          ${option('light', 'Light', state.mode)}
          ${option('dark', 'Dark', state.mode)}
          ${option('auto', 'Auto', state.mode)}
        </select>
      </label>
      <label class="field">
        <span>Font pairing</span>
        <select data-bind="fontPairing">
          ${Object.entries(fontPairings).map(([id, item]) => option(id, item.label, state.fontPairing)).join('')}
        </select>
      </label>
      <div class="font-sample" style="--sample-heading:${getFontPairing(state.fontPairing).heading};--sample-body:${getFontPairing(state.fontPairing).body}">
        <strong>${escapeHtml(fontPairings[state.fontPairing]?.label || 'Selected pairing')}</strong>
        <span>The quick docs preview changes with this pairing.</span>
      </div>
      <div class="field">
        <span>Style preset</span>
        <div class="preset-grid">
          ${stylePresets.map((preset) => `
            <button class="preset-card ${state.stylePreset === preset.id ? 'selected' : ''}" data-preset="${preset.id}" type="button">
              <span class="preset-thumb ${preset.id}"><i></i><i></i><i></i></span>
              <strong>${preset.title}</strong>
              <small>${preset.copy}</small>
            </button>
          `).join('')}
        </div>
      </div>
      <div class="control-panel">
        <h3>Button style</h3>
        <div class="control-grid">
          <label class="field mini">
            <span>Shape</span>
            <select data-bind="buttons.shape">
              ${option('pill', 'Pill', state.buttons.shape)}
              ${option('rounded', 'Rounded', state.buttons.shape)}
              ${option('square', 'Square', state.buttons.shape)}
            </select>
          </label>
          <label class="field mini">
            <span>Fill</span>
            <select data-bind="buttons.fill">
              ${option('solid', 'Solid', state.buttons.fill)}
              ${option('outline', 'Outline', state.buttons.fill)}
              ${option('soft', 'Soft', state.buttons.fill)}
              ${option('ghost', 'Ghost', state.buttons.fill)}
            </select>
          </label>
          <label class="field mini">
            <span>Size</span>
            <select data-bind="buttons.size">
              ${option('compact', 'Compact', state.buttons.size)}
              ${option('normal', 'Normal', state.buttons.size)}
              ${option('large', 'Large', state.buttons.size)}
            </select>
          </label>
          ${toggle('buttons.shadow', 'Button shadow', 'Adds lift to primary actions.', state.buttons.shadow)}
        </div>
      </div>
      <div class="control-panel">
        <h3>Card style</h3>
        <div class="control-grid">
          <label class="field mini">
            <span>Radius</span>
            <select data-bind="cards.radius">
              ${option('square', 'Square', state.cards.radius)}
              ${option('soft', 'Soft', state.cards.radius)}
              ${option('rounded', 'Rounded', state.cards.radius)}
            </select>
          </label>
          <label class="field mini">
            <span>Surface</span>
            <select data-bind="cards.style">
              ${option('plain', 'Plain', state.cards.style)}
              ${option('bordered', 'Bordered', state.cards.style)}
              ${option('filled', 'Filled', state.cards.style)}
              ${option('elevated', 'Elevated', state.cards.style)}
            </select>
          </label>
          <label class="field mini">
            <span>Density</span>
            <select data-bind="cards.density">
              ${option('compact', 'Compact', state.cards.density)}
              ${option('normal', 'Normal', state.cards.density)}
              ${option('spacious', 'Spacious', state.cards.density)}
            </select>
          </label>
          ${toggle('cards.accentBar', 'Accent bar', 'Adds an accent rule to feature cards.', state.cards.accentBar)}
        </div>
      </div>
    </section>
  `
}

function renderNavigation() {
  return `
    <section class="form-step">
      <div class="step-heading">
        <p class="eyebrow">Step 3</p>
        <h2>Navigation & social</h2>
      </div>
      <div class="repeat-header">
        <h3>Nav links</h3>
        <button type="button" class="icon-btn" data-action="add-nav" aria-label="Add nav link">+</button>
      </div>
      ${state.nav.map((item, index) => `
        <div class="repeat-row two-col">
          ${miniField('Label', `nav.${index}.label`, item.label)}
          ${miniField('Link', `nav.${index}.link`, item.link)}
          <button type="button" class="remove-btn" data-action="remove-nav" data-index="${index}" aria-label="Remove nav link">Remove</button>
        </div>
      `).join('')}
      <div class="repeat-header">
        <h3>Social links</h3>
        <button type="button" class="icon-btn" data-action="add-social" aria-label="Add social link">+</button>
      </div>
      ${state.socialLinks.map((item, index) => `
        <div class="repeat-row two-col">
          <label class="field mini">
            <span>Icon</span>
            <select data-bind="socialLinks.${index}.icon">
              ${socialIconOptionsMarkup(item.icon)}
            </select>
          </label>
          ${miniField('URL', `socialLinks.${index}.url`, item.url)}
          <button type="button" class="remove-btn" data-action="remove-social" data-index="${index}" aria-label="Remove social link">Remove</button>
        </div>
      `).join('')}
      <div class="placement-grid">
        ${toggle('socialPlacement.header', 'Show social icons in header', 'Uses VitePress built-in socialLinks in the top nav.', state.socialPlacement.header)}
        ${toggle('socialPlacement.footer', 'Show social icons in footer', 'Adds a generated footer social row in the custom theme.', state.socialPlacement.footer)}
      </div>
      <div class="repeat-header">
        <h3>Footer</h3>
        <button type="button" class="icon-btn" data-action="add-footer-link" aria-label="Add footer link">+</button>
      </div>
      ${field('Footer message', 'footer.message', state.footer.message, 'Released under the MIT License.')}
      ${field('Copyright', 'footer.copyright', state.footer.copyright, 'Copyright (c) 2026 Your Project')}
      <label class="field">
        <span>Footer text alignment</span>
        <select data-bind="footer.alignment">
          ${option('center', 'Center', state.footer.alignment)}
          ${option('left', 'Left', state.footer.alignment)}
        </select>
      </label>
      ${state.footerLinks.map((item, index) => `
        <div class="repeat-row two-col">
          ${miniField('Footer label', `footerLinks.${index}.label`, item.label)}
          ${miniField('Footer link', `footerLinks.${index}.link`, item.link)}
          <button type="button" class="remove-btn" data-action="remove-footer-link" data-index="${index}" aria-label="Remove footer link">Remove</button>
        </div>
      `).join('')}
    </section>
  `
}

function renderContent() {
  selectedPageIndex = Math.min(selectedPageIndex, Math.max(state.pages.length - 1, 0))
  return `
    <section class="form-step">
      <div class="step-heading">
        <p class="eyebrow">Step 4</p>
        <h2>Homepage & pages</h2>
      </div>
      <div class="repeat-header">
        <h3>Homepage buttons</h3>
        <button type="button" class="icon-btn" data-action="add-hero-action" aria-label="Add homepage button">+</button>
      </div>
      ${state.heroActions.map((item, index) => `
        <div class="repeat-row two-col">
          ${miniField('Button text', `heroActions.${index}.text`, item.text)}
          ${miniField('Link', `heroActions.${index}.link`, item.link)}
          <label class="field mini">
            <span>Theme</span>
            <select data-bind="heroActions.${index}.theme">
              ${option('brand', 'Brand', item.theme)}
              ${option('alt', 'Alt', item.theme)}
            </select>
          </label>
          <button type="button" class="remove-btn" data-action="remove-hero-action" data-index="${index}" aria-label="Remove homepage button">Remove</button>
        </div>
      `).join('')}
      <div class="repeat-header">
        <h3>Feature cards</h3>
        <button type="button" class="icon-btn" data-action="add-feature" aria-label="Add feature card">+</button>
      </div>
      ${state.features.map((item, index) => `
        <div class="nested-panel">
          <div class="repeat-row two-col">
            ${miniField('Title', `features.${index}.title`, item.title)}
            ${miniField('Link', `features.${index}.link`, item.link)}
            <button type="button" class="remove-btn" data-action="remove-feature" data-index="${index}" aria-label="Remove feature card">Remove</button>
          </div>
          <label class="field mini">
            <span>Details</span>
            <textarea data-bind="features.${index}.details" rows="3">${escapeHtml(item.details)}</textarea>
          </label>
        </div>
      `).join('')}
      ${state.plugins.autoSidebar ? '<p class="note">Auto-sidebar is enabled, so the generated config will let the folder structure drive docs navigation.</p>' : `
        <div class="repeat-header">
          <h3>Sidebar sections</h3>
          <button type="button" class="icon-btn" data-action="add-sidebar" aria-label="Add sidebar section">+</button>
        </div>
        ${state.sidebar.map((section, sectionIndex) => `
          <div class="nested-panel">
            <div class="repeat-row">
              ${miniField('Section title', `sidebar.${sectionIndex}.title`, section.title)}
              <button type="button" class="remove-btn" data-action="remove-sidebar" data-index="${sectionIndex}">Remove</button>
            </div>
            ${section.items.map((item, itemIndex) => `
              <div class="repeat-row two-col nested-row">
                ${miniField('Label', `sidebar.${sectionIndex}.items.${itemIndex}.label`, item.label)}
                ${miniField('Link', `sidebar.${sectionIndex}.items.${itemIndex}.link`, item.link)}
                <button type="button" class="remove-btn" data-action="remove-sidebar-item" data-section="${sectionIndex}" data-index="${itemIndex}">Remove</button>
              </div>
            `).join('')}
            <button type="button" class="quiet-btn inline" data-action="add-sidebar-item" data-section="${sectionIndex}">Add item</button>
          </div>
        `).join('')}
      `}
      <div class="repeat-header">
        <h3>Pages</h3>
        <button type="button" class="icon-btn" data-action="add-page" aria-label="Add page">+</button>
      </div>
      ${renderPageEditor()}
    </section>
  `
}

function renderPageEditor() {
  if (!state.pages.length) {
    return `
      <div class="page-editor empty">
        <div class="empty-panel">
          <strong>No pages yet</strong>
          <span>Add a page to start writing documentation content.</span>
          <button type="button" class="primary-btn" data-action="add-page">Add page</button>
        </div>
      </div>
    `
  }

  const page = state.pages[selectedPageIndex]
  return `
    <div class="page-editor">
      <aside class="page-list" aria-label="Pages">
        ${state.pages.map((item, index) => `
          <button type="button" class="page-list-item ${index === selectedPageIndex ? 'active' : ''}" data-action="select-page" data-index="${index}">
            <strong>${escapeHtml(item.title || 'Untitled page')}</strong>
            <span>/${escapeHtml(normalizePath(item.slug || item.title))}</span>
          </button>
        `).join('')}
      </aside>
      <div class="page-editor-main">
        <div class="page-editor-bar">
          <div>
            <h3>${escapeHtml(page.title || 'Untitled page')}</h3>
            <span>/${escapeHtml(normalizePath(page.slug || page.title))}.md</span>
          </div>
          <button type="button" class="remove-btn" data-action="remove-page" data-index="${selectedPageIndex}">Remove page</button>
        </div>
        <div class="page-meta-grid">
          ${miniField('Page title', `pages.${selectedPageIndex}.title`, page.title)}
          ${miniField('Slug/path', `pages.${selectedPageIndex}.slug`, page.slug)}
        </div>
        <label class="field mini">
          <span>Description</span>
          <textarea data-bind="pages.${selectedPageIndex}.description" rows="2" placeholder="Short SEO and page summary.">${escapeHtml(page.description)}</textarea>
        </label>
        <div class="markdown-workbench">
          <label class="field mini markdown-editor">
            <span>Markdown</span>
            <textarea data-bind="pages.${selectedPageIndex}.content" rows="18" spellcheck="true">${escapeHtml(page.content)}</textarea>
          </label>
          <div class="markdown-preview-panel" aria-label="Page preview">
            <div class="markdown-preview-header">
              <span>Preview</span>
              <code>${escapeHtml(page.slug || slugify(page.title))}.md</code>
            </div>
            <article class="markdown-preview">
              ${renderMarkdownPreview(page)}
            </article>
          </div>
        </div>
      </div>
    </div>
  `
}

function renderMarkdownPreview(page: PageItem) {
  const markdown = page.content.trim() || starterMarkdown(page.title || 'Untitled page')
  const body = markdownToHtml(markdown)
  return `
    ${page.description.trim() ? `<p class="page-description">${escapeHtml(page.description.trim())}</p>` : ''}
    ${body}
  `
}

function markdownToHtml(markdown: string) {
  const lines = markdown.split('\n')
  let html = ''
  let paragraph: string[] = []
  let list: string[] = []
  let code: string[] = []
  let inCode = false

  const flushParagraph = () => {
    if (!paragraph.length) return
    html += `<p>${inlineMarkdown(paragraph.join(' '))}</p>`
    paragraph = []
  }
  const flushList = () => {
    if (!list.length) return
    html += `<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('')}</ul>`
    list = []
  }
  const flushCode = () => {
    html += `<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`
    code = []
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trimEnd()
    if (line.trim().startsWith('```')) {
      flushParagraph()
      flushList()
      if (inCode) flushCode()
      inCode = !inCode
      return
    }
    if (inCode) {
      code.push(rawLine)
      return
    }
    if (!line.trim()) {
      flushParagraph()
      flushList()
      return
    }
    const heading = /^(#{1,3})\s+(.+)$/.exec(line)
    if (heading) {
      flushParagraph()
      flushList()
      const level = heading[1].length
      html += `<h${level}>${inlineMarkdown(heading[2])}</h${level}>`
      return
    }
    const listItem = /^[-*]\s+(.+)$/.exec(line)
    if (listItem) {
      flushParagraph()
      list.push(listItem[1])
      return
    }
    if (line.startsWith('>')) {
      flushParagraph()
      flushList()
      html += `<blockquote>${inlineMarkdown(line.replace(/^>\s?/, ''))}</blockquote>`
      return
    }
    paragraph.push(line.trim())
  })

  flushParagraph()
  flushList()
  if (inCode) flushCode()
  return html
}

function inlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a>$1</a>')
}

function renderPlugins() {
  const enabledPlugins = pluginSummary()
  return `
    <section class="form-step">
      <div class="step-heading">
        <p class="eyebrow">Step 5</p>
        <h2>Plugins / integrations</h2>
      </div>
      <div class="integration-hero">
        <strong>Choose what the generated VitePress site ships with.</strong>
        <span>These options change the downloaded project config, dependencies, and theme behavior.</span>
      </div>
      <div class="plugin-grid">
        ${pluginCard('plugins.localSearch', 'Local search', 'Built in', 'Adds VitePress browser search without Algolia or any external service.', 'themeConfig.search', state.plugins.localSearch)}
        ${pluginCard('plugins.mermaid', 'Mermaid diagrams', 'Extra package', 'Lets markdown pages render Mermaid diagrams and flowcharts.', 'vitepress-plugin-mermaid', state.plugins.mermaid)}
        ${pluginCard('plugins.sitemap', 'Sitemap', 'SEO', 'Generates a sitemap using the production site URL below.', 'sitemap.hostname', state.plugins.sitemap)}
        ${pluginCard('plugins.autoSidebar', 'Auto sidebar', 'Navigation', 'Leaves sidebar generation to VitePress folder conventions instead of manual sections.', 'sidebar auto mode', state.plugins.autoSidebar)}
        ${pluginCard('plugins.editLink', 'Edit links', 'GitHub', 'Adds an edit-this-page link that points back to your repository.', 'themeConfig.editLink', state.plugins.editLink)}
        ${pluginCard('plugins.lastUpdated', 'Last updated', 'Docs metadata', 'Shows update times based on Git history when the generated site builds.', 'lastUpdated', state.plugins.lastUpdated)}
        ${pluginCard('plugins.pwa', 'PWA / offline', 'Default on', 'Adds installable app metadata and offline support using the VitePress PWA plugin.', '@vite-pwa/vitepress', state.plugins.pwa)}
        ${pluginCard('plugins.openGraph', 'Open Graph', 'Social preview', 'Adds social sharing meta tags for link previews.', 'head meta tags', state.plugins.openGraph)}
        ${pluginCard('plugins.robots', 'Robots.txt', 'SEO', 'Writes robots.txt with sitemap hints for crawlers.', 'public/robots.txt', state.plugins.robots)}
      </div>
      <div class="control-panel">
        <h3>Project integrations</h3>
        <div class="control-grid two">
          ${miniField('Production docs URL', 'integrations.siteUrl', state.integrations.siteUrl)}
          ${miniField('GitHub repository URL', 'integrations.repoUrl', state.integrations.repoUrl)}
        </div>
        <p class="note">Sitemap, robots.txt, Open Graph, PWA metadata, and edit links use these URLs in the generated project.</p>
      </div>
      <div class="control-panel">
        <h3>Analytics</h3>
        <div class="control-grid two">
          <label class="field mini">
            <span>Provider</span>
            <select data-bind="integrations.analyticsProvider">
              ${option('none', 'None', state.integrations.analyticsProvider)}
              ${option('plausible', 'Plausible', state.integrations.analyticsProvider)}
              ${option('umami', 'Umami', state.integrations.analyticsProvider)}
              ${option('goatcounter', 'GoatCounter', state.integrations.analyticsProvider)}
              ${option('google', 'Google Analytics', state.integrations.analyticsProvider)}
            </select>
          </label>
          ${miniField('Site ID / domain / measurement ID', 'integrations.analyticsId', state.integrations.analyticsId)}
        </div>
      </div>
      <div class="control-panel">
        <h3>Social preview & deploy</h3>
        <div class="control-grid two">
          ${miniField('Open Graph image URL', 'integrations.ogImage', state.integrations.ogImage)}
          <label class="field mini">
            <span>Deployment target</span>
            <select data-bind="integrations.deploymentTarget">
              ${option('github-pages', 'GitHub Pages workflow', state.integrations.deploymentTarget)}
              ${option('cloudflare-pages', 'Cloudflare Pages', state.integrations.deploymentTarget)}
              ${option('netlify', 'Netlify', state.integrations.deploymentTarget)}
              ${option('vercel', 'Vercel', state.integrations.deploymentTarget)}
            </select>
          </label>
        </div>
      </div>
      <div class="integration-output">
        <h3>Generated changes</h3>
        <ul>
          ${enabledPlugins.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    </section>
  `
}

function pluginCard(bind: string, title: string, badge: string, copy: string, output: string, checked: boolean) {
  return `
    <label class="plugin-card ${checked ? 'enabled' : ''}">
      <input data-bind="${bind}" type="checkbox" ${checked ? 'checked' : ''} />
      <span class="plugin-switch" aria-hidden="true"></span>
      <span class="plugin-content">
        <span class="plugin-title">
          <strong>${escapeHtml(title)}</strong>
          <em>${escapeHtml(badge)}</em>
        </span>
        <span>${escapeHtml(copy)}</span>
        <code>${escapeHtml(output)}</code>
      </span>
    </label>
  `
}

function pluginSummary() {
  const items = [
    state.plugins.localSearch ? 'Adds VitePress local search to themeConfig.' : '',
    state.plugins.mermaid ? 'Adds Mermaid dependencies and wraps the config with withMermaid().' : '',
    state.plugins.sitemap ? `Adds sitemap hostname: ${escapeHtml(state.integrations.siteUrl || 'https://example.com')}.` : '',
    state.plugins.autoSidebar ? 'Skips manual sidebar config so page structure can drive navigation.' : 'Writes your manual sidebar sections into config.mts.',
    state.plugins.editLink ? `Adds GitHub edit links using ${escapeHtml(state.integrations.repoUrl || 'your repository')}.` : '',
    state.plugins.lastUpdated ? 'Enables VitePress lastUpdated metadata.' : '',
    state.plugins.pwa ? 'Adds @vite-pwa/vitepress and wraps config with withPwa().' : '',
    state.plugins.openGraph ? 'Adds Open Graph and Twitter card meta tags.' : '',
    state.plugins.robots ? 'Writes public/robots.txt with sitemap reference.' : '',
    state.integrations.analyticsProvider !== 'none' ? `Injects ${escapeHtml(state.integrations.analyticsProvider)} analytics script.` : '',
    `Adds deployment setup for ${escapeHtml(deploymentTargetLabel(state.integrations.deploymentTarget))}.`,
  ].filter(Boolean)
  return items.length ? items : ['No optional integrations selected.']
}

function deploymentTargetLabel(target: DeploymentTarget) {
  if (target === 'cloudflare-pages') return 'Cloudflare Pages'
  if (target === 'netlify') return 'Netlify'
  if (target === 'vercel') return 'Vercel'
  return 'GitHub Pages'
}

function renderReview(config: SiteConfig) {
  return `
    <section class="form-step">
      <div class="step-heading">
        <p class="eyebrow">Step 6</p>
        <h2>Review & download</h2>
      </div>
      <dl class="summary-grid">
        <div><dt>Title</dt><dd>${escapeHtml(config.title)}</dd></div>
        <div><dt>Slug</dt><dd>${escapeHtml(config.slug)}</dd></div>
        <div><dt>Preset</dt><dd>${escapeHtml(config.stylePreset)}</dd></div>
        <div><dt>Theme</dt><dd>${escapeHtml(config.themePalette)}</dd></div>
        <div><dt>Pages</dt><dd>${config.pages.length + 1}</dd></div>
      </dl>
      <pre class="terminal large">${escapeHtml(fileTree(config))}<span class="cursor"></span></pre>
      ${downloaded ? `
        <div class="next-panel">
          <strong>What to do next</strong>
          <code>cd ${escapeHtml(config.slug)}</code>
          <code>npm install</code>
          <code>npm run docs:dev</code>
          <p>Pushing to GitHub with Pages set to GitHub Actions will auto-deploy.</p>
        </div>
      ` : ''}
    </section>
  `
}

function field(label: string, bind: string, value: string, placeholder: string, required = false) {
  return `
    <label class="field">
      <span>${label}</span>
      <input data-bind="${bind}" value="${escapeAttr(value)}" placeholder="${escapeAttr(placeholder)}" ${required ? 'required' : ''} />
    </label>
  `
}

function miniField(label: string, bind: string, value: string) {
  return `
    <label class="field mini">
      <span>${label}</span>
      <input data-bind="${bind}" value="${escapeAttr(value)}" />
    </label>
  `
}

function option(value: string, label: string, selected: string) {
  return `<option value="${escapeAttr(value)}" ${value === selected ? 'selected' : ''}>${escapeHtml(label)}</option>`
}

function socialIconOptionsMarkup(selected: string) {
  const generic = option('link', 'Generic link (custom SVG)', selected)
  const common = socialIconFallbacks
    .filter((icon) => icon !== 'link')
    .map((icon) => option(icon, `${iconLabel(icon)} (common)`, selected))
    .join('')
  const allIcons = simpleIconOptions
    .filter((icon) => !socialIconFallbacks.includes(icon.value))
    .map((icon) => option(icon.value, icon.label, selected))
    .join('')
  return `${generic}${common}${allIcons}`
}

function toggle(bind: string, title: string, copy: string, checked: boolean) {
  return `
    <label class="toggle-row">
      <input data-bind="${bind}" type="checkbox" ${checked ? 'checked' : ''} />
      <span class="toggle-ui"></span>
      <span><strong>${title}</strong><small>${copy}</small></span>
    </label>
  `
}

function bindEvents() {
  const app = document.querySelector<HTMLDivElement>('#app')!
  app.addEventListener('input', onInput)
  app.addEventListener('change', onChange)
  app.addEventListener('click', onClick)
  app.addEventListener('dragstart', onDragStart)
  app.addEventListener('dragover', onDragOver)
  app.addEventListener('drop', onDrop)
  app.addEventListener('dragend', onDragEnd)
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  const bind = target.dataset.bind
  if (!bind) return
  const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value
  setPath(state, bind, value)
  if (bind === 'title' && !state.slugTouched) {
    state.slug = slugify(String(value))
    const slugInput = document.querySelector<HTMLInputElement>('[data-bind="slug"]')
    if (slugInput) slugInput.value = state.slug
  }
  if (bind === 'slug') {
    state.slugTouched = true
    state.slug = slugify(String(value))
    target.value = state.slug
  }
  if (bind === 'accentColor') {
    state.themePalette = 'custom'
  }
  if (/pages\.\d+\.title/.test(bind)) {
    const index = Number(bind.split('.')[1])
    if (!state.pages[index].slug) state.pages[index].slug = slugify(String(value))
  }
  if (bind.startsWith('pages.')) {
    updatePageEditorPreview(Number(bind.split('.')[1]))
  }
  schedulePreview()
}

function updatePageEditorPreview(index: number) {
  if (currentStep !== 3 || index !== selectedPageIndex) return
  const page = state.pages[index]
  if (!page) return

  const path = normalizePath(page.slug || page.title)
  const title = page.title || 'Untitled page'
  const listItem = document.querySelector<HTMLElement>(`.page-list-item[data-index="${index}"]`)
  const barTitle = document.querySelector<HTMLElement>('.page-editor-bar h3')
  const barPath = document.querySelector<HTMLElement>('.page-editor-bar span')
  const previewPath = document.querySelector<HTMLElement>('.markdown-preview-header code')
  const preview = document.querySelector<HTMLElement>('.markdown-preview')

  if (listItem) {
    const [label, slug] = Array.from(listItem.children) as HTMLElement[]
    if (label) label.textContent = title
    if (slug) slug.textContent = `/${path}`
  }
  if (barTitle) barTitle.textContent = title
  if (barPath) barPath.textContent = `/${path}.md`
  if (previewPath) previewPath.textContent = `${path}.md`
  if (preview) preview.innerHTML = renderMarkdownPreview(page)
}

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.dataset.logoInput !== undefined && target.files?.[0]) {
    readLogo(target.files[0])
  }
  if (target.dataset.siteLogoInput !== undefined && target.files?.[0]) {
    readSiteLogo(target.files[0])
  }
  if (target.dataset.faviconInput !== undefined && target.files?.[0]) {
    readFavicon(target.files[0])
  }
  if (target.dataset.bind?.startsWith('plugins.') || target.dataset.bind === 'integrations.analyticsProvider' || target.dataset.bind === 'integrations.deploymentTarget') {
    renderStep()
    schedulePreview()
  }
}

function onClick(event: MouseEvent) {
  const target = (event.target as HTMLElement).closest<HTMLElement>('button')
  if (!target) return
  const action = target.dataset.action
  if (target.dataset.step) {
    currentStep = Number(target.dataset.step)
    renderStep()
    return
  }
  if (target.dataset.previewTab) {
    previewTab = target.dataset.previewTab as 'site' | 'tree'
    document.querySelectorAll('[data-preview-tab]').forEach((button) => button.classList.toggle('active', (button as HTMLElement).dataset.previewTab === previewTab))
    renderPreview()
    return
  }
  if (target.dataset.preset) {
    state.stylePreset = target.dataset.preset as StylePreset
    renderStep()
    schedulePreview()
    return
  }
  if (target.dataset.accent) {
    state.accentColor = target.dataset.accent
    state.themePalette = 'custom'
    renderStep()
    schedulePreview()
    return
  }
  if (target.dataset.palette) {
    const palette = themePalettes.find((item) => item.id === target.dataset.palette)
    if (palette) {
      state.themePalette = palette.id
      state.accentColor = palette.accent
    }
    renderStep()
    schedulePreview()
    return
  }
  switch (action) {
    case 'prev':
      currentStep = Math.max(0, currentStep - 1)
      renderStep()
      break
    case 'next':
      currentStep = Math.min(steps.length - 1, currentStep + 1)
      renderStep()
      break
    case 'download':
      void downloadZip()
      break
    case 'add-nav':
      state.nav.push({ label: 'Docs', link: '/docs' })
      rerenderChangedStep()
      break
    case 'remove-nav':
      state.nav.splice(Number(target.dataset.index), 1)
      rerenderChangedStep()
      break
    case 'add-social':
      state.socialLinks.push({ icon: 'link', url: 'https://' })
      rerenderChangedStep()
      break
    case 'remove-social':
      state.socialLinks.splice(Number(target.dataset.index), 1)
      rerenderChangedStep()
      break
    case 'add-footer-link':
      state.footerLinks.push({ label: 'New Link', link: 'https://' })
      rerenderChangedStep()
      break
    case 'remove-footer-link':
      state.footerLinks.splice(Number(target.dataset.index), 1)
      rerenderChangedStep()
      break
    case 'add-hero-action':
      state.heroActions.push({ text: 'New Button', link: '/', theme: 'alt' })
      rerenderChangedStep()
      break
    case 'remove-hero-action':
      state.heroActions.splice(Number(target.dataset.index), 1)
      rerenderChangedStep()
      break
    case 'add-feature':
      state.features.push({ title: 'New Feature', details: 'Describe this feature card.', link: '/' })
      rerenderChangedStep()
      break
    case 'remove-feature':
      state.features.splice(Number(target.dataset.index), 1)
      rerenderChangedStep()
      break
    case 'add-sidebar':
      state.sidebar.push({ title: 'New Section', items: [{ label: 'Overview', link: '/overview' }] })
      rerenderChangedStep()
      break
    case 'remove-sidebar':
      state.sidebar.splice(Number(target.dataset.index), 1)
      rerenderChangedStep()
      break
    case 'add-sidebar-item':
      state.sidebar[Number(target.dataset.section)].items.push({ label: 'New Page', link: '/new-page' })
      rerenderChangedStep()
      break
    case 'remove-sidebar-item':
      state.sidebar[Number(target.dataset.section)].items.splice(Number(target.dataset.index), 1)
      rerenderChangedStep()
      break
    case 'select-page':
      selectedPageIndex = Number(target.dataset.index)
      renderStep()
      break
    case 'add-page':
      state.pages.push({ title: 'New Page', slug: 'new-page', description: 'Describe this documentation page.', content: starterMarkdown('New Page') })
      selectedPageIndex = state.pages.length - 1
      rerenderChangedStep()
      break
    case 'remove-page':
      state.pages.splice(Number(target.dataset.index), 1)
      selectedPageIndex = Math.min(selectedPageIndex, Math.max(state.pages.length - 1, 0))
      rerenderChangedStep()
      break
  }
}

function onDragStart(event: DragEvent) {
  const target = (event.target as HTMLElement).closest<HTMLElement>('[data-site-logo-drag]')
  if (!target) return
  draggingSiteLogo = true
  event.dataTransfer?.setData('text/plain', 'site-logo')
  event.dataTransfer?.setDragImage(target, 12, 12)
  renderPreview()
}

function onDragOver(event: DragEvent) {
  const target = (event.target as HTMLElement).closest<HTMLElement>('[data-site-logo-drop]')
  if (!target) return
  event.preventDefault()
}

function onDrop(event: DragEvent) {
  const target = (event.target as HTMLElement).closest<HTMLElement>('[data-site-logo-drop]')
  if (!target || event.dataTransfer?.getData('text/plain') !== 'site-logo') {
    draggingSiteLogo = false
    renderPreview()
    return
  }
  event.preventDefault()
  state.siteLogoPosition = target.dataset.siteLogoDrop as SiteLogoPosition
  draggingSiteLogo = false
  renderStep()
  renderPreview()
}

function onDragEnd() {
  if (!draggingSiteLogo) return
  draggingSiteLogo = false
  renderPreview()
}

function rerenderChangedStep() {
  renderStep()
  schedulePreview()
}

function setPath(target: Record<string, any>, path: string, value: unknown) {
  const keys = path.split('.')
  let cursor: any = target
  keys.slice(0, -1).forEach((key) => {
    cursor = cursor[key]
  })
  cursor[keys[keys.length - 1]] = value
}

function schedulePreview() {
  window.clearTimeout(previewTimer)
  previewTimer = window.setTimeout(renderPreview, 150)
}

function readLogo(file: File) {
  readImageAsset(file, (asset) => {
    state.logo = asset
    renderStep()
    renderPreview()
  })
}

function readSiteLogo(file: File) {
  readImageAsset(file, (asset) => {
    state.siteLogo = asset
    state.showSiteLogo = true
    renderStep()
    renderPreview()
  })
}

function readFavicon(file: File) {
  readImageAsset(file, (asset) => {
    state.favicon = asset
    renderStep()
    renderPreview()
  })
}

function readImageAsset(file: File, callback: (asset: LogoFile) => void) {
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    const dataUrl = String(reader.result)
    const [, base64 = ''] = dataUrl.split(',')
    const extension = file.name.split('.').pop()?.toLowerCase() || file.type.split('/').pop() || 'png'
    callback({ dataUrl, fileName: file.name, extension: extension.replace('svg+xml', 'svg').replace('x-icon', 'ico'), base64 })
  })
  reader.readAsDataURL(file)
}

function renderPreview() {
  const config = buildSiteConfig(state)
  const target = document.querySelector<HTMLDivElement>('#preview-content')
  if (!target) return
  target.innerHTML = previewTab === 'site' ? sitePreview(config) : `<pre class="terminal">${escapeHtml(fileTree(config))}<span class="cursor"></span></pre>`
}

function sitePreview(config: SiteConfig) {
  const fonts = getFontPairing(config.fontPairing)
  const colors = brandScale(config.accentColor)
  const palette = themeTokens(config.themePalette, config.accentColor)
  const nav = config.nav.slice(0, 4).map((item) => `<a>${escapeHtml(item.label)}</a>`).join('')
  const socials = config.socialLinks.slice(0, 5).map((item) => `
    <a class="preview-social" title="${escapeAttr(iconLabel(item.icon))}">${socialIconMarkup(item.icon)}</a>
  `).join('')
  const headerLogoMarkup = config.logoUrl
    ? `<img src="${config.logoUrl}" alt="" />`
    : `<span>${escapeHtml(config.title.slice(0, 2).toUpperCase())}</span>`
  const siteLogoMarkup = config.siteLogoUrl
    ? `<img src="${config.siteLogoUrl}" alt="" />`
    : `<span>${escapeHtml(config.title)}</span>`
  const leftLogo = config.showHeaderLogo && config.headerLogoPosition === 'left' ? `<div class="preview-logo square">${headerLogoMarkup}</div>` : ''
  const rightLogo = config.showHeaderLogo && config.headerLogoPosition === 'right' ? `<div class="preview-logo square right">${headerLogoMarkup}</div>` : ''
  const siteLogo = config.showSiteLogo ? `<div class="preview-logo wide" draggable="true" data-site-logo-drag="true" title="Drag to reposition site logo">${siteLogoMarkup}</div>` : ''
  const siteLogoSlot = (position: SiteLogoPosition) => `
    <div class="site-logo-slot ${config.siteLogoPosition === position ? 'active' : ''} ${draggingSiteLogo ? 'drag-visible' : ''}" data-site-logo-drop="${position}">
      ${config.siteLogoPosition === position ? siteLogo : draggingSiteLogo ? '<span>Drop site logo here</span>' : ''}
    </div>
  `
  const headerSocials = config.socialPlacement.header ? `<div class="preview-socials">${socials}</div>` : ''
  const footerSocials = config.socialPlacement.footer ? `<div class="preview-socials">${socials}</div>` : ''
  const footerLinks = config.footerLinks.length
    ? `<nav class="preview-footer-links">${config.footerLinks.slice(0, 4).map((item) => `<a>${escapeHtml(item.label)}</a>`).join('')}</nav>`
    : ''
  const footerActions = footerLinks || footerSocials ? `<div class="preview-footer-actions">${footerLinks}${footerSocials}</div>` : ''
  const heroActions = config.heroActions.map((item) => `<button class="${item.theme}">${escapeHtml(item.text)}</button>`).join('')
  const featureCards = config.features.map((item) => `
    <div>
      <b>${escapeHtml(item.title)}</b>
      <span>${escapeHtml(item.details)}</span>
      ${item.link ? `<a>${escapeHtml(item.link)}</a>` : ''}
    </div>
  `).join('')
  return `
    <article class="site-preview ${config.stylePreset} ${config.mode} ${buttonClass(config)} ${cardClass(config)}" style="--site-accent:${config.accentColor};--site-accent-soft:${colors.soft};--site-accent-dark:${colors.dark};--site-accent-light:${colors.light};--site-palette-surface:${palette.bg};--site-palette-soft:${palette.soft};--site-heading:${fonts.heading};--site-body:${fonts.body}">
      <header>
        ${leftLogo}
        ${config.showHeaderTitle ? `<strong>${escapeHtml(config.title)}</strong>` : ''}
        <nav>${nav}</nav>
        ${headerSocials}
        ${rightLogo}
      </header>
      <section class="preview-hero">
        ${config.showSiteLogo ? siteLogoSlot('above-kicker') : ''}
        <p>${heroKicker(config.stylePreset)}</p>
        ${config.showSiteLogo ? siteLogoSlot('between-kicker-title') : ''}
        <div class="preview-title-row ${config.siteLogoPosition === 'left-title' || config.siteLogoPosition === 'right-title' ? 'with-site-logo' : ''}">
          ${config.showSiteLogo ? siteLogoSlot('left-title') : ''}
          <h2>${escapeHtml(config.title)}</h2>
          ${config.showSiteLogo ? siteLogoSlot('right-title') : ''}
        </div>
        ${config.showSiteLogo ? siteLogoSlot('below-title') : ''}
        <span>${escapeHtml(config.description)}</span>
        <div class="preview-actions">
          ${heroActions}
        </div>
      </section>
      ${config.stylePreset === 'minimal' ? `
        <section class="preview-doc">
          <aside>${config.sidebar[0]?.items.slice(0, 3).map((item) => `<a>${escapeHtml(item.label)}</a>`).join('') || '<a>Overview</a><a>Guide</a>'}</aside>
          <div><h3>${escapeHtml(config.pages[0]?.title || 'Guide')}</h3><p>Clean single-column docs with quiet navigation, wide line spacing, and a restrained accent system.</p></div>
        </section>
      ` : config.stylePreset === 'editorial' ? `
        <section class="preview-editorial">
          <p>Featured chapter</p>
          <h3>${escapeHtml(config.pages[0]?.title || 'Guide')}</h3>
          <span>${escapeHtml(config.pages[0]?.content.replace(/^#.*\n?/, '').trim().slice(0, 120) || 'Long-form documentation with more air, stronger prose rhythm, and a readable article surface.')}</span>
        </section>
      ` : `
        <section class="preview-features">
          ${featureCards}
        </section>
      `}
      <footer class="preview-footer align-${config.footer.alignment}">
        <div class="preview-footer-copy">
          <strong>${escapeHtml(config.footer.message || config.title)}</strong>
          <span>${escapeHtml(config.footer.copyright || config.description)}</span>
        </div>
        ${footerActions}
      </footer>
    </article>
  `
}

function heroKicker(preset: StylePreset) {
  if (preset === 'terminal') return '$ npm run docs:dev'
  if (preset === 'product') return 'Launch documentation'
  if (preset === 'editorial') return 'Field notes and docs'
  if (preset === 'api') return 'API reference'
  if (preset === 'handbook') return 'Team handbook'
  if (preset === 'showcase') return 'Product showcase'
  if (preset === 'compact') return 'Docs index'
  if (preset === 'retro') return '> readme.md'
  if (preset === 'magazine') return 'Latest issue'
  return 'VitePress documentation'
}

function socialIconMarkup(icon: SocialIcon) {
  return socialIconSvg(icon)
}

function buttonClass(config: SiteConfig) {
  return `btn-${config.buttons.shape} btn-${config.buttons.fill} btn-${config.buttons.size} ${config.buttons.shadow ? 'btn-shadow' : 'btn-flat'}`
}

function cardClass(config: SiteConfig) {
  return `card-${config.cards.radius} card-${config.cards.style} card-${config.cards.density} ${config.cards.accentBar ? 'card-accent' : 'card-no-accent'}`
}

function socialIconSvg(icon: SocialIcon) {
  if (icon === 'link') {
    return '<svg role="img" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M10.6 13.4a1 1 0 0 1 0-1.4l3.9-3.9a3 3 0 1 1 4.2 4.2l-2.1 2.1a1 1 0 1 1-1.4-1.4l2.1-2.1a1 1 0 0 0-1.4-1.4L12 13.4a1 1 0 0 1-1.4 0Zm2.8-2.8a1 1 0 0 1 0 1.4l-3.9 3.9a3 3 0 0 1-4.2-4.2l2.1-2.1A1 1 0 1 1 8.8 11l-2.1 2.1a1 1 0 0 0 1.4 1.4l3.9-3.9a1 1 0 0 1 1.4 0Z"/></svg>'
  }
  const iconData = (simpleIcons as Record<string, SimpleIcon>)[simpleIconExportName(icon)]
  if (!iconData) return `<span>${escapeHtml(icon.slice(0, 2).toUpperCase())}</span>`
  return `<svg role="img" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="${iconData.path}"/></svg>`
}

function fileTree(config: SiteConfig) {
  const deployment = deploymentFiles(config).map((file) => file.path)
  const publicFiles = [
    config.showHeaderLogo ? effectiveHeaderLogoFileName(config) : null,
    config.showSiteLogo ? effectiveSiteLogoFileName(config) : null,
    config.faviconFileName,
    config.plugins.robots ? 'robots.txt' : null,
  ].filter(Boolean)
  const publicLines = publicFiles.length
    ? publicFiles.map((file, index) => `│   ${index === publicFiles.length - 1 ? '└──' : '├──'} ${file}`).join('\n') + '\n'
    : '│   └── .gitkeep\n'
  const pages = config.pages.map((page) => `├── ${page.slug}.md`).join('\n')
  return `${config.slug}/
${deployment.map((file) => `├── ${file}`).join('\n')}${deployment.length ? '\n' : ''}├── .vitepress/
│   ├── config.mts
│   └── theme/
│       ├── index.ts
│       └── custom.css
├── public/
${publicLines}├── index.md
${pages ? `${pages}\n` : ''}├── package.json
├── .gitignore
└── README.md`
}

function effectiveHeaderLogoFileName(config: SiteConfig) {
  return config.logoFileName || 'header-logo.svg'
}

function effectiveSiteLogoFileName(config: SiteConfig) {
  return config.siteLogoFileName || 'site-logo.svg'
}

function generatedHeaderLogoSvg(config: SiteConfig) {
  const initials = escapeHtml(config.title.slice(0, 2).toUpperCase())
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${escapeAttr(config.title)} logo">
  <text x="32" y="40" text-anchor="middle" font-family="monospace" font-size="28" font-weight="700" fill="${config.accentColor}">${initials}</text>
</svg>
`
}

function generatedSiteLogoSvg(config: SiteConfig) {
  const label = escapeHtml(config.title || 'My VitePress Site')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 52" role="img" aria-label="${escapeAttr(config.title)} logo">
  <text x="0" y="34" font-family="monospace" font-size="22" font-weight="700" fill="${config.accentColor}">${label}</text>
</svg>
`
}

async function downloadZip() {
  const config = buildSiteConfig(state)
  const zip = await generateZip(config)
  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${config.slug}.zip`
  link.click()
  URL.revokeObjectURL(url)
  downloaded = true
  renderStep()
}

async function generateZip(config: SiteConfig) {
  const zip = new JSZip()
  const root = zip.folder(config.slug)!
  deploymentFiles(config).forEach((file) => root.file(file.path, file.content))
  root.file('.vitepress/config.mts', vitePressConfig(config))
  root.file('.vitepress/theme/index.ts', themeIndex(config))
  root.file('.vitepress/theme/custom.css', customCss(config))
  root.file('public/.gitkeep', '')
  if (config.plugins.robots) root.file('public/robots.txt', robotsTxt(config))
  if (config.logoFileName && config.logoBase64) {
    root.file(`public/${config.logoFileName}`, config.logoBase64, { base64: true })
  } else if (config.showHeaderLogo) {
    root.file('public/header-logo.svg', generatedHeaderLogoSvg(config))
  }
  if (config.siteLogoFileName && config.siteLogoBase64) {
    root.file(`public/${config.siteLogoFileName}`, config.siteLogoBase64, { base64: true })
  } else if (config.showSiteLogo) {
    root.file('public/site-logo.svg', generatedSiteLogoSvg(config))
  }
  if (config.faviconFileName && config.faviconBase64) {
    root.file(`public/${config.faviconFileName}`, config.faviconBase64, { base64: true })
  }
  root.file('index.md', homeMarkdown(config))
  config.pages.forEach((page) => root.file(`${page.slug}.md`, pageMarkdown(page)))
  root.file('package.json', generatedPackage(config))
  root.file('.gitignore', 'node_modules\n.vitepress/cache\n.vitepress/dist\n')
  root.file('README.md', readme(config))
  return zip
}

function themeIndex(config: SiteConfig) {
  const footerSocials = config.socialPlacement.footer
    ? config.socialLinks.map((item) => ({
      icon: item.icon,
      label: iconLabel(item.icon),
      link: item.url,
    }))
    : []
  const iconHelpers = footerSocials.length ? `
function customLinkSvg() {
  return ${quote(socialIconSvg('link'))}
}

function iconSvg(icon) {
  if (icon === 'link') return customLinkSvg()
  const iconData = simpleIcons[simpleIconExportName(icon)]
  if (!iconData) return ''
  return '<svg role="img" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="' + iconData.path + '"/></svg>'
}

function simpleIconExportName(slug) {
  return 'si' + slug.charAt(0).toUpperCase() + slug.slice(1)
}
` : `
function iconSvg() {
  return ''
}
`
  return `import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
${footerSocials.length ? `import * as simpleIcons from 'simple-icons'
` : ''}import './custom.css'

const footerLinks = ${JSON.stringify(config.footerLinks, null, 2)}
const footerSocials = ${JSON.stringify(footerSocials, null, 2)}
const headerLogo = ${JSON.stringify(config.showHeaderLogo ? {
    position: config.headerLogoPosition,
    src: `/${effectiveHeaderLogoFileName(config)}`,
    alt: `${config.title} header logo`,
  } : null, null, 2)}
const siteLogo = ${JSON.stringify(config.showSiteLogo ? {
    src: `/${effectiveSiteLogoFileName(config)}`,
    alt: `${config.title} site logo`,
    position: config.siteLogoPosition,
  } : null, null, 2)}
${iconHelpers}

function headerLogoNode(kind) {
  if (!headerLogo) return null
  if (headerLogo.position !== kind) return null
  const className = 'np-header-logo np-header-logo-' + kind
  return h('a', { class: className, href: '/' }, [
    h('img', { src: headerLogo.src, alt: headerLogo.alt })
  ])
}

function siteLogoNode() {
  if (!siteLogo) return null
  return h('a', { class: 'np-site-logo np-site-logo-' + siteLogo.position, href: '/' }, [
    h('img', { src: siteLogo.src, alt: siteLogo.alt })
  ])
}

function footerExtra() {
  if (!footerLinks.length && !footerSocials.length) return null
  return h('div', { class: 'np-footer-extra' }, [
    footerLinks.length
      ? h('nav', { class: 'np-footer-links', 'aria-label': 'Footer links' }, footerLinks.map((item) =>
          h('a', { href: item.link }, item.label)
        ))
      : null,
    footerSocials.length
      ? h('nav', { class: 'np-footer-socials', 'aria-label': 'Social links' }, footerSocials.map((item) =>
          h('a', { href: item.link, 'aria-label': item.label, innerHTML: iconSvg(item.icon) })
        ))
      : null
  ])
}

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => headerLogoNode('right'),
      'home-hero-info-before': () => siteLogoNode(),
      'layout-bottom': () => footerExtra()
    })
  }
}
`
}

function vitePressConfig(config: SiteConfig) {
  const imports = [`import { defineConfig } from 'vitepress'`]
  if (config.plugins.mermaid) imports.push(`import { withMermaid } from 'vitepress-plugin-mermaid'`)
  if (config.plugins.pwa) imports.push(`import { withPwa } from '@vite-pwa/vitepress'`)
  const themeConfig = [
    `nav: ${configArray(config.nav)}`,
    !config.plugins.autoSidebar ? `sidebar: ${sidebarConfig(config.sidebar)}` : '',
    config.socialPlacement.header ? `socialLinks: ${socialConfig(config.socialLinks)}` : '',
    footerConfig(config.footer),
    config.plugins.localSearch ? `search: { provider: 'local' }` : '',
    config.plugins.editLink && config.integrations.repoUrl ? `editLink: {
        pattern: ${quote(`${config.integrations.repoUrl}/edit/main/:path`)},
        text: 'Edit this page on GitHub'
      }` : '',
    !config.showHeaderTitle ? `siteTitle: false` : '',
    config.showHeaderLogo && config.headerLogoPosition === 'left' ? `logo: '/${effectiveHeaderLogoFileName(config)}'` : '',
  ].filter(Boolean).join(',\n      ')
  const head = headConfig(config)
  const body = `defineConfig({
  base: '/${config.slug}/',
  title: ${quote(config.title)},
  description: ${quote(config.description)},
  appearance: ${quote(appearanceValue(config.mode))},
  ${config.plugins.lastUpdated ? `lastUpdated: true,` : ''}
  cleanUrls: true,
  ${head ? `head: ${head},` : ''}
  ${config.plugins.sitemap ? `sitemap: {
    hostname: ${quote(config.integrations.siteUrl || 'https://example.com')}
  },` : ''}
  ${config.plugins.pwa ? `pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: ${quote(config.title)},
      short_name: ${quote(config.title.slice(0, 24))},
      description: ${quote(config.description)},
      theme_color: ${quote(config.accentColor)}
    }
  },` : ''}
  themeConfig: {
      ${themeConfig}
  }
})`
  const wrapped = [
    config.plugins.mermaid ? 'withMermaid' : '',
    config.plugins.pwa ? 'withPwa' : '',
  ].filter(Boolean).reduce((source, wrapper) => `${wrapper}(\n${indent(source, 2)}\n)`, body)
  return `${imports.join('\n')}\n\nexport default ${wrapped}\n`
}

function headConfig(config: SiteConfig) {
  const entries: string[] = []
  if (config.faviconFileName) {
    entries.push(`['link', { rel: 'icon', href: '/${config.slug}/${config.faviconFileName}' }]`)
  }
  if (config.plugins.openGraph) {
    const url = config.integrations.siteUrl || `https://example.com/${config.slug}`
    entries.push(`['meta', { property: 'og:title', content: ${quote(config.title)} }]`)
    entries.push(`['meta', { property: 'og:description', content: ${quote(config.description)} }]`)
    entries.push(`['meta', { property: 'og:type', content: 'website' }]`)
    entries.push(`['meta', { property: 'og:url', content: ${quote(url)} }]`)
    entries.push(`['meta', { name: 'twitter:card', content: ${config.integrations.ogImage ? "'summary_large_image'" : "'summary'"} }]`)
    if (config.integrations.ogImage) {
      entries.push(`['meta', { property: 'og:image', content: ${quote(config.integrations.ogImage)} }]`)
      entries.push(`['meta', { name: 'twitter:image', content: ${quote(config.integrations.ogImage)} }]`)
    }
  }
  const analytics = analyticsHeadEntries(config)
  entries.push(...analytics)
  return entries.length ? `[\n    ${entries.join(',\n    ')}\n  ]` : ''
}

function analyticsHeadEntries(config: SiteConfig) {
  const id = config.integrations.analyticsId
  if (!id || config.integrations.analyticsProvider === 'none') return []
  if (config.integrations.analyticsProvider === 'plausible') {
    return [`['script', { defer: '', 'data-domain': ${quote(id)}, src: 'https://plausible.io/js/script.js' }]`]
  }
  if (config.integrations.analyticsProvider === 'umami') {
    return [`['script', { defer: '', 'data-website-id': ${quote(id)}, src: 'https://analytics.umami.is/script.js' }]`]
  }
  if (config.integrations.analyticsProvider === 'goatcounter') {
    return [`['script', { async: '', 'data-goatcounter': ${quote(`https://${id}.goatcounter.com/count`)}, src: '//gc.zgo.at/count.js' }]`]
  }
  return [
    `['script', { async: '', src: ${quote(`https://www.googletagmanager.com/gtag/js?id=${id}`)} }]`,
    `['script', {}, ${quote(`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`)}]`,
  ]
}

function configArray(items: LinkItem[]) {
  return `[${items.map((item) => `{ text: ${quote(item.label)}, link: ${quote(item.link)} }`).join(', ')}]`
}

function sidebarConfig(sections: SidebarSection[]) {
  if (!sections.length) return `[]`
  return `[
${sections.map((section) => `    {
      text: ${quote(section.title)},
      items: ${configArray(section.items)}
    }`).join(',\n')}
  ]`
}

function socialConfig(items: SocialLink[]) {
  return `[${items.map((item) => {
    const icon = item.icon === 'link'
      ? `{ svg: ${quote(socialIconSvg('link'))} }`
      : quote(vitePressSocialIcon(item.icon))
    return `{ icon: ${icon}, link: ${quote(item.url)}, ariaLabel: ${quote(iconLabel(item.icon))} }`
  }).join(', ')}]`
}

function vitePressSocialIcon(icon: SocialIcon) {
  return icon
}

function simpleIconExportName(slug: string) {
  return `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`
}

function footerConfig(footer: SiteConfig['footer']) {
  if (!footer.message && !footer.copyright) return ''
  return `footer: {
        message: ${quote(footer.message)},
        copyright: ${quote(footer.copyright)}
      }`
}

function appearanceValue(mode: Mode) {
  if (mode === 'dark') return 'dark'
  if (mode === 'light') return false
  return true
}

function homeMarkdown(config: SiteConfig) {
  const features = config.features.length ? config.features : homeFeatures(config.stylePreset)
  const actions = config.heroActions.length ? config.heroActions : [
    { text: 'Get Started', link: config.pages[0] ? `/${config.pages[0].slug}` : '/', theme: 'brand' as const },
  ]
  return `---
layout: home

hero:
  name: ${quote(config.title)}
  text: ${quote(config.description)}
  tagline: Generated by NerdyPress
  actions:
${actions.map((action) => `    - theme: ${action.theme}
      text: ${quote(action.text)}
      link: ${quote(action.link)}`).join('\n')}
${features.length ? `features:
${features.map((feature) => `  - title: ${quote(feature.title)}\n    details: ${quote(feature.details)}${feature.link ? `\n    link: ${quote(feature.link)}` : ''}`).join('\n')}` : ''}
---
`
}

function homeFeatures(preset: StylePreset): FeatureItem[] {
  if (preset === 'minimal') return []
  if (preset === 'product') {
    return [
      { title: 'Ship faster', details: 'Give users a polished docs entry point from day one.', link: '' },
      { title: 'Guide adoption', details: 'Use strong actions and proof cards for product education.', link: '' },
      { title: 'Deploy cleanly', details: 'GitHub Pages workflow included.', link: '' },
    ]
  }
  if (preset === 'editorial' || preset === 'magazine') {
    return [
      { title: 'Readable chapters', details: 'A calmer structure for essays, handbooks, and deep guides.', link: '' },
      { title: 'Curated navigation', details: 'Keep long-form docs easy to scan and revisit.', link: '' },
      { title: 'Custom voice', details: 'Fonts, footer, and theme palette reinforce the publication style.', link: '' },
    ]
  }
  if (preset === 'api' || preset === 'compact') {
    return [
      { title: 'Reference-first', details: 'Dense sections make endpoints, options, and APIs easy to scan.', link: '' },
      { title: 'Fast lookup', details: 'Tighter spacing and clear hierarchy for repeat visits.', link: '' },
      { title: 'Practical examples', details: 'Code and docs styling are tuned for technical readers.', link: '' },
    ]
  }
  if (preset === 'handbook') {
    return [
      { title: 'Team knowledge', details: 'A calmer layout for policies, runbooks, and onboarding.', link: '' },
      { title: 'Organized sections', details: 'Sidebar-first structure keeps broad manuals navigable.', link: '' },
      { title: 'Readable defaults', details: 'Comfortable type and spacing for longer internal pages.', link: '' },
    ]
  }
  if (preset === 'showcase') {
    return [
      { title: 'Tell the story', details: 'Bigger cards and contrast for product-facing docs.', link: '' },
      { title: 'Guide conversion', details: 'Hero and features make next steps obvious.', link: '' },
      { title: 'Polished launch', details: 'The generated theme feels public-site ready.', link: '' },
    ]
  }
  if (preset === 'retro') {
    return [
      { title: 'README energy', details: 'Hard edges and mono-forward styling for utility projects.', link: '' },
      { title: 'Low ceremony', details: 'Simple blocks make the content feel direct and durable.', link: '' },
      { title: 'CLI friendly', details: 'Pairs nicely with command references and changelogs.', link: '' },
    ]
  }
  return [
    { title: 'Fast setup', details: 'Start with a complete VitePress project structure.', link: '' },
    { title: 'Ready to deploy', details: 'GitHub Pages workflow included.', link: '' },
    { title: 'Designed theme', details: 'Accent color and preset styles wired into CSS variables.', link: '' },
  ]
}

function pageMarkdown(page: PageItem) {
  const frontmatter = `---
title: ${quote(page.title)}
${page.description ? `description: ${quote(page.description)}\n` : ''}---

`
  const content = page.content.startsWith('#') ? page.content : `# ${page.title}\n\n${page.content}\n`
  return `${frontmatter}${content}`
}

function generatedPackage(config: SiteConfig) {
  const devDependencies: Record<string, string> = {
    vitepress: '^1.6.4',
  }
  if (config.plugins.mermaid) {
    devDependencies.mermaid = '^11.12.0'
    devDependencies['vitepress-plugin-mermaid'] = '^2.0.17'
  }
  if (config.plugins.pwa) {
    devDependencies['@vite-pwa/vitepress'] = '^1.1.0'
  }
  if (config.socialPlacement.footer && config.socialLinks.length) {
    devDependencies['simple-icons'] = '^16.25.0'
  }
  return `${JSON.stringify({
    name: config.slug,
    private: true,
    type: 'module',
    scripts: {
      'docs:dev': 'vitepress dev .',
      'docs:build': 'vitepress build .',
      'docs:preview': 'vitepress preview .',
    },
    devDependencies,
  }, null, 2)}\n`
}

function customCss(config: SiteConfig) {
  const colors = brandScale(config.accentColor)
  const fonts = getFontPairing(config.fontPairing)
  const palette = themeTokens(config.themePalette, config.accentColor)
  const presetCss = presetThemeCss(config.stylePreset, colors)
  const footerJustify = config.footer.alignment === 'left' ? 'flex-start' : 'center'
  const componentCss = componentThemeCss(config)
  return `:root {
  --vp-c-brand-1: ${colors.base};
  --vp-c-brand-2: ${colors.light};
  --vp-c-brand-3: ${colors.dark};
  --vp-c-brand-soft: ${colors.soft};
  --vp-button-brand-bg: ${colors.base};
  --vp-button-brand-hover-bg: ${colors.dark};
  --vp-button-brand-active-bg: ${colors.deep};
  --vp-button-brand-border: ${colors.base};
  --vp-button-brand-hover-border: ${colors.dark};
  --vp-home-hero-name-color: ${colors.base};
  --vp-home-hero-image-background-image: linear-gradient(135deg, ${colors.soft}, transparent 64%);
  --vp-home-hero-image-filter: blur(42px);
  --vp-font-family-base: ${fonts.body};
  --vp-font-family-mono: ${fonts.heading};
}

:root:not(.dark) {
  --vp-c-bg: ${palette.bg};
  --vp-c-bg-alt: ${palette.alt};
  --vp-c-bg-soft: ${palette.soft};
  --vp-c-divider: rgba(33, 33, 33, .13);
  --vp-c-text-1: #202020;
  --vp-c-text-2: #5e6470;
}

.dark {
  --vp-c-bg: #121212;
  --vp-c-bg-alt: #181818;
  --vp-c-bg-soft: #202020;
  --vp-c-divider: rgba(255, 255, 255, .12);
  --vp-c-text-1: #f0f0f0;
  --vp-c-text-2: #b4b4b4;
  --vp-code-block-bg: #171717;
}

.VPNavBar.has-sidebar .content,
.VPNavBar:not(.has-sidebar) {
  border-bottom-color: var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  backdrop-filter: blur(14px);
}

.VPNavBarTitle .title {
  font-family: ${fonts.heading};
  letter-spacing: 0;
}

.VPHomeHero .name,
.VPHomeHero .text,
.VPDoc h1,
.VPDoc h2 {
  font-family: ${fonts.heading};
}

.VPButton.brand {
  box-shadow: 0 8px 24px ${colors.shadow};
}

.VPFeature {
  border-radius: 8px;
  border-color: var(--vp-c-divider);
  background: linear-gradient(180deg, var(--vp-c-bg-soft), var(--vp-c-bg));
}

.VPFooter {
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  text-align: ${config.footer.alignment};
}

.np-footer-extra {
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  display: flex;
  justify-content: ${footerJustify};
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
  padding: 18px 24px;
}

.np-footer-links,
.np-footer-socials {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
}

.np-footer-links a {
  color: var(--vp-c-text-2);
  font-size: 13px;
  text-decoration: none;
}

.np-footer-links a:hover {
  color: var(--vp-c-brand-1);
}

.np-footer-socials a {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  text-decoration: none;
}

.np-footer-socials a:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.np-footer-socials svg {
  width: 15px;
  height: 15px;
}

.np-header-logo {
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
}

.np-header-logo img {
  display: block;
  object-fit: contain;
}

.np-header-logo-right {
  width: 32px;
  height: 32px;
  margin-left: 12px;
}

.np-header-logo-right img {
  width: 32px;
  height: 32px;
}

.VPHomeHero .main {
  position: relative;
}

.np-site-logo {
  width: min(340px, calc(100% - 48px));
  height: 96px;
  margin: 0 0 14px;
  display: grid;
  place-items: center start;
}

.np-site-logo img {
  width: 100%;
  height: auto;
  max-height: 90px;
  object-position: left center;
}

.np-site-logo-left-title,
.np-site-logo-right-title {
  position: absolute;
  top: 86px;
  width: min(180px, 22vw);
  height: 72px;
}

.np-site-logo-left-title {
  right: calc(100% + 18px);
}

.np-site-logo-right-title {
  left: min(760px, 100%);
  margin-left: 18px;
}

.np-site-logo-between-kicker-title {
  margin-top: 14px;
}

.np-site-logo-below-title {
  margin-top: 14px;
}

.VPSidebarItem.is-active > .item .link > .text,
.VPNavBarMenuLink.active {
  color: var(--vp-c-brand-1);
}

.VPDoc a {
  text-decoration-color: ${colors.soft};
  text-underline-offset: 3px;
}

${presetCss}
${componentCss}
`
}

function componentThemeCss(config: SiteConfig) {
  const buttonRadius = config.buttons.shape === 'pill' ? '999px' : config.buttons.shape === 'rounded' ? '8px' : '0'
  const buttonPadding = config.buttons.size === 'compact' ? '0 13px' : config.buttons.size === 'large' ? '0 22px' : '0 18px'
  const buttonHeight = config.buttons.size === 'compact' ? '34px' : config.buttons.size === 'large' ? '46px' : '40px'
  const cardRadius = config.cards.radius === 'square' ? '0' : config.cards.radius === 'rounded' ? '16px' : '8px'
  const cardPadding = config.cards.density === 'compact' ? '16px' : config.cards.density === 'spacious' ? '28px' : '22px'
  const cardMinHeight = config.cards.density === 'compact' ? '96px' : config.cards.density === 'spacious' ? '156px' : '120px'
  const cardSurface = {
    plain: 'transparent',
    bordered: 'linear-gradient(180deg, var(--vp-c-bg-soft), var(--vp-c-bg))',
    filled: 'var(--vp-c-brand-soft)',
    elevated: 'linear-gradient(180deg, var(--vp-c-bg-soft), var(--vp-c-bg))',
  }[config.cards.style]
  const cardShadow = config.cards.style === 'elevated' ? '0 20px 48px rgba(0,0,0,.12)' : 'none'
  const cardBorder = config.cards.style === 'plain' ? 'transparent' : 'var(--vp-c-divider)'
  const brandButton = config.buttons.fill === 'outline'
    ? `background: transparent; color: var(--vp-c-brand-1);`
    : config.buttons.fill === 'soft'
      ? `background: var(--vp-c-brand-soft); color: var(--vp-c-brand-3); border-color: transparent;`
      : config.buttons.fill === 'ghost'
        ? `background: transparent; color: var(--vp-c-brand-1); border-color: transparent;`
        : ``
  return `.VPButton {
  border-radius: ${buttonRadius};
  min-height: ${buttonHeight};
  padding: ${buttonPadding};
}

.VPButton.brand {
  ${brandButton}
  box-shadow: ${config.buttons.shadow ? '0 10px 24px var(--vp-c-brand-soft)' : 'none'};
}

.VPFeature {
  border-radius: ${cardRadius};
  padding: ${cardPadding};
  min-height: ${cardMinHeight};
  background: ${cardSurface};
  border-color: ${cardBorder};
  box-shadow: ${cardShadow};
  ${config.cards.accentBar ? 'border-top: 3px solid var(--vp-c-brand-1);' : ''}
}
`
}

function presetThemeCss(preset: StylePreset, colors: ReturnType<typeof brandScale>) {
  if (preset === 'minimal') {
    return `.VPHomeFeatures { display: none; }
.VPHomeHero .container { padding-top: 88px; padding-bottom: 64px; }
.VPHomeHero .main { max-width: 720px; }
.VPHomeHero .name,
.VPHomeHero .text { max-width: 700px; }
.VPHomeHero .tagline { max-width: 620px; font-size: 19px; line-height: 1.7; }
.VPDoc .container { max-width: 820px; }
.VPDoc .content { padding-bottom: 96px; }
.VPDoc h2 { border-top: 0; margin-top: 38px; }
`
  }
  if (preset === 'terminal') {
    return `:root:not(.dark) {
  --vp-c-bg: #151515;
  --vp-c-bg-alt: #111111;
  --vp-c-bg-soft: #1f1f1f;
  --vp-c-text-1: #f2f2f2;
  --vp-c-text-2: #b8c1ba;
  --vp-code-block-bg: #101010;
}

.VPHomeHero .main {
  border: 1px solid ${colors.soft};
  background: linear-gradient(180deg, var(--vp-code-block-bg), var(--vp-c-bg-soft));
  padding: 32px;
  border-radius: 8px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.05), 0 18px 50px rgba(0,0,0,.26);
}

.VPHomeHero .name::before {
  content: "$ ";
  color: var(--vp-c-brand-1);
}

.VPHomeHero .text {
  color: #f4f4f4;
}

.VPFeature,
.VPDoc div[class*="language-"] {
  border-radius: 4px;
  border-color: ${colors.soft};
  background: #101010;
}

.VPFeature::before {
  content: "";
  display: block;
  width: 36px;
  height: 3px;
  margin-bottom: 14px;
  background: var(--vp-c-brand-1);
}
`
  }
  if (preset === 'product') {
    return `.VPHomeHero .container { padding-top: 112px; padding-bottom: 72px; }
.VPHomeHero .main { max-width: 900px; }
.VPHomeHero .name,
.VPHomeHero .text { max-width: 860px; }
.VPHomeHero .text { font-size: 54px; line-height: 1; }
.VPHomeFeatures .items { gap: 18px; }
.VPFeature {
  border-top: 3px solid var(--vp-c-brand-1);
  box-shadow: 0 18px 45px rgba(0,0,0,.08);
}
.VPButton { border-radius: 8px; }
`
  }
  if (preset === 'showcase') {
    return `.VPHomeHero .container { padding-top: 124px; padding-bottom: 86px; }
.VPHomeHero .main { max-width: 980px; }
.VPHomeHero .text { font-size: 60px; line-height: .98; }
.VPFeature {
  min-height: 190px;
  border-bottom: 4px solid var(--vp-c-brand-1);
  box-shadow: 0 22px 60px rgba(0,0,0,.1);
}
.VPButton.brand { transform: translateY(-1px); }
`
  }
  if (preset === 'api') {
    return `.VPHomeHero .container { padding-top: 72px; padding-bottom: 36px; }
.VPHomeHero .text { font-size: 42px; }
.VPHomeFeatures .items { gap: 10px; }
.VPFeature { min-height: 112px; border-radius: 4px; }
.VPDoc .content { font-size: 15px; }
.VPDoc div[class*="language-"] { border-radius: 4px; }
`
  }
  if (preset === 'compact') {
    return `.VPHomeHero .container { padding-top: 56px; padding-bottom: 30px; }
.VPHomeHero .text { font-size: 38px; }
.VPHomeHero .tagline { font-size: 16px; }
.VPHomeFeatures .items { gap: 8px; }
.VPFeature { padding: 16px; min-height: 96px; border-radius: 4px; }
.VPDoc .content { font-size: 15px; line-height: 1.65; }
`
  }
  if (preset === 'handbook') {
    return `.VPHomeHero .container { padding-top: 80px; padding-bottom: 52px; }
.VPHomeHero .main { max-width: 760px; }
.VPHomeHero .text { font-size: 46px; line-height: 1.08; }
.VPFeature { box-shadow: none; background: var(--vp-c-bg-soft); }
.VPDoc .content { line-height: 1.78; }
`
  }
  if (preset === 'retro') {
    return `.VPHomeHero .main {
  border: 2px solid var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  padding: 28px;
  box-shadow: 8px 8px 0 var(--vp-c-brand-1);
}
.VPHomeHero .name::before { content: "# "; color: var(--vp-c-brand-1); }
.VPButton, .VPFeature, .VPDoc div[class*="language-"] { border-radius: 0; }
.VPFeature { border: 2px solid var(--vp-c-text-1); box-shadow: 5px 5px 0 ${colors.soft}; }
`
  }
  if (preset === 'editorial' || preset === 'magazine') {
    return `.VPHomeHero .container { padding-top: 84px; padding-bottom: 48px; }
.VPHomeHero .main { max-width: 760px; }
.VPHomeHero .name { font-size: 20px; text-transform: uppercase; letter-spacing: .08em; }
.VPHomeHero .text { font-size: 48px; line-height: 1.08; }
.VPHomeHero .tagline { font-size: 20px; line-height: 1.75; }
.VPFeature {
  border-left: 3px solid var(--vp-c-brand-1);
  box-shadow: none;
}
.VPDoc .content { font-size: 17px; line-height: 1.8; }
.VPDoc h2 { border-top: 0; }
${preset === 'magazine' ? `.VPHomeFeatures .items { grid-template-columns: 1.3fr .85fr .85fr; }
.VPFeature:first-child { min-height: 210px; }
` : ''}
`
  }
  return `.VPHomeHero .container { padding-top: 96px; }
.VPHomeHero .main { max-width: 820px; }
.VPHomeFeatures .container {
  max-width: 1120px;
}
.VPFeature {
  box-shadow: 0 12px 38px rgba(0,0,0,.06);
}
`
}

function themeTokens(palette: ThemePalette, accent: string) {
  const tokens: Record<string, { bg: string; alt: string; soft: string }> = {
    nerdy: { bg: '#fbfbfb', alt: '#f2f2f2', soft: '#f6f6f6' },
    ocean: { bg: '#f8fbff', alt: '#eef6ff', soft: '#f3f8ff' },
    forest: { bg: '#f8fdf9', alt: '#effaf5', soft: '#f2fbf7' },
    violet: { bg: '#fbfaff', alt: '#f5f1ff', soft: '#f8f5ff' },
    amber: { bg: '#fffaf4', alt: '#fff3e5', soft: '#fff7ed' },
    rose: { bg: '#fff8fa', alt: '#fff1f4', soft: '#fff5f7' },
    graphite: { bg: '#fafafa', alt: '#f4f4f5', soft: '#f7f7f8' },
    mint: { bg: '#f7fffb', alt: '#ecfdf8', soft: '#f2fff9' },
    sky: { bg: '#f8fcff', alt: '#f0f9ff', soft: '#f5fbff' },
    indigo: { bg: '#fafaff', alt: '#eef2ff', soft: '#f5f7ff' },
    lime: { bg: '#fcfff6', alt: '#f7fee7', soft: '#fbfff0' },
    coral: { bg: '#fffaf7', alt: '#fff4ed', soft: '#fff8f3' },
    mono: { bg: '#ffffff', alt: '#f3f4f6', soft: '#f9fafb' },
    night: { bg: '#111827', alt: '#0f172a', soft: '#1f2937' },
    custom: { bg: '#fbfbfb', alt: colorMixWhite(accent, 0.92), soft: colorMixWhite(accent, 0.96) },
  }
  return tokens[palette] || tokens.custom
}

function colorMixWhite(hex: string, amount: number) {
  const rgb = hexToRgb(hex)
  return rgbToHex(mix(rgb, { r: 255, g: 255, b: 255 }, amount))
}

function brandScale(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  return {
    base: hex,
    light: rgbToHex(mix({ r, g, b }, { r: 255, g: 255, b: 255 }, 0.22)),
    dark: rgbToHex(mix({ r, g, b }, { r: 0, g: 0, b: 0 }, 0.22)),
    deep: rgbToHex(mix({ r, g, b }, { r: 0, g: 0, b: 0 }, 0.38)),
    soft: `rgba(${r}, ${g}, ${b}, .14)`,
    shadow: `rgba(${r}, ${g}, ${b}, .22)`,
  }
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '')
  const value = Number.parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16)
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 }
}

function mix(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }, amount: number) {
  return {
    r: Math.round(a.r + (b.r - a.r) * amount),
    g: Math.round(a.g + (b.g - a.g) * amount),
    b: Math.round(a.b + (b.b - a.b) * amount),
  }
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b].map((part) => part.toString(16).padStart(2, '0')).join('')}`
}

function deploymentFiles(config: SiteConfig) {
  if (config.integrations.deploymentTarget === 'netlify') {
    return [{
      path: 'netlify.toml',
      content: `[build]
  command = "npm run docs:build"
  publish = ".vitepress/dist"
`,
    }]
  }
  if (config.integrations.deploymentTarget === 'vercel') {
    return [{
      path: 'vercel.json',
      content: `${JSON.stringify({
        buildCommand: 'npm run docs:build',
        outputDirectory: '.vitepress/dist',
        installCommand: 'npm ci',
      }, null, 2)}\n`,
    }]
  }
  if (config.integrations.deploymentTarget === 'cloudflare-pages') {
    return [{
      path: 'CLOUDFLARE_PAGES.md',
      content: `# Cloudflare Pages

Use these settings when creating the Cloudflare Pages project:

- Framework preset: None
- Build command: \`npm run docs:build\`
- Build output directory: \`.vitepress/dist\`
- Root directory: \`/\`
- Node version: 22
`,
    }]
  }
  return [{ path: '.github/workflows/deploy.yml', content: deployWorkflow() }]
}

function robotsTxt(config: SiteConfig) {
  const siteUrl = (config.integrations.siteUrl || `https://example.com/${config.slug}`).replace(/\/$/, '')
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`
}

function deployWorkflow() {
  return `name: Deploy VitePress site to Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run docs:build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .vitepress/dist

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`
}

function readme(config: SiteConfig) {
  return `# ${config.title}

This VitePress site was generated by NerdyPress.

## Local development

\`\`\`sh
cd ${config.slug}
npm install
npm run docs:dev
\`\`\`

Push to GitHub with Pages set to GitHub Actions to deploy with the included workflow.
`
}

function iconLabel(icon: SocialIcon) {
  return icon === 'x' ? 'Twitter/X' : icon.charAt(0).toUpperCase() + icon.slice(1)
}

renderApp()
