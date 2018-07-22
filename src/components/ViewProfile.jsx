import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getProfile, clearProfileDetails } from "../actions/profile";

class ViewProfile extends Component {
  componentDidMount() {
    const username = this.props.match.params.username;
    console.log(username);
    this.props.getProfile(username).then(() => {
      if (this.props.actionStatus === "Action successful") {
        console.log("Success");
      } else {
        console.log("Error");
      }
    });
  }

  componentWillUnmount() {
    this.props.clearProfile();
  }

  render() {
    return (
      <div>
        <h1>{this.props.match.params.username}</h1>
        <Link to="/">Home</Link>
        <img src={this.props.profile.photo} height="400" width="400" />
        <p>{this.props.profile.bio}</p>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  actionStatus: state.status.status
});

const mapDispatchToProps = dispatch => ({
  getProfile: username => dispatch(getProfile(username)),
  clearProfile: () => dispatch(clearProfileDetails())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewProfile);
