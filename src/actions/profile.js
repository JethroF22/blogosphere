import axios from "axios";
import setError from "./error";
import setActionStatus from "./status";

export const setDetails = ({
  bio,
  photo,
  followedAuthors,
  followers,
  likedPosts,
  postsByFollowedAuthors,
  notifications
}) => ({
  type: "SET_PROFILE_DETAILS",
  bio,
  photo,
  followedAuthors,
  followers,
  likedPosts,
  postsByFollowedAuthors,
  notifications
});

export const clearProfileDetails = () => ({ type: "CLEAR_PROFILE_DETAILS" });

export const setPosts = posts => ({ type: "SET_PUBLISHED_POSTS", posts });

export const createProfile = (details, token) => {
  return dispatch => {
    const url = `${process.env.API_URL}profile/create`;
    dispatch(
      setActionStatus({
        type: "IN_PROGRESS",
        name: "createProfile"
      })
    );
    return axios({
      url,
      data: {
        details,
        token
      },
      method: "post",
      headers: { token }
    })
      .then(res => {
        dispatch(
          setActionStatus({
            type: "SUCCESSFUL",
            name: "createProfile"
          })
        );
        dispatch(setDetails(res.data));
      })
      .catch(err => {
        dispatch(
          setActionStatus({
            type: "FAILED",
            name: "createProfile"
          })
        );
      });
  };
};

export const editProfile = (updates, token) => {
  return dispatch => {
    const url = `${process.env.API_URL}profile/update`;
    dispatch(
      setActionStatus({
        type: "IN_PROGRESS",
        name: "editProfile"
      })
    );
    return axios({
      url,
      data: updates,
      method: "patch",
      headers: {
        token
      }
    })
      .then(response => {
        const user = response.data;
        dispatch(setDetails(user));
        dispatch(
          setActionStatus({
            type: "SUCCESSFUL",
            name: "editProfile"
          })
        );
        dispatch(setError(""));
      })
      .catch(error => {
        dispatch(
          setActionStatus({
            type: "FAILED",
            name: "editProfile"
          })
        );
        if (error.response.status === 400) {
          dispatch(setError(error.response.data.error));
        }
      });
  };
};

export const getProfile = username => {
  return dispatch => {
    const url = `${process.env.API_URL}profile/${username}`;
    dispatch(
      setActionStatus({
        type: "IN_PROGRESS",
        name: "getProfile"
      })
    );
    return axios({ method: "get", url })
      .then(res => {
        dispatch(
          setActionStatus({
            type: "SUCCESSFUL",
            name: "getProfile"
          })
        );
        dispatch(setDetails(res.data.user));
      })
      .catch(err => {
        dispatch(
          setActionStatus({
            type: "FAILED",
            name: "getProfile"
          })
        );
      });
  };
};

export const followUnfollowAuthor = (author, token, type) => {
  return dispatch => {
    const url = `${process.env.API_URL}profile/${type}/`;
    dispatch(
      setActionStatus({
        type: "IN_PROGRESS",
        name: "followUnfollowAuthor"
      })
    );
    return axios({
      url,
      method: type === "follow" ? "patch" : "delete",
      headers: {
        token
      },
      data: author
    })
      .then(res => {
        dispatch(
          setActionStatus({
            type: "SUCCESSFUL",
            name: "followUnfollowAuthor"
          })
        );
        dispatch(setDetails(res.data.user));
      })
      .catch(err => {
        dispatch(
          setActionStatus({
            type: "FAILED",
            name: "followUnfollowAuthor"
          })
        );
      });
  };
};

export const getPostsByAuthor = author => {
  return dispatch => {
    const url = `${process.env.API_URL}profile/posts/${author}/`;
    dispatch(
      setActionStatus({
        type: "IN_PROGRESS",
        name: "getPostsByAuthor"
      })
    );
    return axios({
      url,
      method: "get"
    })
      .then(res => {
        dispatch(
          setActionStatus({
            type: "SUCCESSFUL",
            name: "getPostsByAuthor"
          })
        );
        dispatch(setPosts(res.data.posts));
      })
      .catch(err => {
        dispatch(
          setActionStatus({
            type: "FAILED",
            name: "getPostsByAuthor"
          })
        );
      });
  };
};
