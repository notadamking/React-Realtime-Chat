import {
  SET_SHOULD_SCROLL_TO_BOTTOM,
  SET_SHOULD_UPDATE_ROOM,
} from '../types';

export const setShouldScrollToBottom = (shouldScroll = true) => ({
  type: SET_SHOULD_SCROLL_TO_BOTTOM,
  shouldScroll
});

export const setShouldUpdateRoom = (shouldUpdate = true) => ({
  type: SET_SHOULD_UPDATE_ROOM,
  shouldUpdate
});
