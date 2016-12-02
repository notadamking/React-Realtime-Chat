import {
  SET_COMMENT_SUBMIT_ERROR,
  CLEAR_COMMENTS_SUBMIT_ERRORS,
} from '../types';

export const setCommentSubmitError = (error) => ({
  type: SET_COMMENT_SUBMIT_ERROR,
  error
});

export const clearSubmitErrors = () => ({
  type: CLEAR_COMMENTS_SUBMIT_ERRORS
});
