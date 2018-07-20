import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getPosts } from "../actions/blog";
import { clearUserDetails } from "../actions/auth";
import { clearProfileDetails } from "../actions/profile";
import ArticleList from "./ArticleList";

class HomePage extends Component {
  componentDidMount() {
    if (!this.props.posts) {
      this.props.getPosts();
    }
  }

  clearUserDetails = e => {
    localStorage.removeItem("token");
    this.props.clearUserDetails();
    this.props.clearProfileDetails();
  };

  render() {
    return (
      <div>
        <h1>Blogosphere</h1>
        {!this.props.token ? (
          <div>
            <Link to="/register">Create Account</Link>
            <br />
            <Link to="/login">Login</Link>
            <br />
          </div>
        ) : (
          <div>
            <p>{this.props.username}</p>
            <Link to="/blog/create">Create Post</Link>
            <br />
            <button onClick={this.clearUserDetails}>Log Out</button>
          </div>
        )}
        {this.props.posts ? (
          <ArticleList posts={this.props.posts} />
        ) : (
          <p>No posts to be displayed</p>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.blog.posts,
  username: state.auth.username,
  token: state.auth.token
});

const mapDispatchToProps = dispatch => ({
  getPosts: () => dispatch(getPosts()),
  clearUserDetails: () => dispatch(clearUserDetails()),
  clearProfileDetails: () => dispatch(clearProfileDetails())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
