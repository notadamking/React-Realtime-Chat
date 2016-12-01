import gql from 'graphql-tag';

export default gql`
mutation User($email: Email!, $password: String!) {
  login(email: $email, password: $password) {
    id
    user {
      id
      email
      authToken
    }
    error
  }
}
`;
