import React, { Component } from "react";
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";

class CreateBlogPostPage extends Component {
  state = {
    body: "",
    title: "",
    coverPhotoURL: ""
  };

  render() {
    return (
      <div>
        <h1>Create a Blog Post</h1>
        <form>
          <label htmlFor="title">Title: </label>
          <input
            type="text"
            name="title"
            value={this.state.title}
            onChange={this.onTitleChange}
          />
          <br />
          <label htmlFor="body">Body: </label>
          <Textarea
            name="body"
            onChange={this.onBodyChange}
            value={this.state.body}
          />
          <br />
          <label htmlFor="coverPhoto">Cover Photo: </label>
          <input
            type="text"
            name="coverPhoto"
            value={this.state.coverPhotoURL}
            onChange={this.onUsernameChange}
            placeholder="Image URL"
          />
          <br />
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  createArticle: (article, token) => dispatch(createArticle(article, token))
});

export default connect(
  undefined,
  mapDispatchToProps
)(CreateBlogPostPage);
