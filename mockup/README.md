# Aurora — mockup B2B para estressar as skills

Esta pasta é um **campo de provas** do `@universal-material/web`: um app B2B fictício (CRM + Operações, chamado **Aurora**) construído **só** com os componentes `u-*`, o CSS do projeto e Tailwind como utilitário pontual. Serve para exercitar as skills (`skills/<componente>/SKILL.md`) em telas reais e descobrir onde elas falham ou enganam.

> **Este README é tudo que você precisa para gerar novas páginas/mockups sem refazer a análise completa do zero.** Leia as "Regras de ouro" e os "Gotchas", copie a anatomia de uma página, e valide no navegador.

Todo o conteúdo da pasta `mockup/` (exceto este README) é **gitignored** — é artefato descartável. Regenere à vontade.

---

## Quick start

O servidor precisa rodar a partir da **raiz do repositório** (as páginas referenciam `../dist/`):

```bash
python mockup/serve.py
```

`serve.py` é um `http.server` que manda `Cache-Control: no-store` em toda resposta. **Use-o sempre** — o `python -m http.server` padrão cacheia o HTML e faz edições parecerem que não aplicaram. Com `serve.py`, um F5 simples mostra a versão nova.

Abra qualquer página em `http://127.0.0.1:5555/mockup/<nome>.html` (ex.: `dashboard.html`, `clientes.html`, `configuracoes.html`).

### Se um componente aparecer como "não definido" / faltando

O mockup consome `../dist/bundle.min.js`. Se você mexeu no `src/` da lib, **rebuilde o bundle**:

```bash
# 1. SCSS -> .styles.ts (se mudou algum *.styles.scss)
node node_modules/gulp/bin/gulp.js -f gulpfile.js scripts:sass-to-ts
# 2. bundle (use o exe direto — npx esbuild dá EPERM neste ambiente)
./node_modules/@esbuild/win32-x64/esbuild.exe src/index.ts --bundle --format=esm \
  --define:process.env.NODE_ENV='"production"' --minify --outfile=dist/bundle.min.js
```

---

## Regras de ouro (o que pode e o que não pode)

1. **Só `u-*` + CSS do projeto + Tailwind utilitário.** Nada de outra lib de UI, nada de CSS framework além do Tailwind, e Tailwind **só** onde não há equivalente no projeto (`overflow-x-auto`, `truncate`, `aspect-square`…).
2. **Layout vem do projeto**, não do Tailwind: `u-container` / `u-container-fluid`, `u-grid` (+ `--u-grid-columns`), `u-column`, `u-gutter-*`, `u-m*-*` / `u-p*-*`.
3. **Cores só via tokens**: `u-text-*`, `u-bg-*`, `u-text-bg-*`, `u-text-low-emphasis`, ou `var(--u-color-*)`. **Nunca hex hardcoded** fora do `ThemeBuilder`.
4. **Tipografia**: `u-display-*`, `u-headline-*`, `u-title-*`, `u-body-*`, `u-label-*`, `u-font-weight-*`.
5. **Tema**: teal seed `#00897b` via `ThemeBuilder.create('#00897b').build()` — já feito no `shell.js`. Dark/light toggle no top bar.
6. **`app.css` é o último recurso**: só entra ali o que `u-*` + Tailwind não cobrem (avatares, timeline, kanban, grid responsivo por breakpoint). Se algo pode ser feito com classes do projeto, use as classes.

---

## Estrutura de arquivos

```
mockup/
  serve.py                # servidor estático no-cache (rode da raiz do repo)
  index.html              # redireciona p/ login
  login.html              # auth standalone (sem shell)
  <pagina>.html           # cada tela usa <aurora-shell>
  assets/
    shell.js              # <aurora-shell>: rail+scaffold+top-bar+nav-bar+fab, tema, helpers
    data.js               # window.aurora.data — fake data determinístico (PRNG seedado)
    app.css               # CSS mínimo (avatares, timeline, kanban, grid responsivo…)
    icons.js              # mapa de Material Symbols por entidade
```

`window.aurora` expõe: `data` (clientes, deals, produtos, pedidos, mensagens, eventos, equipe, atividade, kpis, helpers), `snackbar(opts)`, `confirm({title,message,…}) -> Promise<bool>`, `message({title,message})`, `toggleScheme()`, `currentScheme()`, `SnackbarDuration`.

---

## Anatomia de uma página

