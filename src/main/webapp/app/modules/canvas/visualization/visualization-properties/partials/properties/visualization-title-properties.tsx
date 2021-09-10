import React, { ReactText, useEffect, useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Form, Heading, Item, Picker, TextField, View, Well } from '@adobe/react-spectrum';
import { getBorderList } from 'app/modules/canvas/visualization/visualization-modal/visualization-edit-modal/visualization-edit-modal-util';
import { TitleProperties } from 'app/shared/model/title-properties.model';

import { updateFieldTitleProperties,updateFieldBodyProperties } from 'app/entities/visualmetadata/visualmetadata.reducer';

export interface IVisualizationTitlePropertiesProps extends StateProps, DispatchProps {}

const VisualizationTitleProperties = (props: IVisualizationTitlePropertiesProps) => {
  const borderList = getBorderList();
  const [properties, setProperty] = useState([]);

  const handleValueChange = (value, property) => {
    // this needs to be refectored
    props.updateFieldTitleProperties(value)
    props.updateFieldBodyProperties(value)
  };

  return (
    <>
      <View>
        <Heading marginTop={5} level={4}>
          Title Properties
        </Heading>
        <Form>
          <TextField
            onChange={text => {
              handleValueChange(text, 'titleText');
            }}
            value={props.visual.titleProperties?.titleText || ''}
            label={'Text'}
          />
          <Picker
            selectedKey={props.visual.titleProperties?.borderBottom || ''}
            onSelectionChange={text => {
              handleValueChange(text, 'borderBottom');
            }}
            label="Border"
            items={borderList}
          >
            {item => <Item key={item.value}>{item.name}</Item>}
          </Picker>
          <TextField
            onChange={text => {
              handleValueChange(text, 'color');
            }}
            value={props.visual.titleProperties?.color || ''}
            type="color"
            label={'Text Color'}
          />
          <TextField
            onChange={text => {
              handleValueChange(text, 'backgroundColor');
            }}
            value={props.visual.titleProperties?.backgroundColor || ''}
            type="color"
            label={'Background Color'}
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
  updateFieldTitleProperties,
  updateFieldBodyProperties
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationTitleProperties);
