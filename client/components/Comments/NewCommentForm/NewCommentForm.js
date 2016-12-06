import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import { Button, Form, Message } from 'semantic-ui-react';

import { FormTextField } from '../../';
import styles from './NewCommentForm.css';

const NewCommentForm = ({ onSubmit, pristine, submitError, submitting }) => (
  <div>
    <Message content={submitError} error header='Comment Failed!' hidden={!submitError} />
    <Form onSubmit={onSubmit}>
      <div className={styles.commentBox}>
        <Field
          component={FormTextField}
          label='Leave a comment'
          name='content'
          rows={4}
        />
        <Button
          className={styles.submitCommentButton}
          color='green'
          content='Submit'
          disabled={pristine || submitting}
          inverted
          size='small'
          type='submit'
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
