import React, { PropTypes } from 'react';
import { Input, Modal } from 'semantic-ui-react';

const NewChannelModal = ({ open, onClose, onKeyUp }) => (
  <Modal closeIcon dimmer open={open} size='small' onClose={onClose}>
    <Modal.Header>Create new channel</Modal.Header>
    <Modal.Content>
      <Input fluid placeholder='Enter channel' onKeyUp={onKeyUp} />
    </Modal.Content>
  </Modal>
);

NewChannelModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func.isRequired,
};

export default NewChannelModal;
