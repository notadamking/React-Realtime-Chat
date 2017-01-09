import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

import { Message, NewMessageForm } from '../../../containers';
import styles from './MessageList.css';

export default class MessageList extends Component {
  render () {
    const { messages, onScroll, onSetRef } = this.props;
    return (
      <div className={styles.messagesContainer}>
        <div
          className={cx('ui', 'comments', styles.messageList)}
          ref={onSetRef}
          onScroll={onScroll}
        >
          {messages && messages.reverse().map((message) => message && (
            <Message
              key={message.id}
              message={message}
            />
          ))}
        </div>
        <NewMessageForm />
      </div>
    );
  }
}

MessageList.propTypes = {
  messages: PropTypes.array,
  onScroll: PropTypes.func,
  onSetRef: PropTypes.func,
};
