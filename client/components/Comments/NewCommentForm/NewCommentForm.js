import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import { Form, Message } from 'semantic-ui-react';

import { FormTextField } from '../../';
import styles from './NewCommentForm.css';

const handleKeyPress = ({ e, onSubmit, pristine, submitting }) => {
  if (e.which === 13 && !e.shiftKey) {
    e.preventDefault();
    if (!pristine && !submitting) {
      onSubmit();
    }
    return false;
  }
};

const NewCommentForm = ({ pristine, submitError, submitting, onSubmit }) => (
  <div>
    <Message content={submitError} error header='Comment Failed!' hidden={!submitError} />
    <Form onSubmit={onSubmit}>
      <div className={styles.commentBox}>
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
);

NewCommentForm.propTypes = {
  pristine: PropTypes.bool,
  submitError: PropTypes.string,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func,
};

export default NewCommentForm;
