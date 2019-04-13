import { html } from "./web_modules/hybrids.js";

export function renderAsync(promise) {
  return html.resolve(
    promise.then(module => module.element),
    html`
      <p>Loading...</p>
    `
  );
}
