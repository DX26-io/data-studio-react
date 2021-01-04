import React, { ReactText, useEffect, useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Form, Heading, Item, Picker, TextField, View, Well } from '@adobe/react-spectrum';
import { getBorderList } from 'app/modules/dx26/partials/dx26-modal-util';
import { TitleProperties } from 'app/shared/model/visualMetadata.model';

export interface IDx26TitlePropertiesProps extends StateProps, DispatchProps {
  titleProperties: TitleProperties;
}

const Dx26TitleProperties = (props: IDx26TitlePropertiesProps) => {
  const borderList = getBorderList();
  const [border, setBorder] = useState(props.titleProperties?.borderBottom || '');
  const [titleText, setTitleText] = useState(props.titleProperties?.titleText || '');
  const [backgroundColor, setBackgroundColor] = useState(props.titleProperties?.backgroundColor || '');
  const [color, setColor] = useState(props.titleProperties?.color || '');
  
  useEffect(() => {
    if (props.titleProperties) {
      setBorder(props.titleProperties?.borderBottom);
      setTitleText(props.titleProperties?.titleText);
      setBackgroundColor(props.titleProperties?.backgroundColor);
      setColor(props.titleProperties?.color);
    }
  }, [props.titleProperties]);
  
  return (
    <>
      <View>
        <Heading marginTop={5} level={4}>
          Title Properties
        </Heading>
        <Form>
          <TextField value={titleText} onChange={setTitleText} label={'Text'} />
          <Picker selectedKey={border} onSelectionChange={selected => setBorder(selected.toString())} label="Border" items={borderList}>
            {item => <Item key={item.value}>{item.name}</Item>}
          </Picker>
          <TextField value={color} onChange={setColor} type="color" label={'Text Color'} />
          <TextField onChange={setBackgroundColor} value={backgroundColor} type="color" label={'Background Color'} />
        </Form>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dx26TitleProperties);
