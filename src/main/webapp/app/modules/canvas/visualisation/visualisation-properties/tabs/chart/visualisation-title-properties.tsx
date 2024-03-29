import React, { ReactText, useEffect, useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Form, Heading, Item, Picker, TextField, View, Well } from '@adobe/react-spectrum';
import { getBorderList } from 'app/modules/canvas/visualisation/visualisation-modal/visualisation-edit-modal/visualisation-edit-modal-util';
import { updateFieldTitleProperties } from 'app/entities/visualmetadata/visualmetadata.reducer';

export interface IVisualisationTitlePropertiesProps extends StateProps, DispatchProps {}

const VisualisationTitleProperties = (props: IVisualisationTitlePropertiesProps) => {
  const borderList = getBorderList();
  const [properties, setProperty] = useState([]);

  const handleValueChange = (value, property) => {
    // this needs to be refectored
    const titleProperties = {
      value,
      property
    }
    props.updateFieldTitleProperties(titleProperties)
  };

  return (
    <>
      <View>
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
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationTitleProperties);
