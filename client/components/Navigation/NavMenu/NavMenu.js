import React, { PropTypes } from 'react';
import { Menu } from 'semantic-ui-react';

import { Channels } from '../../../components';
import styles from './NavMenu.css';

const NavMenu = ({ channel, room, user, onLoginClicked, onLogoutClicked, onSignupClicked }) => (
  <Menu className={styles.navMenu} vertical>
    <Menu.Item>
      <Menu.Header className={styles.roomTitle}>{room}</Menu.Header>
    </Menu.Item>
    {user ? (
      <Menu.Menu>
        <Menu.Item className={styles.navMenuItem} icon='user' content={user.email} />
        <Menu.Item
          className={styles.navMenuItem}
          icon='sign out'
          content='logout'
          onClick={onLogoutClicked}
        />
      </Menu.Menu>
    ) : (
      <Menu.Menu>
        <Menu.Item
          className={styles.navMenuItem}
          icon='talk'
          content='sign up'
          onClick={onSignupClicked}
        />
        <Menu.Item
          className={styles.navMenuItem}
          icon='sign in'
          content='login'
          onClick={onLoginClicked}
        />
      </Menu.Menu>
    )}
    <Channels
      activeChannel={channel}
      channels={['general', 'test', 'new']}
      room={room}
    />
    <Channels
      activeChannel={channel}
      channels={['a@a.com', '1@1.com', 't@t.com']}
      directMessages
      room={room}
    />
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
