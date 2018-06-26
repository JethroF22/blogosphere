export default (state = {}, action) => {
  switch (action.type) {
    case "SET_CURRENT_POST":
      return { ...state, currentPost: action.post };
    case "SET_POSTS":
      return { ...state, posts: action.posts };
    default:
      return state;
  }
};
