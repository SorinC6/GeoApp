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
    case "DELETE_PIN":
      const deletedPin = payload;
      const filterdPins = state.pins.filter(pin => pin._id !== deletedPin._id);
      if (state.currentPin) {
        const isCurrentPin = deletedPin._id === state.currentPin._id;
        if (isCurrentPin) {
          return {
            ...state,
            pins: filterdPins,
            currentPin: null
          };
        }
      }
      return {
        ...state,
        pins: filterdPins
      };
    case "CREATE_COMMENT":
      const updatedCurrentPin = payload;
      const updatePins = state.pins.map(pin => {
        if (pin._id === updatedCurrentPin._id) {
          return updatedCurrentPin;
        } else {
          return pin;
        }
      });
      return {
        ...state,
        pins: updatePins,
        currentPin: updatedCurrentPin
      };
    default:
      return state;
  }
}
