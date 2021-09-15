import React, { useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

import { IFeature } from 'app/shared/model/feature.model';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { Checkbox, Switch, Item, Picker, TextField } from '@adobe/react-spectrum';
import { parseBool, parseString } from 'app/shared/util/common-utils.ts';
import { ColorSlider } from '@react-spectrum/color';
import { Property } from 'app/shared/model/property.model';

export interface IPropertiesProps {
  features: readonly IFeature[];
  visual: IVisualMetadataSet;
  propstyle: string;
  property: Property;
}

const Properties = (props: IPropertiesProps) => {
  const [property, setProperty] = useState([]);

  const handleCheckboxChange = e => {
    props.property.value = !props.property.value;
    setProperty([props.property.value]);
  };

  const handleValueChange = (value, possibleValues = null) => {
    if (possibleValues) {
      const selectedValue = possibleValues.filter(item => {
        return item.value === value;
      });
      props.property.value = selectedValue[0];
    } else {
      props.property.value = value;
    }
    setProperty([props.property.value]);
  };

  return (
    <>
      {props.property.type === 'NUMBER' && (
        <TextField
          type="number"
          onChange={text => {
            handleValueChange(text);
          }}
          value={props.property.value.toString() || ''}
          label={props.property.propertyType.name}
        />
      )}
      {props.property.type === 'SELECT' && (
        <Picker
          selectedKey={props.property.value['value']}
          label={props.property.propertyType.name}
          items={props.property.propertyType.possibleValues}
          onSelectionChange={selected => handleValueChange(selected.toString(), props.property.propertyType.possibleValues)}
        >
          {item => <Item key={item.value}>{item.value}</Item>}
        </Picker>
      )}
      {props.property.type === 'CHECKBOX' && (
        <Switch
          isEmphasized
          onChange={() => {
            handleCheckboxChange(props.property);
          }}
          isSelected={parseBool(props.property.value)}
          defaultSelected={parseBool(props.property.propertyType.defaultValue)}
        >
          {props.property.propertyType.name}
        </Switch>
      )}
      {props.property.type === 'COLOR_PICKER' && (
        <><TextField
          onChange={text => {
            handleValueChange(text);
          } }
          value={parseString(props.property.value)}
          type="color"
          label={props.property.propertyType.name} />
        
{/* 
working on it
          <ColorSlider
            label="Hue (controlled)"
            value={parseString(props.property.value)}
            onChange={text => {
              handleValueChange(text);
            } }
            channel="hue" />*/}
            </> 
      )}
      {props.property.type === 'TEXT' && (
        <TextField
          onChange={text => {
            handleValueChange(text);
          }}
          value={parseString(props.property.value) || ''}
          label={props.property.propertyType.name}
          width={'100%'}
        />
      )}
    </>
  );
};

export default Properties
