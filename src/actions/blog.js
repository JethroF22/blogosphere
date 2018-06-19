import axios from "axios";

import setActionStatus from "./status";

export const setCurrentPost = article => ({
  type: "SET_CURRENT_ARTICLE",
  article
});

export const createArticle = (blogPost, token) => {
  return dispatch => {
    const url = `${process.env.API_URL}blog/create`;
    return axios({
      url,
      data: blogPost,
      method: "post",
      headers: {
        token
      }
    })
      .then(response => {
        const data = response.data;
        dispatch(
          setCurrentPost({
            ...data,
            author: data.author.username
          })
        );
        dispatch(setActionStatus("SUCCESSFUL"));
      })
      .catch(error => {
        dispatch(setActionStatus("FAILED"));
      });
  };
};
