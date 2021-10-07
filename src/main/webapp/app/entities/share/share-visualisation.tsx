import React, { useEffect } from 'react';
import { Flex, View, } from '@adobe/react-spectrum';
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
import { toggleFilterPanel } from 'app/modules/canvas/filter/filter.reducer';
import FilterPanel from 'app/modules/canvas/filter/filter-panel';
import { setIsShare } from './share-visualisation.reducer';

export interface ISharevisualisationProps extends StateProps, DispatchProps, RouteComponentProps { }

const Sharevisualisation = (props: ISharevisualisationProps) => {

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
        }
        return () => {
            props.setIsShare(false);
        };
    }, []);

    useEffect(() => {
        if (props.isvisualMetaDataFetched && props.visualmetadataEntity.fields && ValidateFields(props.visualmetadataEntity.fields)) {
            props.receiveSocketResponseByVisualId(props.visualmetadataEntity.id);
            const visualMetadata = VisualWrap(props.visualmetadataEntity);
            const queryDTO = visualMetadata.getQueryParameters(props.visualmetadataEntity, {}, getConditionExpression({}), 0);
            const body = {
                queryDTO,
                visualMetadata,
                validationType: 'REQUIRED_FIELDS',
                actionType: null,
                type: 'share-link',
            };
            forwardCall(datasourceId, body, viewId);
        }
    }, [props.isvisualMetaDataFetched]);

    useEffect(() => {
        if (props.visualDataById) {
            if (props.visualDataById?.data.length > 0) {
                renderVisualisation(props.visualmetadataEntity, props.visualDataById?.data, 'visualisation-edit');
            }
        }
    }, [props.visualDataById]);

    return (
        <>
            <FilterPanel visualisationId={props.visualmetadataEntity.id} />
            <Flex direction="column" flex gap="size-75">
                <View id={`visualisation-edit-${props.visualmetadataEntity.id}`} height="90vh" >
                </View>
            </Flex>
        </>
    );
};

const mapStateToProps = (storeState: IRootState) => ({
    visualmetadataEntity: storeState.visualmetadata.entity,
    view: storeState.views.entity,
    visualDataById: storeState.visualisationData.visualDataById,
    isvisualMetaDataFetched: storeState.visualmetadata.isvisualMetaDataFetched,
});

const mapDispatchToProps = {
    getVisualmetadataEntity,
    getViewEntity,
    receiveSocketResponseByVisualId,
    toggleFilterPanel,
    receiveSocketResponse,
    setIsShare
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Sharevisualisation);
