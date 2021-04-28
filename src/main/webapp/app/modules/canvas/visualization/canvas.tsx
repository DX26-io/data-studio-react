import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { View } from '@adobe/react-spectrum';
import $ from 'jquery';
import { RouteComponentProps } from 'react-router-dom';
import RGL, { WidthProvider } from 'react-grid-layout';
import './canvas.scss';
import { getEntity as getViewEntity, getCurrentViewState, saveViewState } from 'app/entities/views/views.reducer';
import { getEntities as getVisualizationsEntities } from 'app/entities/visualizations/visualizations.reducer';
import { getEntities as getfeatureEntities, getViewFeaturesEntities } from 'app/entities/feature/feature.reducer';
import { IRootState } from 'app/shared/reducers';
import {
  createEntity as addVisualmetadataEntity,
  deleteEntity as deleteVisualmetadataEntity,
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import {
  getVisualizationData,
  renderVisualization,
  ValidateFields,
} from 'app/modules/canvas/visualization/util/visualization-render-utils';
import {
  VisualMetadataContainerAdd,
  VisualMetadataContainerGetOne,
} from 'app/modules/canvas/visualization/util/visualmetadata-container.service';
import {
  getEntity as getVisualmetadataEntity,
  updateEntity as updateVisualmetadataEntity,
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import { connectWebSocket, subscribeWebSocket } from 'app/shared/websocket/stomp-client.service';
import VisualizationHeader from './visualization-modal/visualization-header';
import 'app/modules/canvas/visualization/canvas.scss';
import { IVisualMetadataSet } from 'app/shared/model/visualMetadata.model';
import { getToken } from 'app/shared/reducers/authentication';
import { NoDataFoundPlaceHolder } from 'app/shared/components/placeholder/placeholder';
import Loader from 'app/shared/components/card/loader/loader';
import FilterPanel from 'app/modules/canvas/filter/filter-panel';
import CanvasFilterHeader from 'app/shared/layout/header/canvas-filter-header';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
const ReactGridLayout = WidthProvider(RGL);

export interface VisualizationProp extends StateProps, DispatchProps, RouteComponentProps<{ dashboardId: string; viewId: string }> {}

const Canvas = (props: VisualizationProp) => {
  const [isVisualizationsModelOpen, setVisualizationsModelOpen] = useState(false);
  const [isSocketConnaction, setSocketConnaction] = useState(false);
  const [visualmetadataList, setvisualmetadata] = useState<IVisualMetadataSet[]>();

  const [filters, setFilters] = useState<string[]>();

  useEffect(() => {
    if (props.selectedFilter) {
      const filterList = Object.keys(props.selectedFilter);
      setFilters(filterList);
    }
  }, [props.selectedFilter]);

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
    });
  };

  const onResizeStop = (layout, oldItem, newItem, placeholder, e, element) => {
    const v = VisualMetadataContainerGetOne(oldItem.i);
    if (v && v.data?.length > 0) {
      renderVisualization(v, v.data);
    }
  };

  const onExchangeMetadataError = data => {
    const body = JSON.parse(data.body || '{}');
    // console.log('received error=' + body);
  };

  const onExchangeMetadata = data => {
    const metaData = data.body === '' ? { data: [] } : JSON.parse(data.body);
    if (data.headers.request === 'filters') {
      const obj = metaData.data[0];
      let dimensionName = '';
      for (const i in obj) {
        dimensionName = i;
        break;
      }
      const retVal = metaData.data.map(function (item) {
        return {
          value: item[dimensionName],
          label: item[dimensionName],
        };
      });
      props.filterData[dimensionName] = retVal;
    } else {
      const v = VisualMetadataContainerGetOne(data.headers.queryId);
      if (v && metaData.data.length > 0) {
        v.data = metaData.data;
        $(`.loader-${v.id}`).hide();
        $(`.dataNotFound-${v.id}`).hide();
        renderVisualization(v, metaData.data);
      } else {
        $(`.dataNotFound-${v.id}`).show();
        $(`.loader-${v.id}`).hide();
      }
    }
  };

  const renderVisualizationById = item => {
    if (ValidateFields(item.fields)) {
      getVisualizationData(item, props.view);
    } else {
      $(`.loader-${item.id}`).hide();
    }
  };

  const loadVisualization = () => {
    props.visualmetadata.visualMetadataSet.map((item, i) => {
      renderVisualizationById(item);
    });
  };
  const connectWeb = () => {
    connectWebSocket({ token: getToken() }, function (frame) {
      // console.log(' connected web socket');
      subscribeWebSocket('/user/exchange/metaData', onExchangeMetadata);
      subscribeWebSocket('/user/exchange/metaDataError', onExchangeMetadataError);
      setSocketConnaction(true);
      VisualMetadataContainerAdd(props.visualmetadata?.visualMetadataSet);
      loadVisualization();
    });
  };

  useEffect(() => {
    if (props.match.params.viewId) {
      props.getVisualizationsEntities();
      props.getViewEntity(props.match.params.viewId);
      props.getCurrentViewState(props.match.params.viewId);
    }
  }, []);

  useEffect(() => {
    if (props.visualmetadata?.visualMetadataSet?.length > 0) {
      if (!isSocketConnaction) {
        connectWeb();
      }
      props.visualmetadata.visualMetadataSet.map(item => {
        (item.x = item.xPosition), (item.y = item.yPosition), (item.h = item.height), (item.w = item.width);
      });
      setvisualmetadata(props.visualmetadata.visualMetadataSet);
    }
    if (props.isCreated) {
      const visualMetadata = VisualMetadataContainerAdd(props.visualmetadataEntity);
      setvisualmetadata(visualMetadata);
      renderVisualizationById(props.visualmetadataEntity);
    }
  }, [props.visualmetadata, props.isCreated, isSocketConnaction, props.visualmetadataEntity]);

  const handleVisualizationClick = v => {
    props.addVisualmetadataEntity({
      viewId: props.view.id,
      visualMetadata: v,
    });
    setVisualizationsModelOpen(false);
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
              filterData={props.filterData}
              {...props}
            ></VisualizationHeader>
          </div>
          <div style={{backgroundColor: v.bodyProperties.backgroundColor}} className="visualBody" id={`visualBody-${v.id}`}>
            <div className="illustrate">
              <div className={`loader loader-${v.id}`}>
                <Loader />
              </div>
              <div className={`dataNotFound dataNotFound-${v.id}`}>
                <NoDataFoundPlaceHolder />
              </div>
            </div>
            <div id={`visualization-${v.id}`} className="visualization"></div>
          </div>
        </div>
      );
    });

  return (
    <>
      {isSocketConnaction && <FilterPanel />}
      {isSocketConnaction && <FeaturesPanel />}
      <View>
        <CanvasFilterHeader />
      </View>
      <View>
        {visualmetadataList && visualmetadataList.length > 0 && (
          <ReactGridLayout
            className="layout"
            rowHeight={120}
            cols={3}
            layout={visualmetadataList}
            margin={[15, 15]}
            verticalCompact={true}
            onLayoutChange={onLayoutChange}
            onResizeStop={onResizeStop}
            draggableHandle=".header"
            draggableCancel=".WidgetDragCancel"
            isBounded={false}
            isDraggable={props.isEditMode}
            isResizable={props.isEditMode}
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
  isCreated: storeState.visualmetadata.newCreated,
  visualizationsList: storeState.visualizations.entities,
  featuresList: storeState.feature.entities,
  visualmetadataEntity: storeState.visualmetadata.entity,
  isEditMode: storeState.applicationProfile.isEditMode,
  filterData: storeState.visualmetadata.filterData,

  selectedFilter: storeState.visualmetadata.selectedFilter,
});

const mapDispatchToProps = {
  getViewEntity,
  getCurrentViewState,
  getVisualizationsEntities,
  getfeatureEntities,
  addVisualmetadataEntity,
  deleteVisualmetadataEntity,
  saveViewState,
  getViewFeaturesEntities,
  getVisualmetadataEntity,
  updateVisualmetadataEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
