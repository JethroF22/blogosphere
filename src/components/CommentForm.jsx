import React, { Component } from "react";
import { connect } from "react-redux";

import { createComment } from "../actions/blog";

class CommentForm extends Component {
  state = {
    commentBody: ""
  };

  onCommentChange = e => {
    const commentBody = e.target.value;
    this.setState(() => ({ commentBody }));
  };

  onSubmit = e => {
    e.preventDefault();

    this.props
      .createComment(
        this.state.commentBody,
        this.props.postID,
        this.props.token
      )
      .then(slug => {
        if (this.props.actionStatus === "Action successful") {
          this.setState(() => ({
            commentBody: ""
          }));
        }
      });
  };

  render() {
    return (
      <div className="form">
        <form className="uk-form-stacked" onSubmit={this.onSubmit}>
          <label htmlFor="commentBody" className="form__label">
            Leave a comment
          </label>
          <input
            type="text"
            name="commentBody"
            value={this.state.commentBody}
            onChange={this.onCommentChange}
            placeholder="Let the author know what you think..."
            className={"uk-textarea form__textarea"}
          />
          <br />
          <button
            type="submit"
            className="uk-button uk-button-default button"
            disabled={this.state.commentBody ? false : true}
          >
            Submit comment
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  postID: state.blog.currentPost._id,
  actionStatus: state.status.status
});

const mapDispatchToProps = dispatch => ({
  createComment: (commentBody, postID, token) =>
    dispatch(createComment(commentBody, postID, token))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentForm);
