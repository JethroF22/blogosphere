export default (state = {}, action) => {
  switch (action.type) {
    case "SET_PROFILE_DETAILS":
      return {
        ...state,
        photo: action.photo,
        bio: action.bio
      };
    case "CLEAR_PROFILE_DETAILS":
      return {};
    default:
      return state;
  }
};
