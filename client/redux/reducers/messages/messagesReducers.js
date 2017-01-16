import {
  SET_SHOULD_SCROLL_TO_BOTTOM,
  SET_SHOULD_UPDATE_ROOM,
} from '../../actions/types';

const initialState = {
  shouldScrollToBottom: false,
  shouldUpdateRoom: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SHOULD_SCROLL_TO_BOTTOM:
      return {
        ...state,
        shouldScrollToBottom: action.shouldScroll
      };

    case SET_SHOULD_UPDATE_ROOM:
      return {
        ...state,
        shouldUpdateRoom: action.shouldUpdate
      };

    default:
      return state;
  }
};
