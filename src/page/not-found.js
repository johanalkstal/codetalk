import { define, html } from "../web_modules/hybrids.js";

export const NotFound = {
  render: () => html`
    <h2>404</h2>
  `,
};

export const element = html`
  <app-not-found></app-not-found>
`;

define("app-not-found", NotFound);
