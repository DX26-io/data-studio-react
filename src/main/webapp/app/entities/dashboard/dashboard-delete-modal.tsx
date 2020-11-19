import React, { useEffect } from 'react';
import {
  Image,
  View,
  Flex,
  useDialogContainer,
  Dialog,
  Heading,
  Divider,
  Content,
  Form,
  Text,
  ButtonGroup,
  Button,
} from '@adobe/react-spectrum';
import { DisplayNamePlaceholder } from 'app/shared/components/placeholder/placeholder';
import { getEntity, deleteEntity } from './dashboard.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

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
      <Heading>Delete Dashboard</Heading>
      <Divider />
      <Content>
        <span>This will permanently delete the selected </span>
        <span className="spectrum-Heading--XS">{props.dashboardName} </span>
        <span>dashboard. continue? </span>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={dialog.dismiss}>
          Cancel
        </Button>
        <Button variant="negative" onPress={confirmDelete}>
          Delete
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
