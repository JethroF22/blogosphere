import axios from "axios";

import setActionStatus from "./status";
import setError from "./error";

export const setCurrentPost = post => ({ type: "SET_CURRENT_POST", post });

export const setPosts = posts => ({
  type: "SET_POSTS",
  posts
});

export const updatedLikedPosts = likedPosts => ({
  type: "UPDATE_LIKED_POSTS",
  likedPosts
});

export const createPost = (blogPost, token) => {
  return dispatch => {
    const url = `${process.env.API_URL}blog/create`;
    dispatch(
      setActionStatus({
        type: "IN_PROGRESS",
        name: "startAuthentication"
      })
    );
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
        dispatch(
          setActionStatus({
            type: "SUCCESSFUL",
            name: "startAuthentication"
          })
        );
        dispatch(setError(""));
        return data.slug;
      })
      .catch(error => {
        dispatch(
          setActionStatus({
            type: "FAILED",
            name: "startAuthentication"
          })
        );
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
    dispatch(
      setActionStatus({
        type: "IN_PROGRESS",
        name: "startAuthentication"
      })
    );
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
        dispatch(
          setActionStatus({
            type: "SUCCESSFUL",
            name: "startAuthentication"
          })
        );
      })
      .catch(error => {
        dispatch(
          setActionStatus({
            type: "FAILED",
            name: "startAuthentication"
          })
        );
      });
  };
};

export const getPosts = () => {
  return dispatch => {
    const url = `${process.env.API_URL}blog/view`;
    dispatch(
      setActionStatus({
        type: "IN_PROGRESS",
        name: "startAuthentication"
      })
    );
    return axios({ url, method: "get" })
      .then(response => {
        const posts = response.data.posts;
        dispatch(setPosts(posts));
        dispatch(
          setActionStatus({
            type: "SUCCESSFUL",
            name: "startAuthentication"
          })
        );
      })
      .catch(error => {
        dispatch(
          setActionStatus({
            type: "FAILED",
            name: "startAuthentication"
          })
        );
      });
  };
};

export const editPost = (blogPost, token, slug) => {
  return dispatch => {
    const url = `${process.env.API_URL}blog/edit/${slug}`;
    dispatch(
      setActionStatus({
        type: "IN_PROGRESS",
        name: "startAuthentication"
      })
    );
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
        dispatch(
          setActionStatus({
            type: "SUCCESSFUL",
            name: "startAuthentication"
          })
        );
        dispatch(setError(""));
        return post.slug;
      })
      .catch(error => {
        dispatch(
          setActionStatus({
            type: "FAILED",
            name: "startAuthentication"
          })
        );
        if (error.response.status === 400) {
          dispatch(setError(error.response.data.error));
        } else {
          console.log("Failed");
        }
      });
  };
};

export const likeUnlikePost = (post, token, type) => {
  return (dispatch, getState) => {
    const url = `${process.env.API_URL}blog/${type}/`;
    dispatch(
      setActionStatus({
        type: "IN_PROGRESS",
        name: "likeUnlikePost"
      })
    );
    return axios({
      url,
      method: "patch",
      headers: {
        token
      },
      data: post
    })
      .then(res => {
        dispatch(
          setActionStatus({
            type: "SUCCESSFUL",
            name: "likeUnlikePost"
          })
        );
        const likedPosts = getState().profile.likedPosts.concat(post);
        dispatch(updatedLikedPosts(likedPosts));
      })
      .catch(err => {
        dispatch(
          setActionStatus({
            type: "FAILED",
            name: "likeUnlikePost"
          })
        );
        console.log(err.response);
      });
  };
};
