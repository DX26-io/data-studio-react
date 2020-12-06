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
import { getEntity, updateEntity } from './dashboard.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate, Translate } from 'react-jhipster';
import { getEntities as getDataSourceEntities } from '../datasources/datasources.reducer';
import {
  getDashboardErrorTranslations,
  getDashboardFromTranslations,
  isCreateEditFormNotValid,
} from 'app/entities/dashboard/dashboard-util';

export interface IDashboardPropertiesModalProps extends StateProps, DispatchProps {
  dashboardId: number;
  dashboardName: string;
  category: string;
  description: string;
  datasource: string;
}

const DashboardPropertiesModal = (props: IDashboardPropertiesModalProps) => {
  const dialog = useDialogContainer();
  const [isEdit, setEdit] = React.useState(false);
  const [dashboardName, setDashboardName] = React.useState(props.dashboardName ? props.dashboardName : '');
  const [dashboardCategory, setCategory] = React.useState(props.category ? props.category : '');
  const [dashboardDescription, setDescription] = React.useState(props.description ? props.description : '');
  const [dashboardDataSource, setDataSource] = React.useState(props.datasource ? props.datasource : '');
  const [isError, setErrorOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
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
    props.getDataSourceEntities();
    if (props.dashboardId) {
      props.getEntity(props.dashboardId);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      dialog.dismiss();
    }
    if (props.errorMessage != null) {
      if (props.errorMessage.response.data.message === 'uniqueError') {
        setErrorMessage(translate('dashboard.uniqueError.update', { param: dashboardName }));
      } else {
        setErrorMessage(translate('dashboard.error.content'));
      }
      setErrorOpen(true);
    }
  }, [props.updateSuccess, props.errorMessage]);

  return (
    <>
      <Dialog>
        {isEdit ? <Heading>Edit {props.dashboardName}</Heading> : <Heading>{props.dashboardName}</Heading>}
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
          <Button variant="secondary" onPress={dialog.dismiss}>
            <Translate contentKey="entity.action.cancel">Close</Translate>
          </Button>
          {!isEdit && (
            <Button
              variant="cta"
              onPress={() => {
                setEdit(true);
              }}
            >
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
  dataSourcesList: storeState.datasources.entities,
});

const mapDispatchToProps = { getEntity, updateEntity, getDataSourceEntities };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPropertiesModal);
