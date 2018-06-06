import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => (
  <div>
    <h1>Welcome to Blogosphere!</h1>
    <Link to="/register">Create Account</Link>
    <button>Log In</button>
  </div>
);

export default HomePage;
