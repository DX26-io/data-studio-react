import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { View, DialogContainer } from '@adobe/react-spectrum';
import { RouteComponentProps } from 'react-router-dom';
import './canvas.scss';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'flair-visualizations/styles/stylesheets/screen.css';
import { getEntity as getViewEntity, getCurrentViewState, resetViewState } from 'app/entities/views/views.reducer';
import { getEntities as getVisualisationsEntities } from 'app/entities/visualisations/visualisations.reducer';
import { IRootState } from 'app/shared/reducers';
import { getEntity as getVisualmetadataEntity, metadataContainerAdd } from 'app/entities/visualmetadata/visualmetadata.reducer';
import Loader from 'app/shared/components/card/loader/loader';
import FilterPanel from 'app/modules/canvas/filter/filter-panel';
import CanvasFilterHeader from 'app/shared/layout/header/canvas-filter-header';
import FeaturesPanel from 'app/modules/canvas/features/features-panel';
import { toggleLoader, reset as resetVisualisationData } from 'app/shared/websocket/websocket.reducer';
import { getFeatureCriteria, reset as resetFeatureCriteria } from 'app/entities/feature-criteria/feature-criteria.reducer';
import { getAppliedBookmark, reset as resetBookmark } from 'app/entities/bookmarks/bookmark.reducer';
import { reset as resetFilters } from 'app/modules/canvas/filter/filter.reducer';
import { getViewFeaturesEntities } from 'app/entities/feature/feature.reducer';
import { setVisualisationAction, reset as resetVisualMetadataContainerList } from 'app/entities/visualmetadata/visualmetadata.reducer';
import VisualisationEditModalPopUp from './visualisation-modal/visualisation-edit-modal/visualisation-edit-modal-popup';
import VisualisationDataModal from './visualisation-modal/visualisation-data-modal/visualisations-data-modal';
import VisualisationShareModal from './visualisation-modal/visualisation-share-modal/visualisation-share-modal';
import VisualisationsDeleteModal from './visualisation-modal/visualisation-delete-modal/visualisations-delete-modal';
import ManageWidgets from './widgets/manage-widgets';
import { getEntities as getDefaultVisualisationColors } from 'app/modules/administration/visualisation-colors/visualisation-colors.reducer';

export interface ICanvasProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

const Canvas = (props: ICanvasProps) => {
  const params = new URLSearchParams(props.location.search);

  useEffect(() => {
    const viewId = params.get('viewId');
    if (viewId) {
      props.getViewFeaturesEntities(viewId);
      props.getVisualisationsEntities();
      props.getViewEntity(viewId);
      props.getCurrentViewState(viewId);
      props.getDefaultVisualisationColors();
    }
    return () => {
      props.resetVisualMetadataContainerList();
      props.resetVisualisationData();
      props.resetFeatureCriteria();
      props.resetBookmark();
      props.resetFilters();
      props.resetViewState();
    };
  }, []);

  return (
    <>
      {props.isFilterOpen && <FilterPanel />}
      {props.isFeaturesPanelOpen && <FeaturesPanel />}
      <View>
        <CanvasFilterHeader />
        <ManageWidgets params={params} />
      </View>
      {props.isLoaderOn && (
        <div className="loader-element">
          <Loader />
        </div>
      )}
      <DialogContainer
        type={props.visualisationAction === 'Edit' ? 'fullscreenTakeover' : 'fullscreen'}
        onDismiss={() => props.setVisualisationAction(null)}
      >
        {props.visualisationAction === 'Edit' && <VisualisationEditModalPopUp />}
        {props.visualisationAction === 'Data' && <VisualisationDataModal />}
      </DialogContainer>
      {props.visualisationAction === 'Share' && <VisualisationShareModal />}
      {props.visualisationAction === 'Delete' && <VisualisationsDeleteModal />}
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visualisationAction: storeState.visualmetadata.visualisationAction,
  isLoaderOn: storeState.visualisationData.isLoaderOn,
  isFilterOpen: storeState.filter.isFilterOpen,
  isFeaturesPanelOpen: storeState.feature.isFeaturesPanelOpen,
});

const mapDispatchToProps = {
  getViewEntity,
  getCurrentViewState,
  getVisualisationsEntities,
  getVisualmetadataEntity,
  metadataContainerAdd,
  getFeatureCriteria,
  getAppliedBookmark,
  toggleLoader,
  getViewFeaturesEntities,
  resetVisualMetadataContainerList,
  setVisualisationAction,
  resetVisualisationData,
  resetFeatureCriteria,
  resetBookmark,
  resetFilters,
  getDefaultVisualisationColors,
  resetViewState
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
