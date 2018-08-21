import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";

import configureStore from "./store/configureStore";
import AppRouter, { history } from "./routes/AppRouter";
import { tokenAuthentication } from "./actions/auth";
import { getPosts } from "./actions/blog";
import LoadingPage from "./components/LoadingPage";
import "./styles/styles.scss";

const store = configureStore();
const token = localStorage.getItem("token");
const documentRoot = document.getElementById("app");

UIkit.use(Icons);

const render = () => {
  const root = (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );

  ReactDOM.render(root, documentRoot);
};

if (token) {
  ReactDOM.render(<LoadingPage />, documentRoot);
  store.dispatch(tokenAuthentication(token)).then(() => {
    if (history.location.pathname === "/") {
      store.dispatch(getPosts()).then(() => render());
    } else {
      render();
    }
  });
} else {
  render();
}
