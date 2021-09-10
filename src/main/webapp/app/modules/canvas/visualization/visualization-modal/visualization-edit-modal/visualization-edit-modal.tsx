import React, { useEffect } from 'react';
import { View, Flex, Dialog, Heading, Divider, Content, Text, ButtonGroup, Button, DialogContainer } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import './visualization-edit-modal.scss';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import VisualizationProperties from 'app/modules/canvas/visualization/visualization-properties/visualization-properties';
import VisualizationSettings from 'app/modules/canvas/visualization/visualization-settings/visualization-settings';
import { Translate } from 'react-jhipster';
import {
  getEntity as getVisualmetadataEntity,
  updateEntity as updateVisualmetadataEntity,
  setVisual,
  metadataContainerUpdate,
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import { getEntity as getViewEntity } from 'app/entities/views/views.reducer';
export interface IVisualizationEditModalProps1
  extends StateProps,
    DispatchProps,
    RouteComponentProps<{ id: string; viewId: string; visualizationId: string }> {}

const VisualizationEditModal = (props: IVisualizationEditModalProps1) => {
  const history = useHistory();
  const visualizationId = props.match.params.visualizationId;
  const viewId = props.match.params.viewId;

  const handleClose = () => {
    history.push(`/dashboards/build?dashboardId=${props.match.params.id}&viewId=${props.match.params.viewId}`);
  };

  const handleSave = () => {
    props.updateVisualmetadataEntity({
      viewId: parseInt(viewId, 10),
      visualMetadata: props.visualmetadataEntity,
    });
    props.metadataContainerUpdate(props.visualmetadataEntity.id, props.visualmetadataEntity, 'id');
  };

  useEffect(() => {
    if (visualizationId) {
      props.getVisualmetadataEntity(visualizationId);
      props.getViewEntity(viewId);
    }
  }, []);

  useEffect(() => {
    props.setVisual(props.visualmetadataEntity);
  }, [props.visualmetadataEntity]);
  return (
    <>
      <DialogContainer type="fullscreenTakeover" onDismiss={handleClose}>
        <Dialog>
          <Heading level={4}>{props.visualmetadataEntity?.titleProperties?.titleText}</Heading>
          <Divider size={'S'} />
          <ButtonGroup>
            <Button variant="secondary" onPress={handleClose}>
              <Translate contentKey="entity.action.discard">Discard</Translate>
            </Button>
            <Button variant="secondary" onPress={handleSave}>
              <Translate contentKey="entity.action.save">Save</Translate>
            </Button>
            <Button variant="cta" onPress={handleClose}>
              <Translate contentKey="entity.action.apply">Apply</Translate>
            </Button>
          </ButtonGroup>
          <Content>
            <Flex direction="row" height="100%" gap="size-75">
              <View flex>
                <Flex direction="column" height="100%" flex gap="size-75">
                  <View borderWidth="thin" borderColor="default" borderRadius="regular" height="50%"></View>
                  <View borderWidth="thin" borderColor="default" borderRadius="regular" height="50%">
                    <VisualizationSettings visual={props.visualmetadataEntity} view={props.view} visualizationId={visualizationId} />
                  </View>
                </Flex>
              </View>
              <div className="properties-tab">
                <View borderWidth="thin" borderColor="default" borderRadius="regular" minHeight={'100%'} width="size-4000">
                  <VisualizationProperties  />
                </View>
              </div>
            </Flex>
          </Content>
        </Dialog>
      </DialogContainer>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visualmetadataEntity: storeState.visualmetadata.entity,
  featuresList: storeState.feature.entities,
  view: storeState.views.entity,
});

const mapDispatchToProps = {
  metadataContainerUpdate,
  setVisual,
  getVisualmetadataEntity,
  getViewEntity,
  updateVisualmetadataEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationEditModal);
