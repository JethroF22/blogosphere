import axios from "axios";
import setError from "./error";
import setActionStatus from "./status";

export const setDetails = ({ bio, photo, username }) => ({
  type: "SET_PROFILE_DETAILS",
  bio,
  photo,
  username
});

export const createProfile = (details, token) => {
  return dispatch => {
    const url = `${process.env.API_URL}auth/profile`;
    dispatch(setActionStatus("IN_PROGRESS"));
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
        dispatch(setActionStatus("SUCCESSFUL"));
        dispatch(setDetails(res.data));
      })
      .catch(err => {
        dispatch(setActionStatus("FAILED"));
      });
  };
};

export const editProfile = (updates, token) => {
  return dispatch => {
    const url = `${process.env.API_URL}auth/profile/`;
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
        dispatch(setActionStatus("SUCCESSFUL"));
        dispatch(setError(""));
      })
      .catch(error => {
        dispatch(setActionStatus("FAILED"));
        if (error.response.status === 400) {
          dispatch(setError(error.response.data.error));
        }
      });
  };
};

export const getProfile = username => {
  return dispatch => {
    const url = `${process.env.API_URL}auth/profile/${username}`;
    return axios({ method: "get", url })
      .then(res => {
        dispatch(setActionStatus("SUCCESSFUL"));
        dispatch(setDetails(res.data));
      })
      .catch(err => {
        dispatch(setActionStatus("FAILED"));
      });
  };
};

export const followAuthor = (author, token) => {
  return dispatch => {
    console.log(author);
    const url = `${process.env.API_URL}auth/follow/`;
    return axios({
      url,
      method: "patch",
      headers: {
        token
      },
      data: author
    })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };
};
