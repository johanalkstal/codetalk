import { define, html } from "../web_modules/hybrids.js";

export const Home = {
  render: () => html`
    <h2>Home</h2>
    <a href="/about">About</a>
  `,
};

export const element = html`
  <app-home></app-home>
`;

define("app-home", Home);
