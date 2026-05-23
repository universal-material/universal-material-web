import { PropertyValues } from '@lit/reactive-element';
import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import { styleMap } from 'lit/directives/style-map.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './slider.styles.js';

type LabelFormat = (value: number) => string;
type Thumb = 'start' | 'end';

export type SliderSize = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large';

// Px distance from handle center to track-segment edge: handle-width/2 + 6dp handle-gap.
const SIZE_GAP_PX: Record<SliderSize, number> = {
  'extra-small': 8,  // 4/2 + 6
  small: 8,
  medium: 9,         // 6/2 + 6
  large: 9,
  'extra-large': 10, // 8/2 + 6
};

/**
 * Material 3 expressive slider. Single-thumb by default; becomes a range slider
 * when both `value-start` and `value-end` are set (or `range` is forced).
 *
 * @fires input - Dispatched continuously while dragging.
 * @fires change - Dispatched when the user commits a value change.
 * @csspart track - The track container.
 * @csspart track-inactive-start - The inactive segment before the start handle (range mode only).
 * @csspart track-active - The highlighted segment between (or up to) the thumbs.
 * @csspart track-inactive-end - The inactive segment after the end handle.
 * @csspart thumb - The thumb indicator (or the start thumb in range mode).
 * @csspart thumb-end - The end thumb in range mode.
 * @csspart value-indicator - The floating value indicator shown in `discrete` mode while dragging.
 * @csspart stop-indicator - The dot at each end of the slider.
 */
@customElement('u-slider')
export class Slider extends LitElement {
  static override styles = [baseStyles, styles];

  static readonly formAssociated = true;

  protected readonly elementInternals: ElementInternals;

  constructor() {
    super();
    this.elementInternals = this.attachInternals();
  }

  /** Minimum value. */
  @property({ type: Number }) min = 0;

  /** Maximum value. */
  @property({ type: Number }) max = 100;

  /** Step increment. Use `0` for fully continuous values. */
  @property({ type: Number }) step = 1;

  /** Current value (single-thumb mode). */
  @property({ type: Number }) value: number | undefined;

  /** Start value (range mode). */
  @property({ type: Number, attribute: 'value-start' }) valueStart: number | undefined;

  /** End value (range mode). */
  @property({ type: Number, attribute: 'value-end' }) valueEnd: number | undefined;

  /**
   * Forces range mode. Auto-enabled when both `value-start` and `value-end`
   * are provided.
   */
  @property({ type: Boolean, reflect: true }) range = false;

  /** Shows tick marks and a floating value indicator while dragging. */
  @property({ type: Boolean, reflect: true }) discrete = false;

  /** Shows tick marks without enabling the floating value indicator. */
  @property({ type: Boolean, reflect: true }) ticks = false;

  /** Disables the slider. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Form-association name. */
  @property({ reflect: true }) name = '';

  /** Visual size variant. */
  @property({ reflect: true }) size: SliderSize = 'extra-small';

  /** Custom formatter for the floating value indicator. */
  @property({ attribute: false }) labelFormat: LabelFormat = (v) => String(v);

  @state() private _dragging = false;
  @state() private _activeThumb: Thumb | null = null;
  @state() private _hoveredThumb: Thumb | null = null;

  @query('#input') private readonly _input!: HTMLInputElement;
  @query('#input-end') private readonly _inputEnd!: HTMLInputElement | null;
  @query('.container') private readonly _container!: HTMLElement;

  get form(): HTMLFormElement | null {
    return this.elementInternals.form;
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has('valueStart') || changed.has('valueEnd')) {
      if (this.valueStart !== undefined && this.valueEnd !== undefined) {
        this.range = true;
      }
    }

