import React, { ReactText, useEffect, useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { getBorderList } from 'app/modules/canvas/visualization/visualization-modal/visualization-edit-modal/visualization-edit-modal-util';
import { Form, Heading, Item, Picker, TextField, View } from '@adobe/react-spectrum';
import { Slider } from '@react-spectrum/slider';
import { BodyProperties } from 'app/shared/model/visualMetadata.model';

export interface IVisualizationBodyPropertiesProps extends StateProps, DispatchProps {
  bodyProperties: BodyProperties;
}

const VisualizationBodyProperties = (props: IVisualizationBodyPropertiesProps) => {
  const borderList = getBorderList();
  const [properties, setProperty] = useState([]);

  const handleValueChange = (value, property) => {
    props.bodyProperties[property] = value;
    setProperty([props.bodyProperties[property]]);
  };
  return (
    <>
      <View>
        <Heading margin={0} level={4}>
          Body Properties
        </Heading>
        <Form>
          <Picker
            selectedKey={props.bodyProperties?.border || ''}
            onSelectionChange={text => {
              handleValueChange(text, 'border');
            }}
            label="Border"
            items={borderList}
          >
            {item => <Item key={item.value}>{item.name}</Item>}
          </Picker>
          <TextField
            onChange={text => {
              handleValueChange(text, 'backgroundColor');
            }}
            value={props.bodyProperties?.backgroundColor || ''}
            type="color"
            label={'Background Color'}
          />
          <Slider
            width={'100%'}
            maxValue={1}
            step={0.001}
            formatOptions={{ style: 'percent', minimumFractionDigits: 1 }}
            defaultValue={1}
            label="Opacity"
            isFilled
          />
        </Form>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationBodyProperties);
