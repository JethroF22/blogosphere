import axios from "axios";

import setActionStatus from "./status";
import setError from "./error";

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
        dispatch(setError(""));
        return data.slug;
      })
      .catch(error => {
        dispatch(setActionStatus("FAILED"));
        if (error.response.status === 400) {
          dispatch(setError(error.response.data.error));
        }
      });
  };
};

export const getArticle = slug => {
  return dispatch => {
    const url = `${process.env.API_URL}blog/view/${slug}`;
    dispatch(setActionStatus("IN_PROGRESS"));
    return axios({
      url,
      method: "get"
    })
      .then(response => {
        const data = response.data.blogPost;
        console.log(data);
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
