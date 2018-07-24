import React from "react";

const ArticleListItem = props => (
  <div>
    <h3>{props.post.title}</h3>
    <img src={props.post.coverPhotoURL} height="400px" width="400px" />
  </div>
);

export default ArticleListItem;
