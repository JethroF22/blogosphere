import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";

import authReducer from "../reducers/auth";
import blogReducer from "../reducers/blog";
import statusReducer from "../reducers/status";
import errorReducer from "../reducers/error";
import profileReducer from "../reducers/profile";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      blog: blogReducer,
      status: statusReducer,
      error: errorReducer,
      profile: profileReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
};
