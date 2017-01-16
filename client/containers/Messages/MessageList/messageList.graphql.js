import gql from 'graphql-tag';

export const messageListQuery = gql`
query MessageList($room: String!, $channel: String!, $offset: Int, $limit: Int) {
  messages(room: $room, channel: $channel, offset: $offset, limit: $limit) {
    id
    content
    createdAt
    updatedAt
    author {
      id
      username
      avatarUrl
    }
  }
}
`;

export const messageAddedSubscription = gql`
subscription MessageAdded($room: String!, $channel: String!) {
  messageAdded(room: $room, channel: $channel) {
    id
    content
    createdAt
    updatedAt
    author {
      id
      username
      avatarUrl
    }
  }
}
`;

export const messageDeletedSubscription = gql`
subscription MessageDeleted($room: String!, $channel: String!) {
  messageDeleted(room: $room, channel: $channel) {
    id
    author {
      id
    }
  }
}
`;
