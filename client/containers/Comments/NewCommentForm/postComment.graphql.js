import gql from 'graphql-tag';

export default gql`
mutation NewComment($content: String!) {
  postComment(content: $content) {
    id
    comment {
      id
      content
      author {
        id
        email
      }
    }
    error
  }
}
`;
