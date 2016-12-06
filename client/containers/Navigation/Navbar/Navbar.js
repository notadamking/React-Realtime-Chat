import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';

import config from '../../../../config';
import { setLoggedOut, setLoginModalOpen, setSignupModalOpen } from '../../../redux/actions/auth';
import { Navbar } from '../../../components';

@withApollo
@connect(
  (state) => ({
    user: (state.auth && state.auth.currentUser) || null,
    loginModalOpen: (state.auth && state.auth.loginModalOpen) || false,
    signupModalOpen: (state.auth && state.auth.signupModalOpen) || false,
  })
)
export default class NavbarContainer extends Component {
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
      <Navbar
        loginModalOpen={loginModalOpen}
        signupModalOpen={signupModalOpen}
        user={user}
        onCloseModal={this.handleCloseModals.bind(this)}
        onLoginClicked={this.handleLoginClick.bind(this)}
        onLogoutClicked={this.handleLogoutClick.bind(this)}
        onSignupClicked={this.handleSignupClick.bind(this)}
      />
    );
  }
}

NavbarContainer.propTypes = {
  client: PropTypes.object,
  dispatch: PropTypes.func,
  loginModalOpen: PropTypes.bool,
  signupModalOpen: PropTypes.bool,
  user: PropTypes.object,
};
