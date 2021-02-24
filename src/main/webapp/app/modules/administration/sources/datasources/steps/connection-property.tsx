import React from 'react';
import { TextField, TextArea, Checkbox } from '@adobe/react-spectrum';
import { connect } from 'react-redux';
import './img-link-card.scss';
import { updateConnection } from './datasource-steps.reducer';

interface ConnectionPropertyProps extends DispatchProps {
  property: any;
  disabled: boolean;
  connection: any;
}

const ConnectionProperty = (props: ConnectionPropertyProps) => {
  const { property, disabled, connection } = props;

  const setPropertyValue = value => {
    if (value) {
      connection.details[property.fieldName] = value;
      props.updateConnection(connection);
    }
  };

  return (
    <React.Fragment>
      {property.fieldType === 'Text' ? (
        <TextArea
          isDisabled={disabled}
          isRequired={!disabled && property.required && property.fieldType === 'Text'}
          label={property.displayName}
          onChange={setPropertyValue}
          value={connection ? connection.details[property.fieldName] : ''}
        />
      ) : null}
      {property.fieldType === 'String' ? (
        <TextField
          inputMode="text"
          isDisabled={disabled}
          label={property.displayName}
          isRequired={!disabled && property.required && property.fieldType === 'String'}
          onChange={setPropertyValue}
          value={connection ? connection.details[property.fieldName] : ''}
        />
      ) : null}
      {property.fieldType === 'Integer' ? (
        <TextField
          inputMode="numeric"
          type="number"
          isDisabled={disabled}
          label={property.displayName}
          isRequired={!disabled && property.required && property.fieldType === 'Integer'}
          onChange={setPropertyValue}
          value={connection ? connection.details[property.fieldName] : 0}
        />
      ) : null}
      {property.fieldType === 'Boolean' ? (
        <Checkbox
          isRequired={!disabled && property.required && property.fieldType === 'Boolean'}
          onChange={setPropertyValue}
          isSelected={connection ? connection.details[property.fieldName] : false}
          isEmphasized
        >
          {property.displayName}
        </Checkbox>
      ) : null}
    </React.Fragment>
  );
};

const mapDispatchToProps = { updateConnection };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(ConnectionProperty);
