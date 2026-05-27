import { expect } from '@open-wc/testing';

import { ThemeBuilder } from './theme-builder.js';

suite('ThemeBuilder', () => {
  suite('static factories', () => {
    test('create() returns a ThemeBuilder seeded with primary palette', () => {
      const tb = ThemeBuilder.create('#6750A4');
      expect(tb).to.be.instanceOf(ThemeBuilder);
      const primary = tb.colors.find((c) => c.name === 'primary');
      expect(primary).to.exist;
    });

    test('createPartial() returns a ThemeBuilder that skips status colors', () => {
      const tb = ThemeBuilder.createPartial('#6750A4');
      expect(tb).to.be.instanceOf(ThemeBuilder);
      // status colors are added at build() time only when partial=false
      const css = tb.build();
      expect(css).to.not.include('--u-color-error');
    });
  });

  suite('chaining', () => {
    test('addColorFromHex returns the builder for chaining', () => {
      const tb = ThemeBuilder.create('#000');
      expect(tb.addColorFromHex('brand', '#ff0000')).to.equal(tb);
    });

    test('addStaticColor returns the builder for chaining', () => {
      const tb = ThemeBuilder.create('#000');
      expect(tb.addStaticColor('promo', '#abc')).to.equal(tb);
    });

    test('setCssClass returns the builder and stores the class', () => {
      const tb = ThemeBuilder.create('#000');
      expect(tb.setCssClass('my-theme')).to.equal(tb);
      expect(tb.cssClass).to.equal('my-theme');
    });
  });

  suite('addColorFromHex / addColorFromPalette side effects', () => {
    test('adds the named color, on-, container and on-container entries', () => {
      const tb = ThemeBuilder.create('#000').addColorFromHex('brand', '#ff0000');
      const names = tb.colors.map((c) => c.name);
      expect(names).to.include('brand');
      expect(names).to.include('on-brand');
      expect(names).to.include('brand-container');
      expect(names).to.include('on-brand-container');
    });

    test('also adds fixed/dim variants', () => {
      const tb = ThemeBuilder.create('#000').addColorFromHex('brand', '#ff0000');
      const names = tb.colors.map((c) => c.name);
      expect(names).to.include('brand-fixed');
      expect(names).to.include('brand-fixed-dim');
      expect(names).to.include('on-brand-fixed');
      expect(names).to.include('on-brand-fixed-variant');
    });
  });

  suite('build() output', () => {
    test('emits CSS targeting :root by default', () => {
      const css = ThemeBuilder.create('#6750A4').build();
      expect(css).to.match(/^:root \{/);
    });

    test('emits CSS targeting the provided class when set', () => {
      const css = ThemeBuilder.create('#6750A4').setCssClass('my-theme').build();
      expect(css).to.match(/^\.my-theme \{/);
    });

    test('prefixes the class with a dot if the consumer omitted it', () => {
      const css = ThemeBuilder.create('#6750A4').setCssClass('foo').build();
      expect(css.startsWith('.foo {')).to.be.true;
    });

    test('keeps an explicit leading dot intact', () => {
      const css = ThemeBuilder.create('#6750A4').setCssClass('.foo').build();
      expect(css.startsWith('.foo {')).to.be.true;
      expect(css.startsWith('..foo {')).to.be.false;
    });

    test('emits CSS custom properties for primary, on-primary and surface', () => {
      const css = ThemeBuilder.create('#6750A4').build();
      expect(css).to.include('--u-color-primary');
      expect(css).to.include('--u-color-on-primary');
      expect(css).to.include('--u-color-surface');
    });

    test('emits light-dark() pairs for non-fixed colors', () => {
      const css = ThemeBuilder.create('#6750A4').build();
      // Output uses CSS light-dark() function, not separate -light / -dark vars.
      expect(css).to.match(/--u-color-primary: light-dark\(#[0-9a-f]+, #[0-9a-f]+\)/);
      expect(css).to.match(/--u-color-on-primary: light-dark\(#[0-9a-f]+, #[0-9a-f]+\)/);
    });

    test('emits dedicated -light and -dark surface variants', () => {
      const css = ThemeBuilder.create('#6750A4').build();
      expect(css).to.include('--u-color-light-surface');
      expect(css).to.include('--u-color-dark-surface');
    });

    test('full (non-partial) build emits status colors success/info/warning/error', () => {
      const css = ThemeBuilder.create('#6750A4').build();
      expect(css).to.include('--u-color-success');
      expect(css).to.include('--u-color-info');
      expect(css).to.include('--u-color-warning');
      expect(css).to.include('--u-color-error');
    });

    test('partial build omits status colors', () => {
      const css = ThemeBuilder.createPartial('#6750A4').build();
      expect(css).to.not.include('--u-color-success');
      expect(css).to.not.include('--u-color-info');
      expect(css).to.not.include('--u-color-warning');
      expect(css).to.not.include('--u-color-error');
    });

    test('build ensures secondary and tertiary palettes are present', () => {
      const css = ThemeBuilder.create('#6750A4').build();
      expect(css).to.include('--u-color-secondary');
      expect(css).to.include('--u-color-tertiary');
    });
  });
});
