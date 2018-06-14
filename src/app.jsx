import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import configureStore from "./store/configureStore";
import AppRouter from "./routes/AppRouter";

const store = configureStore();
const root = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(root, document.getElementById("app"));
