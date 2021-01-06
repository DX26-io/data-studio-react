import React, { ReactNode, ReactText, useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import VisualizationQuerySetting from 'app/modules/canvas/visualization/visualization-settings/partials/visualization-query-setting';
import VisualizationDataConstraintsSetting from 'app/modules/canvas/visualization/visualization-settings/partials/visualization-data-constraints-setting';
import VisualizationDataSetting from 'app/modules/canvas/visualization/visualization-settings/partials/visualization-data-setting';
import VisualizationThresholdAlertSetting from 'app/modules/canvas/visualization/visualization-settings/partials/visualization-threshold-alert-setting';
import { Content } from '@react-spectrum/view';
import { Tabs, Item } from '@react-spectrum/tabs';
import { getSettingsTabTranslations } from 'app/modules/canvas/visualization/canvas-edit/canvas-edit-modal-util';

export interface IVisualizationSettingsProps extends StateProps, DispatchProps {
  visualizationId : ReactNode;
}

const VisualizationSettings = (props: IVisualizationSettingsProps) => {
  const [activeTabId, setActiveTabId] =  useState<ReactText>('query');
  return (
    <>
      <Tabs isQuiet={true} density={'compact'} items={getSettingsTabTranslations()} onSelectionChange={key => setActiveTabId(key)}>
        {item => (
          <Item title={item.name}>
            <Content marginTop="size-250" marginStart="size-125">
              {activeTabId === 'query' && <VisualizationQuerySetting />}
              {activeTabId === 'dataConstraints' && <VisualizationDataConstraintsSetting />}
              {activeTabId === 'thresholdAlert' && <VisualizationThresholdAlertSetting />}
              {activeTabId === 'data' && <VisualizationDataSetting />}
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

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationSettings);
