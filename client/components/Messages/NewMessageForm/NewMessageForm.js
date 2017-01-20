import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import { Form, Header, Message } from 'semantic-ui-react';

import { FormTextField } from '../../';
import styles from './NewMessageForm.css';

const NewMessageForm = ({ channel, submitError, user, onKeyPress, onSubmit }) => {
  return user
  ? (
    <div>
      <Message content={submitError} error header='Message Failed!' hidden={!submitError} />
      <Form onSubmit={onSubmit}>
        <div className={styles.messageBox}>
          <Field
            autoHeight
            component={FormTextField}
            name='content'
            placeholder={`Message ${channel.charAt(0) === '@' ? channel : `#${channel}`}`}
            rows={1}
            onKeyPress={onKeyPress}
          />
        </div>
      </Form>
    </div>
  )
  : (
    <Header as='h4' className={styles.messageBox} content='Login to leave a message' />
  );
};

NewMessageForm.propTypes = {
  channel: PropTypes.string,
  submitError: PropTypes.string,
  user: PropTypes.object,
  onKeyPress: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default NewMessageForm;
