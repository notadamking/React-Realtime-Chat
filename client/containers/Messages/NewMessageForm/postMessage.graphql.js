import gql from 'graphql-tag';

export default gql`
mutation NewMessage($room: String!, $channel: String!, $content: String!) {
  postMessage(room: $room, channel: $channel, content: $content) {
    id
    content
    createdAt
    updatedAt
    author {
      id
      email
    }
  }
}
`;
