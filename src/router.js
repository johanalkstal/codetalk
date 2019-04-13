import { html } from "./web_modules/hybrids.js";
import page from "./web_modules/page.js";
import { store } from "./state.js";

page("/", () => {
  store.dispatch({
    type: "SET_VIEW",
    payload: import("./page/home.js"),
  });
});

page("/about", () => {
  store.dispatch({
    type: "SET_VIEW",
    payload: import("./page/about.js"),
  });
});

page("*", () => {
  store.dispatch({
    type: "SET_VIEW",
    payload: import("./page/not-found.js"),
  });
});

page();
