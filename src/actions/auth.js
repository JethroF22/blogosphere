import axios from "axios";
import * as _ from "lodash";

export const setUserDetails = ({ username, email }) => ({
  type: "SET_DETAILS",
  username,
  email
});

export const startAuthentication = (userCredentials, type) => {
  return dispatch => {
    const url = `${process.env.API_URL}auth/${type}`;
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
        return data.token;
      })
      .catch(error => {
        return Promise.reject();
      });
  };
};
