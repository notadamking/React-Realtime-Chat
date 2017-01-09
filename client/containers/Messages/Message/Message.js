import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { Message } from '../../../components';
import deleteMessageMutation from './deleteMessage.graphql';

@graphql(deleteMessageMutation, {
  props: ({ ownProps, mutate }) => ({
    deleteMessage: () => mutate({
      variables: { id: ownProps.message.id },
      optimisticResponse: {
        deleteMessage: {
          __typename: 'Message',
          id: ownProps.message.id,
        }
      },
      updateQueries: {
        MessageList: (previousResult, { mutationResult }) => {
          const remainingMessages = previousResult.messages.filter((message) => {
            return message.id !== mutationResult.data.deleteMessage.id;
          });

          return {
            messages: remainingMessages
          };
        }
      }
    }),
  }),
})
@connect(
  (state) => ({
    user: (state.auth && state.auth.currentUser) || null,
  })
)
export default class MessageContainer extends Component {
  onDelete() {
    const { deleteMessage } = this.props;
    deleteMessage();
  }

  render() {
    const { message, user } = this.props;
    const wasPostedByUser = user && (message.author.id === user.id);
    return (
      <Message
        isRemovable={wasPostedByUser}
        message={message}
        onDelete={this.onDelete.bind(this)}
      />
    );
  }
}

MessageContainer.propTypes = {
  deleteMessage: PropTypes.func,
  message: PropTypes.object.isRequired,
  user: PropTypes.object,
};
