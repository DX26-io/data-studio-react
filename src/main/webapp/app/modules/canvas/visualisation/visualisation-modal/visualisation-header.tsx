import './visualisation-header.scss';
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
import 'app/modules/canvas/visualisation/canvas.scss';
import { VisualWrap } from 'app/modules/canvas/visualisation/util/visualmetadata-wrapper';
import VisualisationEditModal from './visualisation-edit-modal/visualisation-edit-modal-popup';
import VisualisationsDeleteModal from './visualisation-delete-modal/visualisations-delete-modal'
import { getVisualisationData } from '../util/visualisation-render-utils';
import  VisualisationDataModal  from './visualisation-data-modal/visualisations-data-modal';
import { CSVLink } from 'react-csv';
import { IRootState } from 'app/shared/reducers';
import React, { FC, ReactText, useEffect, useRef, useState } from 'react';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getTransactionData } from '../util/visualisation-utils';
import VisualisationShareModal from './visualisation-share-modal/visualisation-share-modal';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { IViews } from 'app/shared/model/views.model';

interface IVisualisationHeaderProps extends StateProps, DispatchProps {
  visual: IVisualMetadataSet;
  // view: IViews;
  totalItem: number;
  handleVisualisationClick: (visualisation) => void;
  isEditMode: boolean;
  // filterData: any;
}

