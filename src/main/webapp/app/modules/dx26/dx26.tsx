import React, { ReactText, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  ActionButton,
  Flex,
  Text,
  Item,
  Menu,
  MenuTrigger,
  View,
  Button,
  DialogContainer,
  DialogTrigger,
  Heading,
  Dialog,
  Content,
  Divider,
} from '@adobe/react-spectrum';

import { Redirect, RouteComponentProps } from 'react-router-dom';
import RGL, { WidthProvider } from 'react-grid-layout';
import './grid.css';
import ViewedMarkAs from '@spectrum-icons/workflow/ViewedMarkAs';
import { getEntity as getViewEntity, getCurrentViewState } from '../../entities/views/views.reducer';
import { getEntities as getVisualizationsEntities } from '../../entities/visualizations/visualizations.reducer';

import Settings from '@spectrum-icons/workflow/Settings';
import Export from '@spectrum-icons/workflow/Export';
import ShareAndroid from '@spectrum-icons/workflow/ShareAndroid';
import Delete from '@spectrum-icons/workflow/Delete';
import Edit from '@spectrum-icons/workflow/Edit';
import Table from '@spectrum-icons/workflow/Table';
import MoreSmallListVert from '@spectrum-icons/workflow/MoreSmallListVert';
import { IRootState } from 'app/shared/reducers';
import clusteredverticalbar from 'flair-visualizations/js/charts/clusteredverticalbar';
import { Translate } from 'react-jhipster';

import $ from 'jquery';
import { Visualizations } from 'app/entities/visualizations/visualizations';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import VisualizationsList from 'app/entities/visualizations/visualizations-list';

const ReactGridLayout = WidthProvider(RGL);
export interface IDx26Prop extends StateProps, DispatchProps, RouteComponentProps<{ dashboardId: string; viewId: string }> {}

const Dx26 = (props: IDx26Prop) => {
  // const [visualmetaList, setvisualmetadata] = useState(props.visualmetadata);
  const [redirect, setRedirect] = useState<ReactText>('');
  const [isVisualizationsModelOpen, setVisualizationsModelOpen] = useState(false);

  const onLayoutChange = (_visualmetaList, all) => {
    //  setvisualmetadata(_visualmetaList);
  };

  const onResize = _visualmetaList => {
    //  setvisualmetadata(_visualmetaList);
  };

  const onResizeStop = (layout, oldItem, newItem, placeholder, e, element) => {
    //  To do
  };

  useEffect(() => {
    if (props.match.params.viewId) {
      props.getVisualizationsEntities();
      props.getViewEntity(props.match.params.viewId);
      props.getCurrentViewState(props.match.params.viewId);
    }
  }, []);

  const handleVisualizationClick = (v)=>{
    props.visualmetadata.visualMetadataSet.push(v);
    setVisualizationsModelOpen(false);
  }

  const generateWidge = () => {
    return props.visualmetadata.visualMetadataSet.map(function (v, i) {
      return (
        <div
          className="item widget"
          id={`widget-${i}`}
          key={i}
          data-grid={{ x: v.xPosition, y: v.yPosition, w: 1, h: 3, maxW: 2, maxH: Infinity, isBounded: true }}
        >
          <div className="header">
            <View backgroundColor="gray-200">
              <Flex direction="row" justifyContent="space-between" alignContent="center">
                <Flex direction="column" alignItems="center" justifyContent="space-around">
                  <span>{v.titleProperties.titleText}</span>
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
                  {redirect === 'Edit' && (
                    <Redirect
                      to={{
                        pathname: '/dashboards/' + props.view.viewDashboard.id + '/' + props.view.id + '/edit/' + v.id,
                      }}
                    />
                  )}
                </Flex>
              </Flex>
            </View>
          </div>
          <div id={`demo-${i}`}>{v.titleProperties.titleText}</div>
        </div>
      );
    });
  };

  return (
    <>
      <SecondaryHeader
        breadcrumbItems={[
          { label: 'Home', route: '/' },
          { label: 'Dashboards', route: '/dashboards' },
        ]}
        title={'DASHBOARDS_TITLE'}
      >
        <Button variant="cta" onPress={() => setVisualizationsModelOpen(true)}>
          <Translate contentKey="views.home.createLabel">Create visualizations</Translate>
        </Button>
        <DialogContainer type="fullscreen" onDismiss={() => setVisualizationsModelOpen(false)} {...props}>
          {isVisualizationsModelOpen && <VisualizationsList handleVisualizationClick={handleVisualizationClick} view={props.view} visualizations={props.visualizationsList} />}
        </DialogContainer>
      </SecondaryHeader>
      <View borderWidth="thin" borderColor="default" borderRadius="regular">
        {props.visualmetadata && props.visualmetadata?.visualMetadataSet?.length > 0 && (
          <ReactGridLayout
            className="layout"
            rowHeight={120}
            cols={3}
            onResize={onResize}
            layout={props.visualmetadata.visualMetadataSet}
            margin={[15, 15]}
            verticalCompact={true}
            onLayoutChange={onLayoutChange}
            onResizeStop={onResizeStop}
            draggableHandle=".header"
            draggableCancel=".WidgetDragCancel"
          >
            {generateWidge()}
          </ReactGridLayout>
        )}
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
  visualmetadata: storeState.views.viewState,
  visualizationsList: storeState.visualizations.entities,
});

const mapDispatchToProps = { getViewEntity, getCurrentViewState, getVisualizationsEntities };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dx26);
