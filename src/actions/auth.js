import axios from "axios";
import setError from "./error";
import setActionStatus from "./status";
import { setDetails } from "./profile";

export const setUserDetails = ({ username, email, id, token }) => ({
  type: "SET_DETAILS",
  username,
  email,
  id,
  token
});

export const clearUserDetails = () => ({ type: "CLEAR_DETAILS" });

export const startAuthentication = (userCredentials, type) => {
  return dispatch => {
    const url = `${process.env.API_URL}auth/${type}`;
    dispatch(setActionStatus("IN_PROGRESS"));
    return axios({
      url,
      data: userCredentials,
      method: "post"
    })
      .then(response => {
        const data = response.data;
        dispatch(setActionStatus("SUCCESSFUL"));
        dispatch(
          setUserDetails({
            username: data.username,
            email: data.email,
            token: data.token
          })
        );
        dispatch(setError(""));

        return data.token;
      })
      .catch(error => {
        dispatch(setError(error.response.data));
        dispatch(setActionStatus("FAILED"));
      });
  };
};

export const tokenAuthentication = token => {
  return dispatch => {
    const url = `${process.env.API_URL}auth/user_details`;
    dispatch(setActionStatus("IN_PROGRESS"));
    return axios({ url, method: "get", headers: { token } })
      .then(response => {
        const data = response.data;
        dispatch(setActionStatus("SUCCESSFUL"));

        dispatch(
          setUserDetails({
            ...data,
            token
          })
        );
        dispatch(setDetails(data));
        dispatch(setError(""));
      })
      .catch(error => {
        dispatch(setActionStatus("FAILED"));
      });
  };
};
