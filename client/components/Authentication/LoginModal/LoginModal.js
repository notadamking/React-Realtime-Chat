import React, { PropTypes } from 'react';
import { Modal } from 'semantic-ui-react';

import { LoginForm } from '../../../containers';
import styles from './LoginModal.css';

const LoginModal = ({ open, onClose, onShowSignupModal }) => (
  <Modal closeIcon dimmer open={open} size='small' onClose={onClose}>
    <Modal.Header>Login</Modal.Header>
    <Modal.Content>
      <LoginForm onClose={onClose} />
    </Modal.Content>
    <a className={styles.signupLink} onClick={onShowSignupModal} >
      Need an account?&nbsp; Sign up, it's free!
    </a>
  </Modal>
);

LoginModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onShowSignupModal: PropTypes.func.isRequired,
};

export default LoginModal;