const VisualisationHeader: FC<IVisualisationHeaderProps> = props => {
  const [transactionData, setTransactionData] = useState([]);
  const [intervalRegistry, setIntervalRegistry] = useState({});
  const [isLiveEnable, setLiveEnable] = useState(false)
  const [action, setMenuAction] = useState('')



  const csvLink = useRef(null);
  const { handleVisualisationClick } = props;
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

  const createVisualMetadata = visualisation => {
    let newVM = {
      isCardRevealed: true,
      isSaved: false,
      viewId: props.view.id,
      titleProperties: {
        titleText: visualisation.name,
        backgroundColor: '#fafafa',
        borderBottom: 'none',
        color: '#676a6c',
      },
      bodyProperties: {
        opacity: 1,
        backgroundColor: `var(--spectrum-global-color-static-gray-50)`,
        border: 'none',
      },
      visualBuildId: visualisation.id + 'a' + Math.round(Math.random() * 1000000),
      width: 1,
      w: 1,
      xPosition: (props.totalItem * 2) % (3 || 12),
      x: (props.totalItem * 2) % (3 || 12),
      height: 3,
      h: 3,
      yPosition: 1000,
      y: 1000,
      metadataVisual: visualisation,
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
      getVisualisationData(visual, props.view, props.filter);
    }
  };

  const setLiveEnabled = () => {
    if (!isLiveEnable) {
      setLiveEnable(true);
      const intervalData = intervalRegistry;
      intervalData[props.visual.id] = setInterval(() => {
        getVisualisationData(props.visual, props.view, props.filter)
      }, 5000)
      setIntervalRegistry(intervalData);
    } else {
      clearInterval(intervalRegistry[props.visual.id]);
      setLiveEnable(false)
    }
  }

  const setAction = {
    '1': {
      getAction() {
        setMenuAction('Edit')
      },
    },
    '2': {
      getAction() {
        setMenuAction('Copy')
        const viz = createVisualMetadata(props.visual.metadataVisual);
        viz.bodyProperties = props.visual.bodyProperties;
        viz.properties = props.visual.properties;
        viz.titleProperties = props.visual.titleProperties;
        viz.fields = props.visual.fields;
        handleVisualisationClick(viz);
      },
    },
    '3': {
      getAction() {
        setMenuAction('View')
        getVisualisationData(props.visual, props.view, props.filter);
      },
    },
    '4': {
      getAction() {
        setMenuAction('Data')
      },
    },
    '5': {
      getAction() {
        setMenuAction('Print')
      },
    },
    '6': {
      getAction() {
        setMenuAction('Delete')
      },
    },
    '7': {
      getAction() {
        setMenuAction('Export')
        getTransactionData(props.visual.data, csvLink, setTransactionData);
        window.open(`export-visualisation?viewId=${props.view.id}&visualizationId=${props.visual.id}`);
      },
    },
    '8': {
      getAction() {
        setMenuAction('Refresh')
        getVisualisationData(props.visual, props.view, props.filter);
      },
    },
    '9': {
      getAction() {
        setMenuAction('Share')
      },
    },
  };
  return (
    <>
      <View backgroundColor="gray-200">
        <Flex direction="row" justifyContent="space-between" alignContent="center">
          <Flex direction="column" alignItems="center" justifyContent="space-around">
            <span className={"chart-title"}>{props.visual?.titleProperties?.titleText}</span>
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
            <ActionButton height="size-300" isQuiet={true} onPress={setLiveEnabled} UNSAFE_className={isLiveEnable ? "enable-live" : "disable-live"}>
              <Circle id={"live-icon"} size={'XS'} aria-label="Default Alert" />
            </ActionButton>
            <MenuTrigger>
              <ActionButton isQuiet height="size-300" >
                <Settings size={'XS'} aria-label="Default Alert" />
              </ActionButton>

              {props.isEditMode ? (
                <Menu onAction={(key) => {
                  setAction[key].getAction();
                }}>
                  <Item key="1" textValue="Edit">
                    <Edit size="M" />
                    <Text>
                      <Translate contentKey="canvas.menu.edit">Edit</Translate>
                    </Text>
                  </Item>

                  <Item key="2" textValue="Copy">
                    <Copy size="M" />
                    <Text>
                      <Translate contentKey="canvas.menu.copy">Copy</Translate>
                    </Text>
                  </Item>

                  <Item key="3" textValue="View">
                    <ViewedMarkAs size="M" />
                    <Text>
                      <Translate contentKey="canvas.menu.view">View</Translate>
                    </Text>
                  </Item>
                  <Item key="4" textValue="Data">
                    <Table size="M" />
                    <Text>
                      <Translate contentKey="canvas.menu.data">Data</Translate>
                    </Text>
                  </Item>
                  <Item key="5" textValue="Print">
                    <MoreSmallListVert size="M" />
                    <Text>
                      <Translate contentKey="canvas.menu.more">Print</Translate>
                    </Text>
                  </Item>
                  <Item key="6" textValue="Delete">
                    <Delete size="M" />
                    <Text>
                      <Translate contentKey="canvas.menu.delete">Delete</Translate>
                    </Text>
                  </Item>
                  <Item key="7" textValue="Export">
                    <Export size="M" />
                    <Text>
                      <Translate contentKey="canvas.menu.export">Export</Translate>
                    </Text>
                  </Item>
                  <Item key="8" textValue="Refresh">
                    <Refresh size="M" />
                    <Text>
                      <Translate contentKey="canvas.menu.refresh">Refresh</Translate>
                    </Text>
                  </Item>
                </Menu>
              ) : (
                <Menu onAction={(key) => { setAction[key].getAction(); }}>
                  <Item key="9" textValue="Share">
                    <ShareAndroid size="M" />
                    <Text>
                      <Translate contentKey="canvas.menu.share">Share</Translate>
                    </Text>
                  </Item>
                  <Item key="7" textValue="Export">
                    <Export size="M" />
                    <Text>
                      <Translate contentKey="canvas.menu.export">Export</Translate>
                    </Text>
                  </Item>
                  <Item key="3" textValue="View">
                    <ViewedMarkAs size="M" />
                    <Text>
                      <Translate contentKey="canvas.menu.view">View</Translate>
                    </Text>
                  </Item>
                  <Item key="5" textValue="Print">
                    <MoreSmallListVert size="M" />
                    <Text>
                      <Translate contentKey="canvas.menu.more">Print</Translate>
                    </Text>
                  </Item>
                  <Item key="4" textValue="Data">
                    <Table size="M" />
                    <Text>
                      <Translate contentKey="canvas.menu.data">Data</Translate>
                    </Text>
                  </Item>
                  <Item key="8" textValue="Refresh">
                    <Refresh size="M" />
                    <Text>
                      <Translate contentKey="canvas.menu.refresh">Refresh</Translate>
                    </Text>
                  </Item>
                </Menu>
              )}
            </MenuTrigger>

            {action === 'Delete' && (
              <VisualisationsDeleteModal visualisationId={props.visual.id} viewId={props.view.id}
                setOpen={() => setMenuAction(null)}
                match={null}
                history={null}
                location={null} />
            )}
            <DialogContainer type={action === 'Edit' ? 'fullscreenTakeover' : 'fullscreen'} onDismiss={() => setMenuAction(null)}>
              {action === 'Edit' && (
                <VisualisationEditModal
                  id={props.view.viewDashboard.id}
                  setOpen={closeEditDialog}
                  // viewId={props.view.id}
                  visualisationId={props.visual.id}
                  // filterData={props.filterData}
                  // {...props}
                ></VisualisationEditModal>
              )}
              {action === 'Data' && <VisualisationDataModal visual={props.visual} />}
            </DialogContainer>

            <DialogContainer onDismiss={() => setMenuAction(null)}>
              {action === 'Share' && <VisualisationShareModal view={props.view} visual={props.visual} />}
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
  filterData: storeState.visualisationData.filterData,
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationHeader);
