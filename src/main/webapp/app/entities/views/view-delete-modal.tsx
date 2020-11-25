import React from 'react';
import { useDialogContainer, Dialog, Heading, Divider, Content, ButtonGroup, Button } from '@adobe/react-spectrum';
import { getEntity, deleteEntity } from './views.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Translate } from 'react-jhipster';

export interface ViewDeleteModal extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
  viewId: number;
  viewdName: React.ReactNode;
}

const ViewDeleteModal = (props: ViewDeleteModal) => {
  const dialog = useDialogContainer();
  const confirmDelete = () => {
    props.deleteEntity(props.viewId);
    dialog.dismiss();
  };

  return (
    <Dialog>
      <Heading>
        <Translate contentKey="datastudioApp.views.home.deleteView">Delete View</Translate>
      </Heading>
      <Divider />
      <Content>
        <span>This will permanently delete the selected </span>
        <span className="spectrum-Heading--XS">{props.viewdName} </span>
        <span>view. continue? </span>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={dialog.dismiss}>
          <Translate contentKey="datastudioApp.views.home.cancelLabel">Cancel</Translate>
        </Button>
        <Button variant="negative" onPress={confirmDelete}>
          <Translate contentKey="datastudioApp.views.home.delete">Delete</Translate>
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
