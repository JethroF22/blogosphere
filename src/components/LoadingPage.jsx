import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const LoadingPage = () => (
  <div className="loading">
    <p>Loading ...</p>
    <p>
      <FontAwesomeIcon icon={faSpinner} size="5x" spin />
    </p>
  </div>
);

export default LoadingPage;
