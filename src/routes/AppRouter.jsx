import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import HomePage from "../components/HomePage";
import Error404 from "../components/Error404";
import RegistrationPage from "../components/RegistrationPage";
import LoginPage from "../components/LoginPage";
import CreatePostPage from "../components/CreatePostPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/register" component={RegistrationPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/blog/createPost" component={CreatePostPage} />
          <Route component={Error404} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
