import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import { Menu } from 'semantic-ui-react';

import config from '../../../../config';
import { setLoggedOut, setLoginModalOpen, setSignupModalOpen } from '../../../redux/actions/auth';
import { LoginModal, SignupModal } from '../../../components';

@withApollo
@connect(
  (state) => ({
    user: (state.auth && state.auth.currentUser) || null,
    loginModalOpen: (state.auth && state.auth.loginModalOpen) || false,
    signupModalOpen: (state.auth && state.auth.signupModalOpen) || false,
  })
)
export default class Navbar extends Component {
  handleLoginClick() {
    const { dispatch } = this.props;
    dispatch(setSignupModalOpen(false));
    dispatch(setLoginModalOpen(true));
  }

  handleLogoutClick() {
    const { dispatch, client } = this.props;
    if (global.localStorage && localStorage.getItem(config.authTokenName)) {
      localStorage.removeItem(config.authTokenName);
    }
    dispatch(setLoggedOut());
    client.resetStore();
  }

  handleSignupClick() {
    const { dispatch } = this.props;
    dispatch(setLoginModalOpen(false));
    dispatch(setSignupModalOpen(true));
  }

  handleCloseModals() {
    const { dispatch } = this.props;
    dispatch(setLoginModalOpen(false));
    dispatch(setSignupModalOpen(false));
  }

  render() {
    const { loginModalOpen, signupModalOpen, user } = this.props;
    return (
      <Menu secondary>
        {user ? (
          <Menu.Menu position='right'>
            <Menu.Item>
              Logged in as {user.email}
            </Menu.Item>
            <Menu.Item name='logout' onClick={this.handleLogoutClick.bind(this)} />
          </Menu.Menu>
        ) : (
          <Menu.Menu position='right'>
            <Menu.Item name='sign up' onClick={this.handleSignupClick.bind(this)} />
            <Menu.Item name='login' onClick={this.handleLoginClick.bind(this)} />
          </Menu.Menu>
        )}
        <LoginModal
          open={loginModalOpen}
          onClose={this.handleCloseModals.bind(this)}
          onShowSignupModal={this.handleSignupClick.bind(this)}
        />
        <SignupModal
          open={signupModalOpen}
          onClose={this.handleCloseModals.bind(this)}
          onShowLoginModal={this.handleLoginClick.bind(this)}
        />
      </Menu>
    );
  }
}

Navbar.propTypes = {
  client: PropTypes.object,
  dispatch: PropTypes.func,
  loginModalOpen: PropTypes.bool,
  signupModalOpen: PropTypes.bool,
  user: PropTypes.object,
};
