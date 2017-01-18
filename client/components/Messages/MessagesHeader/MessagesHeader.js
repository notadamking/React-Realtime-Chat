import React, { PropTypes } from 'react';
import { Header } from 'semantic-ui-react';

import styles from './MessagesHeader.css';

const MessagesHeader = ({ channel }) => (
  <div className={styles.headerContainer}>
    <Header as='h3'>
      {channel.includes('@') ? channel : `#${channel}`}
    </Header>
  </div>
);

MessagesHeader.propTypes = {
  channel: PropTypes.string.isRequired,
};

export default MessagesHeader;
