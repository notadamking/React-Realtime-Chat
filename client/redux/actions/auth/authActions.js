import config from '../../../../config';
import {
  SET_CURRENT_USER,
  REMOVE_CURRENT_USER,
  SET_LOGIN_MODAL_OPEN,
  SET_SIGNUP_MODAL_OPEN,
  SET_LOGIN_SUBMIT_ERROR,
  SET_SIGNUP_SUBMIT_ERROR,
  CLEAR_SUBMIT_ERRORS,
} from '../types';

export const setCurrentUser = (user) => ({
  type: SET_CURRENT_USER,
  user
});

export const removeCurrentUser = () => ({
  type: REMOVE_CURRENT_USER
});

export const setLoginModalOpen = (open) => ({
  type: SET_LOGIN_MODAL_OPEN,
  open
});

export const setSignupModalOpen = (open) => ({
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
  type: CLEAR_SUBMIT_ERRORS
});

export const handleLoginSuccess = (user) => {
  if (global.localStorage) {
    localStorage.setItem(config.authTokenName, user.authToken);
  }
  return (dispatch) => {
    dispatch(setCurrentUser(user));
    dispatch(setLoginModalOpen(false));
    dispatch(clearSubmitErrors());
  };
};

export const handleSignupSuccess = (user) => {
  if (global.localStorage) {
    localStorage.setItem(config.authTokenName, user.authToken);
  }
  return (dispatch) => {
    dispatch(setCurrentUser(user));
    dispatch(setSignupModalOpen(false));
    dispatch(clearSubmitErrors());
  };
};
