import gql from 'graphql-tag';

export const userListQuery = gql`
query UserList($room: String!) {
  usersInRoom(room: $room) {
    id
    username
  }
}
`;

export const usersInRoomChangedSubscription = gql`
subscription onUsersInRoomChanged($room: String!) {
  usersInRoomChanged(room: $room) {
    users {
      id
      username
    }
  }
}
`;
