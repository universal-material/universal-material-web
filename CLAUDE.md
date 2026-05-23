# CLAUDE.md — Universal Material Web

A Material Design 3 web-components library, built with [Lit](https://lit.dev/). Components are written in TypeScript, styles in SCSS, and the project ships a public docs site (Angular) under `docs/`.

## Cardinal rule

> **Everything must be visually evaluated and be pixel perfect.**

Components are not done when the build passes or the diagnostic prints look right. They are done when the rendered output matches the Material 3 spec to the pixel and is exercised in a real browser. Always open the **docs site** (`npm run docs`, served at `http://localhost:4200`) and verify:
- dimensions match the M3 tokens (1dp = 1px on the web, no rounding),
- colors come from `sys.color.*` tokens (never hardcoded),
- spacing, typography, shape and elevation are correct,
- behaviour (scroll, focus, ripple, hover, transitions) actually works in the browser.

If a measurement comes back slightly off (e.g. `0.667px` letter-spacing when the spec says `0.5px`), **fix it** — don't shrug it off as "close enough".

## Mandatory: read the M3 spec before any component work

Before creating, modifying, or auditing a component, **read its Material 3 spec page first** at `https://m3.material.io/components/<component-name>/specs`. The spec page is the ground truth — token files alone aren't enough because some details (anatomy slots, contextual behaviors like "active label color differs between vertical and horizontal variants", FAB/menu positioning, expanded vs collapsed layouts) live in the prose and diagrams, not in the token names.

How to read it:
- The page is JS-rendered, so `curl`/`WebFetch` returns almost nothing — open it in the connected Chrome browser (e.g. `mcp__Claude_in_Chrome__navigate` + `get_page_text`) instead.
- Capture the **Anatomy** section (which slots/parts the component supports).
- Capture every dimension, color role and typography token listed under **Tokens & specs**, **Color**, **Measurements**, **States** and **Configurations** — including any "X (variantA), Y (variantB)" notes that signal context-dependent values.
- Then fetch the matching SCSS token files under [`tokens/versions/latest/sass/`](https://github.com/material-components/material-web/tree/main/tokens/versions/latest/sass) to get the exact numeric values. For multi-file components (rail, drawer, etc.) fetch every related file — e.g. `_md-comp-nav-rail.scss`, `_md-comp-nav-rail-collapsed.scss`, `_md-comp-nav-rail-expanded.scss`, `_md-comp-nav-rail-item.scss`, `_md-comp-nav-rail-item-vertical.scss`, `_md-comp-nav-rail-item-horizontal.scss`.
- Cross-check against the spec page: if the page says "active label color is `secondary` (vertical) / `on-secondary-container` (horizontal)" and you only see one token in the SCSS file, the variant overrides live in the variant-specific token files. Apply both.

Skipping the spec page and using only the token files leads to drawer-style implementations of rail components, missing variant-specific colors, and other subtle but visible deviations.

## Commit messages

Write commit messages **in English**, even when chatting in Portuguese. Use imperative mood ("Add navigation bar item variants", not "Added" or "Adds"), reference the affected component/area, and keep the subject under ~70 chars. The body, when needed, explains *why* — not what (the diff already shows the what).

## Versioning

The **major** version tracks the Material Design spec major (M3 → `3.x`, M4 → `4.x`). Breaking changes *inside the library* — renames, removed exports, changed defaults — bump the **minor** (e.g. `3.9.0` → `3.10.0`), not the major. The major only moves when Material publishes a new generation.

---

## Repo layout

```
src/                     # library source (TS + co-located SCSS)
  <component>/
    <component>.ts       # the LitElement class, @customElement('u-...')
    <component>.styles.scss   # SCSS source
    <component>.styles.ts     # generated from .scss via gulp — DO NOT hand-edit (it gets regenerated)
  index.ts               # registers and re-exports every component
  config.ts              # runtime defaults (e.g. dialog button defaults)
  shared/                # base classes (ButtonWrapper, FieldBase, …)
scss/                    # global SCSS: tokens, mixins, functions, utilities
dist/                    # tsc output + esbuild bundle (gitignored)
docs/                    # Angular docs app, served at http://localhost:4200
  src/app/components/<name>/
    <name>.component.{ts,html,scss}
    examples/*.html      # text imports used by docs-example to show code AND render
  src/app/apis.ts        # generated from JSDoc by `gulp docs:apis` (gitignored)
skills/                  # Claude Code skills shipped with the npm package
  <skill-name>/SKILL.md  # one folder per skill, with the markdown body + frontmatter
.claude-plugin/          # plugin manifest that exposes the skills/ directory
  plugin.json
.claude/launch.json      # preview server config (docs at 4200)
```

## Naming and component conventions

- **Tag prefix**: `u-` (e.g. `<u-button>`, `<u-scaffold>`).
- **Class names**: unprefixed PascalCase, matching the tag name without the `u-` (`<u-button>` → `class Button`, `<u-top-app-bar>` → `class TopAppBar`). Internal base/abstract classes follow the same convention (`ButtonWrapper`, `FieldBase`).
- **Decorators**: `@customElement`, `@property`, `@state`, `@query`, `@queryAssignedElements`.
- **Slots**: documented in JSDoc above the class. Slot names match part/class names where it makes sense (`top-bar`, `bottom-bar`, `fab`).
- **Parts**: expose `part="container"`, `part="content"`, etc. on the meaningful boxes so consumers can style them via `::part()`.
- **Base classes**: prefer extending `ButtonWrapper` for interactive button-like components — you get ripple, elevation, link/button rendering and a `_renderContent()` override hook.
- **`HTMLElementTagNameMap`**: every component file ends with a `declare global` block — keep it.

## Tokens and styling

- Source of truth is **Material 3 expressive tokens** from `material-components/material-web` under `tokens/versions/latest/sass/_md-comp-*.scss`. Fetch them when in doubt:
  ```
  curl -s "https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/latest/sass/_md-comp-<name>.scss"
  ```
- Convert dp ↔ px 1:1 (no rounding, no rem unless the project's existing typography mixin already uses rem).
- The project's `mixins.typo($style)` computes letter-spacing as `tracking / font-size * 1rem`, which **doesn't match M3 absolute sp tracking**. When pixel-accuracy matters, override letter-spacing inline (`letter-spacing: 0.5px;` for label-medium).
- Always use existing color functions: `functions.get-color-var(secondary-container)` or `api.get-color-var(...)`. Never hardcode hex.
- `:host` + `display: block` for top-level layout components.
- Every interactive component bottoms out at `u-elevation` and `u-ripple` via the shared button wrapper.

## Common gotchas (learned the hard way)

1. **`@property({ reflect: true })` and defaults.** A property with `reflect: true` is reflected to the attribute as soon as the element is upgraded. Checking `el.hasAttribute('position')` to detect whether the consumer explicitly set it **always returns true**. Compare against the property's default value instead (`el.position === 'fixed'`).
2. **Lit context import order.** A provider must be registered (via `customElements.define`) *before* consumers — otherwise the consumer's `context-request` event bubbles past an unupgraded host and gets no answer. In `src/index.ts`, register providers first (e.g. `import './scaffold/scaffold.js'` before `top-app-bar` and `fab`).
3. **`flex-direction: row-reverse`** is used by `u-dialog`'s `.actions`. The first child in DOM order ends up **on the right**. Always put the confirming action first in markup.
4. **`pointer-events: none`** on a slot wrapper propagates to slotted children. Don't blanket-override with `::slotted(*) { pointer-events: auto }` — it breaks components like `u-fab-menu` that intentionally use `pointer-events: none` on their host so the invisible "menu items area" passes clicks through. Scope to specific tags (`::slotted(u-fab)`).
5. **`contain: layout` / `contain: paint`** establish a containing block for absolutely-positioned descendants. If you need a descendant to position relative to a higher ancestor, use `contain: style` (or none) — or apply `contain` on the higher element instead.
6. **`transition: inset` interferes with class swaps.** Changing classes (e.g. `.fixed` → `.absolute` on the top-app-bar container) where both rules touch `inset-inline-start` leaves the property stuck at the previous value through the transition. Scope the transition to the specific class that needs it (`.fixed { transition: ... inset-inline-start ... }`), not the shared container.
7. **`--u-app-bar-offset`** is set by `u-side-navigation` and consumed by `u-top-app-bar`/`u-navigation-bar` to slide the bar when the drawer opens. This token is only relevant for `position: fixed`; **do not** apply it on `.absolute` (the bar is positioned to a scaffold, not the viewport).
8. **`<input type="date">` placeholder visibility.** The native date input shows a `yyyy-mm-dd` mask via `::-webkit-datetime-edit-*`, not `::placeholder`. The library's standard "blank placeholder when empty + unfocused" rule must also target `::-webkit-datetime-edit`.
9. **`u-button-set` in flex containers** is auto-sized to its content. `width: 100%` evaluates to the parent's content-sized width (= the set's own content width), so alignment looks identical for `start/center/end`. Use a fixed width or a wider container if the alignment difference must be visible (e.g. in docs).
10. **u-button color/variant set from JS.** Setting `button.color = undefined` overrides the class default (`'primary'`) and collapses the classMap `[this.color]: true` to a literal `class="undefined"`. When forwarding optional props (e.g. `DialogBuilder._addButton`), check `if (def.color !== undefined)` before assigning.
11. **`ResizeObserver`** does not fire in the headless preview environment used by `mcp__Claude_Preview__preview_*`. Don't conclude it's broken — re-test in a real browser before changing the code.

## Build pipeline

| Step | Command | What it does |
| --- | --- | --- |
| SCSS → TS | `node node_modules/gulp/bin/gulp.js -f gulpfile.js scripts:sass-to-ts` | Compiles every `*.styles.scss` to `*.styles.ts` (a `css\`…\`` template literal). Run after any SCSS change. |
| Type-check + emit | `node node_modules/typescript/bin/tsc` | Compiles `src/` to `dist/`. The docs Angular app imports `@universal-material/web` → `../dist/index` via tsconfig path mapping. |
| Bundle | `./node_modules/@esbuild/win32-x64/esbuild.exe src/index.ts --bundle --format=esm --define:process.env.NODE_ENV='"production"' --minify --outfile=dist/bundle.min.js` | Builds the standalone bundle. Rarely needed — the docs site does not consume it. Use the direct exe — `npx esbuild` fails in this environment with EPERM. |
| Docs API table | `node node_modules/gulp/bin/gulp.js -f gulpfile.js docs:apis` | Regenerates `docs/src/app/apis.ts` from JSDoc on `@property` declarations. Run after editing any property's JSDoc. |
| All-in-one | `npm run build` | The full release build (sass → esm → bundle → sass → analyze → copy). |

The docs Angular dev server is the primary test surface: `npm run docs` (kept running by the developer). It watches `src/` via the `build:watch` gulp task and `docs/` via `ng serve` on port 4200, both with hot-reload. After a `tsc` rebuild from inside a Claude session, give the Angular watcher a few seconds to pick up the new `dist/` files.

## Verifying in the browser

**Always test against the docs site at `http://localhost:4200`** — `npm run docs` is the canonical test surface. The developer keeps it running; don't restart it unless asked. Do **not** spin up `mockup.html` shims or other ad-hoc test pages — they bypass the Angular wiring (path-mapped `@universal-material/web`), use stale bundles, and won't surface real-world regressions.

If a component doesn't have a docs example for what you're testing, add one — that becomes both the validation surface and documentation.

Preview tooling notes (`mcp__Claude_Preview__*`):
- `preview_eval` is reliable for DOM inspection and computed styles.
- `preview_screenshot` frequently times out — don't depend on it; use eval + bounding rects + computed styles to verify pixel-accuracy.
- `preview_resize` is necessary because the viewport may report `0×0` until set (`{ width: 1280, height: 800 }` is a sensible desktop default).
- Hash routing is used by the docs app: navigate via `http://localhost:4200/#/components/<name>`.

## Docs page conventions

Each component gets a folder under `docs/src/app/components/<name>/`:

- `<name>.component.ts` — Angular standalone component. Imports `examples/*.html` as strings (the docs build resolves them via `raw-loader`).
- `<name>.component.html` — uses `<docs-title>`, `<docs-example>`, `<docs-apis-table>`.
- `<name>.component.scss` — usually `:host { display: block; }`.
- `examples/*.html` — the *shown* code. When `[renderExample]="true"` (default) the example is also rendered live from the same HTML.

For interactive playgrounds where the rendered example differs from the shown code, use `[renderExample]="false"` and put the live demo inside `<div example>...</div>`.

For **radio-like chip selectors**, use `<u-chip clickable [selected]="x === v" (click)="x = v">` — *not* `toggle`. `toggle` allows the user to deselect the only selected option, leaving the playground in an invalid empty state. `clickable` gets the ripple/hover treatment without the toggle semantics.

After adding a new component:
1. Register the route in `docs/src/app/app.routes.ts`.
2. Add a `<u-drawer-item routerLink="components/...">` in `docs/src/app/app.component.html`. **Drawer items must be in alphabetical order within their `<u-drawer-headline>` group** (Components, Colors, Layout, etc.) — sort by the visible label, case-insensitive. When adding a new item, find its slot in the existing order.
3. Add a `<docs-apis-table key="...">` to its docs page.
4. Re-run `gulp docs:apis` so the table has data.

## Claude Code skills

The library ships a Claude Code plugin with one skill per component family under `skills/<skill-name>/SKILL.md`. The plugin manifest lives at `.claude-plugin/plugin.json`. Both directories are copied into `dist/` by the `copy` script and ship as part of the published npm package, so consumers can `/plugin install` from their `node_modules/@universal-material/web`.

When you change a user-facing API or pattern (a slot, an attribute, an event name, a builder signature, a default value), **update the matching `skills/<name>/SKILL.md`** in the same change. Skills must stay in sync with the docs examples they reference — they are the second consumer-facing surface after the docs site.

Skill content style: short frontmatter `description` (one-line trigger phrase), then the body with 1-3 working code snippets pulled from `docs/src/app/components/<x>/examples/`, plus a Caveats list.

## Editing checklist (per change)

1. Find the M3 spec / token for what you're changing.
2. Implement against the spec, not against a screenshot. **Token names go in comments** near the rule.
3. Regenerate styles (`scripts:sass-to-ts`) and `tsc` after touching SCSS/TS.
4. Open the affected docs page at `http://localhost:4200/#/components/<name>` and verify with `preview_eval`:
   - `getBoundingClientRect()` for sizes,
   - `getComputedStyle()` for colors, font properties, etc.
5. If the measurement is off, fix the source. Repeat from step 3.
6. Update JSDoc and regenerate `docs:apis` if a public API changed.
7. If a user-facing API or pattern covered by a skill changed, update the matching `skills/<name>/SKILL.md`.
8. Remove any debug `console.log`, temporary test files, etc.
