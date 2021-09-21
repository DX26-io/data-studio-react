import './visualizationHeader.scss';
import { ActionButton, Button, DialogContainer, Flex, Item, Menu, MenuTrigger, Text, View } from '@adobe/react-spectrum';
import Circle from '@spectrum-icons/workflow/Circle';
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
import 'app/modules/canvas/visualization/canvas.scss';
import { VisualWrap } from 'app/modules/canvas/visualization/util/visualmetadata-wrapper';
import { IViews } from 'app/shared/model/views.model';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { IRootState } from 'app/shared/reducers';
import React, { FC, ReactText, useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getVisualizationData } from '../util/visualization-render-utils';
import { getTransactionData } from '../util/visualization-utils';
import { VisualizationDataModal } from './visualization-data-modal/visualizations-data-modal';
import VisualizationEditModal from './visualization-edit-modal/visualization-edit-modal-popup';
import { VisualizationShareModal } from './visualization-share-modal/visualization-share-modal';

interface IVisualizationHeaderProps extends StateProps, DispatchProps {
  visual: IVisualMetadataSet;
  view: IViews;
  totalItem: number;
  handleVisualizationClick: (visualization) => void;
  isEditMode: boolean;
  filterData: any;
}

const VisualizationHeader: FC<IVisualizationHeaderProps> = props => {
  const [dialog, setDialog] = useState<ReactText>();
  const [transactionData, setTransactionData] = useState([]);
  const [intervalRegistry, setIntervalRegistry] = useState({});
  const [isLiveEnable, setLiveEnable] = useState(false)

  const csvLink = useRef(null);
  const { handleVisualizationClick } = props;
  const createFields = newVM => {
    // let order = 0;
    newVM.fields = newVM.metadataVisual.fieldTypes
      .filter(function (item) {
        return item.constraint === 'REQUIRED';
      })
      .map(function (item) {
        return {
          fieldType: item,
          feature: null,
          constraint: item.constraint,
        };
      });

    return newVM;
  };

  const createProperties = newVM => {
    newVM.properties = newVM.metadataVisual.propertyTypes.map(function (item) {
      return {
        propertyType: item.propertyType,
        value: item.propertyType.defaultValue,
        order: item.order,
        type: item.propertyType.type,
      };
    });
    return newVM;
  };

  const createVisualMetadata = visualization => {
    let newVM = {
      isCardRevealed: true,
      isSaved: false,
      viewId: props.view.id,
      titleProperties: {
        titleText: visualization.name,
        backgroundColor: '#fafafa',
        borderBottom: 'none',
        color: '#676a6c',
      },
      bodyProperties: {
        opacity: 1,
        backgroundColor: `var(--spectrum-global-color-static-gray-50)`,
        border: 'none',
      },
      visualBuildId: visualization.id + 'a' + Math.round(Math.random() * 1000000),
      width: 1,
      w: 1,
      xPosition: (props.totalItem * 2) % (3 || 12),
      x: (props.totalItem * 2) % (3 || 12),
      height: 3,
      h: 3,
      yPosition: 1000,
      y: 1000,
      metadataVisual: visualization,
      views: props.view,
      datasource: props.view.viewDashboard.dashboardDatasource.id,
    };
    newVM = createProperties(newVM);
    newVM = createFields(newVM);
    return VisualWrap(newVM);
  };

  const closeEditDialog = () => {
    if (props.editAction === 'save') {
      const visual = props.visual;
      getVisualizationData(visual, props.view, props.filter);
    }
  };

  const setLiveEnabled = () => {
    if (!isLiveEnable) {
      setLiveEnable(true);
      const intervalData = intervalRegistry;
      intervalData[props.visual.id] = setInterval(() => {
        getVisualizationData(props.visual, props.view, props.filter)
      }, 5000)
      setIntervalRegistry(intervalData);
    } else {
      clearInterval(intervalRegistry[props.visual.id]);
      setLiveEnable(false)
    }
  }

  useEffect(() => {
    if (dialog === 'Copy') {
      const viz = createVisualMetadata(props.visual.metadataVisual);
      viz.bodyProperties = props.visual.bodyProperties;
      viz.properties = props.visual.properties;
      viz.titleProperties = props.visual.titleProperties;
      viz.fields = props.visual.fields;
      handleVisualizationClick(viz);
    } else if (dialog === 'Export') {
      getTransactionData(props.visual.data, csvLink, setTransactionData);
    } else if (dialog === 'Refresh') {
      getVisualizationData(props.visual, props.view, props.filter);
    }
  }, [dialog]);
  return (
    <>
      <View backgroundColor="gray-200">
        <Flex direction="row" justifyContent="space-between" alignContent="center">
          <Flex direction="column" alignItems="center" justifyContent="space-around">
            <span>{props.visual?.titleProperties?.titleText}</span>
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
            <ActionButton height="size-300" isQuiet={true} onPress={setLiveEnabled} UNSAFE_className={isLiveEnable ? "enableLive" : "disableLive"}>
              <Circle size={'XS'} aria-label="Default Alert" />
            </ActionButton>
            <MenuTrigger>
              <ActionButton isQuiet height="size-300" >
                <Settings size={'XS'} aria-label="Default Alert" />
              </ActionButton>

              {props.isEditMode ? (
                <Menu onAction={key => setDialog(key)}>
                  <Item key="Edit" textValue="Edit">
                    <Edit size="M" />
                    <Text>
                      <Translate contentKey="entity.action.edit">Edit</Translate>
                    </Text>
                  </Item>

                  <Item key="Copy" textValue="Copy">
                    <Copy size="M" />
                    <Text>
                      <Translate contentKey="entity.action.copy">Copy</Translate>
                    </Text>
                  </Item>

                  <Item key="View" textValue="View">
                    <ViewedMarkAs size="M" />
                    <Text>
                      <Translate contentKey="entity.action.view">View</Translate>
                    </Text>
                  </Item>
                  <Item key="Data" textValue="Data">
                    <Table size="M" />
                    <Text>
                      <Translate contentKey="entity.action.data">Data</Translate>
                    </Text>
                  </Item>
                  <Item key="Print" textValue="Print">
                    <MoreSmallListVert size="M" />
                    <Text>
                      <Translate contentKey="entity.action.more">Print</Translate>
                    </Text>
                  </Item>
                  <Item key="Delete" textValue="Delete">
                    <Delete size="M" />
                    <Text>
                      <Translate contentKey="entity.action.delete">Delete</Translate>
                    </Text>
                  </Item>
                  <Item key="Export" textValue="Export">
                    <Export size="M" />
                    <Text>
                      <Translate contentKey="entity.action.export">Export</Translate>
                    </Text>
                  </Item>
                  <Item key="Refresh" textValue="Refresh">
                    <Refresh size="M" />
                    <Text>
                      <Translate contentKey="entity.action.refresh">Refresh</Translate>
                    </Text>
                  </Item>
                </Menu>
              ) : (
                <Menu onAction={key => setDialog(key)}>
                  <Item key="Share" textValue="Share">
                    <ShareAndroid size="M" />
                    <Text>
                      <Translate contentKey="entity.action.share">Share</Translate>
                    </Text>
                  </Item>
                  <Item key="Export" textValue="Export">
                    <Export size="M" />
                    <Text>
                      <Translate contentKey="entity.action.export">Export</Translate>
                    </Text>
                  </Item>
                  <Item key="View" textValue="View">
                    <ViewedMarkAs size="M" />
                    <Text>
                      <Translate contentKey="entity.action.view">View</Translate>
                    </Text>
                  </Item>
                  <Item key="Print" textValue="Print">
                    <MoreSmallListVert size="M" />
                    <Text>
                      <Translate contentKey="entity.action.more">Print</Translate>
                    </Text>
                  </Item>
                  <Item key="Data" textValue="Data">
                    <Table size="M" />
                    <Text>
                      <Translate contentKey="entity.action.data">Data</Translate>
                    </Text>
                  </Item>
                  <Item key="Refresh" textValue="Refresh">
                    <Refresh size="M" />
                    <Text>
                      <Translate contentKey="entity.action.refresh">Refresh</Translate>
                    </Text>
                  </Item>
                </Menu>
              )}
            </MenuTrigger>

            {dialog === 'Delete' && (
              <Redirect
                to={{
                  pathname: '/dashboards/' + props.view.viewDashboard.id + '/' + props.view.id + '/delete/' + props.visual.id,
                }}
              />
            )}
            <DialogContainer type={dialog === 'Edit' ? 'fullscreenTakeover' : 'fullscreen'} onDismiss={() => setDialog(null)}>
              {dialog === 'Edit' && (
                <VisualizationEditModal
                  id={props.view.viewDashboard.id}
                  setOpen={closeEditDialog}
                  viewId={props.view.id}
                  visualizationId={props.visual.id}
                  filterData={props.filterData}
                  {...props}
                ></VisualizationEditModal>
              )}
              {dialog === 'Data' && <VisualizationDataModal visual={props.visual} />}
            </DialogContainer>

            <DialogContainer onDismiss={() => setDialog(null)}>
              {dialog === 'Share' && <VisualizationShareModal view={props.view} visual={props.visual} />}
            </DialogContainer>
          </Flex>
        </Flex>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  editAction: storeState.visualmetadata.editAction,
  featuresList: storeState.feature.entities,
  filter: storeState.filter.selectedFilters,
  view: storeState.views.entity,
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationHeader);
