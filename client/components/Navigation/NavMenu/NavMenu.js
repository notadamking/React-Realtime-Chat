import React, { PropTypes } from 'react';
import { Icon, Input, Menu } from 'semantic-ui-react';

import { Channels, DirectMessages } from '../../../containers';
import styles from './NavMenu.css';

const NavMenu = ({ channel, isEditingRoom, room, user, onEditRoomClicked, onKeyUp, onLoginClicked, onLogoutClicked, onSignupClicked }) => (
  <Menu className={styles.navMenu} vertical>
    <Menu.Item>
      {isEditingRoom
        ? <Input autoFocus placeholder='Enter room' onKeyUp={onKeyUp} />
        : (
          <Menu.Header className={styles.roomTitle}>
            {room}&nbsp;
            <Icon className={styles.editRoomIcon} name='write' onClick={onEditRoomClicked} />
          </Menu.Header>
        )
      }
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
  isEditingRoom: PropTypes.bool,
  room: PropTypes.string,
  user: PropTypes.object,
  onEditRoomClicked: PropTypes.func,
  onKeyUp: PropTypes.func,
  onLoginClicked: PropTypes.func,
  onLogoutClicked: PropTypes.func,
  onSignupClicked: PropTypes.func,
};

export default NavMenu;
