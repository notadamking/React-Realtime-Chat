import config from '../../../../config';
import {
  SET_LOADING,
  SET_LOGGED_IN,
  SET_LOGGED_OUT,
  SET_LOGIN_MODAL_OPEN,
  SET_SIGNUP_MODAL_OPEN,
  SET_LOGIN_SUBMIT_ERROR,
  SET_SIGNUP_SUBMIT_ERROR,
  CLEAR_AUTH_SUBMIT_ERRORS,
} from '../types';

export const setLoading = (loading = true) => ({
  type: SET_LOADING,
  loading
});

export const setLoggedIn = (user) => ({
  type: SET_LOGGED_IN,
  user
});

export const setLoggedOut = () => ({
  type: SET_LOGGED_OUT
});

export const setLoginModalOpen = (open = true) => ({
  type: SET_LOGIN_MODAL_OPEN,
  open
});

export const setSignupModalOpen = (open = true) => ({
  type: SET_SIGNUP_MODAL_OPEN,
  open
});

export const setLoginSubmitError = (error) => ({
  type: SET_LOGIN_SUBMIT_ERROR,
  error
});

export const setSignupSubmitError = (error) => ({
  type: SET_SIGNUP_SUBMIT_ERROR,
  error
});

export const clearSubmitErrors = () => ({
  type: CLEAR_AUTH_SUBMIT_ERRORS
});

export const handleLoginSuccess = (user) => {
  if (global.localStorage) {
    localStorage.setItem(config.authTokenName, user.authToken);
  }
  return (dispatch) => {
    dispatch(setLoggedIn(user));
    dispatch(setLoginModalOpen(false));
  };
};

export const handleSignupSuccess = (user) => {
  if (global.localStorage) {
    localStorage.setItem(config.authTokenName, user.authToken);
  }
  return (dispatch) => {
    dispatch(setLoggedIn(user));
    dispatch(setSignupModalOpen(false));
  };
};
