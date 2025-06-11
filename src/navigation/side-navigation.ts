import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { config } from '../config.js';
import { styles as baseStyles } from '../shared/base.styles.js';
import { styles as swiperStyles } from './side-navigation-swiper.styles.js';
import { styles } from './side-navigation.styles.js';

import '../elevation/elevation.js';

@customElement('u-side-navigation')
export class UmSideNavigation extends LitElement {
  static override styles = [baseStyles, config.navigationDrawer.useSwiperJs ? swiperStyles : styles];

  #toggleDrawer = false;
  private disableSlideAnimation = false;

  /**
   * Toggle the navigation drawer visibility
   *
   * _Modal drawer_: Open if `true`, closed if `false`
   * _Standard drawer_: Collapsed if `true`, visible if `false`
   */
  @property({ type: Boolean, attribute: 'toggle-drawer' })
  get toggleDrawer() {
    return this.#toggleDrawer;
  }

  set toggleDrawer(toggleDrawer: boolean) {
    this.#toggleDrawer = toggleDrawer;

    if (!this.disableSlideAnimation) {
      this.swiperContainer?.swiper?.slideTo(toggleDrawer ? 0 : 1);
    }
  }

  @query('swiper-container') swiperContainer: any;
  @query('.scrim') scrim!: HTMLElement;
  @query('#scroll-container') scrollContainer: HTMLElement | undefined;

  override render(): HTMLTemplateResult {
    return config.navigationDrawer.useSwiperJs ? this.renderWithSwipe() : this.renderDefault();
  }

  private renderDefault() {
    const classes = { toggle: this.toggleDrawer };

    return html`
      <div class="grid container">
        <div>
          <div class="navigation">
            <div class="scrim ${classMap(classes)}" @click="${this.scrimClick}"></div>
            <div class="drawer ${classMap(classes)}">
              <u-elevation></u-elevation>
              <div class="drawer-container">
                <slot name="drawer"></slot>
              </div>
            </div>
            <slot name="rail"></slot>
          </div>
        </div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  private renderWithSwipe() {
    const classes = { toggle: this.toggleDrawer };
    return html`
      <swiper-container
        class="container"
        initial-slide="1"
        resistance-ratio="0"
        slides-per-view="auto"
        simulate-touch="false"
        @swiperactiveindexchange="${this.swiperActiveIndexChange}"
        @swiperslidermove="${this.swiperSliderMove}"
        @swipertransitionend="${this.swiperTransitionEnd}"
        @swipertransitionstart="${this.swiperTransitionStart}"
        @swiperslidesgridlengthchange="${this.slidesGridLengthChange}">
        <swiper-slide class="drawer ${classMap(classes)}">
          <u-elevation></u-elevation>
          <div class="drawer-container">
            <slot name="drawer"></slot>
          </div>
        </swiper-slide>
        <swiper-slide class="dummy-slide"></swiper-slide>

        <div id="scroll-container" class="content" slot="container-end">
          <slot></slot>
        </div>
        <div class="scrim ${classMap(classes)}" @click="${this.scrimClick}" slot="container-end"></div>
      </swiper-container>
    `;
  }

  private swiperActiveIndexChange() {
    if (!this.swiperContainer?.swiper) {
      return;
    }

    this.toggleDrawer = !this.swiperContainer.swiper.activeIndex;
  }

  private swiperTransitionStart() {
    this.scrim.classList.add('moving');
  }

  private slidesGridLengthChange() {
    if (!this.swiperContainer?.swiper) {
      return;
    }

    this.classList.add('disable-transition');

    const gridLength = this.swiperContainer.swiper.snapGrid.length;
    this.swiperContainer.swiper.slideTo(gridLength === 1 ? 0 : 1, 0);
    this.disableSlideAnimation = true;
    this.toggleDrawer = true;
    this.toggleDrawer = false;
    this.disableSlideAnimation = false;
    setTimeout(() => this.classList.remove('disable-transition'));
  }

  private swiperTransitionEnd() {
    this.scrim.style.removeProperty('--_modal-drawer-open-progress');
    this.scrim.classList.remove('moving');
  }

  private swiperSliderMove(e: Event) {

    const swiper = (e as any).detail[0];
    this.scrim.style.setProperty('--_modal-drawer-open-progress', `${1 - swiper.progress}`);
  }

  private scrimClick() {
    this.toggleDrawer = false;
    this.swiperContainer?.swiper?.slideTo(1);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-side-navigation': UmSideNavigation;
  }
}
