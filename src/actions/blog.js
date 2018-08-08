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
        name: "createPost"
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
        const data = response.data.post;
        dispatch(
          setCurrentPost({
            ...data
          })
        );
        dispatch(
          setActionStatus({
            type: "SUCCESSFUL",
            name: "createPost"
          })
        );
        dispatch(setError(""));
        return data.slug;
      })
      .catch(error => {
        dispatch(
          setActionStatus({
            type: "FAILED",
            name: "createPost"
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
        name: "getPost"
      })
    );
    return axios({
      url,
      method: "get"
    })
      .then(response => {
        const data = response.data.post;
        dispatch(
          setCurrentPost({
            ...data
          })
        );
        dispatch(
          setActionStatus({
            type: "SUCCESSFUL",
            name: "getPost"
          })
        );
      })
      .catch(error => {
        dispatch(
          setActionStatus({
            type: "FAILED",
            name: "getPost"
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
        name: "getPosts"
      })
    );
    return axios({ url, method: "get" })
      .then(response => {
        const posts = response.data.posts;
        dispatch(setPosts(posts));
        dispatch(
          setActionStatus({
            type: "SUCCESSFUL",
            name: "getPosts"
          })
        );
      })
      .catch(error => {
        dispatch(
          setActionStatus({
            type: "FAILED",
            name: "getPosts"
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
        name: "editPost"
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
            name: "editPost"
          })
        );
        dispatch(setError(""));
        return post.slug;
      })
      .catch(error => {
        dispatch(
          setActionStatus({
            type: "FAILED",
            name: "editPost"
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
        post.likes += 1;
        const likedPosts = getState().profile.likedPosts.concat(post);
        dispatch(updatedLikedPosts(likedPosts));
        dispatch(setCurrentPost(post));
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

export const createComment = (commentBody, postID, token) => {
  return dispatch => {
    const url = `${process.env.API_URL}blog/comment/`;
    dispatch(
      setActionStatus({
        type: "IN_PROGRESS",
        name: "createComment"
      })
    );
    return axios({
      url,
      method: "patch",
      headers: { token },
      data: { commentBody, _id: postID }
    })
      .then(res => {
        dispatch(
          setActionStatus({
            type: "SUCCESSFUL",
            name: "createComment"
          })
        );
        const post = res.data.post;
        dispatch(setCurrentPost(post));
      })
      .catch(err => {
        dispatch(setActionStatus({ type: "FAILED", name: "createComment" }));
        console.log(err.response);
      });
  };
};
