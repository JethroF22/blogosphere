import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import configureStore from "./store/configureStore";
import AppRouter from "./routes/AppRouter";
import { tokenAuthentication } from "./actions/auth";
import LoadingPage from "./components/LoadingPage";

const store = configureStore();
const token = localStorage.getItem("token");
const documentRoot = document.getElementById("app");

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
  store.dispatch(tokenAuthentication(token)).then(() => render());
} else {
  render();
}
