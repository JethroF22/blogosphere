import React from "react";
import { Link } from "react-router-dom";

import ArticleListItem from "./ArticleListItem";

const ArticleList = props => (
  <div>
    {props.posts.map(post => (
      <Link to={`/blog/view/${post.slug}`}>
        <ArticleListItem post={post} key={Math.floor(Math.random() * 99999)} />
      </Link>
    ))}
  </div>
);

export default ArticleList;
