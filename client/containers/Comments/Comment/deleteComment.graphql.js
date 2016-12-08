import gql from 'graphql-tag';

export default gql`
mutation DeleteComment($id: ID!) {
  deleteComment(id: $id) {
    id
    comment {
      id
    }
    error
  }
}
`;
