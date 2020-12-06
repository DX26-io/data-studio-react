import React from 'react';
import { useDialogContainer, Dialog, Heading, Divider, Content, ButtonGroup, Button } from '@adobe/react-spectrum';
import { getEntity, deleteEntity } from './views.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';

export interface IViewDeleteModalProps extends StateProps, DispatchProps {
  viewId: number;
  viewName: React.ReactNode;
}

const ViewDeleteModal = (props: IViewDeleteModalProps) => {
  const dialog = useDialogContainer();
  const confirmDelete = () => {
    props.deleteEntity(props.viewId, props.dashboardEntity.id);
    dialog.dismiss();
  };

  return (
    <Dialog>
      <Heading>
        <Translate contentKey="views.home.deleteView">Delete View</Translate>
      </Heading>
      <Divider />
      <Content>
        <span>This will permanently delete the selected </span>
        <span className="spectrum-Heading--XS">{props.viewName} </span>
        <span>view. continue? </span>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={dialog.dismiss}>
          <Translate contentKey="entity.action.cancel">close</Translate>
        </Button>
        <Button variant="negative" onPress={confirmDelete}>
          <Translate contentKey="entity.action.delete">delete</Translate>
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};

const mapStateToProps = ({ dashboard }: IRootState) => ({
  dashboardEntity: dashboard.entity,
  updateSuccess: dashboard.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ViewDeleteModal);
