import {
  SET_SHOULD_SCROLL_TO_BOTTOM,
} from '../types';

export const setShouldScrollToBottom = (shouldScroll = true) => ({
  type: SET_SHOULD_SCROLL_TO_BOTTOM,
  shouldScroll
});
