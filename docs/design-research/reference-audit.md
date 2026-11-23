# TokenHub reference audit and proposed design

Research date: 2026-11-22. Sources are public HTML, CSS and JavaScript retrieved directly from the official hosts. This is a source inspection, not a completed visual/browser audit.

## Evidence and limits

- ZenMux homepage: https://zenmux.ai/
- Model catalog: https://zenmux.ai/models
- Public analytics: https://zenmux.ai/analytics
- Pricing documentation: https://zenmux.ai/docs/guide/observability/pricing.html
- ZenMux stylesheet: https://cdn.marmot-cloud.com/page/tbox-router-home/umi.b3e1e931.css
- DTMaaS homepage: https://maas.antdigital.com/
- DTMaaS stylesheet: https://edge.zkobjects.com/page/dt-maas-online/umi.d996856a.css
- DTMaaS application bundle: https://edge.zkobjects.com/page/dt-maas-online/umi.ad20fbb5.js

Browser access failed with “The browser access host is unavailable”. Screenshots, computed styles, hover/focus appearance, runtime transitions, mobile rendering and authenticated console screens are unverified. Bundles include shared, legacy and mock code; their presence does not prove that a given screen is currently rendered. Color/radius counts are discovery aids, not authoritative component specifications. No claim of exhaustive site coverage is made.

## ZenMux observations

The homepage has an announcement band, grouped navigation, a large product statement, two primary entry paths, developer command/API content, platform metrics, provider integrations, a sequence of benefit sections, editorial content, testimonials, a final conversion area and a multi-column footer. The catalog exposes a sidebar of modality, context, provider, parameter, protocol and reasoning filters; a search field, sorting, category navigation and model entries with metadata. Analytics separates totals, usage/cost, ranking, market share, trends and performance with time-granularity controls. Runtime data was not verified.

Confirmed semantic CSS variables:

| Role | Light | Dark |
| --- | --- | --- |
| Primary background | #ffffffe6 | #1a1a1a |
| Secondary background | #f2f2f2 | #262626 |
| Elevated background | #fff | #333 |
| Main text | #333 | #ffffffe6 |
| Secondary text | #666 | #fff9 |
| Tertiary text | #858585 | #ffffff4d |
| Primary border | #e6e6e6 | #333 |
| Interactive hover | #f2f2f2 | #333 |
| Interactive active | #e6e6e6 | #404040 |

Font resources include PT Sans regular/bold, DIN Condensed bold and Noto Serif Display. CSS also contains Instrument Serif and native system/monospace stacks. These indicate multiple typographic contexts, not one uniform font across the entire site. Frequently declared corner radii include 8, 4, 16, 24, 6 and 12px. Explicit media queries include 520, 560, 768, 1024, 1280, 1536px and reduced-motion handling. Common transitions are 160–200ms for background, opacity, color and transform; some 300ms transitions also exist. Actual runtime behavior remains unverified.

Design implications: neutral semantic surfaces, prominent content hierarchy, readable technical metadata, compact controls, provider/model discovery patterns, separate brand/display and data typography. The promotional palette and insurance/business claims belong to ZenMux and are not TokenHub requirements.

## DTMaaS observations

The homepage is client rendered; the text extractor returned no readable content. Application sources contain navigation labels for model experience, model market, Token Plan, documentation, about, login and console. Declared route families include model list/detail/compare, text/image/video experiences, pricing, docs and console usage, costs, plans, call logs, workspace management and API keys. Route declarations do not prove unauthenticated availability.

Brand blue #2D4FFF and its lowercase equivalent appear repeatedly in CSS; darker blue #2244DD also appears. White, slate/gray surfaces and translucent borders accompany the blue. Font families include Geist Variable, Geist Mono, Inter, PingFang SC, Alibaba Sans and Alibaba PuHuiTi. CSS includes theme variables and source labels for a light/dark homepage switch. The stylesheet contains 16, 20, 24 and 28px corners along with smaller input/control corners and radius variables. Breakpoints include 640, 768, 1053, 1180 and 1296px plus standard Tailwind breakpoints. Reduced-motion rules are present.

Source-defined interactions include search/filter controls, loading/empty/error messages, copy success/failure messages, date ranges, export tasks, pagination, detail drawers and workspace selection. These are evidence of intended state handling, not screenshots of the live console. Some bundle data explicitly identifies mocks; no prices, model availability, SLA or customer counts are adopted from this source.

Design implications: clear blue action hierarchy, Chinese-friendly typography, model metadata cards, unified visual language for marketing and application UI, and explicit status/empty/error states.

## Three proposed directions

These are TokenHub design proposals, not extracted official specifications.

### A — Enterprise clarity (recommended)

White/light-gray canvas, ink text, blue #2D4FFF primary actions, restrained borders, 12px component corners and 20px showcase panels. Use DTMaaS's clear action hierarchy and ZenMux's neutral surfaces and technical information structure. Best fit for a reusable enterprise model gateway design system.

### B — Editorial neutrality

Warm white, charcoal primary actions, serif English display accents, restrained warm highlights and thin dividers. Stronger brand/editorial character; less conventional for a Chinese enterprise console.

### C — Dark infrastructure

Graphite canvas, cool blue focus/actions, subtle grid detail, higher-contrast data panels and monospace technical labels. Strong developer atmosphere; requires more careful contrast work and can make dense administration screens heavier.

## Proposed implementation contract after direction selection

Use src/design-system as the source root. Preserve the exact required components/, tokens/ and hooks/ folders and barrel exports. Additional foundational tokens may live in a separate foundations.js, and theme CSS in styles.css; do not add styles to src/index.css, whose one-line Tailwind import remains intact.

Tokens: primitive and semantic color roles, light/dark mappings, 4px base spacing scale, display/heading/body/caption/code typography, radii, borders, shadows, motion and breakpoints. JavaScript token values are the source of truth; a theme boundary maps the same values to CSS custom properties so tokens and runtime styles cannot drift independently.

Button: primary/secondary/ghost/danger, sm/md/lg, optional icon, loading and disabled. Native button semantics, ref forwarding, explicit focus-visible ring and reduced-motion support. Loading blocks duplicate activation and exposes aria-busy.

Input: visible label, description, leading/trailing content, disabled, invalid and error text. Associate labels and descriptions with stable IDs; use native input semantics and forward refs.

Card: default/subtle/elevated variants, consistent padding and optional header/footer composition. Keep generic surfaces noninteractive; use explicit buttons/links for actions rather than making every card clickable.

useMediaQuery: configurable query, matchMedia change subscription and cleanup, browser/SSR-safe initialization. Preview demonstrates responsive changes and reduced-motion handling.

Preview architecture: src/pages/DesignSystemPreview.jsx composes dedicated preview sections; preview data and presentation helpers live outside App.jsx. Use Chinese explanatory labels and English technical tokens. Sections: overview, colors, typography, spacing/radii, buttons and states, inputs and states, cards, a small illustrative model-gateway composition, and responsive/motion/accessibility notes. Every business metric/model offering shown is clearly marked as sample data. Theme and preview controls must work, with keyboard access and feedback for copy actions.

App.jsx acceptance target:

```jsx
import DesignSystemPreview from './pages/DesignSystemPreview'

export default function App() {
  return <DesignSystemPreview />
}
```

Validation: production build and lint; focused checks for interactive states, label associations, loading/disabled behavior, responsive hook cleanup and token/theme consistency. Visual verification at desktop and mobile sizes remains required when a browser becomes available. Do not report browser QA as passed without evidence.
