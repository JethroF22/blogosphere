export default (state = {}, action) => {
  switch (action.type) {
    case "SET_DETAILS":
      return { ...state, username: action.username, email: action.email };
    default:
      return state;
  }
};
