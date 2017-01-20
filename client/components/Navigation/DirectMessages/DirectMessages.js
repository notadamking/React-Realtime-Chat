import React, { PropTypes } from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import cx from 'classnames';

import styles from './DirectMessages.css';

const DirectMessages = ({ activeChannel, offlineUsers, onlineUsers, user, onClickChannel }) => (
  <Menu className={styles.channelsMenu} secondary vertical>
    <Menu.Item>
      <Menu.Header className={styles.channelsHeader}>
        DIRECT MESSAGES
      </Menu.Header>
      <Menu.Menu className={styles.channelsContainer}>
        {onlineUsers && onlineUsers.map((onlineUser) => (
          <Menu.Item
            active={activeChannel === onlineUser}
            className={cx(styles.channelItem, {
              [styles.activeItem]: activeChannel === onlineUser
            })}
            key={onlineUser}
            onClick={() => onClickChannel(onlineUser)}
          >
            <Icon
              className={cx(styles.channelIcon, styles.onlineIcon, {
                [styles.activeIcon]: activeChannel === onlineUser
              })}
              name='circle'
              size='small'
            />
            &nbsp;
            {user && onlineUser.slice(1) === user.username
              ? `${onlineUser.slice(1)} (you)`
              : onlineUser.slice(1)
            }
          </Menu.Item>
        ))}
        {offlineUsers && offlineUsers.map((offlineUser) => (
          <Menu.Item
            active={activeChannel === offlineUser}
            className={cx(styles.channelItem, {
              [styles.activeItem]: activeChannel === offlineUser
            })}
            key={offlineUser}
            onClick={() => onClickChannel(offlineUser)}
          >
            <Icon
              className={cx(styles.channelIcon, {
                [styles.activeIcon]: activeChannel === offlineUser,
              })}
              name='circle'
              size='small'
            />
            &nbsp;
            {user && offlineUser.slice(1) === user.username
              ? `${offlineUser.slice(1)} (you)`
              : offlineUser.slice(1)
            }
          </Menu.Item>
        ))}
      </Menu.Menu>
    </Menu.Item>
  </Menu>
);

DirectMessages.propTypes = {
  activeChannel: PropTypes.string,
  offlineUsers: PropTypes.array,
  onlineUsers: PropTypes.array,
  user: PropTypes.object,
  onClickChannel: PropTypes.func,
};

export default DirectMessages;
