import { define, html } from "../web_modules/hybrids.js";

export const About = {
  render: () => html`
    <h2>About</h2>
    <a href="/">Home</a>
  `,
};

export const element = html`
  <app-about></app-about>
`;

define("app-about", About);
