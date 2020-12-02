import React from 'react';
import { Button, ButtonGroup, Content, Dialog, Divider, Heading, useDialogContainer } from '@adobe/react-spectrum';
import { deleteEntity, getEntity } from './dashboard.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';

export interface IDashboardDeleteModalProps extends StateProps, DispatchProps {
  dashboardId: number;
  dashboardName: React.ReactNode;
}

const DashboardDeleteModal = (props: IDashboardDeleteModalProps) => {
  const confirmDelete = () => {
    props.deleteEntity(props.dashboardId);
  };

  const dialog = useDialogContainer();

  return (
    <Dialog>
      <Heading>
        <Translate contentKey="dashboard.home.deleteDashboard">Delete Dashboard</Translate>
      </Heading>
      <Divider />
      <Content>
        <span>This will permanently delete the selected </span>
        <span className="spectrum-Heading--XS">{props.dashboardName} </span>
        <span>dashboard. continue? </span>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={dialog.dismiss}>
          <Translate contentKey="dashboard.home.cancelLabel">Cancel</Translate>
        </Button>
        <Button variant="negative" onPress={confirmDelete}>
          <Translate contentKey="dashboard.home.delete">Delete</Translate>
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardDeleteModal);
