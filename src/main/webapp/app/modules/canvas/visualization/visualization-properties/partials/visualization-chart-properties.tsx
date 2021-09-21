import React, { ReactText, useState } from 'react';
import { Content, Item, View } from '@adobe/react-spectrum';
import VisualizationTitleProperties from 'app/modules/canvas/visualization/visualization-properties/partials/properties/visualization-title-properties';
import VisualizationChartConfigProperties from 'app/modules/canvas/visualization/visualization-properties/partials/properties/visualization-chart-config-properties';
import VisualizationBodyProperties from 'app/modules/canvas/visualization/visualization-properties/partials/properties/visualization-body-properties';
import { Tabs } from '@react-spectrum/tabs';
import { getChartPropertiesTranslations } from '../../visualization-modal/visualization-edit-modal/visualization-edit-modal-util';

const VisualizationChartProperties = () => {
  const [activeTabId, setActiveTabId] = useState<ReactText>('titleProperties');

  return (
    <View>

      <Tabs
          isQuiet={true}
          density={'compact'}
          position={'sticky'}
          items={getChartPropertiesTranslations()}
          onSelectionChange={key => setActiveTabId(key)}
        >
          {item => (
            <Item title={item.name} key={item.id}>
              <Content margin="size-100">
                {activeTabId === 'titleProperties' && <VisualizationTitleProperties />}
                {activeTabId === 'bodyProperties' && <VisualizationBodyProperties />}
                {activeTabId === 'chartCongifuration' && <VisualizationChartConfigProperties />}
              </Content>
            </Item>
          )}
        </Tabs>
    </View>
  );
};

export default VisualizationChartProperties;
