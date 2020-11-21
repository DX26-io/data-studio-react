import React, { useState, useEffect } from 'react';
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
  Picker,
  Item,
} from '@adobe/react-spectrum';
import { getEntity, updateEntity, createEntity, reset } from './dashboard.reducer';
import { getEntities } from '../datasources/datasources.reducer';

import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

export interface DashboardModal extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

const DashboardModal = (props: DashboardModal) => {
  const dialog = useDialogContainer();
  const { dashboardEntity, loading, updating, datasourcesList } = props;

  const [dashboardName, setDashboardNameText] = useState();
  const [category, setCategoryText] = useState();
  const [description, setDescriptionText] = useState();
  const [datasource, setDatasourceText] = useState();

  const getDatasourceById = id => {
    const datasource = datasourcesList.filter(function (item) {
      return item.id === id;
    });
    return datasource[0];
  };

  const saveEntity = values => {
    const entity = {
      ...dashboardEntity,
      ...values,
    };
    props.createEntity(entity);
    dialog.dismiss();
    
  };

  const createDashboard = (dashboardName, category, description, datasource) => {
    saveEntity({
      dashboardName: dashboardName,
      category: category,
      description: description,
      dashboardDatasource: getDatasourceById(parseInt(datasource)),
    });
  };
  
  const getAllDatasource = () => {
    props.getEntities();
  };

  useEffect(() => {
    getAllDatasource();
  }, []);

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
              <Picker onSelectionChange={setDatasourceText} label="Datasource">
                {datasourcesList.map((datasources, i) => (
                  <Item key={datasources.id}>{datasources.name}</Item>
                ))}
              </Picker>
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
  datasourcesList: storeState.datasources.entities,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DashboardModal);
