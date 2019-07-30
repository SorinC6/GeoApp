export default function reducer(state, { type, payload }) {
  switch (type) {
    case "LOGIN_USER":
      return {
        ...state,
        currentUser: payload
      };
    case "IS_LOGGED_IN":
      return {
        ...state,
        isAuth: payload
      };
    case "SIGNOUT_USER":
      return {
        ...state,
        currentUser: null,
        isAuth: false
      };
    case "CREATE_DRAFT":
      return {
        ...state,
        currentPin: null,
        draft: {
          longitude: 0,
          latitude: 0
        }
      };
    case "UPDATE_PIN_LOCATION":
      return {
        ...state,
        draft: payload
      };
    case "DELETE_PIN":
      return {
        ...state,
        draft: null
      };
    case "GET_PINS":
      return {
        ...state,
        pins: payload
      };
    case "CREATE_PIN":
      const newPin = payload;
      const prevPin =
        state.pins &&
        state.pins.filter(pin => {
          return newPin._id !== pin._id;
        });
      return {
        ...state,
        pins: [...prevPin, newPin]
      };
    case "SET_PIN":
      return {
        ...state,
        currentPin: payload,
        draft: null
      };

    default:
      return state;
  }
}
