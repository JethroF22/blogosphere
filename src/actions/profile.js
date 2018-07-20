import axios from "axios";
import setError from "./error";
import setActionStatus from "./status";

export const setDetails = ({
  bio,
  photo,
  followedAuthors,
  followers,
  likedPosts
}) => ({
  type: "SET_PROFILE_DETAILS",
  bio,
  photo,
  followedAuthors,
  followers,
  likedPosts
});

export const clearProfileDetails = () => ({ type: "CLEAR_PROFILE_DETAILS" });

export const updatedLikedPosts = likedPosts => ({
  type: "UPDATE_LIKED_POSTS",
  likedPosts
});

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
            name: "startAuthentication"
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
        dispatch(setDetails(res.data));
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
    const url = `${process.env.API_URL}profile/${
      type === "follow" ? "follow" : "unfollow"
    }/`;
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
        dispatch(setDetails(res.data));
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
