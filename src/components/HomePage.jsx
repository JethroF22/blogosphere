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
          {this.props.postsByFollowedAuthors && (
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
              <ArticleList
                posts={
                  this.props.token
                    ? this.props.postsByFollowedAuthors
                    : this.props.mostPopularPosts
                }
              />
            )}
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.blog.posts,
  username: state.auth.username,
  token: state.auth.token,
  postsByFollowedAuthors: state.profile.postsByFollowedAuthors
    ? state.profile.postsByFollowedAuthors.sort(
        (a, b) => a.createdAt < b.createdAt
      )
    : null,
  mostPopularPosts:
    state.profile.posts && state.profile.posts.sort((a, b) => a.likes < b.likes)
});

const mapDispatchToProps = dispatch => ({
  getPosts: () => dispatch(getPosts())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
