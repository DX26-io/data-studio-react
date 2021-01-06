import React, { ReactText, useEffect, useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { getBorderList } from 'app/modules/canvas/visualization/canvas-edit/canvas-edit-modal-util';
import { Form, Heading, Item, Picker, TextField, View } from '@adobe/react-spectrum';
import { Slider } from '@react-spectrum/slider';
import { BodyProperties } from 'app/shared/model/visualMetadata.model';
// import {Slider} from '@adobe/react-spectrum';

export interface IVisualizationBodyPropertiesProps extends StateProps, DispatchProps {
  bodyProperties: BodyProperties;
}

const VisualizationBodyProperties = (props: IVisualizationBodyPropertiesProps) => {
  const borderList = getBorderList();
  const [border, setBorder] = useState(props.bodyProperties?.border || '');
  const [backgroundColor, setBackgroundColor] = useState(props.bodyProperties?.backgroundColor || '');
  const [opacity, setOpacity] = useState(props.bodyProperties?.opacity || 1);
  
  useEffect(() => {
    if (props.bodyProperties) {
      setBorder(props.bodyProperties?.border);
      setOpacity(props.bodyProperties?.opacity);
      setBackgroundColor(props.bodyProperties?.backgroundColor);
    }
  }, [props.bodyProperties]);
  return (
    <>
      <View>
        <Heading margin={0} level={4}>
          Body Properties
        </Heading>
        <Form>
          <Picker selectedKey={border} onSelectionChange={selected => setBorder(selected.toString())} label="Border" items={borderList}>
            {item => <Item key={item.value}>{item.name}</Item>}
          </Picker>
          <TextField value={backgroundColor} onChange={setBackgroundColor} type="color" label={'Background Color'} />
          <Slider
            width={'100%'}
            maxValue={1}
            step={0.001}
            value={opacity}
            onChange={setOpacity}
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
