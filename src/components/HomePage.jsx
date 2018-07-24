import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getPosts } from "../actions/blog";

import ArticleList from "./ArticleList";

class HomePage extends Component {
  componentDidMount() {
    if (!this.props.posts) {
      this.props.getPosts();
    }
  }

  render() {
    return (
      <div>
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
  getPosts: () => dispatch(getPosts())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
