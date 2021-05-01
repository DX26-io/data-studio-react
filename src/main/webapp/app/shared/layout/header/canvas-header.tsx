import './header.scss';
import React, { useEffect, useState } from 'react';
import { ActionButton, View, DialogContainer, TooltipTrigger, Tooltip, MenuTrigger, Menu, Item } from '@adobe/react-spectrum';
import MoreSmallListVert from '@spectrum-icons/workflow/MoreSmallListVert';
import SaveAsFloppy from '@spectrum-icons/workflow/SaveAsFloppy';
import Asset from '@spectrum-icons/workflow/Asset';
import Search from '@spectrum-icons/workflow/Search';
import GraphBarVerticalAdd from '@spectrum-icons/workflow/GraphBarVerticalAdd';
import CollectionEdit from '@spectrum-icons/workflow/CollectionEdit';
import VisualizationsList from 'app/entities/visualizations/visualizations-list';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import {
  createEntity as addVisualmetadataEntity,
  deleteEntity as deleteVisualmetadataEntity,
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import {
  toggleEditMode,
  toggleFeaturesPanel,
  toggleFilterPanel,
} from 'app/shared/reducers/application-profile';
import { saveViewState } from 'app/entities/views/views.reducer';
import Filter from '@spectrum-icons/workflow/Filter';
import {translate} from "react-jhipster";
import {toggleSearch} from "app/entities/search/search.reducer";

const CanvasHeader = props => {
  const [isVisualizationsModelOpen, setVisualizationsModelOpen] = useState(false);

  const handleVisualizationClick = v => {
    props.addVisualmetadataEntity({
      viewId: props.view.id,
      visualMetadata: v,
    });
    setVisualizationsModelOpen(false);
  };
  const handleToggleEditMode = () => {
    props.toggleEditMode();
  };
  const handleToggleFilterPanel = () => {
    props.toggleFilterPanel();
  };

  const saveAllVisualizations = () => {
    props.saveViewState({
      visualMetadataSet: props.visualmetadata.visualMetadataSet,
      _id: props.view.id,
    });
  };

  const toggleFeatures = () => {
    props.toggleFeaturesPanel();
  };

  const toggleSearchModal = () => {
    props.toggleSearch();
  };

  return (
    <>
      <View>
        <TooltipTrigger>
          <ActionButton onPress={() => handleToggleEditMode()} aria-label="Notifications" isQuiet={true} marginEnd="size-5">
            <div className={props.isEditMode ? 'enableEdit' : 'disableEdit'}>
              <CollectionEdit color="informative" size="M" />
            </div>
          </ActionButton>
          <Tooltip>Edit</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <ActionButton
            onPress={() => setVisualizationsModelOpen(true)}
            aria-label="GraphBarVerticalAdd"
            isQuiet={true}
            marginEnd="size-5"
            data-testid="notificationsButton"
            isDisabled={!props.isEditMode}
          >
            <GraphBarVerticalAdd size="M" />
          </ActionButton>
          <Tooltip>Add Visualization</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <ActionButton onPress={() => saveAllVisualizations()} aria-label="Notifications" isQuiet={true} marginEnd="size-5">
            <SaveAsFloppy size="M" />
          </ActionButton>
          <Tooltip>Save</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <ActionButton onPress={() => toggleFeatures()}
                        aria-label="Features"
                        isQuiet={true}
                        isDisabled={!props.isEditMode}
                        marginEnd="size-5">
            <Asset size="M" />
          </ActionButton>
          <Tooltip>Toggle features</Tooltip>
        </TooltipTrigger>

        <TooltipTrigger>
          <MenuTrigger>
            <ActionButton aria-label="Notifications" isQuiet={true} marginEnd="size-5">
              <MoreSmallListVert size="M" />
            </ActionButton>
            <Menu>
              <Item key="Bookmarks">Bookmarks</Item>
              <Item key="Share">Share</Item>
              <Item key="Print">Print</Item>
            </Menu>
          </MenuTrigger>
          <Tooltip>More</Tooltip>
        </TooltipTrigger>

        <TooltipTrigger>
          <ActionButton onPress={() => toggleSearchModal()}
                        aria-label="{translate('views.menu.search')}"
                        isQuiet={true}
                        marginEnd="size-5">
            <Search size="M" />
          </ActionButton>
          <Tooltip>{translate('views.menu.toggle.search')}</Tooltip>
        </TooltipTrigger>

        <TooltipTrigger>
          <ActionButton onPress={() => handleToggleFilterPanel()} isQuiet={true} marginEnd="size-5">
            <Filter size="M" />
          </ActionButton>
          <Tooltip>Filter</Tooltip>
        </TooltipTrigger>

        <DialogContainer type="fullscreen" onDismiss={() => setVisualizationsModelOpen(false)} {...props}>
          {isVisualizationsModelOpen && (
            <VisualizationsList
              handleVisualizationClick={handleVisualizationClick}
              view={props.view}
              visualizations={props.visualizationsList}
              totalItem={props.visualmetadata.visualmetadataList?.length || 0}
            />
          )}
        </DialogContainer>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  isAuthenticated: storeState.authentication.isAuthenticated,
  visualmetadata: storeState.views.viewState,
  visualizationsList: storeState.visualizations.entities,
  visualmetadataEntity: storeState.visualmetadata.entity,
  isEditMode: storeState.applicationProfile.isEditMode,
});

const mapDispatchToProps = {
  addVisualmetadataEntity,
  toggleEditMode,
  toggleFilterPanel,
  toggleFeaturesPanel,
  toggleSearch,
  saveViewState,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CanvasHeader);
