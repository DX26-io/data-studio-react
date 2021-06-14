import React, { Key, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, View, Text, Button, Divider, ListBox, Item, Content } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import './features-panel.scss';
import Minimize from '@spectrum-icons/workflow/Minimize';
import Maximize from '@spectrum-icons/workflow/Maximize';
import Add from '@spectrum-icons/workflow/Add';
import { getViewFeaturesEntities, selectFeature } from 'app/entities/feature/feature.reducer';
import { Tabs } from '@react-spectrum/tabs';
import { featureTypeToActiveTabs, getFeaturesTabTranslations } from 'app/modules/canvas/features/features-panel-util';
import { Translate } from 'react-jhipster';
import { Redirect } from 'react-router-dom';

export interface IFeaturesPanelProp extends StateProps, DispatchProps {}

const FeaturesPanel = (props: IFeaturesPanelProp) => {
  const [isFeaturesMinimize, setFeaturesMinimize] = useState(true);
  const [activeTabId, setActiveTabId] = useState<Key>(0);
  const [showFeatureCreateDialog, setShowFeatureCreateDialog] = useState<boolean>(false);

  useEffect(() => {
    props.getViewFeaturesEntities(props.view.id);
  }, [props.view]);

  const featureFilter = feature => {
    return feature.featureType === featureTypeToActiveTabs[activeTabId];
  };

  const createNewFeatureClicked = () => {
    setShowFeatureCreateDialog(true);
  };

  const onFeatureSelected = selectedSet => {
    const feature = props.featuresList.find(ft => selectedSet.has(ft.id));
    props.selectFeature(feature);
    setShowFeatureCreateDialog(true);
  };

  const redirectToFeature = () => {
    return (
      <Redirect
        to={{
          pathname: `/dashboards/${props.view.viewDashboard.id}/${props.view.id}/feature`,
          state: {
            featureType: featureTypeToActiveTabs[activeTabId],
            datasource: props.view.viewDashboard.dashboardDatasource,
          },
        }}
      />
    );
  };

  if (showFeatureCreateDialog) {
    return redirectToFeature();
  }

  return (
    <>
      <div className={props.isFeaturesPanelOpen ? 'FeaturesPanel-Main FeaturesPanel-show' : 'FeaturesPanel-Main FeaturesPanel-hide'}>
        <div className={isFeaturesMinimize ? 'FeaturesPanel FeaturesPanel-minimize' : 'FeaturesPanel FeaturesPanel-maximize'}>
          <Flex direction="row" justifyContent="center" alignItems="center" marginStart="size-175" marginEnd="size-175">
            <span className="spectrum-Heading--sizeXXS" style={{ marginRight: 'auto' }}>
              <Translate contentKey="features.panel.title">_Features</Translate>
            </span>
            <ActionButton isQuiet onPress={createNewFeatureClicked}>
              <Add size="S" />
            </ActionButton>
            <div style={{ marginRight: '-11px' }}>
              {isFeaturesMinimize ? (
                <ActionButton
                  onPress={() => {
                    setFeaturesMinimize(!isFeaturesMinimize);
                  }}
                  isQuiet={true}
                >
                  <Maximize></Maximize>
                </ActionButton>
              ) : (
                <ActionButton
                  onPress={() => {
                    setFeaturesMinimize(!isFeaturesMinimize);
                  }}
                  isQuiet={true}
                >
                  <Minimize></Minimize>
                </ActionButton>
              )}
            </div>
          </Flex>
          <Divider size={'S'} />
          <View backgroundColor="gray-75" width="91%" margin="0px auto">
            <Tabs
              aria-label="Features"
              isQuiet={true}
              density={'compact'}
              position={'sticky'}
              items={getFeaturesTabTranslations()}
              selectedKey={activeTabId}
              onSelectionChange={key => setActiveTabId(key)}
            >
              {item => (
                <Item title={item.name} key={item.id}>
                  <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
                    <ListBox
                      width="size-2400"
                      aria-label="Features"
                      selectionMode="single"
                      onSelectionChange={onFeatureSelected}
                      items={props.featuresList.filter(featureFilter)}
                    >
                      {feature => <Item>{feature.name}</Item>}
                    </ListBox>
                  </Content>
                </Item>
              )}
            </Tabs>
          </View>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  isFeaturesPanelOpen: storeState.filter.isFeaturesPanelOpen,
  featuresList: storeState.feature.entities,
  selectedFeature: storeState.feature.selectedFeature,
});
const mapDispatchToProps = {
  getViewFeaturesEntities,
  selectFeature,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(FeaturesPanel);
