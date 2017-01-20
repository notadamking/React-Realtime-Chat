import gql from 'graphql-tag';

export const onlineUsersForRoomQuery = gql`
query OnlineUserList($room: String!) {
  onlineUsersForRoom(room: $room) {
    id
    username
  }
}
`;

export const usersForRoomQuery = gql`
query UserList($room: String!) {
  usersForRoom(room: $room) {
    id
    username
  }
}
`;

export const onlineUsersChangedSubscription = gql`
subscription onOnlineUsersChanged($room: String!) {
  onlineUsersChanged(room: $room) {
    users {
      id
      username
    }
  }
}
`;
