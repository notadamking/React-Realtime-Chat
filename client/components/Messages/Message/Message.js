import React, { PropTypes } from 'react';
import { Comment, Icon } from 'semantic-ui-react';
import cx from 'classnames';

import { RelativeTime } from '../../';
import styles from './Message.css';

const MessageComponent = ({ message, isRemovable, onDelete }) => (
  <Comment className={cx({ [styles.newMessage]: message.id !== '0' })}>
    <Comment.Avatar src={`${message.author.avatarUrl}?d=identicon`} />
    <Comment.Content>
      <Comment.Author as='a'>{message.author.username}</Comment.Author>
      <Comment.Metadata>
        <RelativeTime time={message.createdAt} />
      </Comment.Metadata>
      <Comment.Text>{message.content}</Comment.Text>
      <Comment.Actions>
        {isRemovable && (
          <Comment.Action onClick={onDelete}>
            <Icon name='trash' /> Delete
          </Comment.Action>
        )}
      </Comment.Actions>
    </Comment.Content>
  </Comment>
);

MessageComponent.propTypes = {
  isRemovable: PropTypes.bool,
  message: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default MessageComponent;
