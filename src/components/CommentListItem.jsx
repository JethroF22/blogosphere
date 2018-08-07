import React from "react";
import moment from "moment";

const CommentListItem = props => (
  <div className="comment">
    <h3 className="uk-card-title comment__username">
      {props.comment.username}{" "}
      <span className="comment__date">
        ({moment(props.comment.timestamp).format("Do MMM")})
      </span>
    </h3>
    <p className="comment__comment-body">{props.comment.body}</p>
  </div>
);

export default CommentListItem;
