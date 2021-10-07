import React, { ReactText, useEffect, useState } from 'react';
import { Button, ButtonGroup, Content, Dialog, DialogContainer, Divider, Heading, TextField} from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import {
  getEntity,
  deleteEntity as deleteVisualmetadataEntity,
  metadataContainerRemove,
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';

interface IVisualisationsDeleteModalProps
extends StateProps,
DispatchProps,
RouteComponentProps<{ id: string; visualisationId: string; viewId: string }> {
  setOpen: (isOpen: boolean) => any;
  viewId: number;
  visualisationId:string
}

const VisualisationsDeleteModal = (props: IVisualisationsDeleteModalProps) => {
  const [visualisationsTitleConfirmation, setVisualisationsTitleConfirmation] = useState<ReactText>('');
  const [visualisationsTitle, setVisualisationsTitle] = useState('');
  
  useEffect(() => {
    props.getEntity(props.visualisationId);
  }, []);
  const handleClose = () => {
    props.setOpen(false)
  };
  const deleteConfirmation = () => {
    return visualisationsTitleConfirmation !== visualisationsTitle;
  };
  
  useEffect(() => {
    if (props.deleteSuccess) {
      props.metadataContainerRemove(props.visualisationId);
      handleClose();
    }
    if (props.visualMetadataEntity.id) {
      setVisualisationsTitle(props.visualMetadataEntity.titleProperties.titleText);
    }
  }, [props.deleteSuccess, props.visualMetadataEntity]);
  
  const confirmDelete = () => {
    props.deleteVisualmetadataEntity(props.visualisationId);
    handleClose();
  };
  
  return (
    <DialogContainer onDismiss={handleClose}>
      <Dialog>
        <Heading>
          <Translate contentKey="datastudioApp.visualmetadata.home.deleteDashboard">Delete Dashboard</Translate>
        </Heading>
        <Divider />
        <Content>
          <Translate contentKey="datastudioApp.visualmetadata.delete.question" interpolate={{ name: visualisationsTitle }}>
            This will permanently delete the selected dashboard
          </Translate>
          <TextField
            marginTop="size-250"
            placeholder={visualisationsTitle}
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

const mapDispatchToProps = { getEntity, deleteVisualmetadataEntity, metadataContainerRemove };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationsDeleteModal);
