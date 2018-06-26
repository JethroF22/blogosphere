import React from "react";

const ArticleListItem = props => (
  <div>
    <h2>{props.post.title}</h2>
    <p>{props.post.body}</p>
    <img src={props.post.coverPhotoURL} height="400px" width="400px" />
  </div>
);

export default ArticleListItem;
