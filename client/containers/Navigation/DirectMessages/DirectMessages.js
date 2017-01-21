import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { graphql } from 'react-apollo';

import { DirectMessages } from '../../../components';
import { onlineUsersChangedSubscription, onlineUsersForRoomQuery, usersForRoomQuery } from './directMessages.graphql';

@graphql(onlineUsersForRoomQuery, {
  options: ({ room }) => ({
    variables: { room }
  }),
  props: ({ data: { loading, onlineUsersForRoom, subscribeToMore } }) => ({
    onlineUsers: onlineUsersForRoom,
    loading,
    subscribeToMore,
  }),
})
@graphql(usersForRoomQuery, {
  options: ({ room }) => ({
    variables: { room }
  }),
  props: ({ data: { usersForRoom } }) => ({
    users: usersForRoom,
  })
})
export default class DirectMessagesContainer extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.subscription && !nextProps.loading) {
      this.subscription = nextProps.subscribeToMore({
        document: onlineUsersChangedSubscription,
        variables: { room: this.props.room },
        updateQuery: (previousResult, { subscriptionData }) => {
          const users = subscriptionData.data.onlineUsersChanged.users;
          const currentUser = this.props.user;
          if (currentUser) {
            const currentUserIndex = users.map((u) => u.id).indexOf(currentUser.id);
            const filteredUsers = users.filter((u) => u.id !== currentUser.id);
            return {
              onlineUsersForRoom: [users[currentUserIndex], ...filteredUsers]
            };
          }

          return {
            onlineUsersForRoom: users
          };
        }
      });
    }
  }

  handleClickChannel(channel) {
    const { room } = this.props;
    browserHistory.push(`/${room}/messages/${channel}`);
  }

  render() {
    const { channel, onlineUsers, user, users } = this.props;
    const online = onlineUsers
      .filter((u) => u.username !== null)
      .map((u) => `@${u.username}`);
    const offline = users
      .filter((u) => {
        return u.username !== null
          && (!user || u.username !== user.username)
          && !online.includes(`@${u.username}`);
      })
      .map((u) => `@${u.username}`);
    return (
      <DirectMessages
        activeChannel={channel}
        offlineUsers={[...new Set(offline)]}
        onlineUsers={[...new Set(online)]}
        user={user}
        onClickChannel={this.handleClickChannel.bind(this)}
      />
    );
  }
}

DirectMessagesContainer.propTypes = {
  channel: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  onlineUsers: PropTypes.array,
  room: PropTypes.string.isRequired,
  subscribeToMore: PropTypes.func,
  user: PropTypes.object,
  users: PropTypes.array,
};
