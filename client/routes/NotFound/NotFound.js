import React from 'react';
import Helmet from 'react-helmet';
import { Header } from 'semantic-ui-react';

const NotFound = () => (
  <div>
    <Helmet title='404: Page Not Found' />
    <Header as='h1'>Oops! That page doesn't seem to exist...</Header>
  </div>
);

export default NotFound;
