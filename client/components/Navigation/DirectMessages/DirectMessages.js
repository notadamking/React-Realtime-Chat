import React, { PropTypes } from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import cx from 'classnames';

import styles from './DirectMessages.css';

const DirectMessages = ({ activeChannel, channels, user, onClickChannel }) => (
  <Menu className={styles.channelsMenu} secondary vertical>
    <Menu.Item>
      <Menu.Header className={styles.channelsHeader}>
        DIRECT MESSAGES
      </Menu.Header>
      <Menu.Menu className={styles.channelsContainer}>
        {channels && channels.map((channel) => (
          <Menu.Item
            active={activeChannel === channel}
            className={cx(styles.channelItem, {
              [styles.activeItem]: activeChannel === channel
            })}
            key={channel}
            onClick={() => onClickChannel(channel)}
          >
            <Icon
              className={cx(styles.channelIcon, styles.directMessageIcon, {
                [styles.activeIcon]: activeChannel === channel
              })}
              name='circle'
              size='small'
            />
            &nbsp;
            {user && channel.slice(1) === user.username
              ? `${channel.slice(1)} (you)`
              : channel.slice(1)
            }
          </Menu.Item>
        ))}
      </Menu.Menu>
    </Menu.Item>
  </Menu>
);

DirectMessages.propTypes = {
  activeChannel: PropTypes.string,
  channels: PropTypes.array,
  user: PropTypes.object,
  onClickChannel: PropTypes.func,
};

export default DirectMessages;
