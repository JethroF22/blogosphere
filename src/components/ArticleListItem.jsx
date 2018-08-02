import React from "react";
import moment from "moment";

const ArticleListItem = props => (
  <div className="uk-card uk-card-default uk-card-hover uk-margin-medium-bottom">
    <div className="uk-card-header">
      <h3 className="article-list__title">{props.post.title}</h3>
      <p className="article-list__subtitle">
        Published on {moment(props.post.createdAt).format("MMMM Do YYYY")}
      </p>
    </div>
    <div className="uk-card-media-bottom">
      <img
        className="article-list__image"
        uk-img={`dataSrc: ${props.post.coverPhotoURL}`}
      />
    </div>
  </div>
);

export default ArticleListItem;
