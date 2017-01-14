import gql from 'graphql-tag';

export const channelsForRoomQuery = gql`
query ChannelList($room: String!) {
  channelsForRoom(room: $room)
}
`;

export const channelsInRoomChangedSubscription = gql`
subscription onChannelsInRoomChanged($room: String!) {
  channelsInRoomChanged(room: $room) {
    channels
  }
}
`;
