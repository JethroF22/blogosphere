import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import { validateRegistrationForm as validateForm } from "../utils/forms";
import { startAuthentication } from "../actions/auth";

export class RegistrationPage extends Component {
  state = {
    password: "",
    confirmPassword: "",
    username: "",
    email: "",
    errors: {}
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

  onSubmit = e => {
    e.preventDefault();
    const errors = validateForm(this.state);
    this.setState(() => ({
      errors
    }));
    if (Object.keys(errors).length === 0) {
      this.props.register(
        _.pick(this.state, ["password", "username", "email"])
      );
    }
  };

  render() {
    return (
      <div>
        <h1>Create An Account</h1>
        <form onSubmit={this.onSubmit}>
          {this.props.authenticationError && (
            <p>{this.props.authenticationError}</p>
          )}
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.onUsernameChange}
          />
          {this.state.errors.username && <p>{this.state.errors.username}</p>}
          <br />
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            name="email"
            value={this.state.email}
            onChange={this.onEmailChange}
          />
          {this.state.errors.email && <p>{this.state.errors.email}</p>}

          <br />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.onPasswordChange}
          />
          {this.state.errors.password && <p>{this.state.errors.password}</p>}

          <br />
          <label htmlFor="confirmPassword">Confirm Password: </label>
          <input
            type="password"
            name="confirmPassword"
            value={this.state.confirmPassword}
            onChange={this.onConfirmPasswordChange}
          />
          {this.state.errors.confirmPassword && (
            <p>{this.state.errors.confirmPassword}</p>
          )}

          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticationError: state.error.message
});

const mapDispatchToProps = dispatch => ({
  register: userCredentials =>
    dispatch(startAuthentication(userCredentials, "register"))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationPage);
