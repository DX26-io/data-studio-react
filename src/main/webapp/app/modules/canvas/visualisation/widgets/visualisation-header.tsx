import './visualisation-header.scss';
import { ActionButton, Button, DialogContainer, Flex, Item, Menu, MenuTrigger, Text, View } from '@adobe/react-spectrum';
import PlayCircle from '@spectrum-icons/workflow/PlayCircle';
import Copy from '@spectrum-icons/workflow/Copy';
import Delete from '@spectrum-icons/workflow/Delete';
import Edit from '@spectrum-icons/workflow/Edit';
import Export from '@spectrum-icons/workflow/Export';
import MoreSmallListVert from '@spectrum-icons/workflow/MoreSmallListVert';
import Refresh from '@spectrum-icons/workflow/Refresh';
import Settings from '@spectrum-icons/workflow/Settings';
import ShareAndroid from '@spectrum-icons/workflow/ShareAndroid';
import Table from '@spectrum-icons/workflow/Table';
import ViewedMarkAs from '@spectrum-icons/workflow/ViewedMarkAs';
import 'app/modules/canvas/visualisation/canvas.scss';
import { getVisualisationData } from '../util/visualisation-render-utils';
import { CSVLink } from 'react-csv';
import { IRootState } from 'app/shared/reducers';
import React, { FC, ReactText, useEffect, useRef, useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { getTransactionData } from '../util/visualisation-utils';
import { IVisualMetadataSet } from 'app/shared/model/visualmetadata.model';
import {
  setVisualisationAction,
  setVisual,
  getEntity as getVisualMetadataEntity,
  updateEntity as updateVisualmetadataEntity,
  metadataContainerUpdate,
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import { isRequiredFeatureEmpty } from 'app/entities/visualmetadata/visualmetadata-util';
import { createVisualMetadata } from '../visualisation-modal/visualisation-edit-modal/visualisation-edit-modal-util';
import Switch from '@spectrum-icons/workflow/Switch';
import SaveFloppy from '@spectrum-icons/workflow/SaveFloppy';
import Hammer from '@spectrum-icons/workflow/Hammer';
import { getVisualisationShareData } from '../util/visualisation-render-utils';
import { VisualWrap } from '../util/visualmetadata-wrapper';
import { validate as validateQuery } from 'app/entities/visualmetadata/visualmetadata.reducer';
interface IVisualisationHeaderProps extends StateProps, DispatchProps {
  visual: IVisualMetadataSet;
  totalItem: number;
  handleVisualisationClick: (visualisation) => void;
  isEditMode: boolean;
  handleFlipClick: (isFlipped) => void;
  isFlipped: boolean;
}

const VisualisationHeader: FC<IVisualisationHeaderProps> = props => {
  const [transactionData, setTransactionData] = useState([]);
  const [intervalRegistry, setIntervalRegistry] = useState({});
  const [isLiveEnable, setLiveEnable] = useState(false);
  const csvLink = useRef(null);
  const { handleVisualisationClick, handleFlipClick } = props;

  const setLiveEnabled = () => {
    if (!isLiveEnable) {
      setLiveEnable(true);
      const intervalData = intervalRegistry;
      intervalData[props.visual.id] = setInterval(() => {
        getVisualisationData(props.sendEvent, props.visual, props.view, props.selectedFilters);
      }, 5000);
      setIntervalRegistry(intervalData);
    } else {
      clearInterval(intervalRegistry[props.visual.id]);
      setLiveEnable(false);
    }
  };

  // keep few icon hidden for time being

  const menuList = [
    {
      icon: <Edit size="M" />,
      actionId: '1',
      title: 'Edit',
      contentKey: 'canvas.menu.edit',
      isEditable: true,
      isVisible: false,
    },
    {
      icon: <Copy size="M" />,
      actionId: '2',
      title: 'Copy',
      contentKey: 'canvas.menu.copy',
      isEditable: true,
      isVisible: false,
    },
    {
      icon: <Delete size="M" />,
      actionId: '6',
      title: 'Delete',
      contentKey: 'canvas.menu.delete',
      isEditable: true,
      isVisible: false,
    },

    {
      icon: <ShareAndroid size="M" />,
      actionId: '9',
      title: 'Share',
      contentKey: 'canvas.menu.share',
      isVisible: true,
      isEditable: false,
    },
    {
      icon: <Refresh size="M" />,
      actionId: '8',
      title: 'Refresh',
      contentKey: 'canvas.menu.refresh',
      isVisible: true,
      isEditable: false,
    },
    // {
    //   icon: <ViewedMarkAs size="M" />,
    //   actionId: '3',
    //   title: 'View',
    //   contentKey: 'canvas.menu.view',
    //   isVisible: true,
    //   isEditable: false,
    // },
    {
      icon: <Table size="M" />,
      actionId: '4',
      title: 'Data',
      contentKey: 'canvas.menu.data',
      isVisible: true,
      isEditable: false,
    },
    // {
    //   icon: <MoreSmallListVert size="M" />,
    //   actionId: '5',
    //   title: 'Print',
    //   contentKey: 'canvas.menu.more',
    //   isVisible: true,
    //   isEditable: false,
    // },
    {
      icon: <Export size="M" />,
      actionId: '7',
      title: 'Export',
      contentKey: 'canvas.menu.export',
      isVisible: true,
      isEditable: false,
    },
  ];

  const setAction = {
    '1': {
      getAction() {
        props.setVisualisationAction('Edit');
      },
    },
    '2': {
      getAction() {
        props.setVisualisationAction('Copy');
        const viz = createVisualMetadata(props.visual.metadataVisual, props.view, props.totalItem);
        viz.bodyProperties = props.visual.bodyProperties;
        viz.properties = props.visual.properties;
        viz.titleProperties = props.visual.titleProperties;
        viz.fields = props.visual.fields;
        handleVisualisationClick(viz);
      },
    },
    '3': {
      getAction() {
        props.setVisualisationAction('View');
        getVisualisationData(props.sendEvent, props.visual, props.view, props.selectedFilters);
      },
    },
    '4': {
      getAction() {
        props.setVisualisationAction('Data');
      },
    },
    '5': {
      getAction() {
        props.setVisualisationAction('Print');
      },
    },
    '6': {
      getAction() {
        props.setVisualisationAction('Delete');
      },
    },
    '7': {
      getAction() {
        props.setVisualisationAction('Export');
        getTransactionData(props.visual.data, csvLink, setTransactionData);
      },
    },
    '8': {
      getAction() {
        props.setVisualisationAction('Refresh');
        getVisualisationData(props.sendEvent, props.visual, props.view, props.selectedFilters);
      },
    },
    '9': {
      getAction() {
        props.setVisualisationAction('Share');
      },
    },
  };

  const onActionMenu = key => {
    setAction[key].getAction();
    props.setVisual(props.visual);
  };

  const _validateQuery = () => {
    const wrap = VisualWrap(props.visual);
    props.validateQuery({
      datasourceId: props.view.viewDashboard.dashboardDatasource.id,
      visualMetadataId: props.visual.id,
      queryDTO: wrap.getQueryParameters(props.visual, {}, null, null),
    });
  };

  const handleApply = () => {
    _validateQuery();
    getVisualisationShareData(props.sendEvent, props.visual, props.view, props.selectedFilters);
    handleFlipClick(!props.isFlipped);
  };

  const handleSave = () => {
    props.updateVisualmetadataEntity({
      viewId: props.view.id,
      visualMetadata: props.visual,
    });
    props.metadataContainerUpdate(props.visualMetadataContainerList, props.visual.id, props.visual, 'id');
    handleFlipClick(!props.isFlipped);
  };

  const generateMenuElements = menuList.map(action => {
    if (props.isEditMode === action.isEditable || action.isVisible) {
      return (
        // functional component does not work with below code. it throws unknown element, proxy facade exception
        <Item key={action.actionId} textValue={translate(action.contentKey)}>
          {action.icon}
          <Text marginTop="size-25">
            <Translate contentKey={action.contentKey}>{action.title}</Translate>
          </Text>
        </Item>
      );
    } else {
      return null;
    }
  });

  return (
    <>
      <div
        style={{
          borderBottom: props.visual?.titleProperties?.borderBottom,
          backgroundColor: props.visual?.titleProperties?.backgroundColor
            ? props.visual?.titleProperties?.backgroundColor
            : `var(
            --spectrum-alias-background-color-gray-200,
            var(--spectrum-global-color-gray-200, var(--spectrum-semantic-gray-200-color-background))
          )`,
        }}
      >
        <Flex direction="row" justifyContent="space-between" alignContent="center">
          <Flex direction="column" alignItems="center" justifyContent="space-around">
            <span className={'chart-title'} style={{ color: props.visual?.titleProperties?.color }}>
              {props.visual?.titleProperties?.titleText}
            </span>
            {props.visual?.data?.length > 0 && (
              <CSVLink
                data={transactionData}
                filename={`${props.visual.titleProperties.titleText}.csv`}
                className="hidden"
                ref={csvLink}
                target="_blank"
              />
            )}
          </Flex>
          <Flex direction="row" justifyContent="space-around">
            <ActionButton
              height="size-300"
              isQuiet={true}
              onPress={setLiveEnabled}
              UNSAFE_className={isLiveEnable ? 'enable-live' : 'disable-live'}
            >
              <PlayCircle id={'live-icon'} size={'XS'} aria-label="Default Alert" />
            </ActionButton>
            {props.isEditMode && (
              <MenuTrigger>
                <ActionButton isQuiet height="size-300">
                  <Settings size={'XS'} aria-label="Default Alert" />
                </ActionButton>
                <Menu
                  onAction={key => {
                    onActionMenu(key);
                  }}
                >
                  {generateMenuElements}
                </Menu>
              </MenuTrigger>
            )}
            {props.isEditMode && (
              <ActionButton
                height="size-300"
                isQuiet={true}
                onPress={() => {
                  handleFlipClick(!props.isFlipped);
                }}
              >
                <Switch id={'switch'} size={'XS'} aria-label="Flip" />
              </ActionButton>
            )}

            {isRequiredFeatureEmpty(props.visual.fields) && props.isEditMode && props.isFlipped && (
              <React.Fragment>
                <ActionButton height="size-300" isQuiet={true} onPress={handleSave}>
                  <SaveFloppy id={'save'} size={'XS'} aria-label="Save" />
                </ActionButton>
                <ActionButton height="size-300" isQuiet={true} onPress={handleApply}>
                  <Hammer id={'hammer'} size={'XS'} aria-label="Hammer" />
                </ActionButton>
              </React.Fragment>
            )}
          </Flex>
        </Flex>
      </div>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  editAction: storeState.visualmetadata.editAction,
  visualMetadataContainerList: storeState.visualmetadata.visualMetadataContainerList,
  featuresList: storeState.feature.entities,
  selectedFilters: storeState.filter.selectedFilters,
  view: storeState.views.entity,
  filterData: storeState.visualisationData.filterData,
  sendEvent: storeState.visualisationData.sendEvent,
});

const mapDispatchToProps = {
  setVisualisationAction,
  setVisual,
  metadataContainerUpdate,
  updateVisualmetadataEntity,
  getVisualMetadataEntity,
  validateQuery,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationHeader);
