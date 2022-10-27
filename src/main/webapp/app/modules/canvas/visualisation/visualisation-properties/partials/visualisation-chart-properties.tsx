import React, { ReactText, useState } from 'react';
import { Content, Item, View } from '@adobe/react-spectrum';
import VisualisationChartConfigProperties from 'app/modules/canvas/visualisation/visualisation-properties/partials/properties/visualisation-chart-config-properties';
import VisualisationTitleProperties from 'app/modules/canvas/visualisation/visualisation-properties/partials/properties/visualisation-title-properties';
import VisualisationBodyProperties from 'app/modules/canvas/visualisation/visualisation-properties/partials/properties/visualisation-body-properties';
import { Tabs } from '@react-spectrum/tabs';
import { getChartPropertiesTranslations } from '../../visualisation-modal/visualisation-edit-modal/visualisation-edit-modal-util';

const VisualisationChartProperties = () => {
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
                {activeTabId === 'titleProperties' && <VisualisationTitleProperties />}
                {activeTabId === 'bodyProperties' && <VisualisationBodyProperties />}
                {activeTabId === 'chartCongifuration' && <VisualisationChartConfigProperties />}
              </Content>
            </Item>
          )}
        </Tabs>
    </View>
  );
};

export default VisualisationChartProperties;
