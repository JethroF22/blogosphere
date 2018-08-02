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
    this.setState(prevState => ({
      email,
      errors: {
        ...prevState.errors,
        email: ""
      }
    }));
  };

  onUsernameChange = e => {
    const username = e.target.value;
    this.setState(prevState => ({
      username,
      errors: {
        ...prevState.errors,
        username: ""
      }
    }));
  };

  onPasswordChange = e => {
    const password = e.target.value;
    this.setState(prevState => ({
      password,
      errors: {
        ...prevState.errors,
        password: ""
      }
    }));
  };

  onConfirmPasswordChange = e => {
    const confirmPassword = e.target.value;
    this.setState(prevState => ({
      confirmPassword,
      errors: {
        ...prevState.errors,
        confirmPassword: ""
      }
    }));
  };

  onSubmit = e => {
    e.preventDefault();
    const errors = validateForm(this.state);
    this.setState(() => ({
      errors
    }));
    if (Object.keys(errors).length === 0) {
      this.props
        .register(_.pick(this.state, ["password", "username", "email"]))
        .then(token => {
          if (this.props.actionStatus === "Action successful") {
            localStorage.setItem("token", token);
            this.props.history.push("/profile/create");
          }
        });
    }
  };

  render() {
    return (
      <div className="form">
        <h1 className="form__title">Create An Account</h1>
        <form onSubmit={this.onSubmit} className="uk-form-stacked">
          {this.props.authenticationError && (
            <p className="form__error">{this.props.authenticationError}</p>
          )}

          <label htmlFor="username" className="form__label">
            Username:{" "}
          </label>
          {this.state.errors.username && (
            <p className="form__error">{this.state.errors.username}</p>
          )}
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.onUsernameChange}
            className={`uk-input form__input ${
              this.state.errors.username ? "uk-form-danger" : "uk-form-blank"
            }`}
          />

          <br />
          <label htmlFor="email" className="form__label">
            Email:{" "}
          </label>
          {this.state.errors.email && (
            <p className="form__error">{this.state.errors.email}</p>
          )}
          <input
            type="text"
            name="email"
            value={this.state.email}
            onChange={this.onEmailChange}
            className={`uk-input form__input ${
              this.state.errors.email ? "uk-form-danger" : "uk-form-blank"
            }`}
          />

          <br />
          <label htmlFor="password" className="form__label">
            Password:{" "}
          </label>
          {this.state.errors.password && (
            <p className="form__error">{this.state.errors.password}</p>
          )}
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.onPasswordChange}
            className={`uk-input form__input ${
              this.state.errors.password ? "uk-form-danger" : "uk-form-blank"
            }`}
          />

          <br />
          <label htmlFor="confirmPassword" className="form__label">
            Confirm Password:{" "}
          </label>
          {this.state.errors.confirmPassword && (
            <p className="form__error">{this.state.errors.confirmPassword}</p>
          )}
          <input
            type="password"
            name="confirmPassword"
            value={this.state.confirmPassword}
            onChange={this.onConfirmPasswordChange}
            className={`uk-input form__input ${
              this.state.errors.confirmPassword
                ? "uk-form-danger"
                : "uk-form-blank"
            }`}
          />

          <br />
          <button type="submit" className="uk-button uk-button-default button">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticationError: state.error.message,
  actionStatus: state.status.status
});

const mapDispatchToProps = dispatch => ({
  register: userCredentials =>
    dispatch(startAuthentication(userCredentials, "register"))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationPage);
