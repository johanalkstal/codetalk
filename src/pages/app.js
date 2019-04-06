import React, { Component } from "react";
import Loadable from "react-loadable";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import store from "../state/store";
import Loading from "../components/loading";
import Layout from "./layout";

const Home = Loadable({
  loader: () => import("./home"),
  loading: Loading,
});

const SignIn = Loadable({
  loader: () => import("./sign-in"),
  loading: Loading,
});

const SignOut = Loadable({
  loader: () => import("./sign-out"),
  loading: Loading,
});

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <Switch>
            <Layout>
              <Route path="/" exact component={Home} />
              <Route path="/sign-in" component={SignIn} />
              <Route path="/sign-out" component={SignOut} />
            </Layout>
          </Switch>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
