import React, { ReactText, useEffect, useState } from 'react';
import {
  ActionButton,
  DialogContainer,
  Flex,
  Item,
  Menu,
  MenuTrigger,
  Section,
  Text,
  Tooltip,
  TooltipTrigger,
  View,
} from '@adobe/react-spectrum';
import MoreSmallListVert from '@spectrum-icons/workflow/MoreSmallListVert';
import InfoOutline from '@spectrum-icons/workflow/InfoOutline';
import { Translate } from 'react-jhipster';
import { Redirect } from 'react-router-dom';
import { IVisualMetadataSet } from 'app/shared/model/visualMetadata.model';
import Settings from '@spectrum-icons/workflow/Settings';
import Edit from '@spectrum-icons/workflow/Edit';
import ShareAndroid from '@spectrum-icons/workflow/ShareAndroid';
import Export from '@spectrum-icons/workflow/Export';
import ViewedMarkAs from '@spectrum-icons/workflow/ViewedMarkAs';
import Table from '@spectrum-icons/workflow/Table';
import Delete from '@spectrum-icons/workflow/Delete';
import Copy from '@spectrum-icons/workflow/Copy';

import 'app/modules/canvas/visualization/canvas.scss';
import { IViews } from 'app/shared/model/views.model';
import { VisualWrap } from 'app/modules/canvas/visualization/util/visualmetadata-wrapper';
import { VisualMetadataContainerAdd } from '../util/visualmetadata-container.service';
import { VisualizationEditModal } from './visualization-edit-modal/visualization-edit-modal-popup';
import { getVisual } from '../util/VisualDispatchService';
import { getVisualizationData } from '../util/visualization-render-utils';

interface IVisualizationHeaderProps {
  visual: IVisualMetadataSet;
  view: IViews;
  totalItem: number;
  handleVisualizationClick: (visualization) => void;
}

const VisualizationHeader: React.FC<IVisualizationHeaderProps> = props => {
  const [redirect, setRedirect] = useState<ReactText>('');
  const [isOpen, setOpen] = useState(false);

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
        backgroundColor: '#ffffff',
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

  const closeDialog = () => {
    const visual = getVisual();
    setOpen(false);
    getVisualizationData(visual, props.view)
  };
  useEffect(() => {
    if (redirect === 'Copy') {
      const viz = createVisualMetadata(props.visual.metadataVisual);
      viz.bodyProperties = props.visual.bodyProperties;
      viz.properties = props.visual.properties;
      viz.titleProperties = props.visual.titleProperties;
      viz.fields = props.visual.fields;
      handleVisualizationClick(viz);
    }
    if (redirect === 'Edit') {
      setOpen(true);
    }
  }, [redirect]);
  return (
    <>
      <DialogContainer type="fullscreenTakeover" onDismiss={closeDialog}>
        {isOpen && (
          <VisualizationEditModal
            id={props.view.viewDashboard.id}
            setOpen={setOpen}
            viewId={props.view.id}
            visualizationId={props.visual.id}
            {...props}
          ></VisualizationEditModal>
        )}
      </DialogContainer>
      <View backgroundColor="gray-200">
        <Flex direction="row" justifyContent="space-between" alignContent="center">
          <Flex direction="column" alignItems="center" justifyContent="space-around">
            <span>{props.visual.titleProperties.titleText}</span>
          </Flex>
          <Flex direction="column" justifyContent="space-around">
            <MenuTrigger>
              <ActionButton isQuiet height="size-300">
                <Settings size={'XS'} aria-label="Default Alert" />
              </ActionButton>
              <Menu onAction={key => setRedirect(key)}>
                <Item key="Edit" textValue="Edit">
                  <Edit size="M" />
                  <Text>
                    <Translate contentKey="entity.action.edit">Edit</Translate>
                  </Text>
                </Item>
                <Item key="Share" textValue="Share">
                  <ShareAndroid size="M" />
                  <Text>
                    <Translate contentKey="entity.action.share">Share</Translate>
                  </Text>
                </Item>
                <Item key="Copy" textValue="Copy">
                  <Copy size="M" />
                  <Text>
                    <Translate contentKey="entity.action.copy">Copy</Translate>
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
                <Item key="data" textValue="data">
                  <Table size="M" />
                  <Text>
                    <Translate contentKey="entity.action.data">Data</Translate>
                  </Text>
                </Item>
                <Item key="More" textValue="More">
                  <MoreSmallListVert size="M" />
                  <Text>
                    <Translate contentKey="entity.action.more">More</Translate>
                  </Text>
                </Item>
                <Item key="Delete" textValue="Delete">
                  <Delete size="M" />
                  <Text>
                    <Translate contentKey="entity.action.delete">Delete</Translate>
                  </Text>
                </Item>
              </Menu>
            </MenuTrigger>
            {/* open with modal popup */}
            {/* {redirect === 'Edit' && (
              <Redirect
                push={true}
                to={{
                  pathname: '/dashboards/' + props.view.viewDashboard.id + '/' + props.view.id + '/edit/' + props.visual.id,
                }}
              />
            )} */}
            {redirect === 'Delete' && (
              <Redirect
                to={{
                  pathname: '/dashboards/' + props.view.viewDashboard.id + '/' + props.view.id + '/delete/' + props.visual.id,
                }}
              />
            )}
          </Flex>
        </Flex>
      </View>
    </>
  );
};

export default VisualizationHeader;
