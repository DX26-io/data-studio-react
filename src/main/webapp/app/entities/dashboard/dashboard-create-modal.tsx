import React, { useEffect } from 'react';
import {
  AlertDialog,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogContainer,
  Divider,
  Flex,
  Form,
  Heading,
  Item,
  Picker,
  TextArea,
  TextField,
  useDialogContainer,
  View,
} from '@adobe/react-spectrum';
import { createEntity, getEntity, reset, updateEntity } from './dashboard.reducer';
import { getEntities } from '../datasources/datasources.reducer';

import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { translate, Translate } from 'react-jhipster';

export interface IDashboardCreateModalProps extends StateProps, DispatchProps {}

const DashboardCreateModal = (props: IDashboardCreateModalProps) => {
  const dialog = useDialogContainer();
  const { dashboardEntity, dataSourcesList } = props;
  const [isOpen, setOpen] = React.useState(false);
  const [dashboardName, setDashboardNameText] = React.useState('');
  const [dashboardCategory, setCategoryText] = React.useState('');
  const [dashboardDescription, setDescriptionText] = React.useState('');
  const [dashboardDataSources, setDatasourceText] = React.useState('');
  const [isError, setErrorOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const history = useHistory();

  const getDatasourceByName = id => {
    const _datasource = dataSourcesList.filter(function (item) {
      return item.name === id;
    });
    return _datasource[0];
  };

  const saveEntity = values => {
    const entity = {
      ...dashboardEntity,
      ...values,
    };
    props.createEntity(entity);
  };

  const createDashboard = (name, category, description, datasource) => {
    saveEntity({
      dashboardName: name,
      category,
      description,
      dashboardDatasource: getDatasourceByName(datasource),
    });
  };

  const getAllDatasource = () => {
    props.getEntities();
  };

  const alertClose = () => {
    setOpen(false);
    dialog.dismiss();
  };

  const alertOpen = () => {
    setOpen(false);
    dialog.dismiss();
    history.push('/dashboard/' + props.dashboardEntity.id.toString());
  };

  useEffect(() => {
    getAllDatasource();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      setOpen(true);
    }
    if (props.errorMessage != null) {
      if (props.errorMessage.response.data.message === 'uniqueError') {
        setErrorMessage(translate('dashboard.uniqueError'));
      } else {
        setErrorMessage(translate('dashboard.errorSaving'));
      }
      setErrorOpen(true);
    }
  }, [props.updateSuccess, props.errorMessage]);

  return (
    <Dialog>
      <Heading>
        <Translate contentKey="dashboard.home.createNewDashboard">Create new dashboard</Translate>
      </Heading>
      <Divider />
      <Content>
        <Flex direction="column" gap="size-100" alignItems="center">
          <DialogContainer onDismiss={() => setOpen(false)} {...props}>
            {isOpen && (
              <AlertDialog
                title="Success"
                onPrimaryAction={alertOpen}
                onCancel={alertClose}
                variant="confirmation"
                cancelLabel="Close"
                primaryActionLabel="Open"
              >
                Created view successfully
              </AlertDialog>
            )}
          </DialogContainer>
          <DialogContainer onDismiss={() => setErrorOpen(false)} {...props}>
            {isError && (
              <AlertDialog title="Error" variant="destructive" primaryActionLabel="Close">
                {errorMessage}
              </AlertDialog>
            )}
          </DialogContainer>
          <View padding="size-600">
            <Form isRequired necessityIndicator="icon" minWidth="size-4600">
              <TextField
                label="Dashboard name"
                maxLength={30}
                validationState={dashboardName?.length < 30 ? 'valid' : 'invalid'}
                onChange={setDashboardNameText}
              />
              <TextField
                label="Category"
                maxLength={30}
                validationState={dashboardCategory?.length < 30 ? 'valid' : 'invalid'}
                onChange={setCategoryText}
              />

              <TextArea
                label="Description"
                maxLength={100}
                validationState={dashboardDescription?.length < 100 ? 'valid' : 'invalid'}
                onChange={setDescriptionText}
              />
              <Picker
                validationState={dashboardDataSources?.length !== 0 ? 'valid' : 'invalid'}
                label="Datasource"
                placeholder="Select datasource"
                onSelectionChange={selected => setDatasourceText(selected.toString())}
              >
                {dataSourcesList.map(dataSources => (
                  <Item key={dataSources.name}>{dataSources.name}</Item>
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
        <Button onPress={() => createDashboard(dashboardName, dashboardCategory, dashboardDescription, dashboardDataSources)} variant="cta">
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
  errorMessage: storeState.dashboard.errorMessage,
  dataSourcesList: storeState.datasources.entities,
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardCreateModal);
