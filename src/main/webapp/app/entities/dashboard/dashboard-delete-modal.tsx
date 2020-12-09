import React, { useEffect } from 'react';
import { Button, ButtonGroup, Content, Dialog, DialogContainer, Divider, Heading } from '@adobe/react-spectrum';
import { deleteEntity, getEntity } from './dashboard.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import { RouteComponentProps, useHistory } from 'react-router-dom';

export interface IDashboardDeleteModalProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

const DashboardDeleteModal = (props: IDashboardDeleteModalProps) => {
  const history = useHistory();

  useEffect(() => {
    const dashboardId = props.match.params.id;
    if (dashboardId) {
      props.getEntity(dashboardId);
    }
  }, []);

  const handleDelete = () => {
    props.deleteEntity(props.match.params.id);
    history.push('/dashboards');
  };

  const handleClose = () => {
    history.push('/dashboards');
  };

  return (
    <DialogContainer onDismiss={() => handleClose()}>
      <Dialog>
        <Heading>
          <Translate contentKey="dashboard.home.deleteDashboard">Delete Dashboard</Translate>
        </Heading>
        <Divider />
        <Content>
          <Translate contentKey="dashboard.delete.question" interpolate={{ name: props.dashboardEntity.dashboardName }}>
            This will permanently delete the selected dashboard
          </Translate>
        </Content>
        <ButtonGroup>
          <Button variant="secondary" onPress={() => handleClose()}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button variant="negative" onPress={handleDelete}>
            <Translate contentKey="entity.action.delete">Delete</Translate>
          </Button>
        </ButtonGroup>
      </Dialog>
    </DialogContainer>
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
