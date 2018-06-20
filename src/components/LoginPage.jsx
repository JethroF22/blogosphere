import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import { startAuthentication } from "../actions/auth";

export class LoginPage extends Component {
  state = {
    password: "",
    email: ""
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

    this.props.login(_.pick(this.state, ["email", "password"])).then(token => {
      if (this.props.actionStatus === "Action successful") {
        localStorage.setItem("token", token);
        this.props.history.push("/");
      }
    });
  };

  render() {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.onSubmit}>
          {this.props.authenticationError && (
            <p>{this.props.authenticationError}</p>
          )}
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

const mapStateToProps = state => ({
  actionStatus: state.status.status,
  authenticationError: state.error.message
});

const mapDispatchToProps = dispatch => ({
  login: userCredentials =>
    dispatch(startAuthentication(userCredentials, "login "))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
