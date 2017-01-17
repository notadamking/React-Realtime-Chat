import gql from 'graphql-tag';

export const updateCurrentRoomMutation = gql`
mutation UpdateCurrentRoom($room: String, $authToken: String) {
  updateCurrentRoom(room: $room, authToken: $authToken) {
    id
    username
    currentRoom
  }
}
`;
