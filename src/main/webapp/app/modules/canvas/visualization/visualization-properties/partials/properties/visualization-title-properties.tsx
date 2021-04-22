import React, { ReactText, useEffect, useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Form, Heading, Item, Picker, TextField, View, Well } from '@adobe/react-spectrum';
import { getBorderList } from 'app/modules/canvas/visualization/visualization-modal/visualization-edit-modal/visualization-edit-modal-util';
import { TitleProperties } from 'app/shared/model/visualMetadata.model';

export interface IVisualizationTitlePropertiesProps {
  titleProperties: TitleProperties;
}

const VisualizationTitleProperties = (props: IVisualizationTitlePropertiesProps) => {
  const borderList = getBorderList();
  const [properties, setProperty] = useState([]);

  const handleValueChange = (value, property) => {
    props.titleProperties[property] = value;
    setProperty([props.titleProperties[property]]);
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
              handleValueChange(text, "titleText")
            }}
            value={props.titleProperties?.titleText || ''}
            label={'Text'}
          />
          <Picker
            selectedKey={props.titleProperties?.borderBottom || ''}
            onSelectionChange={text => {
              handleValueChange(text, "borderBottom");
            }}
            label="Border"
            items={borderList}
          >
            {item => <Item key={item.value}>{item.name}</Item>}
          </Picker>
          <TextField
            onChange={text => {
              handleValueChange(text, "color")
            }}
            value={props.titleProperties?.color ||''}
            type="color"
            label={'Text Color'}
          />
          <TextField
            onChange={text => {
              handleValueChange(text, "backgroundColor")
            }}
            value={props.titleProperties?.backgroundColor||''}
            type="color"
            label={'Background Color'}
          />
        </Form>
      </View>
    </>
  );
};

export default (VisualizationTitleProperties);