```html
<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Aurora — <Página></title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=block" />
    <link rel="stylesheet" href="../dist/css/universal-material.min.css" />
    <link rel="stylesheet" href="./assets/app.css" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>tailwind.config = { corePlugins: { preflight: false } };</script>
    <script type="module" src="https://unpkg.com/element-internals-polyfill@1.3.9/dist/index.js"></script>
    <script type="module" src="../dist/bundle.min.js"></script>
    <script src="./assets/data.js"></script>
    <script type="module" src="./assets/shell.js"></script>
  </head>
  <body>
    <aurora-shell active="<chave-nav>" titulo="<Título>">
      <!-- conteúdo da página vai aqui (vira o <main> do scaffold) -->
    </aurora-shell>
    <script type="module">
      const data = window.aurora.data;
      // ...lógica da página...
    </script>
  </body>
</html>
```

**Atributos do `<aurora-shell>`**:
- `active` — chave do item de nav ativo (`dashboard`, `clientes`, `pipeline`, `inbox`, `agenda`, `pedidos`, `produtos`, `oportunidade`, `relatorios`, `equipe`, `configuracoes`, `perfil`).
- `titulo` — headline do top app bar.
- `top-size` — `small` (default), `medium`, `large`.
- `no-fab` — remove o FAB-menu global.
- `no-main` — **não** embrulha o conteúdo num `<main>`; insere os filhos direto no `<u-scaffold>`. Use quando a página é list-detail com `<u-pane>` (configuracoes, inbox).

Para adicionar uma rota nova ao menu, edite `NAV_GROUPS` / `NAV_RAIL_PRIMARY` / `NAV_BAR_PRIMARY` em `assets/shell.js`.

---

## Gotchas & padrões (destilado das skills — leia antes de gerar)

Cada item abaixo foi um erro real cometido e corrigido. As skills foram atualizadas; aqui está o resumo operacional.

**Cascata CSS**
- **Inline style vence `@media`.** `style="grid-column: span 1"` + uma regra `@media{ ... span 3 }` nunca sobrepõe — o inline ganha. Idem `style="display:flex"` vs `.classe-mobile{display:none}`. Ponha o que precisa virar por breakpoint **numa classe**, nunca inline.

**Cards** (`skills/card`)
- **Não use `<u-card-content>`** — o `u-card` já embrulha o slot default num bloco com padding. Conteúdo vai **direto** no `<u-card>`. `--u-card-padding` para tunar/zerar o padding.
- Mídia/banner vai em **`slot="before-content"`** (flush, sem padding): `<u-card-media slot="before-content">`. `wide` = 16:9. Overlays (chips sobre a mídia) num `<div style="position:relative">` interno, não direto no card-media.
- **Cards irmãos de mesma importância = mesma variant** (KPI grid, catálogo). Variar variant cria hierarquia que os dados não têm. Variant diferente só para papel diferente (main vs side).

**Slider** (`skills/slider`)
- **`discrete` só com ≤ ~15 stops** (`(max-min)/step`). Acima disso os ticks viram ruído. Para faixas grandes (preço, score 0-100), slider contínuo + `<span>` que atualiza no evento `input`.

**Grid responsivo**
- O `.u-grid` do projeto lê só `--u-grid-columns`. O `app.css` adiciona `--u-grid-columns-{sm,md,lg,xl}` com fallback em cascata. Use: `style="--u-grid-columns:1; --u-grid-columns-md:2; --u-grid-columns-lg:3"`.
- Para "sidebar + content" prefira **flexbox** a nested grid (`flex: 0 0 260px` + `flex: 1 1 0`).

**Scaffold / panes** (`skills/scaffold`)
- **Se usar `<u-pane>` para um filho do body, use pane para todos** (consistência de surface, scroll e modes). Conteúdo central = `<u-pane variant="transparent" style="flex:1 1 0">`.
- **List-detail "settings"** (configuracoes): nav de seções = a *lista* → `mode="fixed"`, largura via classe (`flex:1 1 0` no mobile, `flex:0 0 320px` no md+). Conteúdo = o *detalhe* → `mode="fullscreen" mode-md="fixed"`. Clicar numa seção → `detailPane.show()`; back → `.close()`.
- **List-detail "mail"** (inbox): nav `mode="sidebar" mode-lg="fixed"` + lista `mode="fixed"` + detalhe `mode="fullscreen" mode-md="fixed"`. Referência completa: `docs/src/app/screens/scaffold-list-detail/`.
- Header fixo do pane vai em `slot="header"`.

**Navigation rail** (`skills/navigation-rail`)
- Os slots `rail` (collapsed) e `expanded` são **a mesma navegação em dois níveis de detalhe**, não dois menus diferentes. Não coloque sub-navegação de seção (ex.: pastas de email) no slot expanded — isso troca o que o rail navega ao expandir e quebra o modelo mental. Sub-nav leve vai em chips/tabs no header; árvore grande vai em pane+drawer próprio (ou corte a camada).

