import gql from 'graphql-tag';

export default gql`
query User {
  currentUser {
    id
    email
    createdAt
    updatedAt
  }
}
`;
