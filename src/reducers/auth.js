export default (state = { username: "", email: "" }, action) => {
  switch (action.type) {
    case "SET_DETAILS":
      return {
        ...state,
        username: action.username,
        email: action.email,
        token: action.token
      };
    case "CLEAR_DETAILS":
      return { ...state, usermame: "", email: "" };
    default:
      return state;
  }
};