**Drawer** (`skills/drawer`)
- Badge é `<span slot="badge">12</span>`, **não** `<u-badge>` (o `u-badge` é o badge flutuante de ícone, fica fora do lugar inline).
- **`<u-drawer>` dentro de `<u-pane variant="filled">`**: o drawer pinta o próprio fundo, e no `lg+` esse fundo vira `surface`/body — cobrindo o filled do pane e sumindo no desktop. Neutralize no pane: `--u-modal-drawer-bg-color: transparent; --u-standard-drawer-bg-color: transparent;`.

**Console**
- Erros `_scheduleSync` / `_renderOptionRelatedElements` ao carregar páginas com vários `u-select` são um **race de upgrade-order conhecido da lib** (option sobe antes do select). A página renderiza e funciona; ignore. Se for corrigir, é no `src/select/`.

---

## Como gerar uma página nova (workflow)

1. **Escolha a(s) skill(s) a estressar** e leia `skills/<nome>/SKILL.md`.
2. **Copie a anatomia** acima. Defina `active`/`titulo`/atributos do shell.
3. **Monte o conteúdo** só com `u-*` + utilitários do projeto. Puxe dados de `window.aurora.data`. Use `window.aurora.snackbar/confirm/message` para feedback.
4. Se for list-detail, use `no-main` + panes (veja os padrões acima).
5. **Registre no menu** (`shell.js`) se a página deve aparecer na navegação.
6. **Valide no navegador** (veja abaixo). Conserte até o console estar limpo (fora o race do select) e o layout bater pixel com o spec M3.

A meta é sempre **estressar variantes**: para cada componente, exiba o máximo de estados (button filled/tonal/elevated/outlined/text/toggle/icon; chip toggle/clickable/removable/elevated; pane fixed/sidebar/fullscreen; etc.).

---

## Como testar

Servidor rodando (`python mockup/serve.py`), depois com o Chrome MCP (`mcp__Claude_in_Chrome__*`):

1. `navigate` para `http://127.0.0.1:5555/mockup/<pagina>.html`.
2. `read_console_messages` (onlyErrors) — zero erros, fora o race do `u-select`.
3. Medições via `javascript_tool`: `getBoundingClientRect()` para tamanhos, `getComputedStyle()` para cores/tipografia. Comparar com os tokens M3.
4. Viewports: mobile (~430px), md (~1000px), lg (≥1200px). Verificar que o `u-navigation-bar` aparece só `< 840px`, rail collapsed em md, rail expanded em lg.
5. Interações-chave (dialog, snackbar, tabs, kanban, panes list-detail).

> O `computer screenshot`/`zoom` **congela** nessas páginas (o Tailwind CDN mantém o documento "busy", então `document_idle` nunca dispara e a captura retorna um frame antigo). Para inspecionar de fato, prefira medições via `javascript_tool` (cor computada, rects, pilha de elementos). Um screenshot logo após `navigate` ainda pega o frame fresco; depois disso, não confie nele.

---

## Mapa de cobertura (página → componentes estressados)

| Página | Foco |
| --- | --- |
| login | text-field (validação, password), button, checkbox, dialog imperativo, snackbar |
| dashboard | scaffold, top-app-bar, rail, card (3 variants), progress-bar, circular-progress, chip, badge, list, fab-menu |
| clientes | list-detail/tabela, list-item, chip-set/chip-field, select, range-datepicker, slider, checkbox bulk, overflow-menu, dialog |
| cliente | tab-bar (7 abas), card-media, chip removable, expansion-panel, typeahead, text-area, slider, divider |
| pipeline | kanban drag-and-drop, card elevated, chip, badge, select, dialog, snackbar |
| oportunidade | top-app-bar large, slider, tab-bar, typeahead, expansion-panel, button-set |
| pedidos | tabela densa, chips status, checkbox bulk, select, range-datepicker, overflow-menu, dialog confirm |
| pedido-novo | tab-bar stepper, todos os text-field types, radio/switch/checkbox list-item, collapse, chip-field, datepicker |
| produtos | card grid (media before-content), chip-set toggle, slider range, switch-list-item, menu, fab |
| inbox | scaffold 2-pane list-detail (fullscreen no mobile), list-item, typeahead, expansion-panel, text-area, menu, dialog |
| agenda | calendar inline, range-datepicker/calendar, switch-list-item, chip-set, dialog com form completo |
| relatorios | tab-bar, vários select, range-datepicker, chip removable, tabela 200 linhas, circular-progress, expansion-panel |
| equipe | tabela, matriz de checkbox (checked/indeterminate/disabled), chip-set, dialog convite |
| configuracoes | list-detail (nav fixed + content fullscreen/fixed), drawer, todos os selection-controls, save por seção |
| perfil | top-app-bar medium, card-media banner, tab-bar, chip-field, switch-list-item, dialog troca de senha |
