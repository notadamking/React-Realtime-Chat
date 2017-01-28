import React, { Component, PropTypes } from 'react';
import { Divider } from 'semantic-ui-react';
import dateFormat from 'dateformat';
import cx from 'classnames';

import { Message } from '../../../containers';
import styles from './MessageList.css';

export default class MessageList extends Component {
  render () {
    const { messages, onScroll, onSetRef } = this.props;
    let lastDate;
    return (
      <div className={styles.messageListContainer}>
        <div
          className={cx('ui', 'comments', styles.messageList)}
          ref={onSetRef}
          onScroll={onScroll}
        >
          {messages && messages.reverse().map((message) => {
            const messageDate = dateFormat(message.createdAt, 'mmmm dS');
            if (lastDate !== messageDate) {
              lastDate = messageDate;
              return (
                <div key={message.id}>
                  <Divider horizontal>
                    {messageDate}
                  </Divider>
                  <Message message={message} />
                </div>
              );
            }
            return <Message key={message.id} message={message} />;
          })}
        </div>
      </div>
    );
  }
}

MessageList.propTypes = {
  messages: PropTypes.array,
  onScroll: PropTypes.func,
  onSetRef: PropTypes.func,
};
