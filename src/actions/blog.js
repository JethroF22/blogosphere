import axios from "axios";

import setActionStatus from "./status";
import setError from "./error";

export const setCurrentPost = post => ({ type: "SET_CURRENT_POST", post });

export const setPosts = posts => ({
  type: "SET_POSTS",
  posts
});

export const createPost = (blogPost, token) => {
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
            author: data.author.name
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
        } else {
          dispatch(setError("An unexpected error occurred"));
        }
      });
  };
};

export const getPost = slug => {
  return dispatch => {
    const url = `${process.env.API_URL}blog/view/${slug}`;
    dispatch(setActionStatus("IN_PROGRESS"));
    return axios({
      url,
      method: "get"
    })
      .then(response => {
        const data = response.data.blogPost;
        dispatch(
          setCurrentPost({
            ...data
          })
        );
        dispatch(setActionStatus("SUCCESSFUL"));
      })
      .catch(error => {
        dispatch(setActionStatus("FAILED"));
      });
  };
};

export const getPosts = () => {
  return dispatch => {
    const url = `${process.env.API_URL}blog/view`;
    dispatch(setActionStatus("IN_PROGRESS"));
    return axios({ url, method: "get" })
      .then(response => {
        const posts = response.data.posts;
        dispatch(setPosts(posts));
        dispatch(setActionStatus("SUCCESSFUL"));
      })
      .catch(error => {
        dispatch(setActionStatus("FAILED"));
      });
  };
};

export const editPost = (blogPost, token, slug) => {
  return dispatch => {
    const url = `${process.env.API_URL}blog/edit/${slug}`;
    return axios({
      url,
      data: blogPost,
      method: "patch",
      headers: {
        token
      }
    })
      .then(response => {
        const post = response.data.post;
        dispatch(
          setCurrentPost({
            ...post,
            author: post.author.username
          })
        );
        dispatch(setActionStatus("SUCCESSFUL"));
        dispatch(setError(""));
        return post.slug;
      })
      .catch(error => {
        dispatch(setActionStatus("FAILED"));
        if (error.response.status === 400) {
          dispatch(setError(error.response.data.error));
        } else {
          console.log("Failed");
        }
      });
  };
};
