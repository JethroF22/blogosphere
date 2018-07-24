import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { clearProfileDetails } from "../actions/profile";
import { clearUserDetails } from "../actions/auth";

class PageHeader extends Component {
  clearUserDetails = e => {
    localStorage.removeItem("token");
    this.props.clearUserDetails();
    this.props.clearProfileDetails();
  };

  render() {
    return (
      <div>
        <Link to="/">
          <h3>Blogosphere</h3>
        </Link>
        {!this.props.token ? (
          <Fragment>
            <Link to="/register">
              <p>Register</p>
            </Link>
            <Link to="/login">
              <p>Login</p>
            </Link>
          </Fragment>
        ) : (
          <div>
            <p>{this.props.username}</p>
            <Link to="/blog/create">Create Post</Link>
            <br />
            <button onClick={this.clearUserDetails}>Log Out</button>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  username: state.auth.username
});

const mapDispatchToProps = dispatch => ({
  clearUserDetails: () => dispatch(clearUserDetails()),
  clearProfileDetails: () => dispatch(clearProfileDetails())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageHeader);
