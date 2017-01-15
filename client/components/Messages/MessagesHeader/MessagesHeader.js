import React, { PropTypes } from 'react';
import { Header } from 'semantic-ui-react';

import styles from './MessagesHeader.css';

const MessagesHeader = ({ channel, isDirectMessage }) => (
  <div className={styles.headerContainer}>
    <Header as='h3'>
      {isDirectMessage ? `@${channel}` : `#${channel}`}
    </Header>
  </div>
);

MessagesHeader.propTypes = {
  channel: PropTypes.string.isRequired,
  isDirectMessage: PropTypes.bool,
};

export default MessagesHeader;
