import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import ArticleList from "./ArticleList";
import {
  getProfile,
  clearProfileDetails,
  getPostsByAuthor
} from "../actions/profile";

class ViewProfile extends Component {
  componentDidMount() {
    const username = this.props.match.params.username;
    this.props.getProfile(username).then(() => {
      if (this.props.actionStatus === "Action successful") {
        this.props.getPosts(username);
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
        <Link to="/profile/edit" className="uk-button uk-button-default button">
          Edit Profile
        </Link>
        <img src={this.props.profile.photo} height="400" width="400" />
        {this.props.profile.bio && <p>{this.props.profile.bio}</p>}
        {this.props.profile.followers && (
          <p>
            {this.props.followersCount} follower{this.props.followersCount > 0
              ? "s"
              : ""}
          </p>
        )}
        {this.props.publishedPosts.length > 0 && (
          <Fragment>
            <h2>Published Posts</h2>
            <ArticleList posts={this.props.publishedPosts} />
          </Fragment>
        )}
        {this.props.likedPosts.length > 0 && (
          <Fragment>
            <h2>Liked Posts</h2>
            <ArticleList posts={this.props.likedPosts} />
          </Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  actionStatus: state.status.status,
  followersCount: state.profile.followers ? state.profile.followers.length : 0,
  likedPosts: state.profile.likedPosts || [],
  publishedPosts: state.profile.publishedPosts || []
});

const mapDispatchToProps = dispatch => ({
  getProfile: username => dispatch(getProfile(username)),
  clearProfile: () => dispatch(clearProfileDetails()),
  getPosts: username => dispatch(getPostsByAuthor(username))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewProfile);
