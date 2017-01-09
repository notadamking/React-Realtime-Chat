import gql from 'graphql-tag';

export default gql`
mutation NewMessage($content: String!) {
  postMessage(content: $content) {
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
