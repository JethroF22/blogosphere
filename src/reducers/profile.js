export default (state = {}, action) => {
  switch (action.type) {
    case "SET_PROFILE_DETAILS":
      return {
        ...state,
        photo: action.photo,
        bio: action.bio,
        followedAuthors: action.followedAuthors,
        followers: action.followers,
        likedPosts: action.likedPosts,
        postsByFollowedAuthors: action.postsByFollowedAuthors
      };
    case "CLEAR_PROFILE_DETAILS":
      return {};
    case "SET_PUBLISHED_POSTS":
      return { ...state, publishedPosts: action.posts };
    default:
      return state;
  }
};
