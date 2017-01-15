import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Icon, Menu } from 'semantic-ui-react';
import cx from 'classnames';

import styles from './Channels.css';

const Channels = ({ activeChannel, channels, directMessages, room }) => (
  <Menu className={styles.channelsMenu} secondary vertical>
    <Menu.Item>
      <Menu.Header className={styles.channelsHeader}>
        {directMessages ? 'DIRECT MESSAGES' : `CHANNELS (${channels ? channels.length : 0})`}
      </Menu.Header>
      <Menu.Menu className={styles.channelsContainer}>
        {channels && channels.map((channel) => (
          <Menu.Item
            active={activeChannel === channel}
            className={cx(styles.channelItem, {
              [styles.activeItem]: activeChannel === channel
            })}
            key={channel}
            onClick={() => browserHistory.push(`/${room}/messages/${channel}`)}
          >
            <Icon
              className={cx(styles.channelIcon, {
                [styles.directMessageIcon]: directMessages,
                [styles.activeDirectMessageIcon]: activeChannel === channel
              })}
              name={directMessages ? 'circle' : 'hashtag'}
              size='small'
            />
            &nbsp;{channel}
          </Menu.Item>
        ))}
      </Menu.Menu>
    </Menu.Item>
  </Menu>
);

Channels.propTypes = {
  activeChannel: PropTypes.string,
  channels: PropTypes.array,
  directMessages: PropTypes.bool,
  room: PropTypes.string,
};

export default Channels;
