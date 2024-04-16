import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { provideMarkdown } from 'ngx-markdown';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHighlightOptions({
      coreLibraryLoader: () => import('highlight.js/lib/core'),
      lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'), // Optional, add line numbers if needed
      languages: {
        shell: () => import('highlight.js/lib/languages/shell'),
        typescript: () => import('highlight.js/lib/languages/typescript'),
        css: () => import('highlight.js/lib/languages/css'),
        xml: () => import('highlight.js/lib/languages/xml')
      },
      themePath: 'path-to-theme.css' // Optional, useful for dynamic theme changes
    }),
    provideMarkdown()
  ]
};
