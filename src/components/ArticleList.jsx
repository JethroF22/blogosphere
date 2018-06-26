import React from "react";

import ArticleListItem from "./ArticleListItem";

const ArticleList = props => (
  <div>
    {props.posts.map(post => (
      <ArticleListItem post={post} key={Math.floor(Math.random() * 99999)} />
    ))}
  </div>
);

export default ArticleList;
