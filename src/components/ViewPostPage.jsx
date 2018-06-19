import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

import { getArticle } from "../actions/blog";

class ViewPostPage extends Component {
  componentDidMount() {
    if (!this.props.article) {
      this.props.getArticle(this.props.match.params.slug);
    }
  }

  render() {
    return (
      <div>
        {this.props.article ? (
          <div>
            <h1>{this.props.article.title}</h1>
            <p>{this.props.article.body}</p>
            <p>{moment(this.props.article.createdAt).format("MMM Do YY")}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  article: state.blog.currentArticle
});

const mapDispatchToProps = dispatch => ({
  getArticle: slug => dispatch(getArticle(slug))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewPostPage);
