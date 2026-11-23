# Velink Design System Implementation Plan

**Goal:** Implement approved direction A and an interactive component gallery with a minimal App.jsx.
**Architecture:** src/design-system owns semantic tokens, theme scope, reusable primitives and the responsive hook. src/pages owns showcase-only data, sections and styles. Token values are mapped to CSS custom properties by ThemeProvider.
**Tech stack:** React, Tailwind v4, tailwind-variants, clsx, lucide-react, framer-motion.

1. Create focused behavior tests for loading buttons, labeled invalid inputs and media-query subscription cleanup. Run to establish missing behavior.
2. Implement colors.js, spacing.js, typography.js, foundations.js and barrel exports. Implement ThemeProvider and styles.css without changing the one-line src/index.css.
3. Implement Button, Input and Card with native semantics and hook useMediaQuery using useSyncExternalStore. Run behavior tests.
4. Compose DesignSystemPreview from Overview, Foundations, ComponentGallery and GatewayExample with separate data/styles. Include theme switch, section navigation, copy feedback and demo form state; annotate all gateway metrics as samples.
5. Replace App.jsx with a single imported page. Set document title and write component usage documentation.
6. Run npm test, npm run build and npm run lint. Check the served application where a browser is available; state any visual verification limitation explicitly.

No git repository exists in the current directory, so no commits or worktree are created.
