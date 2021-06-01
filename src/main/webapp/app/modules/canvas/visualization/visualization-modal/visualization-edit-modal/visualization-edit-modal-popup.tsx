import React, { useEffect, useState } from 'react';
import { View, Flex, Dialog, Heading, Divider, Content, ButtonGroup, Button, useDialogContainer } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import './visualization-edit-modal.scss';
import { useHistory } from 'react-router-dom';
import VisualizationProperties from 'app/modules/canvas/visualization/visualization-properties/visualization-properties';
import VisualizationSettings from 'app/modules/canvas/visualization/visualization-settings/visualization-settings';
import { Translate } from 'react-jhipster';
import {
  getEntity as getVisualmetadataEntity,
  updateEntity as updateVisualmetadataEntity,
  setVisual,
  setEditAction,
  metadataContainerUpdate
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import { getViewFeaturesEntities } from 'app/entities/feature/feature.reducer';
import { getEntity as getViewEntity } from 'app/entities/views/views.reducer';
import { renderVisualization, ValidateFields } from '../../util/visualization-render-utils';
import { VisualWrap } from '../../util/visualmetadata-wrapper';
import { forwardCall } from 'app/shared/websocket/proxy-websocket.service';
import { subscribeWebSocket } from 'app/shared/websocket/stomp-client.service';

export interface IVisualizationEditModalProps extends StateProps, DispatchProps {
  id: number;
  viewId: number;
  visualizationId: string;
  setOpen: (isOpen: boolean) => void;
  filterData: any;
  view:any
}

export const VisualizationEditModal = (props: IVisualizationEditModalProps) => {
  const [visualizationData, setData] = useState<any>();
  const dialog = useDialogContainer();
  const visualizationId = props.visualizationId;
  const viewId = props.viewId;

  const handleClose = action => {
    props.setEditAction(action);
    props.setOpen(false);
    props.setVisual(props.visualmetadataEntity);
    dialog.dismiss();
  };

  const handleSave = () => {
    props.updateVisualmetadataEntity({
      viewId,
      visualMetadata: props.visualmetadataEntity,
    });
    props.metadataContainerUpdate(props.visualmetadataEntity.id, props.visualmetadataEntity, 'id');
    handleClose('save');
  };
  useEffect(() => {
    if (visualizationId) {
      props.getVisualmetadataEntity(visualizationId);
      props.getViewFeaturesEntities(viewId);
      props.getViewEntity(viewId);
    }
  }, []);

  const onExchangeMetadata = data => {
    const metaData = data.body === '' ? { data: [] } : JSON.parse(data.body);
    setData(metaData.data);
    if (data.headers.request === 'filters') {
      // console.log('filter data');
    } else {
      renderVisualization(props.visualmetadataEntity, metaData.data, 'visualization-edit');
    }
  };

  const onExchangeMetadataError = data => {
    const body = JSON.parse(data.body || '{}');
  };

  useEffect(() => {
    props.setVisual(props.visualmetadataEntity);
    if (props.visualmetadataEntity.fields && ValidateFields(props.visualmetadataEntity.fields)) {
      subscribeWebSocket('/user/exchange/metaData/' + props.visualmetadataEntity.id, onExchangeMetadata);
      subscribeWebSocket('/user/exchange/metaDataError', onExchangeMetadataError);
      const visualMetadata = VisualWrap(props.visualmetadataEntity);
      const queryDTO = visualMetadata.getQueryParameters(props.visualmetadataEntity, null, null, null);
      const body = {
        queryDTO,
        visualMetadata,
        validationType: 'REQUIRED_FIELDS',
        actionType: null,
        type: 'share-link',
      };
      forwardCall(props.view?.viewDashboard?.dashboardDatasource?.id, body, props.view.id);
    }
  }, [props.visualmetadataEntity]);

  return (
    <Dialog>
      <Heading level={4}>{props.visualmetadataEntity?.titleProperties?.titleText}</Heading>
      <Divider size={'S'} />
      <ButtonGroup>
        <Button
          variant="secondary"
          onPress={() => {
            handleClose('discard');
          }}
        >
          <Translate contentKey="entity.action.discard">Discard</Translate>
        </Button>
        <Button variant="secondary" onPress={handleSave}>
          <Translate contentKey="entity.action.save">Save</Translate>
        </Button>
        <Button
          variant="cta"
          onPress={() => {
            handleClose('apply');
          }}
        >
          <Translate contentKey="entity.action.apply">Apply</Translate>
        </Button>
      </ButtonGroup>
      <Content>
        <Flex direction="row" height="100%" gap="size-75">
          <Flex flex>
            <Flex direction="column" height="100%" flex gap="size-75">
              <View borderWidth="thin" borderColor="default" borderRadius="regular" minHeight="50%">
                <div style={{ height: '100%' }} id={`visualization-edit-${props.visualmetadataEntity.id}`} className="visualization"></div>
              </View>
              <div className="settings-tab">
                <View borderWidth="thin" borderColor="default" borderRadius="regular" minHeight="50%">
                  <VisualizationSettings
                    data={visualizationData}
                    visual={props.visualmetadataEntity}
                    view={props.view}
                    visualizationId={visualizationId}
                    features={props.featuresList}
                    datasource={props.view.viewDashboard.dashboardDatasource}
                    filterData={props.filterData}
                  />
                </View>
              </div>
            </Flex>
          </Flex>
          <div className="properties-tab">
            <View borderWidth="thin" borderColor="default" borderRadius="regular" minHeight={'100%'} width="size-4000">
              <VisualizationProperties features={props.featuresList} visual={props.visualmetadataEntity} />
            </View>
          </div>
        </Flex>
      </Content>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visualmetadataEntity: storeState.visualmetadata.entity,
  featuresList: storeState.feature.entities,
  view: storeState.views.entity,
});

const mapDispatchToProps = {
  setVisual,
  setEditAction,
  getVisualmetadataEntity,
  getViewFeaturesEntities,
  getViewEntity,
  updateVisualmetadataEntity,
  metadataContainerUpdate
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationEditModal);
