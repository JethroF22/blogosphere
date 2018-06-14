import React, { Component } from "react";
import { connect } from "react-redux";
import * as _ from "lodash";

class LoginPage extends Component {
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

  render() {
    return (
      <div>
        <h1>Create An Account</h1>
        <form>
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

export default connect(
  undefined,
  mapDispatchToProps
)(LoginPage);
