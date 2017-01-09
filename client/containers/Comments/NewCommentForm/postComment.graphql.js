import gql from 'graphql-tag';

export default gql`
mutation NewComment($content: String!) {
  postComment(content: $content) {
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
