import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

const Home = ({ children }) => (
  <div>
    <Helmet title='Home' />
    <h1>Welcome home</h1>
    {children}
  </div>
);

Home.propTypes = {
  children: PropTypes.object,
};

export default Home;
