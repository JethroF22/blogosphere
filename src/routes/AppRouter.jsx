import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import createHistory from "history/createBrowserHistory";

import PrivateRoute from "./PrivateRoute";
import HomePage from "../components/HomePage";
import Error404 from "../components/Error404";
import RegistrationPage from "../components/RegistrationPage";
import LoginPage from "../components/LoginPage";
import CreatePostPage from "../components/CreatePostPage";
import ViewPostPage from "../components/ViewPostPage";
import EditPostPage from "../components/EditPostPage";
import CreateProfile from "../components/CreateProfile";
import ViewProfile from "../components/ViewProfile";
import EditProfile from "../components/EditProfile";
import Header from "../components/Header";

export const history = createHistory();

const AppRouter = () => {
  return (
    <Router history={history}>
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/register" component={RegistrationPage} />
          <Route path="/login" component={LoginPage} />
          <PrivateRoute path="/blog/create" component={CreatePostPage} />
          <Route path="/blog/view/:slug" component={ViewPostPage} />
          <PrivateRoute path="/blog/edit/:slug" component={EditPostPage} />
          <PrivateRoute path="/profile/create" component={CreateProfile} />
          <Route path="/profile/view/:username" component={ViewProfile} />
          <PrivateRoute path="/profile/edit/" component={EditProfile} />
          <Route component={Error404} />
        </Switch>
      </div>
    </Router>
  );
};

export default AppRouter;
