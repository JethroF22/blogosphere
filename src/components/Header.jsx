import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

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
      <div className="header">
        <Link to="/">
          <h3 className="header__title">Blogosphere</h3>
        </Link>
        <div className="header__right">
          {!this.props.token ? (
            <Fragment>
              <Link to="/register" className="header__text header__links">
                Register
              </Link>
              <Link to="/login" className="header__text header__links">
                Login
              </Link>
            </Fragment>
          ) : (
            <Fragment>
              <div className="uk-inline header__photo">
                <button
                  className="uk-button uk-button-default button"
                  type="button"
                >
                  <div className="">
                    {this.props.userPhoto ? (
                      <img src={this.props.userPhoto} />
                    ) : (
                      <FontAwesomeIcon icon={faUserCircle} size="3x" />
                    )}
                  </div>
                </button>
                <div uk-dropdown="mode: click">
                  <ul className="uk-nav uk-dropdown-nav">
                    <li>
                      <Link
                        to={`/profile/view/${this.props.username}`}
                        className="header__text"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/blog/create" className="header__text">
                        New Post
                      </Link>
                    </li>
                    <li>
                      <Link
                        to=""
                        onClick={this.clearUserDetails}
                        className="header__text"
                      >
                        Log Out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  username: state.auth.username,
  userPhoto: state.profile.photo
});

const mapDispatchToProps = dispatch => ({
  clearUserDetails: () => dispatch(clearUserDetails()),
  clearProfileDetails: () => dispatch(clearProfileDetails())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageHeader);
