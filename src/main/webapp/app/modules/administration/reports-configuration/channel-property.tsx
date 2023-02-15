import React from 'react';
import { TextField, TextArea, Checkbox } from '@adobe/react-spectrum';
import { connect } from 'react-redux';
import { IEmailConfig } from 'app/shared/model/email-config.model';
import { ITeamConfig } from 'app/shared/model/team-config.model';
import { setConfig } from './reports-configuration.reducer';
import { IChannelProperty } from 'app/shared/model/channel-parameters.model';

interface ChannelPropertyProps extends DispatchProps {
  property: IChannelProperty;
  config: IEmailConfig | ITeamConfig;
}

const ChannelProperty = (props: ChannelPropertyProps) => {
  const { property, config } = props;
  const [val,setVal] =  React.useState(props.config[property.fieldName]);

  const setPropertyValue = value => {
    config[property.fieldName] = value;
    props.setConfig(config);
    setVal(value);
  };

  return (
    <React.Fragment>
      {property.fieldType === 'String' ? (
        <TextField
          type="text"
          label={property.displayName}
          isRequired={property.required}
          onChange={setPropertyValue}
          value={val}
        />
      ) : null}
      {property.fieldType === 'Password' ? (
        <TextField
          type="password"
          label={property.displayName}
          isRequired={property.required}
          onChange={setPropertyValue}
          value={val}
        />
      ) : null}
      {property.fieldType === 'Integer' ? (
        <TextField
          inputMode="numeric"
          type="number"
          label={property.displayName}
          isRequired={property.required}
          onChange={setPropertyValue}
          value={val}
        />
      ) : null}
      {property.fieldType === 'Boolean' ? (
        <Checkbox
          isRequired={property.required}
          onChange={setPropertyValue}
          isSelected={val}
          isEmphasized
        ></Checkbox>
      ) : null}
    </React.Fragment>
  );
};

const mapDispatchToProps = { setConfig };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(ChannelProperty);
