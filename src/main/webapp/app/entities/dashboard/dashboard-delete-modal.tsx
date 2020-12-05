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
  const dialog = useDialogContainer();
  const handleDelete = () => {
    dialog.dismiss();
    props.deleteEntity(props.dashboardId);
  };

  return (
    <Dialog>
      <Heading>
        <Translate contentKey="dashboard.home.deleteDashboard">Delete Dashboard</Translate>
      </Heading>
      <Divider />
      <Content>
        <Translate contentKey="dashboard.delete.question" interpolate={{ name: props.dashboardName }}>
          This will permanently delete the selected dashboard
        </Translate>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={dialog.dismiss}>
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button variant="negative" onPress={handleDelete}>
          <Translate contentKey="entity.action.delete">Delete</Translate>
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
