import React from 'react';
import Helmet from 'react-helmet';
import { Container, Header } from 'semantic-ui-react';

import { CommentList } from '../../containers';

const Home = () => (
  <Container>
    <Helmet title='Home' />
    <Header as='h1' textAlign='center'>
      Welcome home!
    </Header>
    <CommentList />
  </Container>
);

export default Home;
