import axios from "axios";
import setError from "./error";
import setActionStatus from "./status";

export const setUserDetails = ({ username, email }) => ({
  type: "SET_DETAILS",
  username,
  email
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
        dispatch(
          setUserDetails({ username: data.username, email: data.email })
        );
        dispatch(setError(""));
        dispatch(setActionStatus("SUCCESSFUL"));

        return data.token;
      })
      .catch(error => {
        dispatch(setError(error.response.data));
        dispatch(setActionStatus("FAILED"));
      });
  };
};
