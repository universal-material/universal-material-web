import { css, CSSResult } from "lit";

export class BaseStyles {
  static styles: CSSResult = css`
    :host,
    * {
      font-family: var(--u-font-family-base, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol");
      box-sizing: border-box;
    }
  `;
}
