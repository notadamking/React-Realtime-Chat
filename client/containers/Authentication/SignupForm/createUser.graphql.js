import gql from 'graphql-tag';

export default gql`
mutation User($email: Email!, $password: String!) {
  createUser(email: $email, password: $password) {
    id
    email
    authToken
  }
}
`;
