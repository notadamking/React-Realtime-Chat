import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';

import { Channels } from '../../../components';
import { usersInRoomChangedSubscription, userListQuery } from './directMessages.graphql';

@graphql(userListQuery, {
  options: ({ room }) => ({
    variables: { room }
  }),
  props: ({ data: { loading, usersInRoom, subscribeToMore } }) => ({
    users: usersInRoom,
    loading,
    subscribeToMore,
  }),
})
export default class DirectMessagesContainer extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.subscription && !nextProps.loading) {
      this.subscription = [
        nextProps.subscribeToMore({
          document: usersInRoomChangedSubscription,
          variables: { room: this.props.room },
          updateQuery: (previousResult, { subscriptionData }) => {
            const users = subscriptionData.data.usersInRoomChanged.users;
            const currentUser = this.props.user;

            if (currentUser) {
              const currentUserIndex = users.map((u) => u.id).indexOf(currentUser.id);
              const filteredUsers = users.filter((u) => u.id !== currentUser.id);
              return {
                usersInRoom: [users[currentUserIndex], ...filteredUsers]
              };
            }

            return {
              usersInRoom: users
            };
          }
        }),
      ];
    }
  }

  render() {
    const { channel, room, user, users } = this.props;
    return (
      <Channels
        activeChannel={channel}
        channels={users.map((u) => {
          if (user && u.id === user.id) {
            return `${u.email} (you)`;
          }
          return u.email;
        })}
        directMessages
        room={room}
      />
    );
  }
}

DirectMessagesContainer.propTypes = {
  channel: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  room: PropTypes.string.isRequired,
  subscribeToMore: PropTypes.func,
  user: PropTypes.object,
  users: PropTypes.array,
};
