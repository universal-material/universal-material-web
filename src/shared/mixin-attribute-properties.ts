import { LitElement } from 'lit';

import { MixinBase, MixinReturn } from './mixin.js';

// @ts-ignore
export const mixinAttributeProperties = <T extends MixinBase<LitElement>>(base: T, ...properties: string[]): MixinReturn<T> => {
  // @ts-ignore
  abstract class AttributeProperties extends base {
    constructor() {
      super();

      for (const property of properties) {
        const propertyKey = property
          .split('-')
          .map(((segment, index) => index
            ? `${segment[0].toUpperCase()}${segment.substring(1)}`
            : segment))
          .join('');

        Object.defineProperty(this, property, {
          get: function() {
            return this[propertyKey];
          },
          set: function(value: any) {
            this[propertyKey] = value;
          },
        });
      }
    }
  }

  return AttributeProperties;
}
