import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { View } from '@adobe/react-spectrum';
import { RouteComponentProps } from 'react-router-dom';
import './canvas.scss';
import 'flair-visualisations/styles/stylesheets/screen.css';
import { getEntity as getViewEntity, getCurrentViewState, saveViewState,reset as resetViews} from 'app/entities/views/views.reducer';
import { getEntities as getvisualisationsEntities } from 'app/entities/visualisations/visualisations.reducer';
import { IRootState } from 'app/shared/reducers';
import {
  alternateDimension,
  createEntity as addVisualmetadataEntity,
  deleteEntity as deleteVisualmetadataEntity,
  reset
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import {
  getVisualisationData,
  renderVisualisation,
  ValidateFields,
} from 'app/modules/canvas/visualisation/util/visualisation-render-utils';
import {
  getEntity as getVisualmetadataEntity,
  updateEntity as updateVisualmetadataEntity,
  metadataContainerAdd,
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import VisualisationHeader from './visualisation-modal/visualisation-header';
import 'app/modules/canvas/visualisation/canvas.scss';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { NoDataFoundPlaceHolder } from 'app/shared/components/placeholder/placeholder';
import Loader from 'app/shared/components/card/loader/loader';
import FilterPanel from 'app/modules/canvas/filter/filter-panel';
import CanvasFilterHeader from 'app/shared/layout/header/canvas-filter-header';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import FeaturesPanel from 'app/modules/canvas/features/features-panel';
import { receiveSocketResponse, toggleLoader } from 'app/shared/websocket/websocket.reducer';
import { visualMetadataContainerGetOne } from './util/visualmetadata-container.util';
import { getFeatureCriteria } from 'app/entities/feature-criteria/feature-criteria.reducer';
import { getAppliedBookmark } from 'app/entities/bookmarks/bookmark.reducer';
import { saveRecentBookmark } from 'app/modules/home/sections/recent.reducer';
import { applyFilter, saveDynamicDateRangeMetaData, saveSelectedFilter } from 'app/modules/canvas/filter/filter.reducer';
import { getViewFeaturesEntities } from 'app/entities/feature/feature.reducer';
import { applyBookmark } from 'app/entities/bookmarks/bookmark.reducer';
import { visualisationType } from 'app/shared/util/visualisation.constants';
import PinnedFiltersHeader from './pinned-canvas-filters/pinned-filters-header';
import PinnedFilterElement from './pinned-canvas-filters/pinned-filter-element';
import { IBroadcast } from '../../../shared/model/broadcast.model'

import { WidthProvider, Responsive as ResponsiveGridLayout, } from 'react-grid-layout';
import { applyDateFilters } from '../filter/filter-util';
const ReactGridLayout = WidthProvider(ResponsiveGridLayout);

export interface IIllustrate {
  visualisationId: string;
  loaderVisibility: boolean;
  noDataFoundVisibility: boolean;
}

export interface IVisualisationProp extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> { }

const Canvas = (props: IVisualisationProp) => {
  const [isvisualisationsModelOpen, setVisualisationsModelOpen] = useState(false);
  const [isLoaderDisplay, setIsLoaderDisplay] = useState<IIllustrate[]>([]);
  const params = new URLSearchParams(props.location.search);

  const broadcast: IBroadcast = {
    selectedFilters: props.selectedFilters,
    applyFilter: props.applyFilter,
    visualmetadata: props.visualmetadata,
    view: props.view,
    saveSelectedFilter: props.saveSelectedFilter,
    alternateDimension : props.alternateDimension
  }

  const onLayoutChange = _visualmetaList => {
    props.visualmetadata?.visualMetadataSet?.map((item, i) => {
      if (!item.key) {
        if(item.x) item.x = _visualmetaList[i].x,
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
    const v = visualMetadataContainerGetOne(oldItem.i);
    if (v && v.data?.length > 0) {
      v.h = newItem.h;
      v.height = newItem.h;
      v.w = newItem.w;
      v.width = newItem.w;
      renderVisualisation(v, v.data, "widget", broadcast);
    }
  };

  const addPinFilter = () => {
    if (!props.visualMetadataContainerList.find(item => {
      return item.key === 'pinned-filters-div';
    })) {
      props.visualMetadataContainerList.push({
        key: 'pinned-filters-div',
        x: 0,
        y: 0,
        w: 1,
        h: props.pinnedFeatures.length
      })
    }
  }

  const renderVisualisationById = item => {
    if (ValidateFields(item.fields)) {
      getVisualisationData(item, props.view, props.selectedFilters);
    } else {
      props.toggleLoader(false);
    }
  };

  const loadvisualisation = () => {
    props.visualmetadata.visualMetadataSet.map((item, i) => {
      renderVisualisationById(item);
    });
  };

  const showDataNotFound = id => {
    isLoaderDisplay.map(item => {
      if (item.visualisationId === id) {
        item.noDataFoundVisibility = true;
      }
    });
    setIsLoaderDisplay([...isLoaderDisplay]);
  };

  const hideDataNotFound = id => {
    isLoaderDisplay.map(item => {
      if (item.visualisationId === id) {
        item.noDataFoundVisibility = false;
      }
    });
    setIsLoaderDisplay([...isLoaderDisplay]);
  };

  useEffect(() => {
    const viewId = params.get('viewId');
    if (viewId) {
      props.getViewFeaturesEntities(viewId);
      props.getVisualisationsEntities();
      props.getViewEntity(viewId);
      props.getCurrentViewState(viewId);
    }
    return () => {
      props.reset();
    };
  }, []);

  useEffect(() => {
    if (props.visualData) {
      const v = visualMetadataContainerGetOne(props.visualData.headers.queryId);
      if (v && props.visualData?.body?.length > 0) {
        v.data = props.visualData?.body;
        props.toggleLoader(false);
        hideDataNotFound(v.id);
        renderVisualisation(v, props.visualData?.body, "widget", broadcast);
      } else {
        showDataNotFound(v.id);
        if (document.getElementById('chart-widget-' + v.id)) {
          document.getElementById('chart-widget-' + v.id).remove();
        }
        props.toggleLoader(false);
      }
    }
  }, [props.visualData]);

  useEffect(() => {
    if (props.visualmetadata?.visualMetadataSet?.length > 0) {
      props.toggleLoader(true)
      props.visualmetadata?.visualMetadataSet.map(item => {
        const loader = {
          visualisationId: item.id,
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
      }
    }
    if (props.view?.viewFeatureCriterias) {
      if (props.view?.viewFeatureCriterias && props.featuresList && props.featuresList.length > 0) {
        applyDateFilters(props.view.viewFeatureCriterias, props.selectedFilters, props.featuresList, props.saveSelectedFilter, props.saveDynamicDateRangeMetaData);
      }
    }
  }, [props.visualmetadata]);

  useEffect(() => {
    if (props.isSocketConnected) {
        props.metadataContainerAdd(props.visualmetadata?.visualMetadataSet);
      if (props.visualmetadata?.visualMetadataSet.length > 0) {
        loadvisualisation();
      } else {
        props.toggleLoader(false);
      }
    } else {
      props.receiveSocketResponse();
    }
  }, [props.isSocketConnected]);

  useEffect(() => {
    if (props.updateSuccess) {
      renderVisualisationById(props.visualmetadataEntity);
    }
  }, [props.updateSuccess]);

  useEffect(() => {
    if (props.pinnedFeatures.length > 0) {
      addPinFilter();
      if (props.visualMetadataContainerList.length > 0 && (props.updateSuccess || props.isCreated)) {
        renderVisualisationById(props.visualmetadataEntity);
      }
    }
  }, [props.visualMetadataContainerList]);

  const handlevisualisationClick = v => {
    props.addVisualmetadataEntity({
      viewId: props.view.id,
      visualMetadata: v,
    });
    setVisualisationsModelOpen(false);
  };

  const generateWidge =
    props.visualMetadataContainerList &&
    props.visualMetadataContainerList.map((v, i) => {
      if (v && v.key) {
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
              <VisualisationHeader
                key={`viz-header-${v.id}`}
                visual={v}
                handleVisualisationClick={handlevisualisationClick}
                view={props.view}
                totalItem={props.visualMetadataContainerList?.length || 0}
                filterData={props.filterList}
                isEditMode={props.isEditMode}
                {...props}
              ></VisualisationHeader>
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
              <div id={`visualisation-${v.id}`} className="visualisation">
                {
                  v.metadataVisual.name === visualisationType.Iframe && (
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
            cols={{ lg: 3, md: 3, sm: 2, xs: 1, xxs: 1 }}
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
  visualisationsList: storeState.visualisations.entities,
  featuresList: storeState.feature.entities,
  visualmetadataEntity: storeState.visualmetadata.entity,
  isEditMode: storeState.visualmetadata.isEditMode,
  visualData: storeState.visualisationData.visualData,
  filterList: storeState.visualisationData.filterData,
  isSocketConnected: storeState.visualisationData.isSocketConnected,
  isLoaderOn: storeState.visualisationData.isLoaderOn,
  visualMetadataContainerList: storeState.visualmetadata.visualMetadataContainerList,
  isSearchOpen: storeState.search.isSearchOpen,
  selectedFilters: storeState.filter.selectedFilters,
  isFilterOpen: storeState.filter.isFilterOpen,
  pinnedFeatures: storeState.feature.entities.filter(feature => feature.pin === true)
});

const mapDispatchToProps = {
  getViewEntity,
  getCurrentViewState,
  getVisualisationsEntities,
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
  toggleLoader,
  saveSelectedFilter,
  getViewFeaturesEntities,
  reset,
  saveDynamicDateRangeMetaData,
  alternateDimension
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);

