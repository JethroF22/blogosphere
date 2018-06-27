import React, { Component } from "react";
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";
import _ from "lodash";

import { createPost } from "../actions/blog";

class CreatePostPage extends Component {
  state = {
    body: "",
    title: "",
    coverPhotoURL: "",
    errors: {}
  };

  onTitleChange = e => {
    const title = e.target.value;
    this.setState(() => ({
      title
    }));
  };

  onBodyChange = e => {
    const body = e.target.value;
    this.setState(() => ({
      body
    }));
  };

  onURLChange = e => {
    const coverPhotoURL = e.target.value;
    this.setState(() => ({
      coverPhotoURL
    }));
  };

  onSubmit = e => {
    e.preventDefault();

    if (!(this.state.body === "" && this.state.title === "")) {
      const blogPost = _.pick(this.state, ["title", "body", "coverPhotoURL"]);
      this.props.createPost(blogPost, this.props.token).then(slug => {
        if (this.props.actionStatus === "Action successful") {
          this.props.history.push(`/blog/view/${slug}`);
        }
      });
    } else {
      const errors = {};
      ["title", "body"].forEach(field => {
        if (this.state[field] === "") {
          errors[field] = `"${field}" cannot be blank`;
        }
        this.setState(() => ({ errors }));
      });
    }
  };

  render() {
    return (
      <div>
        <h1>Create a Blog Post</h1>
        <form onSubmit={this.onSubmit}>
          {this.props.creationError && <p>{this.props.creationError}</p>}
          <label htmlFor="title">Title: </label>
          <input
            type="text"
            name="title"
            value={this.state.title}
            onChange={this.onTitleChange}
          />
          {this.state.errors.title && <p>{this.state.errors.title}</p>}
          <br />
          <label htmlFor="body">Body: </label>
          <Textarea
            name="body"
            onChange={this.onBodyChange}
            value={this.state.body}
          />
          {this.state.errors.body && <p>{this.state.errors.body}</p>}
          <br />
          <label htmlFor="coverPhoto">Cover Photo: </label>
          <input
            type="text"
            name="coverPhoto"
            value={this.state.coverPhotoURL}
            onChange={this.onURLChange}
            placeholder="Image URL (optional)"
          />
          <br />
          <button type="submit">Create Post</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  actionStatus: state.status.status,
  creationError: state.error.message,
  token: state.auth.token
});

const mapDispatchToProps = dispatch => ({
  createPost: (article, token) => dispatch(createPost(article, token))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreatePostPage);
