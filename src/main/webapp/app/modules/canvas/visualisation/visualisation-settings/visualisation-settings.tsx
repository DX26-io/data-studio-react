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
            <Content margin="size-250">
              <VisualisationQuerySetting />
            </Content>
          </Item>
          <Item key="dataConstraints">
            <Content margin="size-250">
              <DataConstraints />
            </Content>
          </Item>
          <Item key="scheduler">
            <Content margin="size-250">
              <Scheduler thresholdAlert={false} />
            </Content>
          </Item>
          <Item key="thresholdAlert">
            <Content margin="size-250">
              <Scheduler thresholdAlert={true} />
            </Content>
          </Item>
          {props.visualDataById && props.visualDataById.length > 0 && (
            <Item key="data">
              <Content margin="size-250">
                {' '}
                <TableView data={props.visualDataById} />{' '}
              </Content>
            </Item>
          )}
        </TabPanels>
      </Tabs>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visualDataById: storeState.visualisationData.visualDataById,
});

export default connect(mapStateToProps, null)(VisualisationSettings);
