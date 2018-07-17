export default (state = {}, action) => {
  switch (action.type) {
    case "SET_PROFILE_DETAILS":
      return {
        ...state,
        photo: action.photo,
        bio: action.bio,
        followedAuthors: action.followedAuthors,
        followers: action.followers
      };
    case "CLEAR_PROFILE_DETAILS":
      return {};
    default:
      return state;
  }
};
