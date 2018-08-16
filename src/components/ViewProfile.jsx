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
  state = {
    isOwnProfile: true,
    profileUsername: ""
  };

  componentDidMount() {
    const username = this.props.match.params.username;
    this.props.getPosts(username).then(() => {
      if (username !== this.props.username) {
        this.setState(() => ({
          isOwnProfile: false,
          profileUsername: username
        }));
        this.props.getProfile(username);
      }
    });
  }

  componentWillUnmount() {
    if (!this.state.isOwnProfile) {
      this.props.clearProfile();
      this.props.getProfile(this.props.username);
    }
  }

  followAuthor = e => {
    this.props
      .followAuthor(this.state.profileUsername, this.props.token)
      .then(() => {
        if (this.props.actionStatus === "Action successful") {
          console.log("followed");
          this.setState(() => ({
            followed: true
          }));
        }
      });
  };

  render() {
    return (
      <div className="profile">
        <div className="profile__header">
          <div>
            <h1 className="profile__title">
              {this.props.match.params.username}
              {this.state.isOwnProfile ? (
                <Link
                  to="/profile/edit"
                  className="uk-button uk-button-default button button--profile"
                >
                  Edit Profile
                </Link>
              ) : (
                <button
                  className="uk-button uk-button-default button button--profile"
                  type="button"
                  onClick={this.followAuthor}
                >
                  Follow
                </button>
              )}
            </h1>
            {this.props.profile.bio && (
              <p className="profile__bio">{this.props.profile.bio}</p>
            )}
            {this.props.profile.followers && (
              <p className="profile__subtitle">
                {this.props.followersCount} follower
                {this.props.followersCount === 1 ? "" : "s"}
              </p>
            )}
          </div>

          <div className="profile__photo">
            <img src={this.props.profile.photo} />
          </div>
        </div>
        <ul data-uk-tab="active: 0" className="tab">
          <li>
            <a href="#" className="tab__label">
              Published Posts
            </a>
          </li>
          <li>
            <a href="#" className="tab__label">
              Liked Posts
            </a>
          </li>
        </ul>
        <ul className="uk-switcher">
          <li>
            {this.props.publishedPosts.length > 0 ? (
              <ArticleList posts={this.props.publishedPosts} />
            ) : (
              <Fragment>
                <p className="profile__message">
                  {this.state.isOwnProfile
                    ? "You have"
                    : `${this.state.profileUsername} has`}{" "}
                  yet to publish any posts.
                </p>
                {this.state.isOwnProfile && (
                  <p className="profile__message">
                    Click <Link to="/blog/create">here</Link> to create your
                    first post right now!
                  </p>
                )}
              </Fragment>
            )}
          </li>
          <li>
            {this.props.likedPosts.length > 0 ? (
              <ArticleList posts={this.props.likedPosts} />
            ) : (
              <p className="profile__message">
                {this.state.isOwnProfile
                  ? "You have"
                  : `${this.state.profileUsername} has`}{" "}
                yet to like any posts
              </p>
            )}
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  username: state.auth.username,
  profile: state.profile,
  actionStatus: state.status.status,
  followersCount: state.profile.followers ? state.profile.followers.length : 0,
  likedPosts: state.profile.likedPosts || [],
  publishedPosts: state.profile.publishedPosts || [],
  followedAuthors: state.profile.followedAuthors.map(author => author.username)
});

const mapDispatchToProps = dispatch => ({
  getProfile: username => dispatch(getProfile(username)),
  clearProfile: () => dispatch(clearProfileDetails()),
  getPosts: username => dispatch(getPostsByAuthor(username)),
  followAuthor: (author, token) =>
    dispatch(followUnfollowAuthor(author, token, "follow"))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewProfile);
