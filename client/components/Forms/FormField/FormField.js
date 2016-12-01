import React, { PropTypes } from 'react';
import { Form, Input } from 'semantic-ui-react';

const FormField = ({ icon, input, label, placeholder, type, meta: { touched, error } }) => (
  <Form.Field>
    <label>{label}</label>
    <Input {...input} icon={icon} placeholder={placeholder} type={type} />
    {touched && error && <span>{error}</span>}
  </Form.Field>
);

FormField.propTypes = {
  icon: PropTypes.string,
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool.isRequired,
    error: PropTypes.string,
  }).isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default FormField;
