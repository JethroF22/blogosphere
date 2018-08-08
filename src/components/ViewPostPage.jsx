import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import Parser from "html-react-parser";
import marked from "marked";

import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import AuthorDetails from "./AuthorDetails";
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
                {this.props.post.author.username === this.props.username
                  ? "you"
                  : this.props.post.author.username}{" "}
              </Link>
              on {moment(this.props.post.createdAt).format("MMM Do YYYY")}
            </p>
            {this.props.post.updatedAt && (
              <p className="post__subtitle">
                Last updated on{" "}
                {moment(this.props.post.updatedAt).format("MMM Do YYYY")}
              </p>
            )}
            <img
              uk-img={`dataSrc: ${this.props.post.coverPhotoURL}`}
              className="post__image"
            />

            <p className="post__body">{Parser(marked(this.props.post.body))}</p>

            <hr className="uk-divider-icon" />
            {this.props.token ? (
              this.props.post.author.username !== this.props.username && (
                <Fragment>
                  <div className="post__likes">
                    <p>
                      {this.props.post.likes}{" "}
                      {`like${this.props.post.likes === 1 ? "" : "s"}`}
                    </p>
                    <button
                      className="uk-button uk-button-default button"
                      onClick={this.state.liked ? null : this.likePost}
                      disabled={this.state.liked}
                    >
                      {this.state.liked ? "Liked" : "Like post"}
                    </button>
                  </div>
                  <AuthorDetails
                    photo={this.props.author.photo}
                    username={this.props.author.username}
                    followed={this.state.followed}
                    followAuthor={this.followAuthor}
                  />
                  <hr className="uk-divider-icon" />
                  <CommentForm />
                  {this.props.post && (
                    <CommentList comments={this.props.comments} />
                  )}
                </Fragment>
              )
            ) : (
              <p className="post__subtitle">
                <Link to="">Sign in</Link> to follow the author, like this post
                or add a comment!
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
  likedPosts: state.profile.likedPosts,
  comments: state.blog.currentPost
    ? state.blog.currentPost.comments.sort((a, b) => a.timestamp < b.timestamp)
    : null,
  author: state.blog.currentPost ? state.blog.currentPost.author : null
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
