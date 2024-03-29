import React, { useEffect, useRef, useState } from 'react';
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
  View,
} from '@adobe/react-spectrum';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createEntity, getEntity, reset, updateEntity } from './dashboard.reducer';
import { getDatasources as getDataSourceEntities } from 'app/modules/administration/sources/datasources/datasources.reducer';
import { IRootState } from 'app/shared/reducers';
import { generateDatasourcesOptions, isCreateEditFormNotValid } from './dashboard-util';
import { translate, Translate } from 'react-jhipster';
import Select from 'react-select';

export interface IDashboardCreateModalProps extends StateProps, DispatchProps {}

const DashboardCreateModal = (props: IDashboardCreateModalProps) => {
  const history = useHistory();
  const dashboardNameInputEl = useRef(null);
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardCategory, setDashboardCategory] = useState('');
  const [dashboardDescription, setDescription] = useState('');
  const [dashboardDataSource, setDatasource] = useState('');
  const [createSuccessDialog, setCreateSuccessDialog] = useState(false);
  const [createErrorDialog, setCreateErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { dashboardEntity, dataSourcesList, updating } = props;

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

  const handleOpenOnSuccessDialog = () => {
    setCreateSuccessDialog(false);
    history.push('/dashboards/' + dashboardEntity.id.toString());
  };

  const handleCloseOnSuccessDialog = () => {
    setCreateSuccessDialog(false);
    props.reset();
    history.push('/dashboards');
  };

  const handleClose = () => {
    history.push('/dashboards');
  };

  useEffect(() => {
    props.reset();
    props.getDataSourceEntities();
    dashboardNameInputEl.current.focus();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      setCreateSuccessDialog(true);
    }
    if (props.errorMessage != null) {
      if (props.errorMessage.response.data.message === 'uniqueError') {
        setErrorMessage(translate('dashboard.uniqueError.create', { param: dashboardName }));
      } else {
        setErrorMessage(translate('dashboard.error.content'));
      }
      setCreateErrorDialog(true);
    }
  }, [props.updateSuccess, props.errorMessage]);

  return (
    <>
      <DialogContainer type="fullscreenTakeover" onDismiss={handleClose}>
        <Dialog>
          <Heading>
            <Translate contentKey="dashboard.home.createNewDashboard">Create new dashboard</Translate>
          </Heading>
          <Divider />
          <Content>
            <Flex direction="column" gap="size-100" alignItems="center">
              <View padding="size-600">
                <Form isRequired necessityIndicator="icon" minWidth="size-4600">
                  <TextField
                    ref={dashboardNameInputEl}
                    label={translate('dashboard.dashboard_name')}
                    maxLength={30}
                    validationState={dashboardName?.length < 30 ? 'valid' : 'invalid'}
                    onChange={setDashboardName}
                    isRequired
                  />
                  {dashboardName?.length >= 30 && <span className="spectrum-Body-emphasis error-message">
                    <Translate contentKey="dashboard.validatioError.createNewdashboard.name">Dashboard name cannot be longer than 30 characters.</Translate>
                  </span>}
                  <TextField
                    label={translate('dashboard.category')}
                    maxLength={30}
                    validationState={dashboardCategory?.length < 30 ? 'valid' : 'invalid'}
                    minLength={1}
                    onChange={setDashboardCategory}
                    isRequired
                  />
                  {dashboardCategory?.length >= 30 && <span className="spectrum-Body-emphasis error-message">
                    <Translate contentKey="dashboard.validatioError.createNewdashboard.category">Category cannot be longer than 30 characters.</Translate>
                  </span>}
                  <TextArea
                    label={translate('dashboard.description')}
                    maxLength={100}
                    isRequired={false}
                    validationState={dashboardDescription?.length < 100 ? 'valid' : 'invalid'}
                    onChange={setDescription}
                  />
                  {dashboardDescription?.length >= 100 && <span className="spectrum-Body-emphasis error-message">
                    <Translate contentKey="dashboard.validatioError.createNewdashboard.description">Description cannot be longer than 100 characters.</Translate>
                  </span>}
                  <span className="spectrum-Body-emphasis--sizeXXS">{translate('dashboard.datasource')}</span>
                  <Select
                    placeholder={translate('dashboard.datasource_placeholder')}
                    value={{ label: dashboardDataSource, value: dashboardDataSource }}
                    onChange={event => {
                      if (event) {
                        setDatasource(event.label.toString());
                      }
                    }}
                    options={generateDatasourcesOptions(dataSourcesList)}
                  />
                </Form>
              </View>
            </Flex>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={handleClose}>
              <Translate contentKey="entity.action.cancel">Cancel</Translate>
            </Button>
            <Button
              isDisabled={isCreateEditFormNotValid({ dashboardName, dashboardCategory, dashboardDataSource }) || updating}
              onPress={() => createDashboard(dashboardName, dashboardCategory, dashboardDescription, dashboardDataSource)}
              variant="cta"
            >
              <Translate contentKey="entity.action.create">Create</Translate>
            </Button>
          </ButtonGroup>
        </Dialog>
      </DialogContainer>

      <DialogContainer onDismiss={() => setCreateSuccessDialog(false)}>
        {createSuccessDialog && (
          <AlertDialog
            title={translate('dashboard.createdDailog.header')}
            onPrimaryAction={handleOpenOnSuccessDialog}
            onCancel={handleCloseOnSuccessDialog}
            variant="confirmation"
            cancelLabel={translate('entity.action.cancel')}
            primaryActionLabel={translate('entity.action.open')}
          >
            <Translate contentKey="dashboard.createdDailog.content">Created dashboard successfully</Translate>
          </AlertDialog>
        )}
      </DialogContainer>
      <DialogContainer onDismiss={() => setCreateErrorDialog(false)}>
        {createErrorDialog && (
          <AlertDialog
            title={translate('dashboard.errorDailog.header')}
            variant="destructive"
            primaryActionLabel={translate('entity.action.cancel')}
          >
            {errorMessage}
          </AlertDialog>
        )}
      </DialogContainer>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  dashboardEntity: storeState.dashboard.entity,
  loading: storeState.dashboard.loading,
  updating: storeState.dashboard.updating,
  updateSuccess: storeState.dashboard.updateSuccess,
  errorMessage: storeState.dashboard.errorMessage,
  dataSourcesList: storeState.datasources.datasources,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
  getDataSourceEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DashboardCreateModal);
