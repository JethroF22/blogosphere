import React from "react";
import { Link } from "react-router-dom";

import ArticleListItem from "./ArticleListItem";

const ArticleList = props => (
  <div className="article-list">
    {props.posts.map(post => (
      <Link
        to={`/blog/view/${post.slug}`}
        key={Math.floor(Math.random() * 99999)}
      >
        <ArticleListItem post={post} />
        <hr className="uk-divider-icon" />
      </Link>
    ))}
  </div>
);

export default ArticleList;
