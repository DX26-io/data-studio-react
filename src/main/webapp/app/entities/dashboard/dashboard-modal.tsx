import React, { useEffect } from 'react';
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
import { Translate } from 'react-jhipster';

export interface DashboardModal extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
  dashboardId?: number;
  dashboardName?: string;
  category?: string;
  description?: string;
  datasource?: string;
}

const DashboardModal = (props: DashboardModal) => {
  const dialog = useDialogContainer();
  const { dashboardEntity, loading, updating, datasourcesList } = props;

  const [dashboarName, setDashboardNameText] = React.useState(props.dashboardName ? props.dashboardName : '');
  const [dashboarCategory, setCategoryText] = React.useState(props.category ? props.category : '');
  const [dashboarDescription, setDescriptionText] = React.useState(props.description ? props.description : '');
  const [dashboarDatasources, setDatasourceText] = React.useState(props.datasource ? props.datasource : '');

  const getDatasourceByName = id => {
    const _datasource = datasourcesList.filter(function (item) {
      return item.name === id;
    });
    return _datasource[0];
  };

  const saveEntity = values => {
    const entity = {
      ...dashboardEntity,
      ...values,
    };
    if (props.dashboardId) {
      props.updateEntity(entity);
    } else {
      props.createEntity(entity);
    }
    dialog.dismiss();
    window.location.reload();
  };

  const createDashboard = (dashboardName, category, description, datasource) => {
    saveEntity({
      dashboardName,
      category,
      description,
      dashboardDatasource: getDatasourceByName(datasource),
    });
  };

  const getAllDatasource = () => {
    props.getEntities();
  };

  useEffect(() => {
    getAllDatasource();
    if (props.dashboardId) {
      props.getEntity(props.dashboardId);
    }
  }, []);

  return (
    <Dialog>
      {props.dashboardId != null ? (
        <Heading>Edit {props.dashboardEntity.dashboardName}</Heading>
      ) : (
        <Heading>
          <Translate contentKey="dashboard.home.createNewDashboard">Create new dashboard</Translate>
        </Heading>
      )}

      <Divider />
      <Content>
        <Flex direction="column" gap="size-100" alignItems="center">
          <View padding="size-600">
            <Form isRequired necessityIndicator="icon" minWidth="size-4600">
              <TextField
                label="Dashboard name"
                maxLength={30}  
                validationState={dashboarName?.length < 30 ? 'valid' : 'invalid'}
                value={dashboarName}
                onChange={setDashboardNameText}
              />
              <TextField
                label="Category"
                maxLength={30}
                validationState={dashboarCategory?.length < 30 ? 'valid' : 'invalid'}
                onChange={setCategoryText}
                value={dashboarCategory}
              />

              <TextArea
                value={dashboarDescription}
                label="Description"
                maxLength={100}
                validationState={dashboarDescription?.length < 100 ? 'valid' : 'invalid'}
                onChange={setDescriptionText}
              />
              <Picker
                validationState={dashboarDatasources?.length !== 0 ? 'valid' : 'invalid'}
                label="Datasource"
                selectedKey={dashboarDatasources}
                placeholder="Select datasource"
                onSelectionChange={selected => setDatasourceText(selected.toString())}
              >
                {datasourcesList.map((datasources, i) => (
                  <Item key={datasources.name}>{datasources.name}</Item>
                ))}
              </Picker>
            </Form>
          </View>
        </Flex>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={dialog.dismiss}>
          <Translate contentKey="dashboard.home.cancelLabel">Cancel</Translate>
        </Button>
        <Button onPress={() => createDashboard(dashboarName, dashboarCategory, dashboarDescription, dashboarDatasources)} variant="cta">
          <Translate contentKey="dashboard.home.save">Save</Translate>
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
