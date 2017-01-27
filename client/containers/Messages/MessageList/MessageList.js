import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { MessageList } from '../../../components';
import { setShouldScrollToBottom } from '../../../redux/actions/messages';
import { messageListQuery, messageAddedSubscription, messageDeletedSubscription } from './messageList.graphql';

const MESSAGES_PER_FETCH = 10;

@connect(
  (state) => ({
    shouldScrollToBottom: state.messages.shouldScrollToBottom,
    user: state.auth.currentUser,
  })
)
@graphql(messageListQuery, {
  options: ({ channel, room }) => ({
    variables: {
      room,
      channel,
      offset: 0,
      limit: MESSAGES_PER_FETCH,
    },
  }),
  props: ({ data: { messages, fetchMore, loading, refetch, subscribeToMore } }) => ({
    messages,
    loading,
    refetch,
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
    if (nextProps.user && !this.props.user && nextProps.refetch) {
      this.subscription.forEach(unsubscribe => unsubscribe());
      this.subscription = null;
      nextProps.refetch();
      setTimeout(() => this.props.dispatch(setShouldScrollToBottom()), 100);
    }

    if (this.subscription && nextProps.channel !== this.props.channel) {
      this.subscription.forEach(unsubscribe => unsubscribe());
      this.subscription = null;
    }

    if (!this.subscription && !nextProps.loading) {
      this.subscription = [
        nextProps.subscribeToMore({
          document: messageAddedSubscription,
          variables: {
            room: nextProps.room,
            channel: nextProps.channel,
            username: nextProps.user && nextProps.user.username,
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            const newMessage = subscriptionData.data.messageAdded;
            if (!this.props.user || newMessage.author.id !== this.props.user.id) {
              setTimeout(() => this.props.dispatch(setShouldScrollToBottom()), 100);
            }

            return { messages: [newMessage, ...previousResult.messages] };
          }
        }),
        nextProps.subscribeToMore({
          document: messageDeletedSubscription,
          variables: {
            room: nextProps.room,
            channel: nextProps.channel,
            username: nextProps.user && nextProps.user.username,
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            const remainingMessages = previousResult.messages.filter((message) => {
              return message.id !== subscriptionData.data.messageDeleted.id;
            });
            return { messages: remainingMessages };
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
    return (
      <MessageList
        messages={messages && [...new Set(messages)]} /* .slice() copies the array */
        onScroll={this.handleScroll.bind(this)}
        onSetRef={this.handleSetRef.bind(this)}
      />
    );
  }
}

MessageListContainer.propTypes = {
  channel: PropTypes.string.isRequired,
  dispatch: PropTypes.func,
  loadMoreMessages: PropTypes.func,
  loading: PropTypes.bool,
  messages: PropTypes.object,
  refetch: PropTypes.func,
  room: PropTypes.string.isRequired,
  shouldScrollToBottom: PropTypes.bool,
  subscribeToMore: PropTypes.func,
  user: PropTypes.object,
};
