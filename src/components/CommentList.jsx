import React from "react";
import CommentListItem from "./CommentListItem";

const CommentList = props => (
  <div className="comments">
    {props.comments.map(comment => <CommentListItem comment={comment} />)}
  </div>
);

export default CommentList;
