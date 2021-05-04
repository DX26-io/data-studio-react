import React, { ReactText, useEffect, useState } from 'react';
import { Button, ButtonGroup, Content, Dialog, DialogContainer, Divider, Heading, TextField } from '@adobe/react-spectrum';
import { deleteEntity, getEntity } from './dashboard.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate, Translate } from 'react-jhipster';
import { RouteComponentProps, useHistory } from 'react-router-dom';

export interface IDashboardDeleteModalProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

const DashboardDeleteModal = (props: IDashboardDeleteModalProps) => {
  const history = useHistory();
  const [dashboardNameConfirmation, setDashboardNameConfirmation] = useState<ReactText>('');
  const handleDelete = () => {
    props.deleteEntity(props.match.params.id);
  };

  const handleClose = () => {
    history.push('/dashboards');
  };

  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const deleteConfirmation = () => {
    return dashboardNameConfirmation !== props.dashboardEntity.dashboardName;
  };

  return (
    <DialogContainer onDismiss={handleClose}>
      <Dialog>
        <Heading>
          <Translate contentKey="dashboard.home.deleteDashboard">Delete Dashboard</Translate>
        </Heading>
        <Divider />
        <Content>
          <Translate contentKey="dashboard.delete.question" interpolate={{ name: props.dashboardEntity.dashboardName }}>
            This will permanently delete the selected dashboard
          </Translate>
          <TextField
            marginTop="size-250"
            label={translate('dashboard.dashboard_name')}
            placeholder={translate('dashboard.dashboard_name')}
            isRequired
            isQuiet
            width="size-3600"
            onChange={setDashboardNameConfirmation}
          />
        </Content>
        <ButtonGroup>
          <Button variant="secondary" onPress={handleClose}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button variant="negative" onPress={handleDelete} isDisabled={deleteConfirmation()}>
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
