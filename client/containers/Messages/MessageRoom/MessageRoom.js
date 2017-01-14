import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';

import { MessageList, NavMenu, NewMessageForm } from '../../';
import { updateCurrentRoomMutation } from './messageRoom.graphql';

function isDuplicateUser(newUser, existingUsers) {
  return newUser && existingUsers.length > 0
          && existingUsers.some(user => newUser.id === user.id);
}

@graphql(updateCurrentRoomMutation, {
  props: ({ mutate }) => ({
    updateCurrentRoom: ({ room, user }) => mutate({
      variables: { room },
      optimisticResponse: {
        updateCurrentRoom: {
          __typename: 'User',
          id: user.id,
          email: user.email,
          currentRoom: room,
        }
      },
      updateQueries: {
        UserList: (previousResult, { mutationResult }) => {
          const updatedUser = mutationResult.data.updateCurrentRoom;

          if (isDuplicateUser(updatedUser, previousResult.usersInRoom)) {
            return previousResult;
          }

          return {
            usersInRoom: [updatedUser, ...previousResult.usersInRoom]
          };
        }
      }
    }),
  }),
})
export default class MessageRoomContainer extends Component {
  componentDidMount() {
    const { updateCurrentRoom, user } = this.props;
    window.onbeforeunload = (e) => {
      e.preventDefault();
      if (user) {
        updateCurrentRoom({ room: null, user });
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      const { room, updateCurrentRoom } = this.props;
      updateCurrentRoom({ room, user: nextProps.user });
    }
  }

  componentWillUnmount() {
    const { updateCurrentRoom, user } = this.props;
    if (user) {
      updateCurrentRoom({ room: null, user });
    }
  }

  render() {
    const { channel, room } = this.props;
    return (
      <div>
        <NavMenu channel={channel} room={room} />
        <MessageList channel={channel} room={room} />
        <NewMessageForm channel={channel} room={room} />
      </div>
    );
  }
}

MessageRoomContainer.propTypes = {
  channel: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  room: PropTypes.string.isRequired,
  subscribeToMore: PropTypes.func,
  updateCurrentRoom: PropTypes.func,
  user: PropTypes.object,
};
