import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { View } from '@adobe/react-spectrum';
import { RouteComponentProps } from 'react-router-dom';
import RGL, { WidthProvider } from 'react-grid-layout';
import './canvas.scss';
import 'flair-visualizations/styles/stylesheets/screen.css';
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
  getEntity as getVisualmetadataEntity,
  updateEntity as updateVisualmetadataEntity,
  metadataContainerAdd,
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import VisualizationHeader from './visualization-modal/visualization-header';
import 'app/modules/canvas/visualization/canvas.scss';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { NoDataFoundPlaceHolder } from 'app/shared/components/placeholder/placeholder';
import Loader from 'app/shared/components/card/loader/loader';
import FilterPanel from 'app/modules/canvas/filter/filter-panel';
import CanvasFilterHeader from 'app/shared/layout/header/canvas-filter-header';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import FeaturesPanel from 'app/modules/canvas/features/features-panel';
import { receiveSocketResponse } from 'app/shared/websocket/websocket.reducer';
import { VisualMetadataContainerGetOne } from './util/visualmetadata-container.util';

const ReactGridLayout = WidthProvider(RGL);

export interface IIllustrate {
  visualizationId: string;
  loaderVisibility: boolean;
  noDataFoundVisibility: boolean;
}

export interface VisualizationProp extends StateProps, DispatchProps, RouteComponentProps<{ dashboardId: string; viewId: string }> {}

