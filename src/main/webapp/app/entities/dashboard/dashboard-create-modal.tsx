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
import { getEntities as getDataSourceEntities } from '../datasources/datasources.reducer';
import { IRootState } from 'app/shared/reducers';
import {
  isCreateEditFormNotValid,
  getDashboardFromTranslations,
  getDashboardSuccessTranslations,
  getDashboardErrorTranslations,
} from './dashboard-util';
import { translate, Translate } from 'react-jhipster';

export interface IDashboardCreateModalProps extends StateProps, DispatchProps {}

const DashboardCreateModal = (props: IDashboardCreateModalProps) => {
  const history = useHistory();
  const dashboardNameInputEl = useRef(null);
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardCategory, setCategory] = useState('');
  const [dashboardDescription, setDescription] = useState('');
  const [dashboardDataSource, setDatasource] = useState('');
  const [createSuccessDialog, setCreateSuccessDialog] = useState(false);
  const [createErrorDialog, setCreateErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { dashboardEntity, dataSourcesList, updating } = props;
  const { DASHBOARD_LABEL, CATEGORY_LABEL, DESCRIPTION_LABEL, DATASOURCE_LABEL, DATASOURCE_PLACEHOLDER } = getDashboardFromTranslations();
  const { SUCCESS_LABEL, SUCCESS_CLOSE_LABEL, PRIMARY_ACTION_LABEL } = getDashboardSuccessTranslations();
  const { ERROR_LABEL, ERROR_CLOSE_LABEL } = getDashboardErrorTranslations();

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
                    label={DASHBOARD_LABEL}
                    maxLength={30}
                    validationState={dashboardName?.length < 30 ? 'valid' : 'invalid'}
                    onChange={setDashboardName}
                  />
                  <TextField
                    label={CATEGORY_LABEL}
                    maxLength={30}
                    validationState={dashboardCategory?.length < 30 ? 'valid' : 'invalid'}
                    onChange={setCategory}
                  />
                  <TextArea
                    label={DESCRIPTION_LABEL}
                    maxLength={100}
                    isRequired={false}
                    validationState={dashboardDescription?.length < 100 ? 'valid' : 'invalid'}
                    onChange={setDescription}
                  />
                  <Picker
                    validationState={dashboardDataSource?.length !== 0 ? 'valid' : 'invalid'}
                    label={DATASOURCE_LABEL}
                    placeholder={DATASOURCE_PLACEHOLDER}
                    onSelectionChange={selected => setDatasource(selected.toString())}
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
            title={SUCCESS_LABEL}
            onPrimaryAction={handleOpenOnSuccessDialog}
            onCancel={handleCloseOnSuccessDialog}
            variant="confirmation"
            cancelLabel={SUCCESS_CLOSE_LABEL}
            primaryActionLabel={PRIMARY_ACTION_LABEL}
          >
            <Translate contentKey="dashboard.created.content">Created dashboard successfully</Translate>
          </AlertDialog>
        )}
      </DialogContainer>
      <DialogContainer onDismiss={() => setCreateErrorDialog(false)}>
        {createErrorDialog && (
          <AlertDialog title={ERROR_LABEL} variant="destructive" primaryActionLabel={ERROR_CLOSE_LABEL}>
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
  dataSourcesList: storeState.datasources.entities,
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
