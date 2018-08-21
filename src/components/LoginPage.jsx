import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import validator from "validator";

import { startAuthentication } from "../actions/auth";

export class LoginPage extends Component {
  state = {
    password: "",
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

  onSubmit = e => {
    e.preventDefault();

    const isValidEmail =
      this.state.email && validator.isEmail(this.state.email);
    const isValidPassword = this.state.password;

    if (isValidPassword && isValidEmail) {
      this.props
        .login(_.pick(this.state, ["email", "password"]))
        .then(token => {
          if (this.props.actionStatus === "Action successful") {
            localStorage.setItem("token", token);
            this.props.history.push("/");
          }
        });
    } else {
      const errors = {};
      if (!isValidEmail) {
        errors.email =
          "Please enter the email you used to register your account";
      }
      if (!isValidPassword) {
        errors.password = "Please enter your password";
      }
      this.setState(() => ({ errors }));
    }
  };

  render() {
    return (
      <div className="form">
        <h1 className="form__title">Login</h1>
        <form onSubmit={this.onSubmit} className="uk-form-stacked">
          {this.props.authenticationError && (
            <p className="form__error">{this.props.authenticationError}</p>
          )}
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
          <button
            type="submit"
            className="uk-button uk-button-default button button--form"
            disabled={this.props.actionStatus === "Action in progress"}
          >
            {this.props.actionStatus === "Action in progress" ? (
              <Fragment>
                <span>Logging in </span>{" "}
                <FontAwesomeIcon icon={faSpinner} spin />
              </Fragment>
            ) : (
              "Login"
            )}
          </button>
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
