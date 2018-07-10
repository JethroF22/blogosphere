import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import HomePage from "../components/HomePage";
import Error404 from "../components/Error404";
import RegistrationPage from "../components/RegistrationPage";
import LoginPage from "../components/LoginPage";
import CreatePostPage from "../components/CreatePostPage";
import ViewPostPage from "../components/ViewPostPage";
import EditPostPage from "../components/EditPostPage";
import CreateProfile from "../components/CreateProfile";
import ViewProfile from "../components/ViewProfile";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/register" component={RegistrationPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/blog/create" component={CreatePostPage} />
          <Route path="/blog/view/:slug" component={ViewPostPage} />
          <Route path="/blog/edit/:slug" component={EditPostPage} />
          <Route path="/profile/create" component={CreateProfile} />
          <Route path="/profile/view/:username" component={ViewProfile} />
          <Route component={Error404} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
