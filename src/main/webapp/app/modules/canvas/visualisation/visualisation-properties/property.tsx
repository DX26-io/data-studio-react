import React, { useState } from 'react';
import { IFeature } from 'app/shared/model/feature.model';
import { IVisualMetadataSet } from 'app/shared/model/visualmetadata.model';
import { Switch, Item, Picker, TextField } from '@adobe/react-spectrum';
import { parseBool, parseString } from 'app/shared/util/common-utils';
import { Property } from 'app/shared/model/property.model';
import Select from 'react-select';
import { generateAlternativeDimensionsOptions, generateFeaturesOptions } from 'app/entities/feature/feature-util';
import { updateChartProperties } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { connect } from 'react-redux';

export interface IPropertiesProps extends DispatchProps {
  features: readonly IFeature[];
  visual: IVisualMetadataSet;
  propStyle: string;
  property: Property;
}

const Property = (props: IPropertiesProps) => {
  const [property, setProperty] = useState([]);

  const handleCheckbox = e => {
    props.property.value = !props.property.value;
    setProperty([props.property.value]);
    props.updateChartProperties(props.property);
  };

  const handleSelect = (value, possibleValues = null) => {
    if (possibleValues) {
      const selectedValue = possibleValues.filter(item => {
        return item.value === value;
      });
      props.property.value = selectedValue[0];
    } else {
      props.property.value = value;
    }
    setProperty([props.property.value]);
    props.updateChartProperties(props.property);
  };

  const handleMultiSelect = (value, actionMeta) => {
    let values = props.property?.value ? JSON.parse(props.property?.value.toString()) : [];
    if (actionMeta.action === 'select-option') {
      values.push({ featureId: actionMeta.option.value, featureName: actionMeta.option.label })
    } else if (actionMeta.action === 'remove-value') {
       values = values.filter((item) => {
       return item.featureId !== actionMeta.removedValue.value
      })
    }
    props.property.value = JSON.stringify(values);
    setProperty([props.property.value]);
    props.updateChartProperties(props.property);
  };
  return (
    <>
      {props.property.type === 'NUMBER' && (
        <TextField
          type="number"
          onChange={text => {
            handleSelect(text);
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
          onSelectionChange={selected => handleSelect(selected.toString(), props.property.propertyType.possibleValues)}
        >
          {item => <Item key={item.value}>{item.value}</Item>}
        </Picker>
      )}
      {props.property.type === 'CHECKBOX' && (
        <Switch
          isEmphasized
          onChange={() => {
            handleCheckbox(props.property);
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
            handleSelect(text);
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
              handleSelect(text);
            } }
            channel="hue" />*/}
        </>
      )}
      {props.property.type === 'TEXT' && props.property.propertyType.name !== 'Alternative Dimensions' && (
        <TextField
          onChange={text => {
            handleSelect(text);
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
            onChange={handleMultiSelect}
            value={generateAlternativeDimensionsOptions(props.property.value)}
            label={props.property.propertyType.name}
            options={generateFeaturesOptions(props.features)}
          />
        </>
      )}
    </>
  );
};

const mapDispatchToProps = {
  updateChartProperties
};

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(Property);
