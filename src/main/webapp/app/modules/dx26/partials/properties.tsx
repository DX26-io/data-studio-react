import React, { useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

import { IFeature } from 'app/shared/model/feature.model';
import { IVisualMetadataSet, Property } from 'app/shared/model/visualMetadata.model';
import { Button, Checkbox, Item, Picker, TextField, View } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import { parseBool, parseString } from 'app/shared/util/common-utils.ts';

export interface IPropertiesProps extends StateProps, DispatchProps {
  features: IFeature[];
  visual: IVisualMetadataSet;
  propstype: string;
  property: Property;
}

const Properties = (props: IPropertiesProps) => {

  return (
    <>
      {props.property.type === 'NUMBER' && (
        <TextField
          type="NUMBER"
          value={props.property.value.toString() || ''}
          label={props.property.propertyType.name}
        />
      )}
      {props.property.type === 'SELECT' && (
        <Picker
          selectedKey={props.property.value['value']}
          label={props.property.propertyType.name}
          items={props.property.propertyType.possibleValues}
        >
          {item => <Item key={item.value}>{item.value}</Item>}
        </Picker>
      )}
      {props.property.type === 'CHECKBOX' && (
        <Checkbox
          defaultSelected={parseBool(props.property.propertyType.defaultValue)}
          isSelected={parseBool(props.property.value)}
          isEmphasized
        >
          {props.property.propertyType.name}
        </Checkbox>
      )}
      {props.property.type === 'COLOR_PICKER' && (
        <TextField
          value={parseString(props.property.value)}
          type="color"
          label={props.property.propertyType.name}
        />
      )}
      {props.property.type === 'TEXT' && (
        <TextField
          value={parseString(props.property.value) || ''}
          label={props.property.propertyType.name}
        />
      )}
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Properties);
