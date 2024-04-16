export const Apis = {
  "topAppBar": [{
    "type": "boolean",
    "attribute": "has-leading-icon",
    "default": "false",
    "name": "hasLeadingIcon",
    "description": "Whether the app bar has leading icon or not\n\n_Note:_ Readonly"
  }, {
    "type": "boolean",
    "attribute": "has-trailing-icon",
    "default": "false",
    "name": "hasTrailingIcon",
    "description": "Whether the app bar has trailing icon or not\n\n_Note:_ Readonly"
  }, {
    "type": "string",
    "attribute": "position",
    "default": "'fixed'",
    "name": "position",
    "description": null
  }, {
    "type": "boolean",
    "attribute": "container-scrolled",
    "default": "false",
    "name": "containerScrolled",
    "description": null
  }, {
    "type": "HTMLElement",
    "attribute": null,
    "default": "undefined",
    "name": "content",
    "description": null
  }, {
    "type": "(e: Event) => void",
    "attribute": null,
    "default": "(e: Event) => {\n    const container = e.currentTarget as HTMLElement & Window;\n\n    const scrollTop = UmTopAppBar.getScrollTop(container);\n\n    this.containerScrolled = !!scrollTop;\n  }",
    "name": "onContainerScroll",
    "description": null
  }],
  "buttonSet": [{
    "type": "string",
    "attribute": "align",
    "default": "'end'",
    "name": "align",
    "description": "Set the alignment of the buttons at the `start`, `center` or at the `end`."
  }, {
    "type": "boolean",
    "attribute": "stack",
    "default": "false",
    "name": "stack",
    "description": "Whether to render the buttons stacked or not"
  }],
  "button": [{
    "type": "string",
    "attribute": "variant",
    "default": "'filled'",
    "name": "variant",
    "description": "The Button variant to render"
  }, {
    "type": "string",
    "attribute": "color",
    "default": "undefined",
    "name": "color",
    "description": "The Button color\n\n_Note:_ Filled buttons only"
  }, {
    "type": "boolean",
    "attribute": "trailing-icon",
    "default": "false",
    "name": "trailingIcon",
    "description": null
  }, {
    "type": "boolean",
    "attribute": "has-icon",
    "default": "false",
    "name": "hasIcon",
    "description": "Whether the button has icon or not\n\n_Note:_ Readonly"
  }, {
    "type": "string",
    "attribute": "type",
    "default": "'submit'",
    "name": "type",
    "description": null
  }, {
    "type": "string",
    "attribute": "value",
    "default": "''",
    "name": "value",
    "description": null
  }, {
    "type": "HTMLFormElement",
    "attribute": "form",
    "default": null,
    "name": "form",
    "description": "The `<form>` element to associate the button with (its form owner). The value of this attribute must be the id of a `<form>` in the same document. (If this attribute is not set, the button is associated with its ancestor `<form>` element, if any.)\n\n<a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#form\" target=\"_blank\">https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#form</a>"
  }, {
    "type": "boolean",
    "attribute": "disabled",
    "default": "false",
    "name": "disabled",
    "description": "Whether the button is disabled or not."
  }, {
    "type": "string",
    "attribute": "href",
    "default": "undefined",
    "name": "href",
    "description": "The URL that the link button points to."
  }, {
    "type": "string",
    "attribute": "target",
    "default": "undefined",
    "name": "target",
    "description": "Where to display the linked `href` URL for a link button. Common options\ninclude `_blank` to open in a new tab."
  }, {
    "type": "string",
    "attribute": "name",
    "default": "undefined",
    "name": "name",
    "description": null
  }, {"type": "string", "attribute": null, "default": null, "name": "pathname", "description": null}],
  "fab": [{
    "type": "string",
    "attribute": "color",
    "default": "'primary'",
    "name": "color",
    "description": "The FAB color variant to render."
  }, {
    "type": "string",
    "attribute": "size",
    "default": "'medium'",
    "name": "size",
    "description": "The size of the FAB."
  }, {
    "type": "string",
    "attribute": "label",
    "default": "null",
    "name": "label",
    "description": "The text to display the FAB."
  }, {
    "type": "boolean",
    "attribute": "lowered",
    "default": "false",
    "name": "lowered",
    "description": "Lowers the FAB&apos;s elevation."
  }, {
    "type": "boolean",
    "attribute": "extended",
    "default": null,
    "name": "extended",
    "description": null
  }, {
    "type": "string",
    "attribute": "type",
    "default": "'submit'",
    "name": "type",
    "description": null
  }, {
    "type": "string",
    "attribute": "value",
    "default": "''",
    "name": "value",
    "description": null
  }, {
    "type": "HTMLFormElement",
    "attribute": "form",
    "default": null,
    "name": "form",
    "description": "The `<form>` element to associate the button with (its form owner). The value of this attribute must be the id of a `<form>` in the same document. (If this attribute is not set, the button is associated with its ancestor `<form>` element, if any.)\n\nhttps://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#form"
  }, {
    "type": "boolean",
    "attribute": "disabled",
    "default": "false",
    "name": "disabled",
    "description": "Whether the button is disabled or not."
  }, {
    "type": "string",
    "attribute": "href",
    "default": "undefined",
    "name": "href",
    "description": "The URL that the link button points to."
  }, {
    "type": "string",
    "attribute": "target",
    "default": "undefined",
    "name": "target",
    "description": "Where to display the linked `href` URL for a link button. Common options\ninclude `_blank` to open in a new tab."
  }, {
    "type": "string",
    "attribute": "name",
    "default": "undefined",
    "name": "name",
    "description": null
  }, {"type": "string", "attribute": null, "default": null, "name": "pathname", "description": null}],
  "iconButton": [{
    "type": "string",
    "attribute": "variant",
    "default": "'standard'",
    "name": "variant",
    "description": null
  }, {
    "type": "boolean",
    "attribute": "toggle",
    "default": "false",
    "name": "toggle",
    "description": "When true, the button will toggle between selected and unselected\nstates"
  }, {
    "type": "boolean",
    "attribute": "has-selection-icon",
    "default": "false",
    "name": "hasSelectionIcon",
    "description": null
  }, {
    "type": "boolean",
    "attribute": "selected",
    "default": "false",
    "name": "selected",
    "description": "Sets the selected state. When false, displays the default icon. When true,\ndisplays the selected icon, or the default icon If no `slot=&quot;selected&quot;`\nicon is provided."
  }, {
    "type": "string",
    "attribute": "aria-label-selected",
    "default": "''",
    "name": "ariaLabelSelected",
    "description": "The `aria-label` of the button when the button is toggleable and selected."
  }, {
    "type": "string",
    "attribute": "type",
    "default": "'submit'",
    "name": "type",
    "description": null
  }, {
    "type": "string",
    "attribute": "value",
    "default": "''",
    "name": "value",
    "description": null
  }, {
    "type": "HTMLFormElement",
    "attribute": "form",
    "default": null,
    "name": "form",
    "description": "The `<form>` element to associate the button with (its form owner). The value of this attribute must be the id of a `<form>` in the same document. (If this attribute is not set, the button is associated with its ancestor `<form>` element, if any.)\n\n<a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#form\" target=\"_blank\">https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#form</a>"
  }, {
    "type": "boolean",
    "attribute": "disabled",
    "default": "false",
    "name": "disabled",
    "description": "Whether the button is disabled or not."
  }, {
    "type": "string",
    "attribute": "href",
    "default": "undefined",
    "name": "href",
    "description": "The URL that the link button points to."
  }, {
    "type": "string",
    "attribute": "target",
    "default": "undefined",
    "name": "target",
    "description": "Where to display the linked `href` URL for a link button. Common options\ninclude `_blank` to open in a new tab."
  }, {
    "type": "string",
    "attribute": "name",
    "default": "undefined",
    "name": "name",
    "description": null
  }, {"type": "string", "attribute": null, "default": null, "name": "pathname", "description": null}],
  "cardContent": [{
    "type": "boolean",
    "attribute": "has-content",
    "default": "false",
    "name": "hasContent",
    "description": null
  }],
  "cardMedia": [{"type": "boolean", "attribute": "wide", "default": "false", "name": "wide", "description": null}],
  "card": [{
    "type": "string",
    "attribute": "variant",
    "default": "'filled'",
    "name": "variant",
    "description": "The Card variant to render."
  }],
  "container": [{
    "type": "string",
    "attribute": "margin",
    "default": "undefined",
    "name": "margin",
    "description": null
  }, {
    "type": "string",
    "attribute": "margin-sm",
    "default": "undefined",
    "name": "marginSmall",
    "description": null
  }, {
    "type": "string",
    "attribute": "margin-md",
    "default": "undefined",
    "name": "marginMedium",
    "description": null
  }, {
    "type": "string",
    "attribute": "margin-lg",
    "default": "undefined",
    "name": "marginLarge",
    "description": null
  }, {
    "type": "string",
    "attribute": "margin-xl",
    "default": "undefined",
    "name": "marginExtraLarge",
    "description": null
  }, {"type": "boolean", "attribute": "full-width", "default": "false", "name": "fullWidth", "description": null}],
  "grid": [{
    "type": "string",
    "attribute": "gutter",
    "default": "undefined",
    "name": "gutter",
    "description": null
  }, {
    "type": "string",
    "attribute": "gutter-sm",
    "default": "undefined",
    "name": "gutterSmall",
    "description": null
  }, {
    "type": "string",
    "attribute": "gutter-md",
    "default": "undefined",
    "name": "gutterMedium",
    "description": null
  }, {
    "type": "string",
    "attribute": "gutter-lg",
    "default": "undefined",
    "name": "gutterLarge",
    "description": null
  }, {
    "type": "string",
    "attribute": "gutter-xl",
    "default": "undefined",
    "name": "gutterExtraLarge",
    "description": null
  }, {"type": "number", "attribute": "cols", "default": "1", "name": "cols", "description": null}, {
    "type": "number",
    "attribute": "cols-sm",
    "default": "undefined",
    "name": "colsSmall",
    "description": null
  }, {
    "type": "number",
    "attribute": "cols-md",
    "default": "undefined",
    "name": "colsMedium",
    "description": null
  }, {
    "type": "number",
    "attribute": "cols-lg",
    "default": "undefined",
    "name": "colsLarge",
    "description": null
  }, {
    "type": "number",
    "attribute": "cols-xl",
    "default": "undefined",
    "name": "colsExtraLarge",
    "description": null
  }, {
    "type": "number",
    "attribute": "template-columns",
    "default": "undefined",
    "name": "templateColumns",
    "description": null
  }, {
    "type": "number",
    "attribute": "template-columns-sm",
    "default": "undefined",
    "name": "templateColumnsSmall",
    "description": null
  }, {
    "type": "number",
    "attribute": "template-columns-md",
    "default": "undefined",
    "name": "templateColumnsMedium",
    "description": null
  }, {
    "type": "number",
    "attribute": "template-columns-lg",
    "default": "undefined",
    "name": "templateColumnsLarge",
    "description": null
  }, {
    "type": "number",
    "attribute": "template-columns-xl",
    "default": "undefined",
    "name": "templateColumnsExtraLarge",
    "description": null
  }, {
    "type": "string",
    "attribute": "margin",
    "default": "undefined",
    "name": "margin",
    "description": null
  }, {
    "type": "string",
    "attribute": "margin-sm",
    "default": "undefined",
    "name": "marginSmall",
    "description": null
  }, {
    "type": "string",
    "attribute": "margin-md",
    "default": "undefined",
    "name": "marginMedium",
    "description": null
  }, {
    "type": "string",
    "attribute": "margin-lg",
    "default": "undefined",
    "name": "marginLarge",
    "description": null
  }, {
    "type": "string",
    "attribute": "margin-xl",
    "default": "undefined",
    "name": "marginExtraLarge",
    "description": null
  }, {"type": "boolean", "attribute": "full-width", "default": "false", "name": "fullWidth", "description": null}],
  "divider": [{
    "type": "boolean",
    "attribute": "no-margin",
    "default": "false",
    "name": "noMargin",
    "description": "When true, remove the margin of the divider"
  }],
  "elevation": [{
    "type": "string",
    "attribute": null,
    "default": "\"true\"",
    "name": "ariaHidden",
    "description": null
  }],
  "menuItem": [{
    "type": "boolean",
    "attribute": "has-icon",
    "default": "false",
    "name": "hasIcon",
    "description": "Whether the drawer item has icon or not\n\n_Note:_ Readonly"
  }, {
    "type": "boolean",
    "attribute": "has-badge",
    "default": "false",
    "name": "hasBadge",
    "description": "Whether the drawer item has badge or not\n\n_Note:_ Readonly"
  }, {
    "type": "boolean",
    "attribute": "disabled",
    "default": "false",
    "name": "disabled",
    "description": "Whether the button is disabled or not."
  }, {
    "type": "string",
    "attribute": "href",
    "default": "undefined",
    "name": "href",
    "description": "The URL that the link button points to."
  }, {
    "type": "string",
    "attribute": "target",
    "default": "undefined",
    "name": "target",
    "description": "Where to display the linked `href` URL for a link button. Common options\ninclude `_blank` to open in a new tab."
  }, {
    "type": "string",
    "attribute": "name",
    "default": "undefined",
    "name": "name",
    "description": null
  }, {"type": "string", "attribute": null, "default": null, "name": "pathname", "description": null}],
  "menu": [{
    "type": "string",
    "attribute": "anchor-corner",
    "default": "'end-start'",
    "name": "anchorCorner",
    "description": "The corner of the anchor which to align the menu in the standard logical\nproperty style of &lt;block&gt;-&lt;inline&gt; e.g. `&apos;end-start&apos;`."
  }, {
    "type": "string",
    "attribute": "direction",
    "default": "'end'",
    "name": "direction",
    "description": "The direction of the menu. e.g. `&apos;end&apos;`.\n\nNOTE: This value may not be respected by the menu positioning algorithm\nif the menu would render outside the viewport."
  }, {
    "type": "boolean",
    "attribute": "auto-scroll-block",
    "default": "true",
    "name": "autoScrollBlock",
    "description": "Limit the height of the menu to not overflow the viewport"
  }, {
    "type": "HTMLElement",
    "attribute": null,
    "default": "undefined",
    "name": "menu",
    "description": null
  }, {
    "type": "() => void",
    "attribute": null,
    "default": "() => {\n    if (this.open) {\n      this.close();\n      return;\n    }\n\n    this.show();\n  }",
    "name": "toggle",
    "description": null
  }, {
    "type": "() => void",
    "attribute": null,
    "default": "() => {\n    if (this.open && !this.#justShow) {\n      this.open = false;\n      return;\n    }\n\n    this.#justShow = false;\n  }",
    "name": "close",
    "description": null
  }, {
    "type": "boolean",
    "attribute": "open",
    "default": null,
    "name": "open",
    "description": "Opens the menu and makes it visible. Alternative to the `.show()`, `.close()` and `.toggle()` methods"
  }, {"type": "HTMLElement", "attribute": null, "default": null, "name": "anchorElement", "description": null}],
  "drawerItem": [{
    "type": "boolean",
    "attribute": "has-icon",
    "default": "false",
    "name": "hasIcon",
    "description": "Whether the drawer item has icon or not\n\n_Note:_ Readonly"
  }, {
    "type": "boolean",
    "attribute": "has-badge",
    "default": "false",
    "name": "hasBadge",
    "description": "Whether the drawer item has badge or not\n\n_Note:_ Readonly"
  }, {
    "type": "boolean",
    "attribute": "active",
    "default": "false",
    "name": "active",
    "description": "Whether the drawer item is active or not\n\n_Note:_ Readonly"
  }, {
    "type": "boolean",
    "attribute": "disabled",
    "default": "false",
    "name": "disabled",
    "description": "Whether the button is disabled or not."
  }, {
    "type": "string",
    "attribute": "href",
    "default": "undefined",
    "name": "href",
    "description": "The URL that the link button points to."
  }, {
    "type": "string",
    "attribute": "target",
    "default": "undefined",
    "name": "target",
    "description": "Where to display the linked `href` URL for a link button. Common options\ninclude `_blank` to open in a new tab."
  }, {
    "type": "string",
    "attribute": "name",
    "default": "undefined",
    "name": "name",
    "description": null
  }, {"type": "string", "attribute": null, "default": null, "name": "pathname", "description": null}],
  "sideNavigation": [{
    "type": "boolean",
    "attribute": "toggle-drawer",
    "default": "false",
    "name": "toggleDrawer",
    "description": null
  }],
  "ripple": [{
    "type": "boolean",
    "attribute": "disabled",
    "default": "false",
    "name": "disabled",
    "description": "Disables the ripple."
  }],
  "snackbar": [{
    "type": "string",
    "attribute": "label",
    "default": "''",
    "name": "label",
    "description": null
  }, {
    "type": "string",
    "attribute": "buttonLabel",
    "default": "''",
    "name": "buttonLabel",
    "description": null
  }, {
    "type": "boolean",
    "attribute": "show-close",
    "default": "false",
    "name": "showClose",
    "description": null
  }, {"type": "boolean", "attribute": "dismissed", "default": "false", "name": "dismissed", "description": null}],
  "bColor": [{
    "type": "number",
    "attribute": null,
    "default": "undefined",
    "name": "r",
    "description": null
  }, {"type": "number", "attribute": null, "default": "undefined", "name": "g", "description": null}, {
    "type": "number",
    "attribute": null,
    "default": "undefined",
    "name": "b",
    "description": null
  }, {
    "type": "() => string",
    "attribute": null,
    "default": "(): string => `${this.r},${this.g},${this.b}`",
    "name": "toString",
    "description": null
  }],
  "emeBuilder": [{
    "type": "string",
    "attribute": null,
    "default": "undefined",
    "name": "cssClass",
    "description": null
  }, {
    "type": "import(\"D:/Projects/universal-material-web/src/theme/theme-color\").ThemeColor[]",
    "attribute": null,
    "default": "[]",
    "name": "colors",
    "description": null
  }, {
    "type": "import(\"D:/Projects/universal-material-web/src/theme/theme-color\").ThemeColor[]",
    "attribute": null,
    "default": "[]",
    "name": "commonColors",
    "description": null
  }, {
    "type": "import(\"D:/Projects/universal-material-web/node_modules/@material/material-color-utilities/palettes/tonal_palette\").TonalPalette",
    "attribute": null,
    "default": "undefined",
    "name": "neutralColorPalette",
    "description": null
  }, {
    "type": "import(\"D:/Projects/universal-material-web/node_modules/@material/material-color-utilities/palettes/tonal_palette\").TonalPalette",
    "attribute": null,
    "default": "undefined",
    "name": "neutralVariantColorPalette",
    "description": null
  }]
}
