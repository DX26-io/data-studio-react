import React, { useEffect } from 'react';
import { Flex, View, } from '@adobe/react-spectrum';
import './share-visualization.scss';
import { RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

import { getEntity as getVisualmetadataEntity } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { getEntity as getViewEntity } from 'app/entities/views/views.reducer';
import { forwardCall } from 'app/shared/websocket/proxy-websocket.service';
import { receiveSocketResponse, receiveSocketResponseByVisualId } from 'app/shared/websocket/websocket.reducer';
import { renderVisualization, ValidateFields } from 'app/modules/canvas/visualization/util/visualization-render-utils';
import { VisualWrap } from 'app/modules/canvas/visualization/util/visualmetadata-wrapper';
import { getConditionExpression } from 'app/modules/canvas/filter/filter-util';
import { toggleFilterPanel } from 'app/modules/canvas/filter/filter.reducer';
import FilterPanel from 'app/modules/canvas/filter/filter-panel';
import { setIsShare } from './share-visualization.reducer';

export interface IShareVisualizationProps extends StateProps, DispatchProps, RouteComponentProps { }

const ShareVisualization = (props: IShareVisualizationProps) => {

    const params = new URLSearchParams(props.location.search);
    const visualizationId = params.get('visualizationId');
    const viewId = params.get('viewId');
    const datasourceId = Number(params.get('datasourceId'));

    useEffect(() => {
        props.setIsShare(true);
        if (visualizationId) {
            props.receiveSocketResponse();
            props.getVisualmetadataEntity(visualizationId);
            props.getViewEntity(viewId);
        }
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
                renderVisualization(props.visualmetadataEntity, props.visualDataById?.data, 'visualization-edit');
            }
        }
    }, [props.visualDataById]);

    return (
        <>
            <FilterPanel {...props} />
            <Flex direction="column" flex gap="size-75">
                <View id={`visualization-edit-${props.visualmetadataEntity.id}`} height="90vh" >
                </View>
            </Flex>
        </>
    );
};

const mapStateToProps = (storeState: IRootState) => ({
    visualmetadataEntity: storeState.visualmetadata.entity,
    view: storeState.views.entity,
    visualDataById: storeState.visualizationData.visualDataById,
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

export default connect(mapStateToProps, mapDispatchToProps)(ShareVisualization);
