import React from 'react';
import { TextField, TextArea, Checkbox } from '@adobe/react-spectrum';
import { connect } from 'react-redux';
import { IEmailConfig } from 'app/shared/model/email-config.model';
import { setEmailConfig } from './reports-configuration.reducer';

interface ChannelPropertyProps extends DispatchProps {
  property: any;
  emailConfig: IEmailConfig;
}

const ChannelProperty = (props: ChannelPropertyProps) => {
  const { property, emailConfig } = props;

  const setPropertyValue = value => {
    emailConfig[property.fieldName] = value;
    props.setEmailConfig(emailConfig);
  };

  return (
    <React.Fragment>
      {property.fieldType === 'String' ? (
        <TextField
          type="text"
          label={property.displayName}
          isRequired={property.required}
          onChange={setPropertyValue}
          value={emailConfig[property.fieldName] ? emailConfig[property.fieldName] : ''}
        />
      ) : null}
      {property.fieldType === 'Password' ? (
        <TextField
          type="password"
          label={property.displayName}
          isRequired={property.required}
          onChange={setPropertyValue}
          value={emailConfig[property.fieldName] ? emailConfig[property.fieldName] : ''}
        />
      ) : null}
      {property.fieldType === 'Integer' ? (
        <TextField
          inputMode="numeric"
          type="number"
          label={property.displayName}
          isRequired={property.required}
          onChange={setPropertyValue}
          value={emailConfig[property.fieldName] ? emailConfig[property.fieldName] : 0}
        />
      ) : null}
      {property.fieldType === 'Boolean' ? (
        <Checkbox
          isRequired={property.required}
          onChange={setPropertyValue}
          isSelected={emailConfig[property.displayName] ? emailConfig[property.displayName] : false}
          isEmphasized
        ></Checkbox>
      ) : null}
    </React.Fragment>
  );
};

const mapDispatchToProps = { setEmailConfig };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(ChannelProperty);
