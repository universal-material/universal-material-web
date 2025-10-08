import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';

import '@universal-material/web';

import { register } from 'swiper/element/bundle';
import { createCustomElement } from '@angular/elements';
import { TypeaheadTemplate } from '@docs/components/typeahead/typeahead-template/typeahead-template';
import { Injector } from '@angular/core';

register();

import('./app/app.component').then(c => {
  bootstrapApplication(c.AppComponent, appConfig)
    .then(ref => registerElements(ref.injector))
    .catch(err => console.error(err));
});

const registerElements = (injector: Injector) => {
  const TypeaheadTemplateElement = createCustomElement(TypeaheadTemplate, { injector });

  customElements.define('typeahead-template', TypeaheadTemplateElement);
};
