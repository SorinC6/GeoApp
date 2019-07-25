export default function reducer(state, action) {
  switch (action.type) {
    case "LOGIN_USER":
      debugger;
      return {
        ...state,
        currentUser: action.payload
      };
    default:
      return state;
  }
}
