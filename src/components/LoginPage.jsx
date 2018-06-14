import React, { Component } from "react";
import { connect } from "react-redux";
import * as _ from "lodash";

import { startAuthentication } from "../actions/auth";

class LoginPage extends Component {
  state = {
    password: "",
    email: "",
    error: ""
  };

  onEmailChange = e => {
    const email = e.target.value;
    this.setState(() => ({
      email
    }));
  };

  onPasswordChange = e => {
    const password = e.target.value;
    this.setState(() => ({
      password
    }));
  };

  onSubmit = e => {
    e.preventDefault();

    this.props
      .login(_.pick(this.state, ["email", "password"]))
      .then(token => {
        this.setState(() => ({ error: "" }));
        localStorage.setItem("token", token);
      })
      .catch(error => {
        this.setState(() => ({ error: "Invalid email/password combination" }));
      });
  };

  render() {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.onSubmit}>
          {this.state.error && <p>{this.state.error}</p>}
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
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  login: userCredentials =>
    dispatch(startAuthentication(userCredentials, "login "))
});

export default connect(
  undefined,
  mapDispatchToProps
)(LoginPage);
