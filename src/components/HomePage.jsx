import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

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
      <div className="container">
        <ul data-uk-tab="active: 0;" className="tab">
          <li>
            <a href="#" className="tab__label">
              Latest
            </a>
          </li>
          {this.props.postsByFollowedAuthors &&
            this.props.postsByFollowedAuthors.length > 0 && (
              <li>
                <a href="#" className="tab__label">
                  Posts From Your Favourite Authors
                </a>
              </li>
            )}
        </ul>
        <ul className="uk-switcher">
          <li>
            {this.props.posts && <ArticleList posts={this.props.posts} />}
          </li>
          <li>
            {this.props.postsByFollowedAuthors && (
              <ArticleList posts={this.props.postsByFollowedAuthors} />
            )}
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.blog.posts
    ? state.blog.posts.sort((a, b) => a.createdAt < b.createdAt)
    : null,
  username: state.auth.username,
  token: state.auth.token,
  postsByFollowedAuthors: state.profile.postsByFollowedAuthors
    ? state.profile.postsByFollowedAuthors.sort(
        (a, b) => a.createdAt < b.createdAt
      )
    : null
});

const mapDispatchToProps = dispatch => ({
  getPosts: () => dispatch(getPosts())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
