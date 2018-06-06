import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import HomePage from "../components/HomePage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <div>
        <Route exact path="/" component={HomePage} />
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
