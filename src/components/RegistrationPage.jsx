import React, { Component } from "react";

class RegistrationPage extends Component {
  state = {
    password: "",
    confirmPassword: "",
    username: "",
    email: ""
  };

  onEmailChange = e => {
    const email = e.target.value;
    this.setState(() => ({
      email
    }));
  };

  onUsernameChange = e => {
    const username = e.target.value;
    this.setState(() => ({
      username
    }));
  };

  onPasswordChange = e => {
    const password = e.target.value;
    this.setState(() => ({
      password
    }));
  };

  onConfirmPasswordChange = e => {
    const confirmPassword = e.target.value;
    this.setState(() => ({
      confirmPassword
    }));
  };

  render() {
    return (
      <div>
        <h1>Create An Account</h1>
        <form>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.onUsernameChange}
          />
          <br />
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            name="email"
            value={this.state.email}
            onChange={this.onEmailChange}
          />
          <br />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.onPasswordChange}
          />
          <br />
          <label htmlFor="confirmPassword">Confirm Password: </label>
          <input
            type="password"
            name="confirmPassword"
            value={this.state.confirmPassword}
            onChange={this.onConfirmPasswordChange}
          />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default RegistrationPage;
