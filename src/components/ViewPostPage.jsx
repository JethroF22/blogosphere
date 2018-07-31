import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";

import { getPost } from "../actions/blog";
import { followUnfollowAuthor } from "../actions/profile";
import { likeUnlikePost } from "../actions/blog";

class ViewPostPage extends Component {
  state = {
    followed: false,
    liked: false
  };

  componentDidMount() {
    this.props.getPost(this.props.match.params.slug).then(() => {
      if (this.props.actionStatus === "Action failed") {
        this.props.history.push("/404");
      } else {
        if (this.props.followedAuthors) {
          this.props.followedAuthors.forEach(author => {
            if (author.username === this.props.post.author.username) {
              this.setState(() => ({
                followed: true
              }));
            }
          });
        }
        if (this.props.likedPosts) {
          this.props.likedPosts.forEach(post => {
            if (post._id === this.props.post._id) {
              this.setState(() => ({ liked: true }));
            }
          });
        }
      }
    });
  }

  followAuthor = e => {
    this.props
      .followAuthor(this.props.post.author, this.props.token)
      .then(() => {
        if (this.props.actionStatus === "Action successful") {
          console.log("followed");
          this.setState(() => ({
            followed: true
          }));
        }
      });
  };

  likePost = e => {
    this.props.likePost(this.props.post, this.props.token).then(() => {
      if (this.props.actionStatus === "Action successful") {
        console.log("liked");
        this.setState(() => ({
          liked: true
        }));
      }
    });
  };

  render() {
    return (
      <div className="container">
        {this.props.post ? (
          <div className="post">
            <h1 className="post__title">{this.props.post.title}</h1>
            <p className="post__subtitle">
              {" "}
              Published by{" "}
              <Link
                to={{
                  pathname: `/profile/view/${this.props.post.author.username}`,
                  state: { username: this.props.post.author.username }
                }}
              >
                {this.props.post.author.username}{" "}
              </Link>
              on {moment(this.props.post.createdAt).format("MMM Do YY")}
            </p>
            <img
              uk-img={`dataSrc: ${this.props.post.coverPhotoURL}`}
              className="post__image"
            />

            <p className="post__body">{this.props.post.body}</p>
            {this.props.post.updatedAt && (
              <p>
                Updated on{" "}
                {moment(this.props.post.updatedAt).format("MMM Do YY")}
              </p>
            )}
            <hr className="uk-divider-icon" />
            {this.props.token ? (
              this.props.post.author !== this.props.username && (
                <div className="post__button-container">
                  <button
                    className="uk-button uk-button-default button"
                    onClick={this.state.followed ? null : this.followAuthor}
                    disabled={this.state.followed}
                  >
                    {this.state.followed
                      ? "Followed"
                      : `Follow ${this.props.post.author.username}`}
                  </button>
                  <button
                    className="uk-button uk-button-default button"
                    onClick={this.state.liked ? null : this.likePost}
                    disabled={this.state.liked}
                  >
                    {this.state.liked ? "Liked" : "Like post"}
                  </button>
                </div>
              )
            ) : (
              <p className="post__subtitle">
                <Link to="">Sign in</Link> to follow the author or like this
                post!
              </p>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  post: state.blog.currentPost,
  actionStatus: state.status.status,
  token: state.auth.token,
  username: state.auth.username,
  followedAuthors: state.profile.followedAuthors,
  likedPosts: state.profile.likedPosts
});

const mapDispatchToProps = dispatch => ({
  getPost: slug => dispatch(getPost(slug)),
  followAuthor: (author, token) =>
    dispatch(followUnfollowAuthor(author, token, "follow")),
  likePost: (post, token) => dispatch(likeUnlikePost(post, token, "like"))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewPostPage);
