export default (state = {}, action) => {
  switch (action.type) {
    case "SET_CURRENT_ARTICLE":
      return { ...state, currentArticle: action.article };
    default:
      return state;
  }
};
