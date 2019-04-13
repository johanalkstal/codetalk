import { define, html } from "../web_modules/hybrids.js";

export const Layout = {
  render: () => html`
    <header>
      <h1>codetalk.dev</h1>
    </header>
    <slot></slot>
  `,
};

define("app-layout", Layout);
