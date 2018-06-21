import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../actions/blog";

const token = localStorage.getItem("token");

class HomePage extends Component {
  componentDidMount() {
    if (!this.props.posts) {
      this.props.getPosts();
    }
  }

  render() {
    return (
      <div>
        <h1>Blogosphere</h1>
        {!token ? (
          <div>
            <Link to="/register">Create Account</Link>
            <br />
            <Link to="/login">Login</Link>
            <br />
          </div>
        ) : (
          <div>
            <Link to="/blog/create">Create Post</Link>
            <br />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.blog.posts
});

const mapStateToProps = dispatch => ({
  getPosts: () => dispatch(getPosts())
});

export default HomePage;
