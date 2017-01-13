import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Menu } from 'semantic-ui-react';

import { LoginModal, SignupModal } from '../../../components';
import styles from './Navbar.css';

const Navbar = ({ loginModalOpen, signupModalOpen, user, onCloseModal, onLoginClicked, onLogoutClicked, onSignupClicked }) => (
  <Menu className={styles.navbar} secondary>
    <Menu.Item>
      <Link to='/messages/general'>Home</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to='/newRoom/messages/general'>NewRoom</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to='/anotherRoom/messages/general'>AnotherRoom</Link>
    </Menu.Item>
    {user ? (
      <Menu.Menu position='right'>
        <Menu.Item>
          Logged in as {user.email}
        </Menu.Item>
        <Menu.Item name='logout' onClick={onLogoutClicked} />
      </Menu.Menu>
    ) : (
      <Menu.Menu position='right'>
        <Menu.Item name='sign up' onClick={onSignupClicked} />
        <Menu.Item name='login' onClick={onLoginClicked} />
      </Menu.Menu>
    )}
    <LoginModal
      open={loginModalOpen}
      onClose={onCloseModal}
      onShowSignupModal={onSignupClicked}
    />
    <SignupModal
      open={signupModalOpen}
      onClose={onCloseModal}
      onShowLoginModal={onLoginClicked}
    />
  </Menu>
);

Navbar.propTypes = {
  loginModalOpen: PropTypes.bool,
  signupModalOpen: PropTypes.bool,
  user: PropTypes.object,
  onCloseModal: PropTypes.func,
  onLoginClicked: PropTypes.func,
  onLogoutClicked: PropTypes.func,
  onSignupClicked: PropTypes.func,
};

export default Navbar;
