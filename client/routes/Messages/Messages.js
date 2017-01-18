import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import Helmet from 'react-helmet';

import { handleLoginSuccess } from '../../redux/actions/auth';
import { MessageRoom } from '../../containers';
import getCurrentUser from './currentUser.graphql';

@connect(
  (state) => ({
    user: state.auth.currentUser,
  })
)
@graphql(getCurrentUser, { options: { ssr: false } })
export default class Messages extends Component {
  componentWillReceiveProps({ data: { currentUser, loading }, dispatch, user }) {
    if (!loading && currentUser && user !== currentUser) {
      dispatch(handleLoginSuccess(currentUser));
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
