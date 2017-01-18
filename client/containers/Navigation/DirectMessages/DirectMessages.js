import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { graphql } from 'react-apollo';

import { DirectMessages } from '../../../components';
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

  handleClickChannel(channel) {
    const { room } = this.props;
    browserHistory.push(`/${room}/messages/${channel}`);
  }

  render() {
    const { channel, user, users } = this.props;
    return (
      <DirectMessages
        activeChannel={channel}
        channels={users.map((u) => `@${u.username}`)}
        user={user}
        onClickChannel={this.handleClickChannel.bind(this)}
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
