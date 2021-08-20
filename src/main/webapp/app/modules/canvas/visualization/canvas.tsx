import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { View } from '@adobe/react-spectrum';
import { RouteComponentProps } from 'react-router-dom';
import './canvas.scss';
import 'flair-visualizations/styles/stylesheets/screen.css';
import { getEntity as getViewEntity, getCurrentViewState, saveViewState } from 'app/entities/views/views.reducer';
import { getEntities as getVisualizationsEntities } from 'app/entities/visualizations/visualizations.reducer';
import { IRootState } from 'app/shared/reducers';
import {
  createEntity as addVisualmetadataEntity,
  deleteEntity as deleteVisualmetadataEntity,
  reset
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
import { receiveSocketResponse, hideLoader } from 'app/shared/websocket/websocket.reducer';
import { VisualMetadataContainerGetOne } from './util/visualmetadata-container.util';
import { getFeatureCriteria } from 'app/entities/feature-criteria/feature-criteria.reducer';
import { getAppliedBookmark } from 'app/entities/bookmarks/bookmark.reducer';
import { saveRecentBookmark } from 'app/modules/home/sections/recent.reducer';
import { applyFilter, saveSelectedFilter } from 'app/modules/canvas/filter/filter.reducer';
import { applyBookmark } from 'app/entities/bookmarks/bookmark.reducer';
import { VisualizationType } from 'app/shared/util/visualization.constants';
import PinnedCanvasFilters from "app/modules/canvas/visualization/pinned-canvas-filters/pinned-canvas-filters";
import PinnedFiltersHeader from './pinned-canvas-filters/pinned-filters-header';
import PinnedFilterElement from './pinned-canvas-filters/pinned-filter-element';

import { WidthProvider, Responsive as ResponsiveGridLayout, } from 'react-grid-layout';
const ReactGridLayout = WidthProvider(ResponsiveGridLayout);

export interface IIllustrate {
  visualizationId: string;
  loaderVisibility: boolean;
  noDataFoundVisibility: boolean;
}

export interface VisualizationProp extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> { }

const Canvas = (props: VisualizationProp) => {
  const [isVisualizationsModelOpen, setVisualizationsModelOpen] = useState(false);
  const [isLoaderDisplay, setIsLoaderDisplay] = useState<IIllustrate[]>([]);
  const params = new URLSearchParams(props.location.search);

  const onLayoutChange = _visualmetaList => {
    props.visualmetadata?.visualMetadataSet?.map((item, i) => {
      if (!item.key) {
        (item.x = _visualmetaList[i].x),
          (item.y = _visualmetaList[i].y),
          (item.h = _visualmetaList[i].h),
          (item.w = _visualmetaList[i].w),
          (item.xPosition = _visualmetaList[i].x),
          (item.yPosition = _visualmetaList[i].y),
          (item.height = _visualmetaList[i].h),
          (item.width = _visualmetaList[i].w);
      }
    });
  };

  const onResizeStop = (layout, oldItem, newItem, placeholder, e, element) => {
    const v = VisualMetadataContainerGetOne(oldItem.i);
    if (v && v.data?.length > 0) {
      v.h = newItem.h;
      v.height = newItem.h;
      v.w = newItem.w;
      v.width = newItem.w;
      renderVisualization(v, v.data, "widget", props);
    }
  };

  const renderVisualizationById = item => {
    if (ValidateFields(item.fields)) {
      getVisualizationData(item, props.view, props.selectedFilters);
    } else {
      props.hideLoader();
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
    const viewId = params.get('viewId');
    if (viewId) {
      props.getVisualizationsEntities();
      props.getViewEntity(viewId);
      props.getCurrentViewState(viewId);
    }
    return () => {
      props.reset();
    };
  }, []);

  useEffect(() => {
    if (props.visualData) {
      const v = VisualMetadataContainerGetOne(props.visualData.headers.queryId);
      if (v && props.visualData?.body?.length > 0) {
        v.data = props.visualData?.body;
        props.hideLoader();
        hideDataNotFound(v.id);
        renderVisualization(v, props.visualData?.body, "widget", props);
      } else {
        showDataNotFound(v.id);
        props.hideLoader();
      }
    }
  }, [props.visualData]);

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
      if (params.get('bookmarkId')) {
        const bookmarkId = params.get('bookmarkId');
        props.getAppliedBookmark(bookmarkId);
        props.getFeatureCriteria(Number(bookmarkId));
        props.saveRecentBookmark(bookmarkId, params.get('viewId'));
      } else {
        props.saveSelectedFilter({});
      }
    }
  }, [props.visualmetadata]);

  useEffect(() => {
    if (props.isSocketConnected) {
      props.metadataContainerAdd(props.visualmetadata?.visualMetadataSet);
      if (props.visualmetadata?.visualMetadataSet.length > 0) {
        loadVisualization();
      } else {
        props.hideLoader();
      }
    } else {
      props.receiveSocketResponse();
    }
  }, [props.isSocketConnected]);

  useEffect(() => {
    if (props.updateSuccess) {
      renderVisualizationById(props.visualmetadataEntity);
    }
  }, [props.updateSuccess]);

  useEffect(() => {
    if (props.pinnedFeatures.length > 0) {
      props.visualMetadataContainerList.push({
        key: 'pinned-filters-div',
        x: 0,
        y: 0,
        w: 1,
        h: props.pinnedFeatures.length
      })
      if (props.visualMetadataContainerList.length > 0 && (props.updateSuccess || props.isCreated)) {
        renderVisualizationById(props.visualmetadataEntity);
      }
    }
  }, [props.visualMetadataContainerList]);

  useEffect(() => {
    if (props.isSearchOpen) {
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
    props.visualMetadataContainerList &&
    props.visualMetadataContainerList.map((v, i) => {
      if (v.key) {
        return (
          <div
            className="layout widget"
            id={`filter-${v.key}`}
            key={`viz-widget-${v.key}`}
            data-grid={{
              i: v.key,
              x: 0,
              y: 0,
              w: 1,
              h: 5 + props.pinnedFeatures.length,
              maxW: Infinity,
              maxH: Infinity,
              isBounded: true,
            }}
          >
            <div className="header">
              <PinnedFiltersHeader />
            </div>
            <div className="visualBody" id={`visualBody-${v.key}`}>
              {props.pinnedFeatures &&
                props.pinnedFeatures.length > 0 &&
                props.pinnedFeatures.map((feature) => (
                  <PinnedFilterElement key={`pinned-filter-element - ${feature.id}`} feature={feature} />
                ))}

            </div>
          </div>
        )
      } else {
        return (
          <div
            className="item widget"
            id={`widget-${v.id}`}
            key={`${v.id}`}
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
                key={`viz-header-${v.id}`}
                visual={v}
                handleVisualizationClick={handleVisualizationClick}
                view={props.view}
                totalItem={props.visualMetadataContainerList?.length || 0}
                filterData={props.filterList}
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
              <div id={`visualization-${v.id}`} className="visualization">
                {
                  v.metadataVisual.name === VisualizationType.Iframe && (
                    <iframe id={`iframe-${v.id}`} />
                  )
                }
              </div>
            </div>
          </div>
        );
      }

    });

  return (
    <>
      {props.isSocketConnected && <FilterPanel />}
      {props.isSocketConnected && <FeaturesPanel />}
      <View>
        <CanvasFilterHeader />
      </View>
      <View>
        {props.isLoaderOn && (
          <div style={{ display: props.isLoaderOn ? 'block' : 'none' }} className="loader-element">
            <Loader />
          </div>
        )}
        {props.visualMetadataContainerList && props.visualMetadataContainerList.length > 0 && (
          <ReactGridLayout
            className="layout"
            rowHeight={120}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 3, md: 3, sm: 2, xs: 2, xxs: 2 }}
            layout={props.visualMetadataContainerList}
            margin={[15, 15]}
            verticalCompact={true}
            compactType={"vertical"}
            onLayoutChange={onLayoutChange}
            onResizeStop={onResizeStop}
            draggableHandle=".header"
            draggableCancel=".WidgetDragCancel"
            isBounded={false}
            isDraggable={props.isEditMode}
            isResizable={props.isEditMode}
            key={'viz-grid-layout'}
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
  visualData: storeState.visualizationData.visualData,
  filterList: storeState.visualizationData.filterData,
  isSocketConnected: storeState.visualizationData.isSocketConnected,
  isLoaderOn: storeState.visualizationData.isLoaderOn,
  visualMetadataContainerList: storeState.visualmetadata.visualMetadataContainerList,
  isSearchOpen: storeState.search.isSearchOpen,
  selectedFilters: storeState.filter.selectedFilters,
  isFilterOpen: storeState.filter.isFilterOpen,
  pinnedFeatures: storeState.feature.entities.filter(feature => feature.pin === true)

});

const mapDispatchToProps = {
  getViewEntity,
  getCurrentViewState,
  getVisualizationsEntities,
  addVisualmetadataEntity,
  deleteVisualmetadataEntity,
  saveViewState,
  getVisualmetadataEntity,
  updateVisualmetadataEntity,
  receiveSocketResponse,
  metadataContainerAdd,
  getFeatureCriteria,
  getAppliedBookmark,
  saveRecentBookmark,
  applyFilter,
  applyBookmark,
  hideLoader,
  saveSelectedFilter,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);

