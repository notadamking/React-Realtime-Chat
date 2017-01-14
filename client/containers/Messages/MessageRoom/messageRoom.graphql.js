import gql from 'graphql-tag';

export const updateCurrentRoomMutation = gql`
mutation UpdateCurrentRoom($room: String) {
  updateCurrentRoom(room: $room) {
    id
    email
    currentRoom
  }
}
`;
