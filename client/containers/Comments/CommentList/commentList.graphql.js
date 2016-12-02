import gql from 'graphql-tag';

export default gql`
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
