import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Field, reduxForm } from 'redux-form';
import { Form, Button, Message } from 'semantic-ui-react';

import { setLoginSubmitError, handleLoginSuccess } from '../../../redux/actions/auth';
import { FormField } from '../../../components';
import loginMutation from './login.graphql';

@connect(
  (state) => ({
    submitError: (state.auth && state.auth.loginSubmitError) || null,
  })
)
@graphql(loginMutation, {
  props: ({ mutate }) => ({
    submitLogin: ({ email, password }) => mutate({ variables: { email, password } }),
  }),
})
@reduxForm({
  form: 'login'
})
export default class LoginForm extends Component {
  async onSubmit({ email, password }) {
    const { dispatch, submitLogin } = this.props;
    const { data: { login: { error, user } } } = await submitLogin({ email, password });
    if (user) {
      dispatch(handleLoginSuccess(user));
    } else if (error) {
      dispatch(setLoginSubmitError(error));
    }
  }

  render() {
    const { handleSubmit, pristine, submitError, submitting } = this.props;
    return (
      <div>
        <Message content={submitError} error header='Login Failed!' hidden={!submitError} />
        <Form size='large' onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <Field
            component={FormField}
            icon='mail'
            label='Email'
            name='email'
            placeholder='email'
            type='email'
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
  }
}

LoginForm.propTypes = {
  dispatch: PropTypes.func,
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool,
  submitError: PropTypes.string,
  submitLogin: PropTypes.func,
  submitting: PropTypes.bool,
};
