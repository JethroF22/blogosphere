import React, { Component } from "react";

class RegistrationPage extends Component {
  state = {
    password: "",
    confirmPassword: "",
    username: "",
    email: ""
  };

  render() {
    return (
      <div>
        <h1>Create An Account</h1>
        <form>
          <label htmlFor="username">Username: </label>
          <input type="text" name="username" />
          <br />
          <label htmlFor="email">Email: </label>
          <input type="text" name="email" />
          <br />
          <label htmlFor="password">Password: </label>
          <input type="password" name="password" />
          <br />
          <label htmlFor="confirmPassword">Confirm Password: </label>
          <input type="password" name="confirmPassword" />
          <br />
        </form>
      </div>
    );
  }
}

export default RegistrationPage;
