import React, { useEffect } from 'react';
import { Flex, View } from '@adobe/react-spectrum';
import { RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

import { getEntity as getVisualmetadataEntity } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { getEntity as getViewEntity } from 'app/entities/views/views.reducer';
import { forwardCall } from 'app/shared/websocket/proxy-websocket.service';
import { receiveSocketResponse, receiveSocketResponseByVisualId } from 'app/shared/websocket/websocket.reducer';
import { renderVisualisation, ValidateFields } from 'app/modules/canvas/visualisation/util/visualisation-render-utils';
import { VisualWrap } from 'app/modules/canvas/visualisation/util/visualmetadata-wrapper';
import { getConditionExpression } from 'app/modules/canvas/filter/filter-util';
import { toggleFilterPanel, saveSelectedFilter, applyFilter } from 'app/modules/canvas/filter/filter.reducer';
import FilterPanel from 'app/modules/canvas/filter/filter-panel';
import { setIsShare } from './share-link-visualisation.reducer';
import { getViewFeaturesEntities } from 'app/entities/feature/feature.reducer';
import { getCurrentViewState } from 'app/entities/views/views.reducer';

export interface IShareLinkVisualisationProps extends StateProps, DispatchProps, RouteComponentProps {}

const ShareLinkVisualisation = (props: IShareLinkVisualisationProps) => {
  const params = new URLSearchParams(props.location.search);
  const visualisationId = params.get('visualisationId');
  const viewId = params.get('viewId');
  const datasourceId = Number(params.get('datasourceId'));

  useEffect(() => {
    props.setIsShare(true);
    if (visualisationId) {
      props.receiveSocketResponse();
      props.getVisualmetadataEntity(visualisationId);
      props.getViewEntity(viewId);
      props.getViewFeaturesEntities(viewId);
      props.getCurrentViewState(viewId);
    }
    return () => {
      props.setIsShare(false);
    };
  }, []);

  const shareLinkfForwardCall = () => {
    const visualMetadata = VisualWrap(props.visualMetadataEntity);
    const queryDTO = visualMetadata.getQueryParameters(
      props.visualMetadataEntity,
      props.selectedFilters,
      getConditionExpression(props.selectedFilters),
      0
    );
    const body = {
      queryDTO,
      visualMetadata,
      validationType: 'REQUIRED_FIELDS',
      actionType: null,
      type: 'share-link',
    };
    forwardCall(datasourceId, body, viewId);
  };

  useEffect(() => {
    if (props.isvisualMetaDataFetched && props.visualMetadataEntity.fields && ValidateFields(props.visualMetadataEntity.fields)) {
      props.receiveSocketResponseByVisualId(props.visualMetadataEntity.id);
      shareLinkfForwardCall();
    }
  }, [props.isvisualMetaDataFetched]);

  useEffect(() => {
    if (props.visualMetadataEntity.fields && ValidateFields(props.visualMetadataEntity.fields)) {
      shareLinkfForwardCall();
    }
  }, [props.selectedFilters]);

  useEffect(() => {
    if (props.visualDataById) {
      if (props.visualDataById?.data.length > 0) {
        renderVisualisation(props.visualMetadataEntity, props.visualDataById?.data, 'visualisation-edit', props);
      }
    }
  }, [props.visualDataById]);

  return (
    <>
      {props.isFilterOpen && <FilterPanel isShareLink={true} />}
      <Flex direction="column" flex gap="size-75">
        <View id={`visualisation-edit-${props.visualMetadataEntity.id}`} height="90vh"></View>
      </Flex>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visualMetadataEntity: storeState.visualmetadata.entity,
  view: storeState.views.entity,
  visualDataById: storeState.visualisationData.visualDataById,
  isvisualMetaDataFetched: storeState.visualmetadata.isvisualMetaDataFetched,
  selectedFilters: storeState.filter.selectedFilters,
  visualmetadata: storeState.views.viewState,
  isFilterOpen: storeState.filter.isFilterOpen,
});

const mapDispatchToProps = {
  getVisualmetadataEntity,
  getViewEntity,
  receiveSocketResponseByVisualId,
  toggleFilterPanel,
  receiveSocketResponse,
  setIsShare,
  getViewFeaturesEntities,
  getCurrentViewState,
  saveSelectedFilter,
  applyFilter,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ShareLinkVisualisation);
