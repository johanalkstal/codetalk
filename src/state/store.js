import { combineReducers, createStore } from "redux";
import user from "./user";

const reducers = combineReducers({
  user,
});

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
