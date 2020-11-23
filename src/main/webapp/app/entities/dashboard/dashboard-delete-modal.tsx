import React from 'react';
import {
  useDialogContainer,
  Dialog,
  Heading,
  Divider,
  Content,
  ButtonGroup,
  Button,
} from '@adobe/react-spectrum';
import { getEntity, deleteEntity } from './dashboard.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Translate } from 'react-jhipster';

export interface DashboardDeleteModal extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
  dashboardId: number;
  dashboardName: React.ReactNode;
}

const DashboardDeleteModal = (props: DashboardDeleteModal) => {
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
