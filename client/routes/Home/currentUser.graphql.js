import gql from 'graphql-tag';

export default gql`
query User {
  currentUser {
    id
    user {
      id
      email
      createdAt
      updatedAt
    }
  }
}
`;
