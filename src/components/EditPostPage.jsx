import React, { Component } from "react";
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";
import _ from "lodash";

import { editPost } from "../actions/blog";
import { getPost } from "../actions/blog";

class EditPostPage extends Component {
  state = {
    body: "",
    title: "",
    coverPhotoURL: "",
    errors: {},
    slug: this.props.match.params.slug
  };

  componentDidMount() {
    if (!this.props.post) {
      this.props.getPost(this.state.slug).then(() => {
        const state = _.pick(this.props.post, [
          "title",
          "body",
          "coverPhotoURL"
        ]);
        this.setState(prevState => ({
          ...prevState,
          ...state
        }));
      });
    }
  }

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
      const blogPost = _.pick(this.state, ["body", "coverPhotoURL"]);
      this.props
        .editPost(blogPost, this.props.token, this.state.slug)
        .then(slug => {
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
        <h1>Edit Blog Post</h1>
        <form onSubmit={this.onSubmit}>
          {this.props.creationError && <p>{this.props.creationError}</p>}
          <label htmlFor="title">Title: </label>
          <input
            type="text"
            name="title"
            value={this.state.title}
            disabled={true}
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
          <button type="submit">Update Post</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  actionStatus: state.status.status,
  creationError: state.error.message,
  post: state.blog.currentPost,
  token: state.auth.token
});

const mapDispatchToProps = dispatch => ({
  editPost: (article, token, slug) => dispatch(editPost(article, token, slug)),
  getPost: slug => dispatch(getPost(slug))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditPostPage);
