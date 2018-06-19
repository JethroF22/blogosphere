export default (state = {}, action) => {
  switch (action.type) {
    case "IN_PROGRESS":
      return { status: "Action in progress" };
    case "SUCCESSFUL":
      return { status: "Action successful" };
    case "FAILED":
      return { status: "Action failed" };
    default:
      return state;
  }
};
