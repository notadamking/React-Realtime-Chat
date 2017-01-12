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
      email
    }
  }
}
`;

export const messageAddedSubscription = gql`
subscription MessageAdded {
  messageAdded {
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

export const messageDeletedSubscription = gql`
subscription MessageDeleted {
  messageDeleted {
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
