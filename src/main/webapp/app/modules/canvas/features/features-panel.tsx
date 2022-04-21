import React, { Key, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, View, Text, Button, Divider, ListBox, Item, DialogContainer } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import Add from '@spectrum-icons/workflow/Add';
import { getViewFeaturesEntities, setFeature, toggleFeaturesPanel,getEntity } from 'app/entities/feature/feature.reducer';
import { Tabs } from '@react-spectrum/tabs';
import { featureTypeToActiveTabs, getFeaturesTabTranslations } from 'app/modules/canvas/features/features-panel-util';
import { getHierarchies, setHierarchy } from 'app/entities/hierarchy/hierarchy.reducer';
import HierarchyUpdate from 'app/entities/hierarchy/hierarchy-update';
import FeatureUpdate from 'app/entities/feature/feature-update';
import { IFeature, defaultValue as featureDefaultValue } from 'app/shared/model/feature.model';
import PanelHeader from 'app/shared/components/panel-header';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

export interface IFeaturesPanelProp extends StateProps, DispatchProps {}

const FeaturesPanel = (props: IFeaturesPanelProp) => {
  const [isFeaturesMinimize, setFeaturesMinimize] = useState<boolean>(true);
  const [activeTabId, setActiveTabId] = useState<Key>(0);
  const [isHierarchyDialogOpen, setHierarchyDialogOpen] = useState<boolean>(false);
  const [isFeatureDialogOpen, setFeatureDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (props.datasourceId) props.getHierarchies(props.datasourceId);
  }, []);

  useEffect(() => {
    if (props.view.id) props.getViewFeaturesEntities(props.view.id);
  }, [props.view]);

  const featureFilter = feature => {
    return feature.featureType === featureTypeToActiveTabs[activeTabId];
  };

  const create = () => {
    if (activeTabId === '0') {
      props.setFeature({ ...featureDefaultValue, featureType: 'DIMENSION' });
      setFeatureDialogOpen(true);
    } else if (activeTabId === '1') {
      props.setFeature({ ...featureDefaultValue, featureType: 'MEASURE' });
      setFeatureDialogOpen(true);
    } else {
      setHierarchyDialogOpen(true);
    }
  };

  const onFeatureSelected = selectedSet => {
    const it = selectedSet.values();
    const featureId= it.next();
    props.getEntity(featureId.value);
    setFeatureDialogOpen(true);
  };

  const onHierarchySelected = selectedSet => {
    const hierarchy = props.hierarchies.find(h => selectedSet.has(h.id));
    props.setHierarchy(hierarchy);
    setHierarchyDialogOpen(true);
  };

  const handleClickAway = event => {
    if (event.target.firstChild.id !== 'toggle-feature-button' && event.target.firstChild.id !== undefined) {
      props.toggleFeaturesPanel();
    }
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className="panel-main">
          <div className={isFeaturesMinimize ? 'panel-body panel-minimize ' : 'panel-body panel-maximize'}>
            <PanelHeader
              setMinimize={setFeaturesMinimize}
              isMinimized={isFeaturesMinimize}
              titleKey="features.panel.title"
              addIcon={
                <ActionButton isQuiet onPress={create}>
                  <Add size="S" />
                </ActionButton>
              }
            />
            <Divider size={'S'} />
            <View backgroundColor="gray-75" margin="size-150">
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
                    <View marginTop="size-250" marginStart="size-125" marginEnd="size-125">
                      {activeTabId === '2' ? (
                        <ListBox
                          width="size-2400"
                          aria-label="Hierarchy"
                          selectionMode="single"
                          onSelectionChange={onHierarchySelected}
                          items={props.hierarchies}
                        >
                          {hiararchy => <Item>{hiararchy.name}</Item>}
                        </ListBox>
                      ) : (
                        <ListBox
                          width="size-2400"
                          aria-label="Features"
                          selectionMode="single"
                          onSelectionChange={onFeatureSelected}
                          items={props.featuresList.filter(featureFilter)}
                        >
                          {feature => <Item>{feature.name}</Item>}
                        </ListBox>
                      )}
                    </View>
                  </Item>
                )}
              </Tabs>
            </View>
            <DialogContainer onDismiss={() => setHierarchyDialogOpen(false)}>
              {isHierarchyDialogOpen && <HierarchyUpdate setOpen={setHierarchyDialogOpen} />}
            </DialogContainer>
            <DialogContainer onDismiss={() => setFeatureDialogOpen(false)}>
              {isFeatureDialogOpen && <FeatureUpdate setOpen={setFeatureDialogOpen} />}
            </DialogContainer>
          </div>
        </div>
      </ClickAwayListener>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  isFeaturesPanelOpen: storeState.feature.isFeaturesPanelOpen,
  featuresList: storeState.feature.entities,
  feature: storeState.feature.entity,
  datasourceId: storeState.views.entity?.viewDashboard?.dashboardDatasource?.id,
  hierarchies: storeState.hierarchies.hierarchies,
});
const mapDispatchToProps = {
  getViewFeaturesEntities,
  setFeature,
  getHierarchies,
  setHierarchy,
  toggleFeaturesPanel,
  getEntity
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(FeaturesPanel);
