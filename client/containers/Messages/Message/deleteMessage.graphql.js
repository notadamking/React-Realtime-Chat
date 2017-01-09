import gql from 'graphql-tag';

export default gql`
mutation DeleteMessage($id: ID!) {
  deleteMessage(id: $id) {
    id
  }
}
`;
