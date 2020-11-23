import React from 'react';
import {
  View,
  Flex,
  useDialogContainer,
  Dialog,
  Heading,
  Divider,
  Content,
  Form,
  ButtonGroup,
  Button,
  TextField,
  TextArea,
  DialogContainer,
} from '@adobe/react-spectrum';
import { getEntity, deleteEntity } from './dashboard.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import DashboardModal from '../dashboard/dashboard-modal';
import { Translate } from 'react-jhipster';

export interface DashboardPropertiesModal extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
  dashboardId: number;
  dashboardName: string;
  category: string;
  description: string;
  datasource: string;
}

const DashboardPropertiesModal = (props: DashboardPropertiesModal) => {
  const [isOpen, setOpen] = React.useState(false);

  const dialog = useDialogContainer();

  return (
    <Dialog>
      <Heading>{props.dashboardName}</Heading>
      <Divider />
      <Content>
        <DialogContainer type="fullscreenTakeover" onDismiss={() => setOpen(false)} {...props}>
          {isOpen && (
            <DashboardModal
              dashboardName={props.dashboardName}
              datasource={props.datasource}
              description={props.description}
              category={props.category}
              dashboardId={props.dashboardId}
            ></DashboardModal>
          )}
        </DialogContainer>
        <Flex direction="column" gap="size-100" alignItems="center">
          <View padding="size-600">
            <Form isReadOnly isRequired necessityIndicator="icon" width="size-4600">
              <TextField label="Dashboard name" defaultValue={props.dashboardName} />
              <TextField label="Category" defaultValue={props.category} />
              <TextArea label="Description" defaultValue={props.description} />
              <TextField label="Datasource" defaultValue={props.datasource} />
            </Form>
          </View>
        </Flex>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={dialog.dismiss}>
          <Translate contentKey="dashboard.home.cancelLabel">Cancel</Translate>
        </Button>
        <Button variant="cta" onPress={() => setOpen(true)}>
          <Translate contentKey="dashboard.home.editLabel">Edit</Translate>
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPropertiesModal);
