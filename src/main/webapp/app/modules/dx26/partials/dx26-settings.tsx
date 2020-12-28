import React, { useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import Dx26QuerySettings from './dx26-settings/dx26-query-settings';
import Dx26DataConstraintsSettings from './dx26-settings/dx26-data-constraints-settings';
import Dx26DataSettings from './dx26-settings/dx26-data-settings';
import Dx26ThresholdAlertSettings from './dx26-settings/dx26-threshold-alert-settings';
import { Content } from '@react-spectrum/view';
import { Tabs, Item } from '@react-spectrum/tabs';
import { getSettingsTabTranslations } from './dx26-modal-util';

export interface IDx26SettingsProps extends StateProps, DispatchProps {
  visualizationId : React.ReactNode;
}

const IDx26Settings = (props: IDx26SettingsProps) => {
  const [activeTabId, setActiveTabId] = useState('query');
  return (
    <>
      <Tabs isQuiet={true} density={'compact'} items={getSettingsTabTranslations()} onSelectionChange={key => setActiveTabId(key)}>
        {item => (
          <Item title={item.name}>
            <Content marginTop="size-250" marginStart="size-125">
              {activeTabId === 'query' && <Dx26QuerySettings />}
              {activeTabId === 'dataConstraints' && <Dx26DataConstraintsSettings />}
              {activeTabId === 'thresholdAlert' && <Dx26ThresholdAlertSettings />}
              {activeTabId === 'data' && <Dx26DataSettings />}
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

export default connect(mapStateToProps, mapDispatchToProps)(IDx26Settings);
