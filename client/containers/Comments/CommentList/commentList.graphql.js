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

export const commentsSubscription = gql`
subscription NewCommentAdded {
  commentAdded {
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
