import React, {Key, ReactText, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import {ActionButton, Flex, View, Text, Button, Divider, ListBox, Item, Content} from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import './features-panel.scss';
import Minimize from '@spectrum-icons/workflow/Minimize';
import Maximize from '@spectrum-icons/workflow/Maximize';
import Add from '@spectrum-icons/workflow/Add';
import { getViewFeaturesEntities } from 'app/entities/feature/feature.reducer';
import {toggleFeaturesPanel} from "app/shared/reducers/application-profile";
import {Tabs} from "@react-spectrum/tabs";
import {featureTypeToActiveTabs, getFeaturesTabTranslations} from "app/modules/canvas/features/features-panel-util";
import {Translate} from "react-jhipster";
import {Redirect} from "react-router-dom";

export interface IFeaturesPanelProp extends StateProps, DispatchProps {}

const FeaturesPanel = (props: IFeaturesPanelProp) => {
  const [isFeaturesMinimize, setFeaturesMinimize] = useState(true);
  const [activeTabId, setActiveTabId] = useState<Key>(0);
  const [showFeatureCreateDialog, setShowFeatureCreateDialog] = useState<boolean>(false);

  useEffect(() => {
    props.getViewFeaturesEntities(props.view.id);
  }, [props.view]);

  const featureFilter = (feature) => {
    return feature.featureType === featureTypeToActiveTabs[activeTabId];
  };

  const createNewFeatureClicked = () => {
    setShowFeatureCreateDialog(true);
  };

  if (showFeatureCreateDialog) {
    return (
      <Redirect
        to={{
          pathname: '/dashboards/' + props.view.viewDashboard.id + '/' + props.view.id + '/feature/create',
          state: {
            featureType: featureTypeToActiveTabs[activeTabId]
          }
        }}
      />
    );
  }

  return <>
    <div className={props.isFeaturesPanelOpen ? 'FeaturesPanel-Main FeaturesPanel-show' : 'FeaturesPanel-Main FeaturesPanel-hide'}>
      <div className={isFeaturesMinimize ? 'FeaturesPanel FeaturesPanel-minimize' : 'FeaturesPanel FeaturesPanel-maximize'}>
        <Flex direction="column" gap="size-100">
          <View justifySelf="center">
            <div className="features-header">
              <span className="spectrum-Heading--sizeXXS">
                <Translate contentKey="datastudioApp.feature.panel.title">_Features</Translate>
              </span>
              <Button variant="secondary"
                      isQuiet
                      onPress={createNewFeatureClicked}>
                <Add></Add>
              </Button>
              {isFeaturesMinimize ?
                <ActionButton
                  onPress={() => {
                    setFeaturesMinimize(!isFeaturesMinimize);
                  }}
                  isQuiet={true}>
                  <Maximize></Maximize>
                </ActionButton>
                :
                <ActionButton
                  onPress={() => {
                    setFeaturesMinimize(!isFeaturesMinimize);
                  }}
                  isQuiet={true}>
                  <Minimize></Minimize>
                </ActionButton>}
            </div>
            <Divider size={'S'} />
          </View>
          <View>
            <Tabs
              aria-label="Features"
              isQuiet={true}
              density={'compact'}
              position={'sticky'}
              items={getFeaturesTabTranslations()}
              selectedKey={activeTabId}
              onSelectionChange={key => setActiveTabId(key)}>
              {item => (
                <Item title={item.name}
                      key={item.id}>
                  <Content margin="size-100">
                    <ListBox
                      width="size-2400"
                      aria-label="Features"
                      selectionMode="none"
                      items={props.featuresList.filter(featureFilter)}>
                      {(feature) => <Item>{feature.name}</Item>}
                    </ListBox>
                  </Content>
                </Item>
              )}
            </Tabs>
          </View>
        </Flex>
      </div>
    </div>
  </>;
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  isFeaturesPanelOpen: storeState.applicationProfile.isFeaturesPanelOpen,
  featuresList: storeState.feature.entities,
});
const mapDispatchToProps = {
  getViewFeaturesEntities,
  toggleFeaturesPanel,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(FeaturesPanel);
