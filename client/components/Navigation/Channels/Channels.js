import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Label, Menu } from 'semantic-ui-react';
import cx from 'classnames';

import styles from './Channels.css';

const Channels = ({ activeChannel, channels, directMessages, room }) => (
  <Menu secondary vertical>
    <Menu.Item>
      <Menu.Header className={styles.channelsHeader}>
        {directMessages ? 'DIRECT MESSAGES' : `CHANNELS (${channels.length})`}
      </Menu.Header>
      <Menu.Menu>
        {channels.map((channel) => (
          <Menu.Item
            active={activeChannel === channel}
            className={cx(styles.channelItem, { [styles.activeItem]: activeChannel === channel })}
            key={channel}
            onClick={() => browserHistory.push(`/${room}/messages/${channel}`)}
          >
            <Label className={styles.notificationLabel}>0</Label>
            {directMessages ? '@' : '#'}{channel}
          </Menu.Item>
        ))}
      </Menu.Menu>
    </Menu.Item>
  </Menu>
);

Channels.propTypes = {
  activeChannel: PropTypes.string,
  directMessages: PropTypes.bool,
  channels: PropTypes.array,
  room: PropTypes.string,
};

export default Channels;
