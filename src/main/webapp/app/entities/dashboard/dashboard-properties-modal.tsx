import React, { useEffect, useState } from 'react';
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
import { getEntity, updateEntity, reset } from './dashboard.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate, Translate } from 'react-jhipster';
import { getDatasources as getDataSourceEntities } from 'app/modules/administration/sources/datasources/datasources.reducer';
import {
  getDashboardErrorTranslations,
  getDashboardFromTranslations,
  isCreateEditFormNotValid,
} from 'app/entities/dashboard/dashboard-util';
import { RouteComponentProps } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

export interface IDashboardPropertiesModalProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

const DashboardPropertiesModal = (props: IDashboardPropertiesModalProps) => {
  const history = useHistory();
  const [isEdit, setEdit] = useState(false);

  const [dashboardName, setDashboardName] = useState(props.dashboardEntity.dashboardName ? props.dashboardEntity.dashboardName : '');
  const [dashboardCategory, setCategory] = useState(props.dashboardEntity.category ? props.dashboardEntity.category : '');
  const [dashboardDescription, setDescription] = useState(props.dashboardEntity.description ? props.dashboardEntity.description : '');
  const [dashboardDataSource, setDataSource] = useState(
    props.dashboardEntity.dashboardDatasource?.name ? props.dashboardEntity.dashboardDatasource?.name : ''
  );
  const [isError, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { DASHBOARD_LABEL, CATEGORY_LABEL, DESCRIPTION_LABEL, DATASOURCE_LABEL, DATASOURCE_PLACEHOLDER } = getDashboardFromTranslations();
  const { ERROR_LABEL, ERROR_CLOSE_LABEL } = getDashboardErrorTranslations();
  const { dashboardEntity, dataSourcesList, updating } = props;

  const getDatasourceByName = id => {
    const _datasource = dataSourcesList.filter(function (item) {
      return item.name === id;
    });
    return _datasource[0];
  };

  const editEntity = values => {
    const entity = {
      ...dashboardEntity,
      ...values,
    };
    props.updateEntity(entity);
  };

  const updateDashboard = (name, category, description, datasource) => {
    editEntity({
      dashboardName: name,
      category,
      description,
      dashboardDatasource: getDatasourceByName(datasource),
    });
  };

  useEffect(() => {
    const dashboardId = props.match.params.id;
    if (dashboardId) {
      props.getEntity(dashboardId);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      history.push('/dashboards');
    }
    if (props.errorMessage != null) {
      if (props.errorMessage.response.data.message === 'uniqueError') {
        setErrorMessage(translate('dashboard.uniqueError.update', { param: dashboardName }));
      } else {
        setErrorMessage(translate('dashboard.error.content'));
      }
      setErrorOpen(true);
    }
    if (props.dashboardEntity.id) {
      setDashboardName(props.dashboardEntity.dashboardName);
      setCategory(props.dashboardEntity.category);
      setDescription(props.dashboardEntity.description);
      setDataSource(props.dashboardEntity.dashboardDatasource.name);
    }
  }, [props.updateSuccess, props.errorMessage, props.dashboardEntity]);

  const handlePropertiesModelClose = () => {
    props.reset();
    history.push('/dashboards');
  };

  const handleEdit = () => {
    setEdit(true);
    props.getDataSourceEntities();
  };

  return (
    <>
      <DialogContainer type="fullscreenTakeover" onDismiss={handlePropertiesModelClose}>
        <Dialog>
          {isEdit ? (
            <Heading>Edit {props.dashboardEntity.dashboardName}</Heading>
          ) : (
            <Heading>{props.dashboardEntity.dashboardName}</Heading>
          )}
          <Divider />
          <Content>
            <Flex direction="column" gap="size-100" alignItems="center">
              <View padding="size-600">
                <Form isRequired isDisabled={!isEdit} necessityIndicator="icon" minWidth="size-4600">
                  <TextField
                    label={DASHBOARD_LABEL}
                    maxLength={30}
                    validationState={dashboardName?.length < 30 ? 'valid' : 'invalid'}
                    value={dashboardName}
                    onChange={setDashboardName}
                  />
                  <TextField
                    label={CATEGORY_LABEL}
                    maxLength={30}
                    validationState={dashboardCategory?.length < 30 ? 'valid' : 'invalid'}
                    onChange={setCategory}
                    value={dashboardCategory}
                  />
                  <TextArea
                    isRequired={false}
                    value={dashboardDescription}
                    label={DESCRIPTION_LABEL}
                    maxLength={100}
                    validationState={dashboardDescription?.length < 100 ? 'valid' : 'invalid'}
                    onChange={setDescription}
                  />
                  <Picker
                    validationState={dashboardDataSource?.length !== 0 ? 'valid' : 'invalid'}
                    label={DATASOURCE_LABEL}
                    selectedKey={dashboardDataSource}
                    placeholder={DATASOURCE_PLACEHOLDER}
                    onSelectionChange={selected => setDataSource(selected.toString())}
                  >
                    {dataSourcesList.map(dataSource => (
                      <Item key={dataSource.name}>{dataSource.name}</Item>
                    ))}
                  </Picker>
                </Form>
              </View>
            </Flex>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={handlePropertiesModelClose}>
              <Translate contentKey="entity.action.cancel">Close</Translate>
            </Button>
            {!isEdit && (
              <Button variant="cta" onPress={handleEdit}>
                <Translate contentKey="entity.action.edit">Edit</Translate>
              </Button>
            )}
            {isEdit && (
              <Button
                variant="cta"
                isDisabled={isCreateEditFormNotValid({ dashboardName, dashboardCategory, dashboardDataSource }) || updating}
                onPress={() => updateDashboard(dashboardName, dashboardCategory, dashboardDescription, dashboardDataSource)}
              >
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            )}
          </ButtonGroup>
        </Dialog>
      </DialogContainer>
      <DialogContainer onDismiss={() => setErrorOpen(false)} {...props}>
        {isError && (
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
  updateSuccess: storeState.dashboard.updateSuccess,
  updating: storeState.dashboard.updating,
  errorMessage: storeState.dashboard.errorMessage,
  dataSourcesList: storeState.datasources.datasources,
});

const mapDispatchToProps = { getEntity, updateEntity, getDataSourceEntities, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPropertiesModal);
