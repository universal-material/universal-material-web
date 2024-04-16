import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import '@universal-material/web';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
