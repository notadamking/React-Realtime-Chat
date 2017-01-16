import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import { reduxForm } from 'redux-form';

import { handleSignupSuccess } from '../../../redux/actions/auth';
import { SignupForm } from '../../../components';
import createUserMutation from './createUser.graphql';
import validate from './validate';

@graphql(createUserMutation, {
  props: ({ mutate }) => ({
    submitSignup: ({ username, password }) => mutate({ variables: { username, password } }),
  }),
})
@reduxForm({
  form: 'signup',
  validate
})
export default class SignupFormContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitError: null
    };
  }

  async onSubmit({ username, password }) {
    const { dispatch, submitSignup, onClose } = this.props;
    this.setState({ submitError: null });
    const { data: { createUser } } = await submitSignup({ username, password });
    if (createUser.error) {
      this.setState({ submitError: createUser.error });
    } else {
      dispatch(handleSignupSuccess(createUser));
      onClose();
    }
  }

  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    return (
      <SignupForm
        pristine={pristine}
        submitError={this.state.submitError}
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
  submitSignup: PropTypes.func,
  submitting: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
