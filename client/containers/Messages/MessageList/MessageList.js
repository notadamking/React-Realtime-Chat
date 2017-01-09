import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { MessageList } from '../../../components';
import { setShouldScrollToBottom } from '../../../redux/actions/messages';
import { messageListQuery, messageFeedSubscription } from './messageList.graphql';

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
      setTimeout(() => this.props.dispatch(setShouldScrollToBottom()), 100);

      this.subscription = nextProps.subscribeToMore({
        document: messageFeedSubscription,
        updateQuery: (previousResult, { subscriptionData }) => {
          const update = subscriptionData.data.messageFeedUpdated;
          if (update.action === 'add') {
            if (isDuplicateMessage(update.message, previousResult.messages)) {
              return previousResult;
            }

            if (!this.props.user || update.message.author.id !== this.props.user.id) {
              setTimeout(() => this.props.dispatch(setShouldScrollToBottom()), 100);
            }

            return {
              messages: [update.message, ...previousResult.messages]
            };
          } else if (update.action === 'delete') {
            const remainingMessages = previousResult.messages.filter((message) => {
              return message.id !== update.message.id;
            });

            return {
              messages: remainingMessages
            };
          }
        }
      });
    }

    if (nextProps.shouldScrollToBottom) {
      this.messageList.scrollTop = this.messageList.scrollHeight + 1000;
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
    return (
      <MessageList
        messages={messages}
        onScroll={this.handleScroll.bind(this)}
        onSetRef={this.handleSetRef.bind(this)}
      />
    );
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
