import React, { ReactText, useEffect, useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { getBorderList } from 'app/modules/canvas/visualization/visualization-modal/visualization-edit-modal/visualization-edit-modal-util';
import { Form, Heading, Item, Picker, TextField, View } from '@adobe/react-spectrum';
import { Slider } from '@react-spectrum/slider';
import { updateFieldBodyProperties } from 'app/entities/visualmetadata/visualmetadata.reducer';

export interface IVisualizationBodyPropertiesProps extends StateProps, DispatchProps {
}

const VisualizationBodyProperties = (props: IVisualizationBodyPropertiesProps) => {
  const borderList = getBorderList();
  const [properties, setProperty] = useState([]);

  const handleValueChange = (value, property) => {
    const bodyProperties = {
      value,
      property
    }
    props.updateFieldBodyProperties(bodyProperties)
  };  

  return (
    <>
      <View>
        <Form>
          <Picker
            selectedKey={props.visual.bodyProperties?.border || ''}
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
            value={props.visual.bodyProperties?.backgroundColor || ''}
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

const mapStateToProps = (storeState: IRootState) => ({
  visual: storeState.visualmetadata.entity,
});

const mapDispatchToProps = {
updateFieldBodyProperties
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationBodyProperties);
