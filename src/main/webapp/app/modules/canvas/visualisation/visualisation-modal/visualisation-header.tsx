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
import { getVisualisationData } from '../util/visualisation-render-utils';
import { CSVLink } from 'react-csv';
import { IRootState } from 'app/shared/reducers';
import React, { FC, ReactText, useEffect, useRef, useState } from 'react';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { getTransactionData } from '../util/visualisation-utils';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { setVisualisationAction, setVisual } from 'app/entities/visualmetadata/visualmetadata.reducer';
import  {createVisualMetadata}  from './visualisation-edit-modal/visualisation-edit-modal-util';

interface IVisualisationHeaderProps extends StateProps, DispatchProps {
  visual: IVisualMetadataSet;
  totalItem: number;
  handleVisualisationClick: (visualisation) => void;
  isEditMode: boolean;
}

const VisualisationHeader: FC<IVisualisationHeaderProps> = props => {

  const [transactionData, setTransactionData] = useState([]);
  const [intervalRegistry, setIntervalRegistry] = useState({});
  const [isLiveEnable, setLiveEnable] = useState(false);
  const csvLink = useRef(null);
  const { handleVisualisationClick } = props;


  const setLiveEnabled = () => {
    if (!isLiveEnable) {
      setLiveEnable(true);
      const intervalData = intervalRegistry;
      intervalData[props.visual.id] = setInterval(() => {
        getVisualisationData(props.visual, props.view, props.selectedFilters);
      }, 5000);
      setIntervalRegistry(intervalData);
    } else {
      clearInterval(intervalRegistry[props.visual.id]);
      setLiveEnable(false);
    }
  };

  const setAction = {
    '1': {
      getAction() {
        props.setVisualisationAction('Edit');
      },
    },
    '2': {
      getAction() {
        props.setVisualisationAction('Copy');
        const viz = createVisualMetadata(props.visual.metadataVisual,props.view,props.totalItem);
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
        getVisualisationData(props.visual, props.view, props.selectedFilters);
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
        window.open(`export-visualisation?viewId=${props.view.id}&visualizationId=${props.visual.id}`);
      },
    },
    '8': {
      getAction() {
        props.setVisualisationAction('Refresh');
        getVisualisationData(props.visual, props.view, props.selectedFilters);
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
  return (
    <>
      <View backgroundColor="gray-200">
        <Flex direction="row" justifyContent="space-between" alignContent="center">
          <Flex direction="column" alignItems="center" justifyContent="space-around">
            <span className={'chart-title'}>{props.visual?.titleProperties?.titleText}</span>
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
              <Circle id={'live-icon'} size={'XS'} aria-label="Default Alert" />
            </ActionButton>
            <MenuTrigger>
              <ActionButton isQuiet height="size-300">
                <Settings size={'XS'} aria-label="Default Alert" />
              </ActionButton>

              {props.isEditMode ? (
                <Menu
                  onAction={key => {
                    onActionMenu(key);
                  }}
                >
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
                <Menu
                  onAction={key => {
                    onActionMenu(key);
                  }}
                >
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
          </Flex>
        </Flex>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  editAction: storeState.visualmetadata.editAction,
  featuresList: storeState.feature.entities,
  selectedFilters: storeState.filter.selectedFilters,
  view: storeState.views.entity,
  filterData: storeState.visualisationData.filterData,
});

const mapDispatchToProps = {
  setVisualisationAction,
  setVisual,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationHeader);
