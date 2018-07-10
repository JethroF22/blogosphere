export default (state = {}, action) => {
  switch (action.type) {
    case "SET_DETAILS":
      return {
        ...state,
        photo: action.photo,
        bio: action.bio
      };
    case "CLEAR_DETAILS":
      return {};
    default:
      return state;
  }
};
