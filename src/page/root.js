import { define, html } from "../web_modules/hybrids.js";
import { renderAsync } from "../html-helper.js";
import { store } from "../state.js";
import "./layout.js";

const Root = {
  view: {
    connect: (host, key, invalidate) => store.subscribe(invalidate),
    get: () => store.getState().view,
  },
  render: ({ view }) =>
    html`
      <app-layout>
        ${renderAsync(view)}
      </app-layout>
    `,
};

define("app-root", Root);

export default Root;
