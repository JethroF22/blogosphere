import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";

import { getPost } from "../actions/blog";
import { followUnfollowAuthor } from "../actions/profile";

class ViewPostPage extends Component {
  state = {
    followed: false
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
            {this.props.post.author !== this.props.username && (
              <button
                onClick={
                  this.state.followed ? this.unfollowAuthor : this.followAuthor
                }
              >
                {this.state.followed ? "Unfollow" : "Follow"} author
              </button>
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
  followedAuthors: state.profile.followedAuthors
});

const mapDispatchToProps = dispatch => ({
  getPost: slug => dispatch(getPost(slug)),
  followAuthor: (author, token) =>
    dispatch(followUnfollowAuthor(author, token, "follow")),
  unfollowAuthor: (author, token) =>
    dispatch(followUnfollowAuthor(author, token, "unfollow"))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewPostPage);
