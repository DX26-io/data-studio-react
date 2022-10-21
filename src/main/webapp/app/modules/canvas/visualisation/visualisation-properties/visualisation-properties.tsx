import React, { ReactText, useState } from 'react';
import { Content, Item, View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
('');
import VisualisationChartProperties from 'app/modules/canvas/visualisation/visualisation-properties/partials/visualisation-chart-properties';
import VisualisationDataProperties from 'app/modules/canvas/visualisation/visualisation-properties/partials/visualisation-data-properties';
import VisualisationHierarchy from 'app/modules/canvas/visualisation/visualisation-properties/partials/visualisation-hierarchy';
import {
  getPropertiesTabTranslations,
} from 'app/modules/canvas/visualisation/visualisation-modal/visualisation-edit-modal/visualisation-edit-modal-util';
import { IFeature } from 'app/shared/model/feature.model';
import { IViews } from 'app/shared/model/views.model';
import { IVisualMetadataSet } from 'app/shared/model/visualmetadata.model';
import { Tabs } from '@react-spectrum/tabs';
import { IHierarchy } from 'app/shared/model/hierarchy.model';

const VisualisationProperties = () => {
  const [activeTabId, setActiveTabId] = useState<ReactText>('chartProperties');

  return (
    <>
      <div className="properties-tabs">
        <Tabs
          isQuiet={true}
          density={'compact'}
          position={'sticky'}
          items={getPropertiesTabTranslations()}
          onSelectionChange={key => setActiveTabId(key)}
        >
            {/* 
// @ts-ignore */}
          {item => (
            <Item title={item.name} key={item.id}>
              <Content margin="size-100">
                {activeTabId === 'chartProperties' && <VisualisationChartProperties />}
                {activeTabId === 'dataProperties' && <VisualisationDataProperties />}
              </Content>
            </Item>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default VisualisationProperties;
