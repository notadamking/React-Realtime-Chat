import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import { reduxForm } from 'redux-form';

import { handleLoginSuccess } from '../../../redux/actions/auth';
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
    submitSignup({ username, password }).then(({ data: { createUser } }) => {
      dispatch(handleLoginSuccess(createUser));
      onClose();
    }).catch(({ graphQLErrors }) => {
      this.setState({ submitError: graphQLErrors[0].message });
    });
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
