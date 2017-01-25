import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';

import { MessageList, NavMenu, NewMessageForm } from '../../';
import { MessagesHeader } from '../../../components';
import { setShouldUpdateRoom } from '../../../redux/actions/messages';
import { updateCurrentRoomMutation } from './messageRoom.graphql';

@connect(
  (state) => ({
    previousUser: state.auth.previousUser,
    shouldUpdateRoom: state.messages.shouldUpdateRoom,
  })
)
@graphql(updateCurrentRoomMutation, {
  props: ({ mutate }) => ({
    updateCurrentRoom: ({ authToken, room, user }) => mutate({
      variables: { room, authToken },
      optimisticResponse: {
        updateCurrentRoom: {
          __typename: 'User',
          id: user && user.id,
          username: user && user.username,
          currentRoom: room,
        }
      },
      updateQueries: {
        OnlineUserList: (previousResult, { mutationResult }) => {
          const updatedUser = mutationResult.data.updateCurrentRoom;
          const prevUsers = previousResult.onlineUsersForRoom;
          if (!updatedUser.currentRoom) {
            const filteredUsers = prevUsers ? prevUsers.filter((u) => u.id !== updatedUser.id) : [];
            return { onlineUsersForRoom: filteredUsers };
          }

          return { onlineUsersForRoom: [updatedUser, ...prevUsers] };
        },
        UserList: (previousResult, { mutationResult }) => {
          const updatedUser = mutationResult.data.updateCurrentRoom;
          const prevUsers = previousResult.usersForRoom;
          if (!prevUsers) {
            return { usersForRoom: [updatedUser] };
          }

          return { usersForRoom: [updatedUser, ...prevUsers] };
        }
      }
    }),
  }),
})
export default class MessageRoomContainer extends Component {
  componentDidMount() {
    window.onbeforeunload = (e) => {
      const { updateCurrentRoom, user } = this.props;
      e.preventDefault();
      if (user) {
        updateCurrentRoom({ room: null, user });
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, room, updateCurrentRoom } = this.props;
    if (nextProps.shouldUpdateRoom && nextProps.previousUser) {
      updateCurrentRoom({
        authToken: nextProps.previousUser.authToken,
        room: null,
        user: nextProps.previousUser
      });
      dispatch(setShouldUpdateRoom(false));
    } else if (nextProps.shouldUpdateRoom) {
      updateCurrentRoom({ room: nextProps.room, user: nextProps.user });
      dispatch(setShouldUpdateRoom(false));
    } else if (nextProps.room !== room) {
      updateCurrentRoom({ room: nextProps.room, user: nextProps.user });
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
        <MessagesHeader channel={channel} />
        <MessageList channel={channel} room={room} />
        <NewMessageForm channel={channel} room={room} />
      </div>
    );
  }
}

MessageRoomContainer.propTypes = {
  channel: PropTypes.string.isRequired,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
  previousUser: PropTypes.object,
  room: PropTypes.string.isRequired,
  shouldUpdateRoom: PropTypes.bool,
  subscribeToMore: PropTypes.func,
  updateCurrentRoom: PropTypes.func,
  user: PropTypes.object,
};
