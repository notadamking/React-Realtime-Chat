import config from '../../../../config';
import { setShouldScrollToBottom, setShouldUpdateRoom } from '../messages';
import {
  SET_LOGGED_IN,
  SET_LOGGED_OUT,
} from '../types';

export const setLoggedIn = (user) => ({
  type: SET_LOGGED_IN,
  user
});

export const setLoggedOut = () => ({
  type: SET_LOGGED_OUT
});

export const handleLogout = () => {
  if (global.localStorage && localStorage.getItem(config.authTokenName)) {
    localStorage.removeItem(config.authTokenName);
  }
  return (dispatch) => {
    dispatch(setLoggedOut());
    dispatch(setShouldUpdateRoom());
  };
};

export const handleLoginSuccess = (user) => {
  if (global.localStorage && localStorage.getItem(config.authTokenName) !== user.authToken) {
    localStorage.setItem(config.authTokenName, user.authToken);
  }
  return (dispatch) => {
    dispatch(setLoggedIn(user));
    dispatch(setShouldUpdateRoom());
    dispatch(setShouldScrollToBottom());
  };
};
