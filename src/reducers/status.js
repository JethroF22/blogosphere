export default (state = {}, action) => {
  switch (action.type) {
    case "IN_PROGRESS":
      return { status: "Action in progress", name: action.name };
    case "SUCCESSFUL":
      return { status: "Action successful", name: action.name };
    case "FAILED":
      return { status: "Action failed", name: action.name };
    default:
      return state;
  }
};
