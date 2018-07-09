import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";

import { getPost } from "../actions/blog";

class ViewPostPage extends Component {
  componentDidMount() {
    if (!this.props.post) {
      this.props.getPost(this.props.match.params.slug).then(() => {
        if (this.props.actionStatus === "Action failed") {
          console.log("Failed");
          this.props.history.push("/404");
        }
      });
    }
  }

  render() {
    return (
      <div>
        {this.props.post ? (
          <div>
            <h1>{this.props.post.title}</h1>
            <p>
              <em>
                {" "}
                Created by
                <Link
                  to={{
                    pathname: `/profile/view/${this.props.post.author}`,
                    state: { username: this.props.post.author }
                  }}
                >
                  {this.props.post.author}
                </Link>
                on {moment(this.props.post.createdAt).format("MMM Do YY")}
              </em>
            </p>
            <p>{this.props.post.body}</p>
            {this.props.post.updatedAt && (
              <p>
                Updated on{" "}
                {moment(this.props.post.updatedAt).format("MMM Do YY")}
              </p>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  post: state.blog.currentPost,
  actionStatus: state.status.status
});

const mapDispatchToProps = dispatch => ({
  getPost: slug => dispatch(getPost(slug))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewPostPage);
