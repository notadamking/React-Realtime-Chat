import React, { PropTypes } from 'react';
import { Icon, Menu } from 'semantic-ui-react';

import { Channels, DirectMessages } from '../../../containers';
import styles from './NavMenu.css';

const NavMenu = ({ channel, room, user, onLoginClicked, onLogoutClicked, onSignupClicked }) => (
  <Menu className={styles.navMenu} vertical>
    <Menu.Item>
      <Menu.Header className={styles.roomTitle}>{room}</Menu.Header>
    </Menu.Item>
    {user ? (
      <Menu.Menu>
        <Menu.Item className={styles.navMenuItem}>
          <Icon
            className={styles.userIcon}
            name='circle'
            size='small'
          />
          &nbsp;{user.username}
        </Menu.Item>
        <Menu.Item
          className={styles.navMenuItem}
          content='logout'
          icon='sign out'
          onClick={onLogoutClicked}
        />
      </Menu.Menu>
    ) : (
      <Menu.Menu>
        <Menu.Item
          className={styles.navMenuItem}
          content='sign up'
          icon='talk'
          onClick={onSignupClicked}
        />
        <Menu.Item
          className={styles.navMenuItem}
          content='login'
          icon='sign in'
          onClick={onLoginClicked}
        />
      </Menu.Menu>
    )}
    <Channels channel={channel} room={room} />
    <DirectMessages channel={channel} room={room} user={user} />
  </Menu>
);

NavMenu.propTypes = {
  channel: PropTypes.string,
  room: PropTypes.string,
  user: PropTypes.object,
  onLoginClicked: PropTypes.func,
  onLogoutClicked: PropTypes.func,
  onSignupClicked: PropTypes.func,
};

export default NavMenu;
