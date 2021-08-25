import React, { ReactText, useEffect, useState } from 'react';
import { Button, ButtonGroup, Content, Dialog, DialogContainer, Divider, Heading, TextField } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import {
  getEntity,
  deleteEntity as deleteVisualmetadataEntity,
  metadataContainerRemove,
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';

interface IVisualizationsDeleteModalProps
  extends StateProps,
    DispatchProps,
    RouteComponentProps<{ id: string; visualizationId: string; viewId: string }> {}

const VisualizationsDeleteModal = (props: IVisualizationsDeleteModalProps) => {
  const [visualizationsTitleConfirmation, setvisualizationsTitleConfirmation] = useState<ReactText>('');
  const [visualizationsTitle, setvisualizationsTitle] = useState('');

  useEffect(() => {
    props.getEntity(props.match.params.visualizationId);
  }, []);

  const handleClose = () => {
    props.history.push(`/dashboards/build?dashboardId=${props.match.params.id}&viewId=${props.match.params.viewId}`);
  };
  const deleteConfirmation = () => {
    return visualizationsTitleConfirmation !== visualizationsTitle;
  };

  useEffect(() => {
    if (props.deleteSuccess) {
      props.metadataContainerRemove(props.match.params.visualizationId);
      handleClose();
    }
    if (props.visualmetadataEntity.id) {
      setvisualizationsTitle(props.visualmetadataEntity.titleProperties.titleText);
    }
  }, [props.deleteSuccess, props.visualmetadataEntity]);

  const confirmDelete = () => {
    props.deleteVisualmetadataEntity(props.match.params.visualizationId);
  };

  return (
    <DialogContainer onDismiss={handleClose}>
      <Dialog>
        <Heading>
          <Translate contentKey="datastudioApp.visualmetadata.home.deleteDashboard">Delete Dashboard</Translate>
        </Heading>
        <Divider />
        <Content>
          <Translate contentKey="datastudioApp.visualmetadata.delete.question" interpolate={{ name: visualizationsTitle }}>
            This will permanently delete the selected dashboard
          </Translate>
          <TextField
            marginTop="size-250"
            placeholder={visualizationsTitle}
            isRequired
            isQuiet
            width="size-3600"
            onChange={setvisualizationsTitleConfirmation}
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
  visualmetadataEntity: storeState.visualmetadata.entity,
  deleteSuccess: storeState.visualmetadata.deleteSuccess,
});

const mapDispatchToProps = { getEntity, deleteVisualmetadataEntity, metadataContainerRemove };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationsDeleteModal);
