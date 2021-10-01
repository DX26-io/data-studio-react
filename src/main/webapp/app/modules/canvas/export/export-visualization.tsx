import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { getEntity as getVisualmetadataEntity } from 'app/entities/visualmetadata/visualmetadata.reducer'; import { IRootState } from "app/shared/reducers";
import { useEffect, useRef, useState } from "react";
import { ValidateFields } from "../visualization/util/visualization-render-utils";
import { getConditionExpression } from "../filter/filter-util";
import { receiveSocketResponseByVisualId } from "app/shared/websocket/websocket.reducer";
import { VisualWrap } from "../visualization/util/visualmetadata-wrapper";
import { forwardCall } from "app/shared/websocket/proxy-websocket.service";
import React from "react";
import TableView from "app/shared/components/table/table";
import { getEntity as getViewEntity } from 'app/entities/views/views.reducer';

import { View } from "@react-spectrum/view";
import SecondaryHeader from "app/shared/layout/secondary-header/secondary-header";
import { DialogContainer } from "@react-spectrum/dialog";
import { Button } from "@react-spectrum/button";
import { getTransactionData } from "../visualization/util/visualization-utils";
import { CSVLink } from 'react-csv';

export interface IExportVisualizationProps extends  StateProps, DispatchProps, RouteComponentProps<{ url: string }> { }

const ExportVisualization = (props: IExportVisualizationProps) => {

    const [transactionData, setTransactionData] = useState([]);
    const csvLink = useRef(null);
    const params = new URLSearchParams(props.location.search);

    useEffect(() => {
        const viewId = params.get('viewId');
        const visualizationId = params.get('visualizationId');

        if (visualizationId) {
            props.getVisualmetadataEntity(visualizationId);
            props.getViewEntity(Number(viewId));
        }
    }, []);

    useEffect(() => {
        if (props.visualmetadataEntity.fields && ValidateFields(props.visualmetadataEntity.fields) && props.view?.id) {
            props.receiveSocketResponseByVisualId(props.visualmetadataEntity.id);
            const visualMetadata = VisualWrap(props.visualmetadataEntity);
            const queryDTO = visualMetadata.getQueryParameters(props.visualmetadataEntity, props.selectedFilters, getConditionExpression(props.selectedFilters), 0);
            const body = {
                queryDTO,
                visualMetadata,
                validationType: 'REQUIRED_FIELDS',
                actionType: null,
                type: 'share-link',
            };
            forwardCall(props.view?.viewDashboard?.dashboardDatasource?.id, body, props.view.id);
        }
    }, [props.visualmetadataEntity, props.view]);

    return (
        <>

            <SecondaryHeader
                breadcrumbItems={[
                    { label: 'Home', route: '/' },
                    { label: 'Export', route: '/dashboards' },
                ]}
                title={props.visualmetadataEntity?.titleProperties?.titleText}


            >
                <Button variant="cta" onPress={() => getTransactionData(props.visualDataById?.data, csvLink, setTransactionData)}>
                    Export
                </Button>
            </SecondaryHeader>
            <CSVLink
                data={transactionData}
                filename={`${props.visualmetadataEntity?.titleProperties?.titleText}.csv`}
                className="hidden"
                ref={csvLink}
                target="_blank"
            />
            <View>
                {props.visualDataById?.data && props.visualDataById?.data.length > 0 && <TableView data={props.visualDataById?.data} />}
            </View>

        </>
    )
}

const mapStateToProps = (storeState: IRootState) => ({
    view: storeState.views.entity,
    selectedFilters: storeState.filter.selectedFilters,
    visualmetadataEntity: storeState.visualmetadata.entity,
    visualDataById: storeState.visualizationData.visualDataById,

});

const mapDispatchToProps = {
    getVisualmetadataEntity,
    receiveSocketResponseByVisualId,
    getViewEntity
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ExportVisualization)
