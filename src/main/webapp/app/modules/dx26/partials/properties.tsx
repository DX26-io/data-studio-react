import React, { useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

import { IFeature } from 'app/shared/model/feature.model';
import { IVisualMetadataSet, Property } from 'app/shared/model/visualMetadata.model';
import { Button, Checkbox, Item, Picker, TextField, View } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';

export interface IPropertiesProps extends StateProps, DispatchProps {
  features: IFeature[];
  visual: IVisualMetadataSet;
  propstype: string;
  property: Property;
}

const Properties = (props: IPropertiesProps) => {
  return (
    <>
      <View>
        {props.property.type === 'NUMBER' && (
          <TextField type="NUMBER" value={props.property.value} label={props.property.propertyType.name} />
        )}
        {props.property.type === 'SELECT' && (
          <Picker selectedKey={props.property.value.value} label={props.property.propertyType.name}  items={props.property.propertyType.possibleValues}>
            {item => <Item key={item.value}>{item.value}</Item>}
          </Picker>
        )}
        {props.property.type === 'CHECKBOX' && (
          <Checkbox defaultSelected={props.property.propertyType.defaultValue} isSelected={props.property.value} isEmphasized>
            {props.property.propertyType.name}
          </Checkbox>
        )}
        {props.property.type === 'COLOR_PICKER' && (
          <TextField value={props.property.value} type="color" label={props.property.propertyType.name} />
        )}
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Properties);
