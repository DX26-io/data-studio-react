import React, { useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { getBorderList } from 'app/modules/dx26/partials/dx26-modal-util';

import { Form, Heading, Item, Picker, TextField, View } from '@adobe/react-spectrum';
// import {Slider} from '@adobe/react-spectrum';

export interface IDx26BodyPropertiesProps extends StateProps, DispatchProps {}

const Dx26BodyProperties = (props: IDx26BodyPropertiesProps) => {
  const borderList = getBorderList();
  return (
    <>
      <View>
        <Heading margin={0} level={4}>Body Properties</Heading>
        <Form>
          <Picker label="Border" items={borderList}>
            {item => <Item key={item.value}>{item.name}</Item>}
          </Picker>
          <TextField type="color" label={'Background Color'} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Dx26BodyProperties);
