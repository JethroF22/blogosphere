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

  unfollowAuthor = e => {
    this.props
      .unfollowAuthor(this.props.post.author, this.props.token)
      .then(() => {
        if (this.props.actionStatus === "Action successful") {
          console.log("Unfollowed");
          this.setState(() => ({
            followed: false
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

  unlikePost = e => {
    this.props.unlikePost(this.props.post, this.props.token).then(() => {
      if (this.props.actionStatus === "Action successful") {
        console.log("unliked");
        this.setState(() => ({ liked: false }));
      }
    });
  };

  render() {
    return (
      <div>
        {this.props.post ? (
          <div>
            <h1>{this.props.post.title}</h1>
            <p>
              <em>
                {" "}
                Created by{" "}
                <Link
                  to={{
                    pathname: `/profile/view/${
                      this.props.post.author.username
                    }`,
                    state: { username: this.props.post.author.username }
                  }}
                >
                  {this.props.post.author.username}{" "}
                </Link>
                on {moment(this.props.post.createdAt).format("MMM Do YY")}
              </em>
            </p>
            <p>{this.props.post.body}</p>
            {this.props.post.updatedAt && (
              <p>
                Updated on{" "}
                {moment(this.props.post.updatedAt).format("MMM Do YY")}
              </p>
            )}
            {this.props.token &&
              (this.props.post.author !== this.props.username && (
                <div>
                  <button
                    onClick={
                      this.state.followed
                        ? this.unfollowAuthor
                        : this.followAuthor
                    }
                  >
                    {this.state.followed ? "Unfollow" : "Follow"} author
                  </button>
                  <button
                    onClick={this.state.liked ? this.unlikePost : this.likePost}
                  >
                    {this.state.liked ? "Unlike" : "Like"} post
                  </button>
                </div>
              ))}
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
  unfollowAuthor: (author, token) =>
    dispatch(followUnfollowAuthor(author, token, "unfollow")),
  likePost: (post, token) => dispatch(likeUnlikePost(post, token, "like")),
  unlikePost: (post, token) => dispatch(likeUnlikePost(post, token, "unlike"))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewPostPage);
