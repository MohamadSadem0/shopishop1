// src/redux/reducers/authReducer.js
import { LOGIN_SUCCESS, GOOGLE_LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../actions/actionTypes';

const initialState = {
  isAuthenticated: false,
  user: null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case GOOGLE_LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload, // User data including JWT and user details
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: action.payload, // Capture error message
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    default:
      return state;
  }
};

export default authReducer;
