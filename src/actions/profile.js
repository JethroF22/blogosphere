import axios from "axios";
import setError from "./error";
import setActionStatus from "./status";

export const setDetails = (bio, photo) => ({
  type: "SET_DETAILS",
  bio,
  photo
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
      })
      .catch(err => {
        dispatch(setActionStatus("FAILED"));
      });
  };
};