    if (this.range) {
      if (this.valueStart === undefined) this.valueStart = this.min;
      if (this.valueEnd === undefined) this.valueEnd = this.max;
      if (this.valueStart > this.valueEnd) {
        [this.valueStart, this.valueEnd] = [this.valueEnd, this.valueStart];
      }
    } else if (this.value === undefined) {
      this.value = (this.max - this.min) / 2 + this.min;
    }
  }

  protected override firstUpdated(): void {
    this.#updateFormValue();
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has('value') || changed.has('valueStart') || changed.has('valueEnd') || changed.has('name')) {
      this.#updateFormValue();
    }
  }

  override render(): HTMLTemplateResult {
    const range = (this.max - this.min) || 1;
    const startPct = this.range ? this.#pct(this.valueStart!) : 0;
    const endPct = this.range ? this.#pct(this.valueEnd!) : this.#pct(this.value!);
    const tickCount = (this.discrete || this.ticks) && this.step > 0 ? Math.floor(range / this.step) + 1 : 0;
    const gap = SIZE_GAP_PX[this.size];

    const collapseStart = !this.range || startPct <= 0;
    const collapseEnd = endPct >= 100;

    // Handle position formula: walks the same coordinate system as the track segments
    // and ticks, so a handle at value v sits exactly on the tick at v. The travel range is
    // (container width − handle width) and the handle's center starts at handle-width/2.
    const handlePos = (pct: number) =>
      `calc(${pct / 100} * (100% - var(--_handle-width)) + var(--_handle-width) / 2)`;

    const activeStart = !this.range
      ? '0'
      : (collapseStart ? '0' : `calc(${startPct}% + ${gap}px)`);
    const activeEnd = collapseEnd ? '0' : `calc(${100 - endPct}% + ${gap}px)`;
    const activeRadius = this.#activeRadius(collapseStart, collapseEnd);

    const fullR = 'calc(var(--_track-height) / 2)';
    const innerR = 'var(--_inner-corner)';
    const inactiveStartRadius = `${fullR} ${collapseStart ? fullR : innerR} ${collapseStart ? fullR : innerR} ${fullR}`;
    const inactiveEndRadius = `${collapseEnd ? fullR : innerR} ${fullR} ${fullR} ${collapseEnd ? fullR : innerR}`;

    return html`
      <div
        class="container ${classMap({ dragging: this._dragging, range: this.range, discrete: this.discrete })}"
        @pointerdown=${this.#handleContainerPointerDown}
        @pointermove=${this.#handleHoverMove}
        @pointerleave=${this.#handleHoverLeave}
      >
        <div class="track" part="track">
          ${this.range && !collapseStart
            ? html`<div
                class="segment inactive inactive-start"
                part="track-inactive-start"
                style=${styleMap({
                  insetInlineStart: '0',
                  insetInlineEnd: `calc(${100 - startPct}% + ${gap}px)`,
                  borderRadius: inactiveStartRadius,
                })}
              ></div>`
            : nothing}
          <div
            class="segment active"
            part="track-active"
            style=${styleMap({
              insetInlineStart: activeStart,
              insetInlineEnd: activeEnd,
              borderRadius: activeRadius,
            })}
          ></div>
          ${!collapseEnd
            ? html`<div
                class="segment inactive inactive-end"
                part="track-inactive-end"
                style=${styleMap({
                  insetInlineStart: `calc(${endPct}% + ${gap}px)`,
                  insetInlineEnd: '0',
                  borderRadius: inactiveEndRadius,
                })}
              ></div>`
            : nothing}
          ${tickCount > 0 ? this.#renderTicks(tickCount, startPct, endPct, gap) : nothing}
          ${tickCount === 0
            ? html`<span
                  class="stop-indicator leading"
                  part="stop-indicator"
                  style=${styleMap({
                    backgroundColor: this.range && !collapseStart
                      ? 'var(--_stop-indicator-inactive-color)'
                      : 'var(--_stop-indicator-active-color)',
                  })}
                ></span>
                <span
                  class="stop-indicator trailing"
                  part="stop-indicator"
                  style=${styleMap({
                    backgroundColor: collapseEnd
                      ? 'var(--_stop-indicator-active-color)'
                      : 'var(--_stop-indicator-inactive-color)',
                  })}
                ></span>`
            : nothing}
        </div>

        ${this.range
          ? html`
            <input
              id="input"
              class="native"
              type="range"
              aria-label="Start value"
              .min=${String(this.min)}
              .max=${String(this.valueEnd!)}
              step=${this.step || 'any'}
              .value=${live(String(this.valueStart!))}
              ?disabled=${this.disabled}
              @input=${this.#handleStartInput}
              @change=${this.#handleChange}
            />
            <input
              id="input-end"
              class="native"
              type="range"
              aria-label="End value"
              .min=${String(this.valueStart!)}
              .max=${String(this.max)}
              step=${this.step || 'any'}
              .value=${live(String(this.valueEnd!))}
              ?disabled=${this.disabled}
              @input=${this.#handleEndInput}
              @change=${this.#handleChange}
            />
            <div
              class=${classMap({
                thumb: true,
                'thumb-start': true,
                'active-thumb': this._activeThumb === 'start',
                hovered: this._hoveredThumb === 'start',
              })}
              part="thumb"
              style=${styleMap({ insetInlineStart: handlePos(startPct) })}
            >
              <span class="focus-ring"></span>
              ${this.#renderValueIndicator('start', this.valueStart!)}
            </div>
            <div
              class=${classMap({
                thumb: true,
                'thumb-end': true,
                'active-thumb': this._activeThumb === 'end',
                hovered: this._hoveredThumb === 'end',
              })}
              part="thumb-end"
              style=${styleMap({ insetInlineStart: handlePos(endPct) })}
            >
              <span class="focus-ring"></span>
              ${this.#renderValueIndicator('end', this.valueEnd!)}
            </div>
          `
          : html`
            <input
              id="input"
              class="native"
              type="range"
              aria-label=${this.getAttribute('aria-label') ?? 'Slider'}
              .min=${String(this.min)}
              .max=${String(this.max)}
              step=${this.step || 'any'}
              .value=${live(String(this.value!))}
              ?disabled=${this.disabled}
              @input=${this.#handleSingleInput}
              @change=${this.#handleChange}
            />
            <div
              class=${classMap({
                thumb: true,
                'active-thumb': this._activeThumb === 'end',
                hovered: this._hoveredThumb === 'end',
              })}
              part="thumb"
              style=${styleMap({ insetInlineStart: handlePos(endPct) })}
            >
              <span class="focus-ring"></span>
              ${this.#renderValueIndicator('end', this.value!)}
            </div>
          `}
      </div>
    `;
  }

  #activeRadius(collapseStart: boolean, collapseEnd: boolean): string {
    const fullR = 'calc(var(--_track-height) / 2)';
    const innerR = 'var(--_inner-corner)';
    if (this.range) {
      const sR = collapseStart ? fullR : innerR;
      const eR = collapseEnd ? fullR : innerR;
      return `${sR} ${eR} ${eR} ${sR}`;
    }
    const eR = collapseEnd ? fullR : innerR;
    return `${fullR} ${eR} ${eR} ${fullR}`;
  }

  #renderTicks(count: number, startPct: number, endPct: number, gapPx: number): HTMLTemplateResult {
    const ticks = [];
    const trackWidth = this.offsetWidth || 200;
    const gapPct = (gapPx / trackWidth) * 100;
    for (let i = 0; i < count; i++) {
      const pct = (i / (count - 1)) * 100;
      const inActive = pct >= startPct && pct <= endPct;
      const inGap =
        Math.abs(pct - endPct) < gapPct || (this.range && Math.abs(pct - startPct) < gapPct);
      ticks.push(html`<span
        class=${classMap({ tick: true, active: inActive, 'in-gap': inGap })}
        style=${styleMap({ insetInlineStart: `${pct}%` })}
      ></span>`);
    }
    return html`<div class="ticks">${ticks}</div>`;
  }

  #renderValueIndicator(thumb: Thumb, value: number): HTMLTemplateResult | typeof nothing {
    if (!this.discrete) return nothing;
    if (!this._dragging || this._activeThumb !== thumb) return nothing;
    return html`<div class="value-indicator" part="value-indicator">${this.labelFormat(value)}</div>`;
  }

  #pct(value: number): number {
    const range = (this.max - this.min) || 1;
    return ((value - this.min) / range) * 100;
  }

  // Determine slider value from pointer x (clamped to [min, max]).
  #pointerToValue(clientX: number): number {
    const rect = this._container.getBoundingClientRect();
    const padPx = this.#paddingPx();
    const usableWidth = rect.width - padPx * 2;
    const local = Math.max(0, Math.min(usableWidth, clientX - rect.left - padPx));
    const ratio = usableWidth > 0 ? local / usableWidth : 0;
    const raw = this.min + ratio * (this.max - this.min);
    return this.#snap(raw);
  }

  #snap(value: number): number {
    if (!this.step || this.step <= 0) return value;
    const steps = Math.round((value - this.min) / this.step);
    return Math.max(this.min, Math.min(this.max, this.min + steps * this.step));
  }

  #paddingPx(): number {
    // Matches container's padding-inline = handle-width/2 (4-8px depending on size).
    const cs = getComputedStyle(this);
    const handleW = parseFloat(cs.getPropertyValue('--_handle-width')) || 4;
    return handleW / 2;
  }

  #closestThumb(value: number): Thumb {
    if (!this.range) return 'end';
    const startDist = Math.abs(value - (this.valueStart ?? this.min));
    const endDist = Math.abs(value - (this.valueEnd ?? this.max));
    // Bias to 'end' when distances tie and pointer is to the right of midpoint,
    // so clicking past either thumb still moves the natural one.
    if (startDist === endDist) {
      const mid = ((this.valueStart ?? this.min) + (this.valueEnd ?? this.max)) / 2;
      return value < mid ? 'start' : 'end';
    }
    return startDist <= endDist ? 'start' : 'end';
  }

  #handleContainerPointerDown = (e: PointerEvent) => {
    if (this.disabled) return;
    // Ignore non-primary buttons.
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    const value = this.#pointerToValue(e.clientX);
    const thumb = this.#closestThumb(value);
    this.#beginDrag(thumb);
    this.#setThumbValue(thumb, value);
    // Intentionally do NOT focus the input on pointer interaction — that would inherit
    // an active :focus-visible state from prior keyboard navigation and incorrectly show
    // the focus ring on click. The user must Tab to the slider for keyboard control.
    try { this._container.setPointerCapture(e.pointerId); } catch { /* */ }
    this._container.addEventListener('pointermove', this.#handleDragMove);
    this._container.addEventListener('pointerup', this.#handleDragEnd, { once: true });
    this._container.addEventListener('pointercancel', this.#handleDragEnd, { once: true });
  };

  #handleDragMove = (e: PointerEvent) => {
    if (!this._dragging || !this._activeThumb) return;
    const value = this.#pointerToValue(e.clientX);
    this.#setThumbValue(this._activeThumb, value);
  };

  #handleDragEnd = () => {
    this._container.removeEventListener('pointermove', this.#handleDragMove);
    this.#endDrag();
    this.#handleChange();
  };

  // Hover tracking — light up the state layer of the thumb nearest the pointer.
  #handleHoverMove = (e: PointerEvent) => {
    if (this.disabled || this._dragging) return;
    const value = this.#pointerToValue(e.clientX);
    this._hoveredThumb = this.#closestThumb(value);
  };

  #handleHoverLeave = () => {
    if (!this._dragging) this._hoveredThumb = null;
  };

  #setThumbValue(thumb: Thumb, value: number) {
    if (this.range) {
      if (thumb === 'start') {
        this.valueStart = Math.min(value, this.valueEnd!);
      } else {
        this.valueEnd = Math.max(value, this.valueStart!);
      }
    } else {
      this.value = value;
    }
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }

  #beginDrag(thumb: Thumb) {
    this._activeThumb = thumb;
    this._dragging = true;
    this._hoveredThumb = thumb;
  }

  #endDrag = () => {
    this._dragging = false;
    this._activeThumb = null;
  };

  // Keyboard input on the native range inputs still updates the bound value.
  #handleSingleInput = () => {
    this.value = this._input.valueAsNumber;
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  };

  #handleStartInput = () => {
    this.valueStart = Math.min(this._input.valueAsNumber, this.valueEnd!);
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  };

  #handleEndInput = () => {
    this.valueEnd = Math.max(this._inputEnd!.valueAsNumber, this.valueStart!);
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  };

  #handleChange = () => {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  };

  #updateFormValue() {
    if (!this.name) {
      this.elementInternals.setFormValue(null);
      return;
    }
    if (this.range) {
      const data = new FormData();
      data.append(`${this.name}-start`, String(this.valueStart ?? this.min));
      data.append(`${this.name}-end`, String(this.valueEnd ?? this.max));
      this.elementInternals.setFormValue(data);
      return;
    }
    this.elementInternals.setFormValue(String(this.value ?? ''));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-slider': Slider;
  }
}
