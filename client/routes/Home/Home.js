import React from 'react';
import Helmet from 'react-helmet';
import { Container } from 'semantic-ui-react';

import { CommentList } from '../../containers';

const Home = () => (
  <Container>
    <Helmet title='Home' />
    <CommentList />
  </Container>
);

export default Home;
