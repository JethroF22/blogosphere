import React from "react";
import moment from "moment";

const CommentListItem = props => (
  <div>
    <h3>
      {props.comment.username} ({moment(props.comment.timestamp).format(
        "Do MMM"
      )})
    </h3>
    <p>{props.comment.body}</p>
  </div>
);

export default CommentListItem;
