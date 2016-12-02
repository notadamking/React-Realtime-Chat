import {
  SET_COMMENT_SUBMIT_ERROR,
  CLEAR_COMMENTS_SUBMIT_ERRORS,
} from '../../actions/types';

const initialState = {
  commentSubmitError: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_COMMENT_SUBMIT_ERROR:
      return {
        ...state,
        commentSubmitError: action.error
      };

    case CLEAR_COMMENTS_SUBMIT_ERRORS:
      return {
        ...state,
        commentSubmitError: null,
      };

    default:
      return state;
  }
};
