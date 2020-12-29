import React, { useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Form, Heading, Item, Picker, TextField, View, Well } from '@adobe/react-spectrum';
import { getBorderList } from 'app/modules/dx26/partials/dx26-modal-util';
import { TitleProperties } from 'app/shared/model/visualMetadata.model';

export interface IDx26TitlePropertiesProps extends StateProps, DispatchProps {
  titleProperties : TitleProperties
}

const Dx26TitleProperties = (props: IDx26TitlePropertiesProps) => {
  const borderList = getBorderList();

  return (
    <>
      <View>
        <Heading margin={0} level={4}>
          Title Properties
        </Heading>
        <Form>
          <TextField value={props.titleProperties?.titleText} label={'Text'} />
          <Picker label="Border" items={borderList}>
            {item => <Item key={item.value}>{item.name}</Item>}
          </Picker>
          <TextField value={props.titleProperties?.color} type="color" label={'Text Color'} />
          <TextField value={props.titleProperties?.backgroundColor} type="color" label={'Background Color'} />
          {/* <Slider formatOptions={{style: 'percent', minimumFractionDigits: 1}} label="Opacity" minValue={0} maxValue={100} defaultValue={100} /> */}
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
