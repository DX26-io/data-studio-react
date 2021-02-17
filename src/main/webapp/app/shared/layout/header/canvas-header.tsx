import './header.scss';
import React, { useEffect, useState } from 'react';
import { ActionButton, View, DialogContainer, TooltipTrigger, Tooltip, MenuTrigger, Menu, Item, Picker } from '@adobe/react-spectrum';
import MoreSmallListVert from '@spectrum-icons/workflow/MoreSmallListVert';
import SaveAsFloppy from '@spectrum-icons/workflow/SaveAsFloppy';
import GraphBarVerticalAdd from '@spectrum-icons/workflow/GraphBarVerticalAdd';
import CollectionEdit from '@spectrum-icons/workflow/CollectionEdit';
import VisualizationsList from 'app/entities/visualizations/visualizations-list';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import {
  createEntity as addVisualmetadataEntity,
  deleteEntity as deleteVisualmetadataEntity,
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import { toggleEditMode } from 'app/shared/reducers/application-profile';
import { saveViewState } from 'app/entities/views/views.reducer';
import { getEntities as getDashboardEntities } from 'app/entities/dashboard/dashboard.reducer';
import { getAllEntities as getViewEntities } from 'app/entities/views/views.reducer';
import { RouteComponentProps, useHistory } from 'react-router-dom';

interface ICanvasHeaderProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string; viewId: string }> {}
const CanvasHeader = (props: ICanvasHeaderProps) => {
  const history = useHistory();
  const [isVisualizationsModelOpen, setVisualizationsModelOpen] = useState(false);
  const [dashboardName, setDashboardName] = useState('');
  const [viewName, setViewName] = useState('');

  const changeViewAndUpdateDashboard = id => {
    setViewName(id);
    history.push(`/dashboards/${dashboardName}/${id}/build`);
    window.location.reload();
  };

  const loadViewById = id => {
    setDashboardName(id);
    props.getViewEntities(id);
  };

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

  const saveAllVisualizations = () => {
    props.saveViewState({
      visualMetadataSet: props.visualmetadata.visualMetadataSet,
      _id: props.view.id,
    });
  };
  const loadDashboardAndView = () => {
    if (props.dashboardList.length === 0) {
      props.getDashboardEntities();
    }
    if (props.viewsList.length === 0) {
      props.getViewEntities(props.view.viewDashboard.id);
    }
  };
  useEffect(() => {
    if (props.view.id) {
      setDashboardName(props.view.viewDashboard.id.toString());
      setViewName(props.view.id.toString());
      loadDashboardAndView();
    }
  }, [props.view]);

  useEffect(() => {
    // if (viewName !== '') {
    //   changeViewAndUpdateDashboard();
    // }
    if (props.viewsList.length > 0 && props.view.id) {
      setViewName(props.view.id.toString());
    }
  }, [viewName, props.viewsList]);

  return (
    <>
      <View>
        <Picker marginEnd={5} selectedKey={dashboardName} onSelectionChange={selected => loadViewById(selected.toString())}>
          {props.dashboardList.map(dashboard => (
            <Item key={dashboard.id}>{dashboard.dashboardName}</Item>
          ))}
        </Picker>
        <Picker marginEnd={5} selectedKey={viewName} onSelectionChange={selected => changeViewAndUpdateDashboard(selected.toString())}>
          {props.viewsList.map(view => (
            <Item key={view.id}>{view.viewName}</Item>
          ))}
        </Picker>
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

        <DialogContainer type="fullscreen" onDismiss={() => setVisualizationsModelOpen(false)} {...props}>
          {isVisualizationsModelOpen && (
            <VisualizationsList
              handleVisualizationClick={handleVisualizationClick}
              view={props.view}
              visualizations={props.visualizationsList}
              totalItem={props.visualmetadata.visualMetadataSet?.length || 0}
            />
          )}
        </DialogContainer>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  dashboardList: storeState.dashboard.entities,
  viewsList: storeState.views.entities,
  isAuthenticated: storeState.authentication.isAuthenticated,
  visualmetadata: storeState.views.viewState,
  visualizationsList: storeState.visualizations.entities,
  visualmetadataEntity: storeState.visualmetadata.entity,
  isEditMode: storeState.applicationProfile.isEditMode,
});

const mapDispatchToProps = {
  addVisualmetadataEntity,
  toggleEditMode,
  saveViewState,
  getDashboardEntities,
  getViewEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CanvasHeader);
