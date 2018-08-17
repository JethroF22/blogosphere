export default (state = {}, action) => {
  switch (action.type) {
    case "SET_MESSAGE":
      return { message: action.message };
    default:
      return state;
  }
};
