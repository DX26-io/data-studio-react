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
  TextField,
  TextArea,
} from '@adobe/react-spectrum';
import { DisplayNamePlaceholder } from 'app/shared/components/placeholder/placeholder';
import { getEntity, deleteEntity } from './dashboard.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

export interface DashboardPropertiesModal extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
  dashboardId: number;
  dashboardName: string;
  category: string;
  description:string;
  datasource: string;
}

const DashboardPropertiesModal = (props: DashboardPropertiesModal) => {
  const confirmDelete = () => {
    props.deleteEntity(props.dashboardId);
  };

  const dialog = useDialogContainer();

  return (
    <Dialog>
      <Heading>{props.dashboardName}</Heading>
      <Divider />
      <Content>
      <Flex direction="column" gap="size-100" alignItems="center">
        <View padding="size-600">
          <Form isReadOnly isRequired necessityIndicator="icon" width="size-4600">
            <TextField  label="Dashboard name" defaultValue={props.dashboardName} />
            <TextField label="Category"  defaultValue={props.category}/>
            <TextArea label="Description"  defaultValue={props.description}/>
            <TextField label="Datasource" defaultValue={props.datasource}/>
          </Form>
        </View>
      </Flex>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={dialog.dismiss}>
          Cancel
        </Button>
        <Button variant="cta" onPress={confirmDelete}>
          Edit
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
