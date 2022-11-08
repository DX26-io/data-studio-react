import React, { ReactNode, ReactText, useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import VisualisationQuerySetting from 'app/modules/canvas/visualisation/visualisation-settings/partials/visualisation-query-setting';
import { Content, View } from '@react-spectrum/view';
import { Tabs, Item, TabList, TabPanels } from '@react-spectrum/tabs';
import { getSettingsTabTranslations } from 'app/modules/canvas/visualisation/visualisation-modal/visualisation-edit-modal/visualisation-edit-modal-util';
import Scheduler from 'app/modules/canvas/scheduler/scheduler';
import DataConstraints from 'app/modules/canvas/data-constraints/data-constraints';
import TableView from 'app/shared/components/table/table';
import { Translate } from 'react-jhipster';

const VisualisationSettings = props => {
  const [activeTabId, setActiveTabId] = useState<ReactText>('query');
  return (
    <>
      <Tabs isQuiet={true} density={'compact'} items={getSettingsTabTranslations()} onSelectionChange={setActiveTabId}>
        <TabList>
          <Item key="query">
            <Content margin="size-100">
              <Translate contentKey="views.editConfiguration.settings.query"></Translate>
            </Content>
          </Item>
          <Item key="dataConstraints">
            <Content margin="size-100">
              <Translate contentKey="views.editConfiguration.settings.dataConstraints"></Translate>
            </Content>
          </Item>
          <Item key="scheduler">
            <Content margin="size-100">
              <Translate contentKey="views.editConfiguration.settings.scheduler"></Translate>
            </Content>
          </Item>
          <Item key="thresholdAlert">
            <Content margin="size-100">
              <Translate contentKey="views.editConfiguration.settings.thresholdAlert"></Translate>
            </Content>
          </Item>
          <Item key="data">
            <Content margin="size-100">
              <Translate contentKey="views.editConfiguration.settings.data"></Translate>
            </Content>
          </Item>
        </TabList>
        <TabPanels>
          <Item key="query">
            <VisualisationQuerySetting />
          </Item>
          <Item key="dataConstraints">
            <DataConstraints />
          </Item>
          <Item key="scheduler">
            <Scheduler thresholdAlert={false} />
          </Item>
          <Item key="thresholdAlert">
            <Scheduler thresholdAlert={true} />
          </Item>
          {props.visualDataById && props.visualDataById?.data.length > 0 && (
            <Item key="data">
              {' '}
              <TableView data={props.visualDataById?.data} />{' '}
            </Item>
          )}
        </TabPanels>
        {/* {item => (
          <Item title={item.name}>
            <Content margin="size-250">
              {activeTabId === 'query' && <VisualisationQuerySetting />}
              {activeTabId === 'dataConstraints' && <DataConstraints />}
              {activeTabId === 'scheduler' && <Scheduler thresholdAlert={false} />}
              {activeTabId === 'thresholdAlert' && <Scheduler thresholdAlert={true} />}
              {activeTabId === 'data' && props.visualDataById && props.visualDataById?.data.length > 0 && (
                <TableView data={props.visualDataById?.data} />
              )}
            </Content>
          </Item>
        )} */}
      </Tabs>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visualDataById: storeState.visualisationData.visualDataById,
});

export default connect(mapStateToProps, null)(VisualisationSettings);
