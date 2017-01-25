import React, { Component, PropTypes } from 'react';
import { withApollo } from 'react-apollo';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import { handleLogout } from '../../../redux/actions/auth';
import { LoginModal, NavMenu, SignupModal } from '../../../components';

@withApollo
@connect(
  (state) => ({
    user: (state.auth && state.auth.currentUser) || null,
  })
)
export default class NavMenuContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditingRoom: false,
      loginModalOpen: false,
      signupModalOpen: false,
    };
  }

  handleLoginClick() {
    this.setState({
      loginModalOpen: true,
      signupModalOpen: false
    });
  }

  handleLogoutClick() {
    const { dispatch, client } = this.props;
    dispatch(handleLogout());
    client.resetStore();
  }

  handleSignupClick() {
    this.setState({
      loginModalOpen: false,
      signupModalOpen: true
    });
  }

  handleCloseModals() {
    this.setState({
      loginModalOpen: false,
      signupModalOpen: false
    });
  }

  handleEditRoomClick() {
    this.setState({
      isEditingRoom: true
    });
  }

  handleKeyUp(e) {
    if (e.which === 13 && !e.shiftKey) {
      const { channel } = this.props;
      browserHistory.push(`/${e.target.value}/messages/${channel}`);
      this.setState({
        isEditingRoom: false
      });
    }
  }

  render() {
    const { channel, room, user } = this.props;
    return (
      <div>
        <NavMenu
          channel={channel}
          isEditingRoom={this.state.isEditingRoom}
          room={room}
          user={user}
          onEditRoomClicked={this.handleEditRoomClick.bind(this)}
          onKeyUp={this.handleKeyUp.bind(this)}
          onLoginClicked={this.handleLoginClick.bind(this)}
          onLogoutClicked={this.handleLogoutClick.bind(this)}
          onSignupClicked={this.handleSignupClick.bind(this)}
        />
        <LoginModal
          open={this.state.loginModalOpen}
          onClose={this.handleCloseModals.bind(this)}
          onShowSignupModal={this.handleSignupClick.bind(this)}
        />
        <SignupModal
          open={this.state.signupModalOpen}
          onClose={this.handleCloseModals.bind(this)}
          onShowLoginModal={this.handleLoginClick.bind(this)}
        />
      </div>
    );
  }
}

NavMenuContainer.propTypes = {
  channel: PropTypes.string,
  client: PropTypes.object,
  dispatch: PropTypes.func,
  room: PropTypes.string,
  user: PropTypes.object,
};
