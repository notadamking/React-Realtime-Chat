import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

import config from '../../../../config';
import styles from './MainLayout.css';

const MainLayout = ({ children }) => (
  <div className={styles.page}>
    <Helmet title=' ' titleTemplate={`%s | ${config.meta.title}`} />
    <div className={styles.content}>
      {children}
    </div>
  </div>
);

MainLayout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default MainLayout;
