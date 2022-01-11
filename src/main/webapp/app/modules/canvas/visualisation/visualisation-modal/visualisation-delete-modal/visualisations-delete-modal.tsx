import React, { ReactText, useEffect, useState } from 'react';
import { Button, ButtonGroup, Content, Dialog, DialogContainer, Divider, Heading, TextField } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import {
  getEntity,
  deleteEntity as deleteVisualmetadataEntity,
  metadataContainerRemove,
  setVisualisationAction,
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';

interface IVisualisationsDeleteModalProps extends StateProps, DispatchProps {}

const VisualisationsDeleteModal = (props: IVisualisationsDeleteModalProps) => {
  const [visualisationsTitleConfirmation, setVisualisationsTitleConfirmation] = useState<ReactText>('');

  const handleClose = () => {
    props.setVisualisationAction(null);
  };
  const deleteConfirmation = () => {
    return visualisationsTitleConfirmation !== props.visualMetadataEntity.titleProperties.titleText;
  };

  const confirmDelete = () => {
    props.deleteVisualmetadataEntity(props.visualMetadataEntity.id);
    props.metadataContainerRemove(props.visualMetadataEntity.id);
    props.setVisualisationAction(null);
  };

  return (
    <DialogContainer onDismiss={handleClose}>
      <Dialog>
        <Heading>
          <Translate contentKey="datastudioApp.visualmetadata.home.deleteDashboard">Delete Dashboard</Translate>
        </Heading>
        <Divider />
        <Content>
          <Translate
            contentKey="datastudioApp.visualmetadata.delete.question"
            interpolate={{ name: props.visualMetadataEntity.titleProperties.titleText }}
          >
            This will permanently delete the selected dashboard
          </Translate>
          <TextField
            marginTop="size-250"
            placeholder={props.visualMetadataEntity.titleProperties.titleText}
            isRequired
            isQuiet
            width="size-3600"
            onChange={setVisualisationsTitleConfirmation}
          />
        </Content>
        <ButtonGroup>
          <Button variant="secondary" onPress={handleClose}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button variant="negative" onPress={confirmDelete} isDisabled={deleteConfirmation()}>
            <Translate contentKey="entity.action.delete">Delete</Translate>
          </Button>
        </ButtonGroup>
      </Dialog>
    </DialogContainer>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visualMetadataEntity: storeState.visualmetadata.entity,
  deleteSuccess: storeState.visualmetadata.deleteSuccess,
});

const mapDispatchToProps = { getEntity, deleteVisualmetadataEntity, metadataContainerRemove, setVisualisationAction };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationsDeleteModal);
