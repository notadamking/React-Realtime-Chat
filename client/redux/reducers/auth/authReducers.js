import {
  SET_LOGGED_IN,
  SET_LOGGED_OUT,
  SET_LOGIN_MODAL_OPEN,
  SET_SIGNUP_MODAL_OPEN,
  SET_LOGIN_SUBMIT_ERROR,
  SET_SIGNUP_SUBMIT_ERROR,
  CLEAR_AUTH_SUBMIT_ERRORS,
} from '../../actions/types';

const initialState = {
  currentUser: null,
  isLoggedIn: false,
  loginModalOpen: false,
  signupModalOpen: false,
  loginSubmitError: null,
  signupSubmitError: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LOGGED_IN:
      return {
        ...state,
        currentUser: action.user,
        isLoggedIn: true
      };

    case SET_LOGGED_OUT:
      return {
        ...state,
        currentUser: null,
        isLoggedIn: false
      };

    case SET_LOGIN_MODAL_OPEN:
      return {
        ...state,
        loginModalOpen: action.open
      };

    case SET_SIGNUP_MODAL_OPEN:
      return {
        ...state,
        signupModalOpen: action.open
      };

    case SET_LOGIN_SUBMIT_ERROR:
      return {
        ...state,
        loginSubmitError: action.error
      };

    case SET_SIGNUP_SUBMIT_ERROR:
      return {
        ...state,
        signupSubmitError: action.error
      };

    case CLEAR_AUTH_SUBMIT_ERRORS:
      return {
        ...state,
        loginSubmitError: null,
        signupSubmitError: null
      };

    default:
      return state;
  }
};
