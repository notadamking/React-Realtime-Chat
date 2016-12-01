import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';

import { setLoginModalOpen, setSignupModalOpen } from '../../../redux/actions';
import { LoginModal } from '../../';

@connect(
  (state) => ({
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

  handleSignupClick() {
    const { dispatch } = this.props;
    dispatch(setLoginModalOpen(false));
    dispatch(setSignupModalOpen(true));
  }

  render() {
    const { loginModalOpen } = this.props;
    return (
      <Menu secondary>
        <Menu.Menu position='right'>
          <Menu.Item name='sign up' onClick={this.handleSignupClick.bind(this)} />
          <Menu.Item name='login' onClick={this.handleLoginClick.bind(this)} />
        </Menu.Menu>
        <LoginModal
          open={loginModalOpen}
          onShowSignupModal={this.handleSignupClick}
        />
      </Menu>
    );
  }
}

Navbar.propTypes = {
  dispatch: PropTypes.func,
  loginModalOpen: PropTypes.bool,
  signupModalOpen: PropTypes.bool,
};
