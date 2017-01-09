import gql from 'graphql-tag';

export const messageListQuery = gql`
query MessageList($offset: Int, $limit: Int) {
  messages(offset: $offset, limit: $limit) {
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

export const messageFeedSubscription = gql`
subscription MessageFeedUpdates {
  messageFeedUpdated {
    message {
      id
      content
      createdAt
      updatedAt
      author {
        id
        email
      }
    }
    action
  }
}
`;
