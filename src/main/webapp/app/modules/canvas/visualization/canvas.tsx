import React, { ReactText, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, Text, Item, Menu, MenuTrigger, View, Button, DialogContainer } from '@adobe/react-spectrum';

import { Redirect, RouteComponentProps } from 'react-router-dom';
import RGL, { WidthProvider } from 'react-grid-layout';
import './canvas.scss';
import { getEntity as getViewEntity, getCurrentViewState, saveViewState } from 'app/entities/views/views.reducer';
import { getEntities as getVisualizationsEntities } from 'app/entities/visualizations/visualizations.reducer';
import { getEntities as getfeatureEntities } from 'app/entities/feature/feature.reducer';
import { IRootState } from 'app/shared/reducers';
import { Translate } from 'react-jhipster';
import { Storage } from 'react-jhipster';
import {
  createEntity as addVisualmetadataEntity,
  deleteEntity as deleteVisualmetadataEntity,
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import VisualizationsList from 'app/entities/visualizations/visualizations-list';
import { VisualWrap } from 'app/modules/canvas/visualization/util/visualmetadata-wrapper';
import { renderVisualization } from 'app/modules/canvas/visualization/util/visualization-render-utils';
import { connect as connectWebSocket, subscribe } from 'app/modules/canvas/visualization/util/stomp-client';
import VisualizationHeader from './visualization-modal/visualization-header';
import 'app/modules/canvas/visualization/canvas.scss';
import { IVisualMetadataSet } from 'app/shared/model/visualMetadata.model';

const ReactGridLayout = WidthProvider(RGL);
export interface VisualizationProp extends StateProps, DispatchProps, RouteComponentProps<{ dashboardId: string; viewId: string }> {}

const Canvas = (props: VisualizationProp) => {
  const [isVisualizationsModelOpen, setVisualizationsModelOpen] = useState(false);
  const [visualmetadataList, setvisualmetadata] = useState<IVisualMetadataSet[]>();

  const onLayoutChange = _visualmetaList => {
    props.visualmetadata.visualMetadataSet.map((item, i) => {
      (item.x = _visualmetaList[i].x),
        (item.y = _visualmetaList[i].y),
        (item.h = _visualmetaList[i].h),
        (item.w = _visualmetaList[i].w),
        (item.xPosition = _visualmetaList[i].x),
        (item.yPosition = _visualmetaList[i].y),
        (item.height = _visualmetaList[i].h),
        (item.width = _visualmetaList[i].w);
      VisualWrap(item);
      //renderVisualization(item, props.view);
    });
    //setvisualmetadata(_visualmetaList);
  };

  const onResize = _visualmetaList => {
    //  setvisualmetadata(_visualmetaList);
  };

  const onResizeStop = (layout, oldItem, newItem, placeholder, e, element) => {
    //  To do
  };

  const onExchangeMetadata = data => {
    debugger;
  };
  const onExchangeMetadataError = data => {
    debugger;
  };

  useEffect(() => {
    const token = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');

    connectWebSocket({ token: token }, frame => {
      console.log('flair-bi controller connected web socket');
      subscribe('/user/exchange/metaData', onExchangeMetadata);
      subscribe('/user/exchange/metaDataError', onExchangeMetadataError);
    });
    if (props.match.params.viewId) {
      props.getVisualizationsEntities();
      props.getViewEntity(props.match.params.viewId);
      props.getCurrentViewState(props.match.params.viewId);
    }
  }, []);

  useEffect(() => {
    if (props.visualmetadata?.visualMetadataSet?.length > 0) {
      props.visualmetadata.visualMetadataSet.map(item => {
        (item.x = item.xPosition), (item.y = item.yPosition), (item.h = item.height), (item.w = item.width);
      });
      setvisualmetadata(props.visualmetadata.visualMetadataSet);
    }
    if (props.isCreated) {
      //props.getCurrentViewState(props.match.params.viewId);
      props.visualmetadata.visualMetadataSet.push(props.visualmetadataEntity);
    }
  }, [props.visualmetadata, props.isCreated]);

  const handleVisualizationClick = v => {
    props.addVisualmetadataEntity({
      viewId: props.view.id,
      visualMetadata: v,
    });
    setVisualizationsModelOpen(false);
  };

  const saveAllVisualizations = () => {
    props.saveViewState({
      visualMetadataSet: props.visualmetadata.visualMetadataSet,
      _id: props.view.id,
    });
  };

  const generateWidge =
    visualmetadataList &&
    visualmetadataList.map(v => {
      return (
        <div
          className="item widget"
          id={`widget-${v.id}`}
          key={v.id}
          data-grid={{
            i: v.id,
            x: v.xPosition || 0,
            y: v.yPosition || 0,
            w: v.width,
            h: v.height,
            maxW: Infinity,
            maxH: Infinity,
            isBounded: true,
          }}
        >
          <div className="header">
            <VisualizationHeader
              key={v.id}
              visual={v}
              handleVisualizationClick={handleVisualizationClick}
              view={props.view}
              totalItem={visualmetadataList?.length || 0}
            ></VisualizationHeader>
          </div>
          <div id={`visualBody-${v.id}`}>{/* <VisualizationRender visual={v} ></VisualizationRender> */}</div>
        </div>
      );
    });

  return (
    <>
      <SecondaryHeader
        breadcrumbItems={[
          { label: 'Home', route: '/' },
          { label: 'Dashboards', route: '/dashboards' },
          { label: 'Views', route: `/dashboards/${props.view?.viewDashboard?.id}` },
          { label: 'Canvas', route: `/dashboards/${props.view?.viewDashboard?.id}/${props.view?.id}/build`  }
        ]}
        title={props.view.viewName}
      >
        <Button variant="cta" onPress={() => setVisualizationsModelOpen(true)}>
          <Translate contentKey="datastudioApp.visualizations.home.createLabel">Create visualizations</Translate>
        </Button>
        <Button variant="secondary" onPress={() => saveAllVisualizations()}>
          <Translate contentKey="entity.action.save">Save</Translate>
        </Button>
        <DialogContainer type="fullscreen" onDismiss={() => setVisualizationsModelOpen(false)} {...props}>
          {isVisualizationsModelOpen && (
            <VisualizationsList
              handleVisualizationClick={handleVisualizationClick}
              view={props.view}
              visualizations={props.visualizationsList}
              totalItem={visualmetadataList?.length || 0}
            />
          )}
        </DialogContainer>
      </SecondaryHeader>
      <View>
        {visualmetadataList && visualmetadataList.length > 0 && (
          <ReactGridLayout
            className="layout"
            rowHeight={120}
            cols={3}
            onResize={onResize}
            layout={visualmetadataList}
            margin={[15, 15]}
            verticalCompact={true}
            onLayoutChange={onLayoutChange}
            onResizeStop={onResizeStop}
            draggableHandle=".header"
            draggableCancel=".WidgetDragCancel"
          >
            {generateWidge}
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
  isCreated: storeState.visualmetadata.updateSuccess,
  visualizationsList: storeState.visualizations.entities,
  featuresList: storeState.feature.entities,
  visualmetadataEntity: storeState.visualmetadata.entity,
});

const mapDispatchToProps = {
  getViewEntity,
  getCurrentViewState,
  getVisualizationsEntities,
  getfeatureEntities,
  addVisualmetadataEntity,
  deleteVisualmetadataEntity,
  saveViewState,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
