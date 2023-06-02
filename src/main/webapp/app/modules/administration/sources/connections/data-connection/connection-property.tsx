import React from 'react';
import { TextField, TextArea, Checkbox } from '@adobe/react-spectrum';
import { connect } from 'react-redux';
import { setConnection } from '../connection-steps.reducer';
import { IRootState } from 'app/shared/reducers';

interface ConnectionPropertyProps extends StateProps,DispatchProps {
  property: any;
  disabled: boolean;
  onChange: (value : any,fieldName: string) => void;
}

const ConnectionProperty = (props: ConnectionPropertyProps) => {
  const { property, disabled, connection, onChange} = props;

  const setPropertyValue = value => {
    onChange(value,property.fieldName);
  };

  return (
    <React.Fragment>
      {property.fieldType === 'Text' ? (
        <TextArea
          isDisabled={disabled}
          isRequired={!disabled && property.required && property.fieldType === 'Text'}
          label={property.displayName}
          onChange={setPropertyValue}
          value={connection.details[property.fieldName] ? connection.details[property.fieldName] : ''}
        />
      ) : null}
      {property.fieldType === 'String' ? (
        <TextField
          inputMode="text"
          isDisabled={disabled}
          label={property.displayName}
          isRequired={!disabled && property.required && property.fieldType === 'String'}
          onChange={setPropertyValue}
          value={connection.details[property.fieldName] ? connection.details[property.fieldName] : ''}
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
          value={connection.details[property.fieldName] ? connection.details[property.fieldName] : 0}
        />
      ) : null}
      {property.fieldType === 'Boolean' ? (
        <Checkbox
          isRequired={!disabled && property.required && property.fieldType === 'Boolean'}
          onChange={setPropertyValue}
          isSelected={connection.details[property.fieldName] ? connection.details[property.fieldName] : false}
          isEmphasized
        >
          {property.displayName}
        </Checkbox>
      ) : null}
    </React.Fragment>
  );
};

const mapDispatchToProps = { setConnection };

const mapStateToProps = (storeState: IRootState) => ({
  connection: storeState.connectionSteps.connection,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionProperty);
