import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import Helmet from 'react-helmet';

import { setLoggedIn, setLoggedOut } from '../../redux/actions/auth';
import { MessageRoom } from '../../containers';
import getCurrentUser from './currentUser.graphql';

@connect(
  (state) => ({
    user: state.auth.currentUser,
  })
)
@graphql(getCurrentUser, { options: { ssr: false } })
export default class Messages extends Component {
  componentWillReceiveProps({ data: { currentUser }, user }) {
    const { dispatch } = this.props;
    if (currentUser) {
      if (user !== currentUser) {
        dispatch(setLoggedIn(currentUser));
      }
    } else if (this.props.user) {
      dispatch(setLoggedOut());
    }
  }

  render() {
    const { params, route, user } = this.props;
    const room = (params.room || route.room);
    const channel = (params.channel || route.channel);
    return (
      <div>
        <Helmet
          title={`${channel} | ${room.charAt(0).toUpperCase() + room.slice(1)}`}
        />
        <MessageRoom channel={channel} room={room} user={user} />
      </div>
    );
  }
}

Messages.propTypes = {
  data: PropTypes.shape({
    currentUser: PropTypes.object,
  }),
  dispatch: PropTypes.func,
  params: PropTypes.shape({
    channel: PropTypes.string,
    room: PropTypes.string,
  }),
  route: PropTypes.shape({
    channel: PropTypes.string,
    room: PropTypes.string,
  }),
  user: PropTypes.object,
};
