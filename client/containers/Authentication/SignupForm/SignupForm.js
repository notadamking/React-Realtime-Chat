import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { reduxForm } from 'redux-form';

import { clearSubmitErrors, handleSignupSuccess, setSignupSubmitError } from '../../../redux/actions/auth';
import { SignupForm } from '../../../components';
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
export default class SignupFormContainer extends Component {
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
      <SignupForm
        pristine={pristine}
        submitError={submitError}
        submitting={submitting}
        onSubmit={handleSubmit(this.onSubmit.bind(this))}
      />
    );
  }
}

SignupFormContainer.propTypes = {
  dispatch: PropTypes.func,
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool,
  submitError: PropTypes.string,
  submitSignup: PropTypes.func,
  submitting: PropTypes.bool,
};
