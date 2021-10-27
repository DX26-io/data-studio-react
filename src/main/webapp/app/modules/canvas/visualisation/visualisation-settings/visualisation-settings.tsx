import React, { ReactNode, ReactText, useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import VisualisationQuerySetting from 'app/modules/canvas/visualisation/visualisation-settings/partials/visualisation-query-setting';
import VisualisationDataConstraintsSetting from 'app/modules/canvas/visualisation/visualisation-settings/partials/visualisation-data-constraints-setting';
import VisualisationDataSetting from 'app/modules/canvas/visualisation/visualisation-settings/partials/visualisation-data-setting';
import VisualisationThresholdAlertSetting from 'app/modules/canvas/visualisation/visualisation-settings/partials/visualisation-threshold-alert-setting';
import { Content } from '@react-spectrum/view';
import { Tabs, Item } from '@react-spectrum/tabs';
import { getSettingsTabTranslations } from 'app/modules/canvas/visualisation/visualisation-modal/visualisation-edit-modal/visualisation-edit-modal-util';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { IViews } from 'app/shared/model/views.model';
import { IFeature } from 'app/shared/model/feature.model';
import { IDatasources } from 'app/shared/model/datasources.model';

export interface IVisualisationSettingsProps {
  visualisationId: ReactNode;
  visual: IVisualMetadataSet;
  view: IViews;
  data?: any;
  features?: readonly IFeature[];
  datasource?: IDatasources;
  filterData?: any;
}

const VisualisationSettings = (props: IVisualisationSettingsProps) => {
  const [activeTabId, setActiveTabId] = useState<ReactText>('query');
  return (
    <>
      <Tabs isQuiet={true} density={'compact'} items={getSettingsTabTranslations()} onSelectionChange={key => setActiveTabId(key)}>
        {item => (
          <Item title={item.name}>
            <Content margin="size-250">
              {activeTabId === 'query' && <VisualisationQuerySetting visual={props.visual} view={props.view} />}
              {activeTabId === 'dataConstraints' && (
                <VisualisationDataConstraintsSetting
                  filterData={props.filterData}
                  features={props.features}
                  datasource={props.datasource}
                  visualMetaData={props.visual}
                />
              )}
              {activeTabId === 'scheduler' && <VisualisationThresholdAlertSetting visual={props.visual} thresholdAlert={false} />}
              {activeTabId === 'thresholdAlert' && <VisualisationThresholdAlertSetting visual={props.visual} thresholdAlert={true} />}
              {activeTabId === 'data' && <VisualisationDataSetting data={props.data} />}
            </Content>
          </Item>
        )}
      </Tabs>
    </>
  );
};

export default VisualisationSettings;
