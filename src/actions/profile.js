import axios from "axios";
import setError from "./error";
import setActionStatus from "./status";

export const setDetails = ({ bio, photo, username }) => ({
  type: "SET_DETAILS",
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
