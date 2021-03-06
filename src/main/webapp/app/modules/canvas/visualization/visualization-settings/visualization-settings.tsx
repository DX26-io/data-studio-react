import React, { ReactNode, ReactText, useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import VisualizationQuerySetting from 'app/modules/canvas/visualization/visualization-settings/partials/visualization-query-setting';
import VisualizationDataConstraintsSetting from 'app/modules/canvas/visualization/visualization-settings/partials/visualization-data-constraints-setting';
import VisualizationDataSetting from 'app/modules/canvas/visualization/visualization-settings/partials/visualization-data-setting';
import VisualizationThresholdAlertSetting from 'app/modules/canvas/visualization/visualization-settings/partials/visualization-threshold-alert-setting';
import { Content } from '@react-spectrum/view';
import { Tabs, Item } from '@react-spectrum/tabs';
import { getSettingsTabTranslations } from 'app/modules/canvas/visualization/visualization-modal/visualization-edit-modal/visualization-edit-modal-util';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { IViews } from 'app/shared/model/views.model';
import { IFeature } from 'app/shared/model/feature.model';
import { IDatasources } from 'app/shared/model/datasources.model';

export interface IVisualizationSettingsProps {
  visualizationId: ReactNode;
  visual: IVisualMetadataSet;
  view: IViews;
  data?: any;
  features?: readonly IFeature[];
  datasource?: IDatasources;
  filterData?: any;
}

const VisualizationSettings = (props: IVisualizationSettingsProps) => {
  const [activeTabId, setActiveTabId] = useState<ReactText>('query');
  return (
    <>
      <Tabs isQuiet={true} density={'compact'} items={getSettingsTabTranslations()} onSelectionChange={key => setActiveTabId(key)}>
        {item => (
          <Item title={item.name}>
            <Content marginTop="size-250" marginStart="size-125">
              {activeTabId === 'query' && <VisualizationQuerySetting visual={props.visual} view={props.view} />}
              {activeTabId === 'dataConstraints' && (
                <VisualizationDataConstraintsSetting
                  filterData={props.filterData}
                  features={props.features}
                  datasource={props.datasource}
                  visualMetaData={props.visual}
                />
              )}
              {activeTabId === 'thresholdAlert' && <VisualizationThresholdAlertSetting visual={props.visual} />}
              {activeTabId === 'data' && <VisualizationDataSetting data={props.data} />}
            </Content>
          </Item>
        )}
      </Tabs>
    </>
  );
};

export default VisualizationSettings;
