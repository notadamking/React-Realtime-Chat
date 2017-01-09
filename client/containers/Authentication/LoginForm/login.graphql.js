import gql from 'graphql-tag';

export default gql`
mutation User($email: Email!, $password: String!) {
  loginAsUser(email: $email, password: $password) {
    id
    email
    authToken
  }
}
`;
