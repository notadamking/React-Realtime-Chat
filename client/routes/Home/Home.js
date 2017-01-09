import React from 'react';
import Helmet from 'react-helmet';
import { Container } from 'semantic-ui-react';

import { MessageList } from '../../containers';

const Home = () => (
  <Container fluid>
    <Helmet title='Home' />
    <MessageList />
  </Container>
);

export default Home;
