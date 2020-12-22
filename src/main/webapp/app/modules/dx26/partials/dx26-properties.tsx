import React, { useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import Dx26ChartProperties from './dx26-properties/dx26-chart-properties';
import Dx26DataProperties from './dx26-properties/dx26-data-properties';
import Dx26Hierarchy from './dx26-properties/dx26-hierarchy';
import { Content } from '@react-spectrum/view';
import { Tabs, Item } from '@react-spectrum/tabs';
import {  getPropertiesTabTranslations} from './dx26-modal-util';

export interface IDx26PropertiesProps extends StateProps, DispatchProps {}

const IDx26Properties = (props: IDx26PropertiesProps) => {
  const [activeTabId, setActiveTabId] = useState('chartProperties');

  return (
    <>
      <Tabs density={'compact'} aria-label="History of Ancient Rome" items={getPropertiesTabTranslations()} onSelectionChange={() => setActiveTabId}>
        {item => (
          <Item title={item.name}>
            <Content marginTop="size-250" marginStart="size-125">
              {activeTabId === 'chartProperties' && <Dx26ChartProperties />}
              {activeTabId === 'dataProperties' && <Dx26DataProperties />}
              {activeTabId === 'hierarchy' && <Dx26Hierarchy />}
            </Content>
          </Item>
        )}
      </Tabs>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(IDx26Properties);
