import React, { useEffect } from 'react';
import { useDialogContainer, Dialog, Heading, Divider, Content, ButtonGroup, Button, DialogContainer } from '@adobe/react-spectrum';
import { getEntity, deleteEntity } from './views.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import { RouteComponentProps, useHistory } from 'react-router-dom';
export interface IViewDeleteModalProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string; viewId: string }> {}

const ViewDeleteModal = (props: IViewDeleteModalProps) => {
  const [isViewDeleteModelOpen, setViewDeleteModelOpen] = React.useState(true);
  const history = useHistory();
  const confirmDelete = () => {
    props.deleteEntity(props.match.params.viewId, props.match.params.id);
  };

  useEffect(() => {
    if (props.match.params.viewId) {
      props.getEntity(props.match.params.viewId);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      history.push('/dashboards/' +  props.match.params.id);
    }
  }, [props.updateSuccess, props.errorMessage, props.viewEntity]);

  return (
    <DialogContainer onDismiss={() => setViewDeleteModelOpen(false)}>
      {isViewDeleteModelOpen && (
        <Dialog>
          <Heading>
            <Translate contentKey="views.home.deleteView">Delete View</Translate>
          </Heading>
          <Divider />
          <Content>
            <Translate contentKey="views.delete.question" interpolate={{ param: props.viewEntity.viewName }}>
              This will permanently delete the selected <strong>{props.viewEntity.viewName}</strong> view. continue?
            </Translate>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={() => history.push('/dashboards/' +  props.match.params.id)}>
              <Translate contentKey="entity.action.cancel">close</Translate>
            </Button>
            <Button variant="negative" onPress={confirmDelete}>
              <Translate contentKey="entity.action.delete">delete</Translate>
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
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
