import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { MessageList } from '../../../components';
import { setShouldScrollToBottom } from '../../../redux/actions/messages';
import { messageListQuery, messageAddedSubscription, messageDeletedSubscription } from './messageList.graphql';

const MESSAGES_PER_FETCH = 10;

function isDuplicateMessage(newMessage, existingMessages) {
  return newMessage && existingMessages.length > 0
          && existingMessages.some(message => newMessage.id === message.id);
}

@connect(
  (state) => ({
    shouldScrollToBottom: state.messages.shouldScrollToBottom,
    user: state.auth.currentUser,
  })
)
@graphql(messageListQuery, {
  options: {
    variables: {
      offset: 0,
      limit: MESSAGES_PER_FETCH,
    }
  },
  props: ({ data: { messages, fetchMore, loading, subscribeToMore } }) => ({
    messages,
    loading,
    subscribeToMore,
    loadMoreMessages: (messageList) => {
      const beforeHeight = messageList.scrollHeight;
      return fetchMore({
        variables: {
          offset: messages.length,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return {
            messages: [...previousResult.messages, ...fetchMoreResult.data.messages],
          };
        },
      }).then(() => {
        const afterHeight = messageList.scrollHeight;
        messageList.scrollTop = afterHeight - beforeHeight;
      });
    },
  }),
})
export default class MessageListContainer extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.subscription && !nextProps.loading) {
      // scroll to bottom after initial page load
      setTimeout(() => this.props.dispatch(setShouldScrollToBottom()), 250);

      this.subscription = [
        nextProps.subscribeToMore({
          document: messageAddedSubscription,
          updateQuery: (previousResult, { subscriptionData }) => {
            const newMessage = subscriptionData.data.messageAdded;
            if (isDuplicateMessage(newMessage, previousResult.messages)) {
              return previousResult;
            }

            if (!this.props.user || newMessage.author.id !== this.props.user.id) {
              setTimeout(() => this.props.dispatch(setShouldScrollToBottom()), 100);
            }

            return {
              messages: [newMessage, ...previousResult.messages]
            };
          }
        }),
        nextProps.subscribeToMore({
          document: messageDeletedSubscription,
          updateQuery: (previousResult, { subscriptionData }) => {
            const remainingMessages = previousResult.messages.filter((message) => {
              return message.id !== subscriptionData.data.messageDeleted.id;
            });

            return {
              messages: remainingMessages
            };
          }
        }),
      ];
    }

    if (nextProps.shouldScrollToBottom) {
      this.messageList.scrollTop = this.messageList.scrollHeight;
      this.props.dispatch(setShouldScrollToBottom(false));
    }
  }

  handleSetRef(ref) {
    this.messageList = ref;
  }

  handleScroll() {
    if (this.messageList.scrollTop === 0) {
      this.props.loadMoreMessages(this.messageList);
    }
  }

  render() {
    const { messages } = this.props;
    return messages
    ? (
      <MessageList
        messages={messages.slice()} /* .slice() copies the array */
        onScroll={this.handleScroll.bind(this)}
        onSetRef={this.handleSetRef.bind(this)}
      />
    )
    : <noscript />;
  }
}

MessageListContainer.propTypes = {
  dispatch: PropTypes.func,
  loadMoreMessages: PropTypes.func,
  loading: PropTypes.bool,
  messages: PropTypes.object,
  shouldScrollToBottom: PropTypes.bool,
  subscribeToMore: PropTypes.func,
  user: PropTypes.object,
};
