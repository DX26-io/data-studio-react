import React, { useState, useEffect } from 'react';
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
import { getEntity, updateEntity, createEntity, reset } from './dashboard.reducer';

import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

export interface DashboardModal extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

const DashboardModal = (props: DashboardModal) => {
  const dialog = useDialogContainer();
  const { dashboardEntity, loading, updating } = props;

  let [dashboardName, setDashboardNameText] = useState();
  let [category, setCategoryText] = useState();
  let [description, setDescriptionText] = useState();
  let [datasource, setDatasourceText] = useState();

  const createDashboard = (dashboardName, category, description, datasource) => {
    alert('d');
    saveEntity({
      dashboardName: dashboardName,
      category: category,
      description: description,
      dashboardDatasource: parseInt( datasource),
    });
  };

  const saveEntity = values => {
    const entity = {
      ...dashboardEntity,
      ...values,
    };
    props.createEntity(entity);
  };

  return (
    <Dialog>
      <Heading>Create new dashboard</Heading>
      <Divider />
      <Content>
        <Flex direction="column" gap="size-100" alignItems="center">
          <View padding="size-600">
            <Form isRequired necessityIndicator="icon" width="size-4600">
              <TextField label="Dashboard name" onChange={setDashboardNameText} />
              <TextField label="Category" onChange={setCategoryText} />
              <TextArea label="Description" onChange={setDescriptionText} />
              <TextField label="Datasource" onChange={setDatasourceText} />
            </Form>
          </View>
        </Flex>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={dialog.dismiss}>
          Cancel
        </Button>
        <Button onPress={() => createDashboard(dashboardName, category, description, datasource)} variant="cta">
          Save
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  dashboardEntity: storeState.dashboard.entity,
  loading: storeState.dashboard.loading,
  updating: storeState.dashboard.updating,
  updateSuccess: storeState.dashboard.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DashboardModal);
