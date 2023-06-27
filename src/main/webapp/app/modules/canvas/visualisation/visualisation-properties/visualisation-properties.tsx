import React, { ReactText, useState } from 'react';
import { Content, Item, View, Tabs, TabList, TabPanels } from '@adobe/react-spectrum';
import VisualisationChartProperties from 'app/modules/canvas/visualisation/visualisation-properties/tabs/chart/visualisation-chart-properties-tabs';
import VisualisationDataProperties from 'app/modules/canvas/visualisation/visualisation-properties/tabs/data/visualisation-data-properties';
import { Translate } from 'react-jhipster';

const VisualisationProperties = () => {
  const [activeTabId, setActiveTabId] = useState<ReactText>('chartProperties');

  return (
    <div className="properties-tabs">
      <Tabs
        isQuiet={true}
        density={'compact'}
        position={'sticky'}
        // items={getPropertiesTabTranslations()}
        onSelectionChange={setActiveTabId}
      >
        <TabList>
          <Item key="chartProperties">
            <Content margin="size-100">
              <Translate contentKey="datastudioApp.visualmetadata.editConfiguration.properties.chartProperties.title"></Translate>
            </Content>
          </Item>
          <Item key="dataProperties">
            <Content margin="size-100">
              <Translate contentKey="datastudioApp.visualmetadata.editConfiguration.properties.dataProperties.title"></Translate>
            </Content>
          </Item>
        </TabList>
        <TabPanels>
          <Item key="chartProperties">
            <Content margin="size-100">
              <VisualisationChartProperties />
            </Content>
          </Item>
          <Item key="dataProperties">
            <Content margin="size-100">
              <VisualisationDataProperties />
            </Content>
          </Item>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default VisualisationProperties;
