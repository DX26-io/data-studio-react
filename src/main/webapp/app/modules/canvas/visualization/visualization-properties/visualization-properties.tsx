import React, { ReactText, useState } from 'react';
import { Content, Item, View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';''
import VisualizationChartProperties from 'app/modules/canvas/visualization/visualization-properties/partials/visualization-chart-properties';
import VisualizationDataProperties from 'app/modules/canvas/visualization/visualization-properties/partials/visualization-data-properties';
import VisualizationHierarchy from 'app/modules/canvas/visualization/visualization-properties/partials/visualization-hierarchy';
import { getPropertiesTabTranslations } from 'app/modules/canvas/visualization/visualization-modal/visualization-edit-modal/visualization-edit-modal-util';
import { IFeature } from 'app/shared/model/feature.model';
import { IViews } from 'app/shared/model/views.model';
import { IVisualMetadataSet } from 'app/shared/model/visualMetadata.model';
import { Tabs } from '@react-spectrum/tabs';

export interface IVisualizationPropertiesProps  {
  features: readonly IFeature[];
  visual: IVisualMetadataSet;
}

const VisualizationProperties = (props: IVisualizationPropertiesProps) => {
  const [activeTabId, setActiveTabId] = useState<ReactText>('chartProperties');

  return (
    <>
      <div className="properties-tabs">
        <Tabs
          isQuiet={true}
          density={'compact'}
          position={"sticky"}
          top={0}
          aria-label="History of Ancient Rome"
          items={getPropertiesTabTranslations()}
          onSelectionChange={key => setActiveTabId(key)}
        >
          {item => (
            <Item title={item.name} key={item.id}>
              <Content margin="size-100">
                {activeTabId === 'chartProperties' &&<VisualizationChartProperties features={props.features} visual={props.visual}  />}
                {activeTabId === 'dataProperties' && <VisualizationDataProperties features={props.features} visual={props.visual} />}
                {/* {activeTabId === 'hierarchy' && <VisualizationHierarchy />} */}
              </Content>
            </Item>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default (VisualizationProperties);
