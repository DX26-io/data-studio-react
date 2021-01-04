import React, { useEffect } from 'react';
import { View, Flex, Dialog, Heading, Divider, Content, Text, ButtonGroup, Button, DialogContainer } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import './dx26-modal.scss';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import IDx26Properties from './partials/dx26-properties';
import IDx26Settings from './partials/dx26-settings';
import { Translate } from 'react-jhipster';
import {
  getEntity as getVisualmetadataEntity,
  updateEntity as updateVisualmetadataEntity,
} from '../../entities/visualmetadata/visualmetadata.reducer';
import { getDatasourcesFeaturesEntities as getfeatureEntities } from '../../entities/feature/feature.reducer';
import { getEntity as getViewEntity } from '../../entities/views/views.reducer';

export interface IDx26ModalProps
  extends StateProps,
    DispatchProps,
    RouteComponentProps<{ id: string; viewId: string; visualizationId: string }> {}

const Dx26Modal = (props: IDx26ModalProps) => {
  const history = useHistory();
  const visualizationId = props.match.params.visualizationId;
  const viewId = props.match.params.viewId;

  const handleClose = () => {
    history.push('/dashboards/' + props.match.params.id + '/' + props.match.params.viewId + '/build');
  };

  const handleSave = () => {
    props.updateVisualmetadataEntity({
      viewId: parseInt(viewId,10),
      visualMetadata: props.visualmetadataEntity,
    });
  };
  useEffect(() => {
    if (visualizationId) {
      props.getVisualmetadataEntity(visualizationId);
      props.getfeatureEntities(parseInt(viewId, 10));
      props.getViewEntity(viewId);
    }
  }, []);

  return (
    <>
      <DialogContainer type="fullscreenTakeover" onDismiss={handleClose}>
        <Dialog>
          <Heading level={4}>{props.visualmetadataEntity?.titleProperties?.titleText}</Heading>
          <Divider  size={"S"} />
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
                    <IDx26Settings visualizationId={visualizationId} />
                  </View>
                </Flex>
              </View>
              <div className="properties-tab">
                <View borderWidth="thin" borderColor="default" borderRadius="regular" minHeight={"100%"} width="size-4000">
                  <IDx26Properties features={props.featuresList} visual={props.visualmetadataEntity} />
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

const mapDispatchToProps = { getVisualmetadataEntity, getfeatureEntities, getViewEntity, updateVisualmetadataEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dx26Modal);
