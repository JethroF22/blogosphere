import axios from "axios";
import * as _ from "lodash";

export const setUserDetails = ({ username, email }) => ({
  type: "SET_DETAILS",
  username,
  email
});

export const startRegistration = userCredentials => {
  return dispatch => {
    const url = `${process.env.API_URL}auth/register`;
    return axios({
      url,
      data: userCredentials,
      method: "post"
    })
      .then(response => {
        const data = response.data;
        localStorage.setItem("token", data.token);
        dispatch(
          setUserDetails({ username: data.username, email: data.email })
        );
      })
      .catch(error => {
        console.log(error);
      });
  };
};