const Canvas = (props: VisualizationProp) => {
  const [isVisualizationsModelOpen, setVisualizationsModelOpen] = useState(false);
  const [visualmetadataList, setvisualmetadata] = useState<IVisualMetadataSet[]>();
  const [filters, setFilters] = useState<string[]>();
  const [isLoaderDisplay, setIsLoaderDisplay] = useState<IIllustrate[]>([]);

  useEffect(() => {
    if (props.selectedFilter) {
      const filterList = Object.keys(props.selectedFilter);
      setFilters(filterList);
    }
  }, [props.selectedFilter]);

  const hideLoader = id => {
    isLoaderDisplay.map(item => {
      if (item.visualizationId === id) {
        item.loaderVisibility = false;
      }
    });
    setIsLoaderDisplay([...isLoaderDisplay]);
  };

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
      v.h = newItem.h;
      v.height = newItem.h;
      v.w = newItem.w;
      v.width = newItem.w;
      renderVisualization(v, v.data);
    }
  };

  const renderVisualizationById = item => {
    if (ValidateFields(item.fields)) {
      getVisualizationData(item, props.view, props.filters);
    } else {
      hideLoader(item.id);
    }
  };

  const loadVisualization = () => {
    props.visualmetadata.visualMetadataSet.map((item, i) => {
      renderVisualizationById(item);
    });
  };

  const showDataNotFound = id => {
    isLoaderDisplay.map(item => {
      if (item.visualizationId === id) {
        item.noDataFoundVisibility = true;
      }
    });
    setIsLoaderDisplay([...isLoaderDisplay]);
  };

  const hideDataNotFound = id => {
    isLoaderDisplay.map(item => {
      if (item.visualizationId === id) {
        item.noDataFoundVisibility = false;
      }
    });
    setIsLoaderDisplay([...isLoaderDisplay]);
  };

  useEffect(() => {
    if (props.match.params.viewId) {
      props.getVisualizationsEntities();
      props.getViewEntity(props.match.params.viewId);
      props.getCurrentViewState(props.match.params.viewId);
    }
  }, []);

  useEffect(() => {
    if (props.visualData) {
      const v = VisualMetadataContainerGetOne(props.visualData.headers.queryId);
      if (v && props.visualData?.body.length > 0) {
        v.data = props.visualData?.body;
        hideLoader(v.id);
        hideDataNotFound(v.id);
        renderVisualization(v, props.visualData?.body);
      } else {
        showDataNotFound(v.id);
        hideLoader(v.id);
      }
    }
  }, [props.visualData]);

  useEffect(() => {
    if (props.filterList) {
      // TODO : this code needs to be refectored
      const obj = props.filterList?.body[0];
      const dimensionName = Object.keys(obj)[0];
      const retVal = props.filterList?.body?.map(function (item) {
        return {
          value: item[dimensionName],
          label: item[dimensionName],
        };
      });
      props.filterData[dimensionName] = retVal;
    }
  }, [props.filterList]);

  useEffect(() => {
    if (props.visualmetadata?.visualMetadataSet?.length > 0) {
      props.visualmetadata?.visualMetadataSet.map(item => {
        const loader = {
          visualizationId: item.id,
          loaderVisibility: true,
          noDataFoundVisibility: false,
        };
        const visList = isLoaderDisplay || [];
        isLoaderDisplay.push(loader);
        setIsLoaderDisplay([...visList]);
      });

      props.visualmetadata.visualMetadataSet.map(item => {
        (item.x = item.xPosition), (item.y = item.yPosition), (item.h = item.height), (item.w = item.width);
      });
      setvisualmetadata([...props.visualmetadata.visualMetadataSet]);
    }
  }, [props.visualmetadata]);

  useEffect(() => {
    if (props.isSocketConnected) {
      props.metadataContainerAdd(props.visualmetadata?.visualMetadataSet);
      loadVisualization();
    } else {
      props.receiveSocketResponse();
    }
  }, [props.isSocketConnected]);

  useEffect(() => {
    if (props.isCreated) {
      props.metadataContainerAdd(props.visualmetadataEntity);
      setvisualmetadata([...props.visualMetadataContainerList]);
      if (props.visualmetadataEntity.id) {
        renderVisualizationById(props.visualmetadataEntity.id);
      }
    }
  }, [props.isCreated]);

  useEffect(() => {
    if (props.updateSuccess) {
      setvisualmetadata([...props.visualMetadataContainerList]);
      renderVisualizationById(props.visualmetadataEntity);
    }
  }, [props.updateSuccess]);

  useEffect(() => {
    if (props.deleteSuccess) {
      setvisualmetadata([...props.visualMetadataContainerList]);
    }
  }, [props.deleteSuccess]);

  useEffect(() => {
    if (props.visualMetadataContainerList.length > 0 && (props.updateSuccess || props.isCreated)) {
      setvisualmetadata([...props.visualMetadataContainerList]);
      renderVisualizationById(props.visualmetadataEntity);
    }
  }, [props.visualMetadataContainerList]);

  useEffect(() => {
    if (props.isSearchOpen) {
      debugger
      props.history.push(`/dashboards/${props.view.viewDashboard.id}/${props.view.id}/search`);
    }
  }, [props.isSearchOpen]);

  const handleVisualizationClick = v => {
    props.addVisualmetadataEntity({
      viewId: props.view.id,
      visualMetadata: v,
    });
    setVisualizationsModelOpen(false);
  };

  const generateWidge =
    visualmetadataList &&
    visualmetadataList.map((v, i) => {
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
              isEditMode={props.isEditMode}
              {...props}
            ></VisualizationHeader>
          </div>
          <div style={{ backgroundColor: v.bodyProperties.backgroundColor }} className="visualBody" id={`visualBody-${v.id}`}>
            <div className="illustrate">
              {isLoaderDisplay[i]?.noDataFoundVisibility && (
                <div
                  style={{ display: isLoaderDisplay[i]?.noDataFoundVisibility ? 'block' : 'none' }}
                  className={`dataNotFound dataNotFound-${v.id}`}
                >
                  <NoDataFoundPlaceHolder />
                </div>
              )}
            </div>
            <div id={`visualization-${v.id}`} className="visualization"></div>
          </div>
        </div>
      );
    });

  return (
    <>
      {props.isSocketConnected && <FilterPanel hideLoader={hideLoader} />}
      {props.isSocketConnected && <FeaturesPanel />}
      <View>
        <CanvasFilterHeader hideLoader={hideLoader} />
      </View>
      <View>
        {props.isLoaderOn && (
          <div style={{ display: props.isLoaderOn ? 'block' : 'none' }} className="loader-element">
            <Loader />
          </div>
        )}
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
  updateSuccess: storeState.visualmetadata.updateSuccess,
  deleteSuccess: storeState.visualmetadata.deleteSuccess,
  visualizationsList: storeState.visualizations.entities,
  featuresList: storeState.feature.entities,
  visualmetadataEntity: storeState.visualmetadata.entity,
  isEditMode: storeState.visualmetadata.isEditMode,
  filterData: storeState.visualmetadata.filterData,
  visualData: storeState.visualizationData.visualData,
  filterList: storeState.visualizationData.filterData,
  isSocketConnected: storeState.visualizationData.isSocketConnected,
  isLoaderOn: storeState.visualizationData.isLoaderOn,
  visualMetadataContainerList: storeState.visualmetadata.visualMetadataContainerList,
  isSearchOpen: storeState.search.isSearchOpen,
  selectedFilter: storeState.visualmetadata.selectedFilter,
  filters: storeState.filter.selectedFilters,
  isFilterOpen: storeState.filter.isFilterOpen,
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
  receiveSocketResponse,
  metadataContainerAdd,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
