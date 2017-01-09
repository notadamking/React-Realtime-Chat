import {
  SET_SHOULD_SCROLL_TO_BOTTOM,
} from '../../actions/types';

const initialState = {
  shouldScrollToBottom: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SHOULD_SCROLL_TO_BOTTOM:
      return {
        ...state,
        shouldScrollToBottom: action.shouldScroll
      };

    default:
      return state;
  }
};
