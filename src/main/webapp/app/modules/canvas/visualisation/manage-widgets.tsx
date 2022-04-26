import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getEntity as getViewEntity, getCurrentViewState, saveViewState } from 'app/entities/views/views.reducer';
import { getEntities as getVisualisationsEntities } from 'app/entities/visualisations/visualisations.reducer';
import { IRootState } from 'app/shared/reducers';
import {
  alternateDimension,
  deleteEntity as deleteVisualmetadataEntity,
  reset,
  visualisationTablePagination,
  setTableActivePage,
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
  applyAlternativeDimensionFilter,
  addPinnedFiltersIntoMetadataContainer,
  removePinnedFiltersIntoMetadataContainer,
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import { receiveSocketResponse, toggleLoader, reset as resetVisualisationData } from 'app/shared/websocket/websocket.reducer';
import { visualMetadataContainerGetOne, pinnedFiltersKey } from './util/visualmetadata-container.util';
import { saveRecentBookmark } from 'app/modules/home/sections/recent.reducer';
import { applyFilter, saveDynamicDateRangeMetaData, saveSelectedFilter } from 'app/modules/canvas/filter/filter.reducer';
import { getViewFeaturesEntities } from 'app/entities/feature/feature.reducer';
import PinnedFiltersWidget from './pinned-canvas-filters/pinned-filters-widget';
import { IBroadcast } from '../../../shared/model/broadcast.model';
import { WidthProvider, Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { applyDateFilters } from '../filter/filter-util';
import { setVisualisationAction, metadataContainerUpdate } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { getFeatureCriteria } from 'app/entities/feature-criteria/feature-criteria.reducer';
import { getAppliedBookmark } from 'app/entities/bookmarks/bookmark.reducer';
import Widgets from './widgets';
import { VisualisationType } from 'app/shared/util/visualisation.constants';

const ReactGridLayout = WidthProvider(ResponsiveGridLayout);

export interface IIllustrate {
  visualisationId: string;
  loaderVisibility: boolean;
  noDataFoundVisibility: boolean;
}

export interface IManageWidgetsProps extends StateProps, DispatchProps {
  params: any;
}

const ManageWidgets = (props: IManageWidgetsProps) => {
  const [isLoaderDisplay, setIsLoaderDisplay] = useState<IIllustrate[]>([]);

  const broadcast: IBroadcast = {
    selectedFilters: props.selectedFilters,
    applyFilter: props.applyFilter,
    visualmetadata: props.visualmetadata,
    view: props.view,
    saveSelectedFilter: props.saveSelectedFilter,
    alternateDimension: props.alternateDimension,
    pagination: props.visualisationTablePagination,
    tableActivePage: props.tableActivePage,
    setTableActivePage: props.setTableActivePage,
    applyAlternativeDimensionFilter: props.applyAlternativeDimensionFilter,
    features: props.featuresList,
    defaultColorSet: props.defaultColorSet,
  };

  const onLayoutChange = _visualmetaList => {
    _visualmetaList.map((item, i) => {
      const v = visualMetadataContainerGetOne(item.i);
      if (v) {
        v.x = item.x;
        v.y = item.y;
        v.h = item.h;
        v.w = item.w;
        v.xPosition = item.x;
        v.yPosition = item.y;
        v.height = item.h;
        v.width = item.w;
        props.metadataContainerUpdate(v.id, v, 'id');
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
      props.metadataContainerUpdate(v.id, v, 'id');
      renderVisualisation(v, v.data, 'widget', broadcast);
    }
  };

  useEffect(() => {
    if (props.isPinnedFeatureListUpdated) {
      if (props.pinnedFeatures && props.pinnedFeatures.length === 0) {
        props.removePinnedFiltersIntoMetadataContainer();
      }
      if (props.pinnedFeatures && props.pinnedFeatures.length === 1) {
        props.addPinnedFiltersIntoMetadataContainer(props.pinnedFeatures);
      }
    }
  }, [props.isPinnedFeatureListUpdated]);

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
    if (props.visualData) {
      const v = visualMetadataContainerGetOne(props.visualData.headers.queryId);
      if (v && props.visualData?.body?.length > 0) {
        v.data = props.visualData?.body;
        props.toggleLoader(false);
        hideDataNotFound(v.id);
        renderVisualisation(v, props.visualData?.body, 'widget', broadcast);
      } else {
        if (v?.id) {
          showDataNotFound(v.id);
          if (document.getElementById('chart-widget-' + v.id)) {
            document.getElementById('chart-widget-' + v.id).remove();
          }
        }
        props.toggleLoader(false);
      }
    }
  }, [props.visualData]);

  useEffect(() => {
    if (props.visualmetadata?.visualMetadataSet?.length > 0) {
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
      if (props.params.get('bookmarkId')) {
        const bookmarkId = props.params.get('bookmarkId');
        props.getAppliedBookmark(bookmarkId);
        props.getFeatureCriteria(Number(bookmarkId));
        props.saveRecentBookmark(bookmarkId, props.params.get('viewId'));
      }
    }
    if (props.view?.viewFeatureCriterias) {
      if (props.view?.viewFeatureCriterias && props.featuresList && props.featuresList.length > 0) {
        applyDateFilters(
          props.view.viewFeatureCriterias,
          props.selectedFilters,
          props.featuresList,
          props.saveSelectedFilter,
          props.saveDynamicDateRangeMetaData
        );
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
      renderVisualisationById(props.visualMetadataEntity);
    }
  }, [props.updateSuccess]);

  useEffect(() => {
    if (props.visualMetadataContainerList.length > 0 && (props.updateSuccess || props.isCreated)) {
      renderVisualisationById(props.visualMetadataEntity);
    }
    if (props.pinnedFeatures && props.pinnedFeatures.length > 0) {
      const pinnedFiltersFoound = props.visualMetadataContainerList.find(item => {
        return item.key === pinnedFiltersKey;
      });
      props.addPinnedFiltersIntoMetadataContainer(props.pinnedFeatures);
    }
  }, [props.visualMetadataContainerList]);

  const generateWidge =
    props.visualMetadataContainerList &&
    props.visualMetadataContainerList.map((v, i) => {
      if (v && v?.key === pinnedFiltersKey) {
        return (
          <div
            className="layout widget"
            id={`pinned-filters-${v.key + i}`}
            key={`viz-widget-${v.key + i}`}
            data-grid={{
              i: v.key,
              x: 0,
              y: 0,
              w: 1,
              h: props.pinnedFeatures.length,
              maxW: Infinity,
              maxH: Infinity,
              isBounded: true,
            }}
          >
            <PinnedFiltersWidget pinnedWidgetKey={v.key} pinnedFeatures={props.pinnedFeatures} key={`pinned-filters-widget-${i}`} />
          </div>
        );
      } else {
        return (
          <div
            className={v.metadataVisual.name === VisualisationType.Iframe ? 'iframe-widget item widget' : 'item widget'}
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
            <Widgets v={v} isLoaderDisplay={isLoaderDisplay} i={i} key={`viz-widget-${i}`} />
          </div>
        );
      }
    });

  return (
    <div>
      {props.visualMetadataContainerList && props.visualMetadataContainerList.length > 0 && (
        <ReactGridLayout
          className="layout"
          rowHeight={120}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 3, md: 3, sm: 2, xs: 1, xxs: 1 }}
          layout={props.visualMetadataContainerList}
          margin={[15, 15]}
          verticalCompact={true}
          compactType={'vertical'}
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
    </div>
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
  visualMetadataEntity: storeState.visualmetadata.entity,
  visual: storeState.visualmetadata.entity,
  isEditMode: storeState.visualmetadata.isEditMode,
  visualData: storeState.visualisationData.visualData,
  filterData: storeState.visualisationData.filterData,
  isSocketConnected: storeState.visualisationData.isSocketConnected,
  visualMetadataContainerList: storeState.visualmetadata.visualMetadataContainerList,
  isSearchOpen: storeState.search.isSearchOpen,
  selectedFilters: storeState.filter.selectedFilters,
  pinnedFeatures: storeState.feature.entities.filter(feature => feature.pin === true),
  tableActivePage: storeState.visualmetadata.tableActivePage,
  editAction: storeState.visualmetadata.editAction,
  isPinnedFeatureListUpdated: storeState.feature.isPinnedFeatureListUpdated,
  defaultColorSet: storeState.visulisationColors.defaultColorSet,
});

const mapDispatchToProps = {
  getViewEntity,
  getCurrentViewState,
  getVisualisationsEntities,

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
  toggleLoader,
  saveSelectedFilter,
  getViewFeaturesEntities,
  reset,
  saveDynamicDateRangeMetaData,
  alternateDimension,
  visualisationTablePagination,
  setTableActivePage,
  setVisualisationAction,
  resetVisualisationData,
  metadataContainerUpdate,
  applyAlternativeDimensionFilter,
  addPinnedFiltersIntoMetadataContainer,
  removePinnedFiltersIntoMetadataContainer,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ManageWidgets);
