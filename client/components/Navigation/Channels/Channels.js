import React, { PropTypes } from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import cx from 'classnames';

import styles from './Channels.css';

const Channels = ({ activeChannel, channels, onClickChannel, onClickCreateNewChannel }) => (
  <Menu className={styles.channelsMenu} secondary vertical>
    <Menu.Item>
      <Menu.Header className={styles.channelsHeader}>
        CHANNELS ({channels ? channels.length : 0})
        <Icon circular className={styles.newChannelIcon} name='plus' onClick={onClickCreateNewChannel} />
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
              className={cx(styles.channelIcon, {
                [styles.activeIcon]: activeChannel === channel
              })}
              name='hashtag'
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
  onClickChannel: PropTypes.func.isRequired,
  onClickCreateNewChannel: PropTypes.func.isRequired,
};

export default Channels;
