import { createStore } from "./web_modules/redux.js";

const initialState = {
  view: null,
};

function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case "SET_VIEW":
      return {
        ...state,
        view: payload,
      };
  }
}

export const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
