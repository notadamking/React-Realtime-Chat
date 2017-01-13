import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import Helmet from 'react-helmet';

import { setLoading, setLoggedIn, setLoggedOut } from '../../redux/actions/auth';
import { MessageList, NavMenu, NewMessageForm } from '../../containers';
import getCurrentUser from './currentUser.graphql';
// import styles from './Messages.css';

@connect()
@graphql(getCurrentUser, { options: { ssr: false } })
export default class Messages extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setLoading());
  }

  componentWillReceiveProps({ data: { currentUser }, user }) {
    const { dispatch } = this.props;
    if (currentUser) {
      if (user !== currentUser) {
        dispatch(setLoggedIn(currentUser));
      }
    } else if (this.props.user) {
      dispatch(setLoggedOut());
    }
    dispatch(setLoading(false));
  }

  render() {
    const { params, route } = this.props;
    const room = (params.room || route.room);
    const channel = (params.channel || route.channel);
    return (
      <div>
        <Helmet
          title={`${channel} | ${room.charAt(0).toUpperCase() + room.slice(1)}`}
        />
        <NavMenu channel={channel} room={room} />
        <MessageList channel={channel} room={room} />
        <NewMessageForm channel={channel} room={room} />
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
