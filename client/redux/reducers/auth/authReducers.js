import {
  SET_LOGGED_IN,
  SET_LOGGED_OUT,
} from '../../actions/types';

const initialState = {
  currentUser: null,
  previousUser: null,
  isLoggedIn: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LOGGED_IN:
      return {
        ...state,
        currentUser: action.user,
        previousUser: null,
        isLoggedIn: true
      };

    case SET_LOGGED_OUT:
      return {
        ...state,
        currentUser: null,
        previousUser: state.currentUser,
        isLoggedIn: false
      };

    default:
      return state;
  }
};
