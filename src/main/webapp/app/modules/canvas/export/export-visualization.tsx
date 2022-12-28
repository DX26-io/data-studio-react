import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getEntity as getVisualmetadataEntity } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { IRootState } from 'app/shared/reducers';
import { useEffect, useRef, useState } from 'react';
import { ValidateFields } from '../visualisation/util/visualisation-render-utils';
import { getConditionExpression } from '../filter/filter-util';
import { VisualWrap } from '../visualisation/util/visualmetadata-wrapper';
import React from 'react';
import TableView from 'app/shared/components/table/table';
import { getEntity as getViewEntity } from 'app/entities/views/views.reducer';
import { useSocket } from 'app/shared/websocket/socket-io-factory';
import { View } from '@react-spectrum/view';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { Button } from '@react-spectrum/button';
import { getTransactionData } from '../visualisation/util/visualisation-utils';
import { CSVLink } from 'react-csv';

export interface IExportVisualizationProps
  extends StateProps,
    DispatchProps,
    RouteComponentProps<{ visualizationId: string; viewId: string }> {}

const ExportVisualization = (props: IExportVisualizationProps) => {
  const [transactionData, setTransactionData] = useState([]);
  const csvLink = useRef(null);
  const { sendEvent } = useSocket();

  useEffect(() => {
    if (props.match.params.visualizationId) {
      props.getVisualmetadataEntity(props.match.params.visualizationId);
      props.getViewEntity(Number(props.match.params.viewId));
    }
  }, []);

  useEffect(() => {
    if (props.visualmetadataEntity.fields && ValidateFields(props.visualmetadataEntity.fields) && props.view?.id) {
      const visualMetadata = VisualWrap(props.visualmetadataEntity);
      const queryDTO = visualMetadata.getQueryParameters(
        props.visualmetadataEntity,
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
      sendEvent(body, props.view?.viewDashboard?.dashboardDatasource?.id, props.view.id);
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
        <Button variant="cta" onPress={() => getTransactionData(props.visualDataById, csvLink, setTransactionData)}>
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
      <View>{props.visualDataById && props.visualDataById.length > 0 && <TableView data={props.visualDataById} />}</View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  selectedFilters: storeState.filter.selectedFilters,
  visualmetadataEntity: storeState.visualmetadata.entity,
  visualDataById: storeState.visualisationData.visualDataById,
});

const mapDispatchToProps = {
  getVisualmetadataEntity,
  getViewEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ExportVisualization);
