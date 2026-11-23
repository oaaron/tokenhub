# TokenHub Design System

Direction A: neutral white/gray surfaces, clear blue actions, fine borders and restrained corners. Reference findings and inspection limits are documented in `docs/design-research/reference-audit.md`.

## Usage

```jsx
import { ThemeProvider, Button, Input, Card, colors, spacing } from '@/design-system'

export default function Example() {
  return (
    <ThemeProvider theme="light">
      <Card>
        <Input label="密钥名称" hint="请输入容易识别的名称" />
        <Button variant="primary">保存</Button>
      </Card>
    </ThemeProvider>
  )
}
```

`ThemeProvider` applies the semantic color, spacing, typography, radius, shadow and motion tokens as scoped CSS variables. Components must be rendered inside a provider. It does not require a global document theme or change the one-line Tailwind v4 entry stylesheet. Theme preference persistence belongs to the preview page, not the generic provider.

- Button: `variant` primary/secondary/ghost/danger; `size` sm/md/lg; `icon` lucide component; `loading`, `disabled`; forwards native props/ref. Native button type defaults to `button`. Loading disables activation and exposes `aria-busy`. Icon-only buttons require an `aria-label`.
- Input: native input props/ref plus `label`, `hint`, `error`, `icon` and `trailing`. Automatically links labels and descriptions. Supply a label or `aria-label`. This primitive does not render select/textarea controls.
- Card: default/subtle/elevated surfaces. `CardHeader` and `CardFooter` are exported for composition. Cards do not imply clickable semantics.
- useMediaQuery: subscribes to `window.matchMedia` change events and removes subscriptions on unmount/query change. SSR snapshot is false.
- Tokens: `colors`, `palette`, `spacing`, `typography`, `radii`, `shadows`, `motion`, `breakpoints`. Components use CSS variables generated from these values. Custom showcase layouts use additional page-only styling.

Keyboard focus indicators and reduced-motion rules are included. English fonts use local system fallbacks; no remote font download is required. Treat visual accessibility as subject to continued testing, not as an accessibility certification.

## Preview

`src/pages/DesignSystemPreview.jsx` composes the gallery from focused section modules. `src/App.jsx` only imports and renders this page. The preview includes theme persistence, copy feedback, component-state controls, sample-model search and validated local configuration creation. Demo data is not a real API, provider offer, price or service commitment.

## Validation

- `npm test`: component semantics, media change cleanup, theme persistence, filtering/empty-state reset and local form validation.
- `npm run build`: production bundling.
- `npm run lint`: project lint checks.
- `npm run dev`: local preview.

Desktop first-screen rendering was visually inspected in native Chrome. Mobile CSS rules are implemented, but mobile viewport and dark-theme screenshots have not been visually verified. Reference-site browser inspection remains incomplete; the earlier audit describes source evidence, not a pixel-perfect reproduction.
