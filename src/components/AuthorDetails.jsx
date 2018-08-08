import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

const AuthorDetails = props => (
  <div className="details">
    {props.photo ? (
      <div className="details__left">
        <img src={props.photo} />
      </div>
    ) : (
      <FontAwesomeIcon icon={faUserCircle} size="4x" />
    )}
    <div className="details__right">
      <p>Published by {props.username}</p>
      <button
        className="uk-button uk-button-default button"
        onClick={props.followed ? null : props.followAuthor}
        disabled={props.followed}
      >
        {props.followed ? `Following ${props.username}` : `Followed`}
      </button>
    </div>
  </div>
);

export default AuthorDetails;
