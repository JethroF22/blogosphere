import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Textarea from "react-textarea-autosize";
import _ from "lodash";

import { createPost } from "../actions/blog";

export class CreatePostPage extends Component {
  state = {
    body: "",
    title: "",
    coverPhotoURL: "",
    errors: {}
  };

  onTitleChange = e => {
    const title = e.target.value;
    this.setState(prevState => ({
      title,
      errors: {
        ...prevState.errors,
        title: ""
      }
    }));
  };

  onBodyChange = e => {
    const body = e.target.value;
    this.setState(prevState => ({
      body,
      errors: {
        ...prevState.errors,
        body: ""
      }
    }));
  };

  onURLChange = e => {
    const coverPhotoURL = e.target.value;
    this.setState(prevState => ({
      coverPhotoURL,
      errors: {
        ...prevState.errors,
        coverPhotoURL: ""
      }
    }));
  };

  onSubmit = e => {
    e.preventDefault();

    if (
      !(
        this.state.body === "" &&
        this.state.title === "" &&
        this.state.coverPhotoURL === ""
      )
    ) {
      const blogPost = _.pick(this.state, ["title", "body", "coverPhotoURL"]);
      this.props.createPost(blogPost, this.props.token).then(slug => {
        if (this.props.actionStatus === "Action successful") {
          this.props.history.push(`/blog/view/${slug}`);
        }
      });
    } else {
      const errors = {};
      ["title", "body", "coverPhotoURL"].forEach(field => {
        if (this.state[field] === "") {
          errors[field] = `Your post requires a ${
            field === "coverPhotoURL" ? "cover photo" : field
          }`;
        }
        this.setState(() => ({ errors }));
      });
    }
  };

  render() {
    return (
      <div className="form">
        <h1 className="form__title">Create a Blog Post</h1>
        <form onSubmit={this.onSubmit} className="uk-form-stacked">
          {this.props.creationError && (
            <p className="form__error">{this.props.creationError}</p>
          )}
          <label htmlFor="title" className="form__label">
            Title{" "}
          </label>
          {this.state.errors.title && (
            <p className="form__error">{this.state.errors.title}</p>
          )}
          <input
            type="text"
            name="title"
            value={this.state.title}
            onChange={this.onTitleChange}
            className={`uk-input form__input ${
              this.state.errors.title ? "uk-form-danger" : "uk-form-blank"
            }`}
            placeholder="Make it catchy!"
          />
          <br />
          <label htmlFor="coverPhoto" className="form__label">
            Cover Photo{" "}
          </label>
          {this.state.errors.coverPhotoURL && (
            <p className="form__error">{this.state.errors.coverPhotoURL}</p>
          )}
          <input
            type="text"
            name="coverPhoto"
            value={this.state.coverPhotoURL}
            onChange={this.onURLChange}
            placeholder="Image URL"
            className={`uk-input form__input ${
              this.state.errors.coverPhotoURL
                ? "uk-form-danger"
                : "uk-form-blank"
            }`}
          />
          <br />
          <label htmlFor="body" className="form__label">
            Body{" "}
          </label>
          {this.state.errors.body && (
            <p className="form__error">{this.state.errors.body}</p>
          )}
          <Textarea
            name="body"
            onChange={this.onBodyChange}
            value={this.state.body}
            className={`uk-textarea form__textarea ${
              this.state.errors.body ? "uk-form-danger" : "uk-form-blank"
            }`}
            placeholder="Tell us your story..."
          />
          <br />
          <button
            type="submit"
            className="uk-button uk-button-default button"
            disabled={this.props.actionStatus === "Action in progress"}
          >
            {this.props.actionStatus === "Action in progress" ? (
              <Fragment>
                <span>Creating </span> <FontAwesomeIcon icon={faSpinner} spin />
              </Fragment>
            ) : (
              "Create Post"
            )}
          </button>
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
