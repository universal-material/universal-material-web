import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

import '@universal-material/web';
import { register } from 'swiper/element/bundle'

register();

import('./app/app.component')
  .then(c => {
    bootstrapApplication(c.AppComponent, appConfig)
      .catch((err) => console.error(err));
  });
