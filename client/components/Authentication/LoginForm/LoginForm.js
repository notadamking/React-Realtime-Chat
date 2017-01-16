import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import { Form, Button, Message } from 'semantic-ui-react';

import { FormField } from '../../../components';

const LoginForm = ({ pristine, submitError, submitting, onSubmit }) => (
  <div>
    <Message content={submitError} error header='Login Failed!' hidden={!submitError} />
    <Form size='large' onSubmit={onSubmit}>
      <Field
        component={FormField}
        icon='mail'
        label='Username'
        name='username'
        placeholder='username'
        type='text'
      />
      <Field
        component={FormField}
        icon='lock'
        label='Password'
        name='password'
        placeholder='password'
        type='password'
      />
      <Button className='primary' disabled={pristine || submitting} fluid size='large' type='submit'>
        Login
      </Button>
    </Form>
  </div>
);

LoginForm.propTypes = {
  pristine: PropTypes.bool,
  submitError: PropTypes.string,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func,
};

export default LoginForm;
