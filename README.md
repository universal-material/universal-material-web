# Universal Material

### Getting started

#### Install

Install Universal Material components using [npm and node](https://nodejs.org/).

```
npm i @universal-material/web
```

### Import

Import element definitions from `@universal-material/web/<component>/<component-variant>.js` or import everything from `@universal-material/web`.

```
// index.js
import '@universal-material/web/button/button.js';
import '@universal-material/web/card/card.js';
import '@universal-material/web/checkbox/checkbox.js';
```

### Documentation

https://universal-material.github.io

### Claude Code skills

The package ships a Claude Code plugin with per-component guidance skills (setup, theming, scaffold, top app bar, navigation bar, drawer, buttons, FAB, dialog, text field, select, chips, selection controls, datepicker, menu, list, tab bar, snackbar, card, typeahead).

To enable them in a project that already depends on `@universal-material/web`, install the plugin from your `node_modules`:

```
/plugin install ./node_modules/@universal-material/web
```

The skills become available as `universal-material-web:<skill-name>` and Claude will surface the right one when you ask about a component (e.g. "build a layout with a top app bar and a FAB").

## Thanks

<img src="https://live.browserstack.com/images/opensource/browserstack-logo.svg" alt="BrowserStack Logo" width="490" height="106">

Thanks to [BrowserStack](https://www.browserstack.com/) for providing the infrastructure that allows us to test in real browsers!
