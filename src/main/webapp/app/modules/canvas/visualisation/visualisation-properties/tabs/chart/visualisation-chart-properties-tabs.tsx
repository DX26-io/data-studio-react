import React, { ReactText, useState } from 'react';
import { Content, Item, View, Tabs, TabList, TabPanels } from '@adobe/react-spectrum';
import VisualisationChartConfigProperties from './visualisation-chart-properties';
import VisualisationTitleProperties from './visualisation-title-properties';
import VisualisationBodyProperties from './visualisation-body-properties';
import { getChartPropertiesTranslations } from '../../../visualisation-modal/visualisation-edit-modal/visualisation-edit-modal-util';
import { Translate } from 'react-jhipster';

const VisualisationChartProperties = () => {
  const [activeTabId, setActiveTabId] = useState<ReactText>('titleProperties');

  return (
    <View>
      <Tabs
        isQuiet={true}
        density={'compact'}
        position={'sticky'}
        // items={getChartPropertiesTranslations()}
        onSelectionChange={setActiveTabId}
        selectedKey={activeTabId}
      >
        <TabList>
          <Item key='titleProperties'>
            <Content margin="size-100">
              <Translate contentKey="datastudioApp.visualmetadata.editConfiguration.properties.chartProperties.titleProperties"></Translate>
            </Content>
          </Item>
          <Item key='bodyProperties'>
            <Content margin="size-100">
              <Translate contentKey="datastudioApp.visualmetadata.editConfiguration.properties.chartProperties.bodyProperties"></Translate>
            </Content>
          </Item>
          <Item key='chartCongifuration'>
            <Content margin="size-100">
              <Translate contentKey="datastudioApp.visualmetadata.editConfiguration.properties.chartProperties.chartConfiguration"></Translate>
            </Content>
          </Item>
        </TabList>
        {/* {item => (
          <Item title={item.name} key={item.id}>
            <Content margin="size-100">
              {activeTabId === 'titleProperties' && <VisualisationTitleProperties />}
              {activeTabId === 'bodyProperties' && <VisualisationBodyProperties />}
              {activeTabId === 'chartCongifuration' && <VisualisationChartConfigProperties />}
            </Content>
          </Item>
        )} */}
        <TabPanels>
          <Item key='titleProperties'>
            <Content margin="size-100">
              <VisualisationTitleProperties />
            </Content>
          </Item>
          <Item key='bodyProperties'>
            <Content margin="size-100">
              <VisualisationBodyProperties />
            </Content>
          </Item>
          <Item key='chartCongifuration'>
            <Content margin="size-100">
              <VisualisationChartConfigProperties />
            </Content>
          </Item>
        </TabPanels>
      </Tabs>
    </View>
  );
};

export default VisualisationChartProperties;
