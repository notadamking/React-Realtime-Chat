import gql from 'graphql-tag';

export default gql`
mutation User($username: String!, $password: String!) {
  createUser(username: $username, password: $password) {
    id
    username
    authToken
  }
}
`;
