import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import { Form, Header, Message } from 'semantic-ui-react';

import { FormTextField } from '../../';
import styles from './NewMessageForm.css';

const handleKeyPress = ({ e, onSubmit, pristine, submitting }) => {
  if (e.which === 13 && !e.shiftKey) {
    e.preventDefault();
    if (!pristine && !submitting) {
      onSubmit();
    }
    return false;
  }
};

const NewMessageForm = ({ pristine, submitError, submitting, user, onSubmit }) => {
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
            rows={1}
            onKeyPress={(e) => handleKeyPress({ e, onSubmit, pristine, submitting })}
          />
        </div>
      </Form>
    </div>
  )
  : (
    <Header as='h4' className={styles.messageBox} content='Login to leave a message.' />
  );
};

NewMessageForm.propTypes = {
  pristine: PropTypes.bool,
  submitError: PropTypes.string,
  submitting: PropTypes.bool,
  user: PropTypes.object,
  onSubmit: PropTypes.func,
};

export default NewMessageForm;
