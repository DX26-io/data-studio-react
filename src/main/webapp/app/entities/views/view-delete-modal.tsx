import React, { ReactText, useEffect, useState } from 'react';
import { Dialog, Heading, Divider, Content, ButtonGroup, Button, DialogContainer, TextField } from '@adobe/react-spectrum';
import { getEntity, deleteEntity } from './views.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate, Translate } from 'react-jhipster';
import { RouteComponentProps, useHistory } from 'react-router-dom';
export interface IViewDeleteModalProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string; viewId: string }> {}

const ViewDeleteModal = (props: IViewDeleteModalProps) => {
  const history = useHistory();
  const [viewNameConfirmation, setViewNameConfirmation] = useState<React.Key>('');
  const viewId = props.match.params.viewId;
  const dashboardId = props.match.params.id;

  const confirmDelete = () => {
    props.deleteEntity(viewId, dashboardId);
  };

  const handleClose = () => {
    history.push('/dashboards/' + dashboardId);
  };

  useEffect(() => {
    if (viewId) {
      props.getEntity(viewId);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess, props.errorMessage, props.viewEntity]);

  const deleteConfirmation = () => {
    return viewNameConfirmation !== props.viewEntity.viewName;
  };

  return (
    <DialogContainer onDismiss={() => handleClose()}>
      <Dialog>
        <Heading>
          <Translate contentKey="views.home.deleteView">Delete View</Translate>
        </Heading>
        <Divider />
        <Content>
          <Translate contentKey="views.delete.question" interpolate={{ param: props.viewEntity.viewName }}>
            This will permanently delete the selected
          </Translate>
          <br />
          <TextField
            marginTop="size-250"
            label={translate('views.viewName')}
            placeholder={translate('views.viewName')}
            isRequired={true}
            isQuiet={true}
            width="size-3600"
            onChange={setViewNameConfirmation}
          />
        </Content>
        <ButtonGroup>
          <Button variant="secondary" onPress={() => history.push('/dashboards/' + dashboardId)}>
            <Translate contentKey="entity.action.cancel">close</Translate>
          </Button>
          <Button variant="negative" onPress={confirmDelete} isDisabled={deleteConfirmation()}>
            <Translate contentKey="entity.action.delete">delete</Translate>
          </Button>
        </ButtonGroup>
      </Dialog>
    </DialogContainer>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  viewEntity: storeState.views.entity,
  updateSuccess: storeState.views.updateSuccess,
  errorMessage: storeState.views.errorMessage,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ViewDeleteModal);
