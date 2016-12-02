import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Field, reduxForm } from 'redux-form';
import { Form, Button, Message } from 'semantic-ui-react';

import { clearSubmitErrors, handleSignupSuccess, setSignupSubmitError } from '../../../redux/actions/auth';
import { FormField } from '../../../components';
import createUserMutation from './createUser.graphql';
import validate from './validate';

@connect(
  (state) => ({
    submitError: (state.auth && state.auth.signupSubmitError) || null,
  })
)
@graphql(createUserMutation, {
  props: ({ mutate }) => ({
    submitSignup: ({ email, password }) => mutate({ variables: { email, password } }),
  }),
})
@reduxForm({
  form: 'signup',
  validate
})
export default class SignupForm extends Component {
  async onSubmit({ email, password }) {
    const { dispatch, submitSignup } = this.props;
    dispatch(clearSubmitErrors());
    const { data: { createUser: { error, user } } } = await submitSignup({ email, password });
    if (user) {
      dispatch(handleSignupSuccess(user));
    } else if (error) {
      dispatch(setSignupSubmitError(error));
    }
  }

  render() {
    const { handleSubmit, pristine, submitError, submitting } = this.props;
    return (
      <div>
        <Message content={submitError} error header='Signup Failed!' hidden={!submitError} />
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
          <Field
            component={FormField}
            icon='lock'
            label='Repeat password'
            name='repeatPassword'
            placeholder='repeat password'
            type='password'
          />
          <Button className='primary' disabled={pristine || submitting} fluid size='large' type='submit'>
            Signup
          </Button>
        </Form>
      </div>
    );
  }
}

SignupForm.propTypes = {
  dispatch: PropTypes.func,
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool,
  submitError: PropTypes.string,
  submitSignup: PropTypes.func,
  submitting: PropTypes.bool,
};
