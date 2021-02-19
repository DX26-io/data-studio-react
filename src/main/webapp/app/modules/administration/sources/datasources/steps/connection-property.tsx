import React from 'react';
import { TextField, TextArea, Checkbox } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import { Link } from 'react-router-dom';
import { selectConnectionType } from './datasource-steps.reducer';
import { connect } from 'react-redux';
import './img-link-card.scss';
import { IRootState } from 'app/shared/reducers';

interface ConnectionPropertyProps extends DispatchProps {
  property: any;
  disabled: boolean;
  connection: any;
}

const ConnectionProperty = (props: ConnectionPropertyProps) => {
  const { property, disabled, connection } = props;
  const [propValue, setPropValue] = React.useState();

  return (
    <React.Fragment>
      {property.fieldType === 'Text' ? (
        <TextArea
          isDisabled={disabled}
          isRequired={!disabled && property.required && property.fieldType === 'Text'}
          label={property.displayName}
          onChange={setPropValue}
          value={connection ? connection.details[property.fieldName] : propValue}
        />
      ) : null}
      {property.fieldType === 'String' ? (
        <TextField
          inputMode="text"
          isDisabled={disabled}
          label={property.displayName}
          isRequired={!disabled && property.required && property.fieldType === 'String'}
          onChange={setPropValue}
          value={connection ? connection.details[property.fieldName] : propValue}
        />
      ) : null}
      {property.fieldType === 'Integer' ? (
        <TextField
          inputMode="numeric"
          isDisabled={disabled}
          label={property.displayName}
          isRequired={!disabled && property.required && property.fieldType === 'Integer'}
          onChange={setPropValue}
          value={connection ? connection.details[property.fieldName] : propValue}
        />
      ) : null}
      {property.fieldType === 'Boolean' ? (
        <Checkbox
          isRequired={!disabled && property.required && property.fieldType === 'Boolean'}
          onChange={setPropValue}
          isSelected={connection ? connection.details[property.fieldName] : propValue}
          isEmphasized
        >
          {property.displayName}
        </Checkbox>
      ) : null}
    </React.Fragment>
  );
};

const mapDispatchToProps = { selectConnectionType };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(ConnectionProperty);
