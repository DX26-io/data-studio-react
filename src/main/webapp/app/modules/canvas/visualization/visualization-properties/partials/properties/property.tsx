import React, { useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

import { IFeature } from 'app/shared/model/feature.model';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { Checkbox, Switch, Item, Picker, TextField } from '@adobe/react-spectrum';
import { parseBool, parseString } from 'app/shared/util/common-utils';
import { ColorSlider } from '@react-spectrum/color';
import { Property } from 'app/shared/model/property.model';
import Select from 'react-select';
import { generateDatasourcesOptions } from 'app/entities/dashboard/dashboard-util';
import { setDatasource } from 'app/modules/administration/sources/datasources/steps/datasource-steps.reducer';
import { translate } from 'react-jhipster';
import { generateFilterOptions } from 'app/modules/canvas/filter/filter-util';
import { generateAlternativeDimensionsOptions, generateFeaturesOptions } from './property.util';


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

  const handleChange = (value, actionMeta) => {
    let values = props.property?.value ? JSON.parse(props.property?.value.toString()) : [];
    if (actionMeta.action === 'select-option') {
      values.push({ featureID: actionMeta.option.value, featureName: actionMeta.option.label })
    } else if (actionMeta.action === 'remove-value') {
       values = values.filter((item) => {
       return item.featureID !== actionMeta.removedValue.value
      })
    }
    props.property.value = JSON.stringify(values);
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
          }}
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
      {props.property.type === 'TEXT' && props.property.propertyType.name !== 'Alternative Dimensions' && (
        <TextField
          onChange={text => {
            handleValueChange(text);
          }}
          value={parseString(props.property.value) || ''}
          label={props.property.propertyType.name}
          width={'100%'}
        />
      )}
      {props.property.propertyType.name === 'Alternative Dimensions' && (
        <>
          <span className="spectrum-Body-emphasis">
            Alternative Dimensions
          </span>
          <Select
            isMulti
            onChange={handleChange}
            value={generateAlternativeDimensionsOptions(props.property.value)}
            label={props.property.propertyType.name}
            options={generateFeaturesOptions(props.features)}
          />
        </>
      )}
    </>
  );
};

export default Properties
