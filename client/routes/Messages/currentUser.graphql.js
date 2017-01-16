import gql from 'graphql-tag';

export default gql`
query User {
  currentUser {
    id
    username
    createdAt
    updatedAt
  }
}
`;
