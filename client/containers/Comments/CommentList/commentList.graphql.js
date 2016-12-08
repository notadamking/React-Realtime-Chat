import gql from 'graphql-tag';

export const commentListQuery = gql`
query CommentList($offset: Int, $limit: Int) {
  comments(offset: $offset, limit: $limit) {
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

export const commentFeedSubscription = gql`
subscription CommentFeedUpdates {
  commentFeedUpdated {
    comment {
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
