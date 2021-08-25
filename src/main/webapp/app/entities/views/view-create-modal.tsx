import React, { useEffect, useState } from 'react';
import {
  View,
  Flex,
  Dialog,
  Heading,
  Divider,
  Content,
  Form,
  ButtonGroup,
  Button,
  TextField,
  TextArea,
  AlertDialog,
  DialogContainer,
} from '@adobe/react-spectrum';
import { createEntity, reset, setBlob } from './views.reducer';
import { getEntity as getDashboardEntity } from '../dashboard/dashboard.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Translate, translate, setFileData } from 'react-jhipster';
import { RouteComponentProps, useHistory } from 'react-router-dom';

export interface IViewCreateModalProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

const ViewCreateModal = (props: IViewCreateModalProps) => {
  const [createSuccessDialog, setCreateSuccessDialog] = useState(false);
  const [createErrorDialog, setCreateErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [viewName, setViewNameText] = useState('');
  const [viewDescription, setDescriptionText] = useState('');
  const { viewEntity, updating } = props;
  const history = useHistory();
  const dashboardId = props.match.params.id;

  const saveEntity = values => {
    const entity = {
      ...viewEntity,
      ...values,
    };
    props.createEntity(entity);
  };

  const createView = (name, description) => {
    saveEntity({
      viewName: name,
      description,
      viewDashboard: props.dashboardEntity,
    });
  };

  const handleClose = () => {
    history.push('/dashboards/' + dashboardId);
  };

  const handleCloseOnSuccessDialog = () => {
    setCreateSuccessDialog(false);
    props.reset();
    handleClose();
  };

  const handleOpenOnSuccessDialog = () => {
    setCreateSuccessDialog(false);
    history.push(`/dashboards/build?dashboardId=${dashboardId}&viewId=${props.viewEntity.id}`);
  };

  useEffect(() => {
    props.reset();
    props.getDashboardEntity(props.match.params.id);
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      setCreateSuccessDialog(true);
    }
    if (props.errorMessage != null) {
      if (props.errorMessage.response.data.message === 'uniqueError') {
        setErrorMessage(translate('views.uniqueError.create', { param: viewName }));
      } else {
        setErrorMessage(translate('views.error.content'));
      }
      setCreateErrorDialog(true);
    }
  }, [props.updateSuccess, props.errorMessage]);

  const onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType.split('/')[1]), isAnImage);
  };

  const clearBlob = name => () => {
    props.setBlob(name, undefined, undefined);
  };

  return (
    <>
      <DialogContainer type="fullscreenTakeover" onDismiss={handleClose}>
        <Dialog>
          <Heading>
            <Translate contentKey="views.home.createNewView">Create new view</Translate>
          </Heading>
          <Divider />
          <Content>
            <Flex direction="column" gap="size-100" alignItems="center">
              <View padding="size-600">
                <Form isRequired necessityIndicator="icon" minWidth="size-4600">
                  <TextField
                    label={translate('views.viewName')}
                    maxLength={30}
                    validationState={viewName?.length < 30 ? 'valid' : 'invalid'}
                    onChange={setViewNameText}
                  />

                  <TextArea
                    label={translate('views.description')}
                    maxLength={100}
                    isRequired={false}
                    validationState={viewDescription?.length < 100 ? 'valid' : 'invalid'}
                    onChange={setDescriptionText}
                  />
                  <input id="file_image" type="file" onChange={onBlobChange(true, 'image')} accept="image/*" />
                </Form>
              </View>
            </Flex>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={handleClose}>
              <Translate contentKey="entity.action.cancel">close</Translate>
            </Button>
            <Button onPress={() => createView(viewName, viewDescription)} variant="cta" isDisabled={viewName === '' || updating}>
              <Translate contentKey="entity.action.save">Save</Translate>
            </Button>
          </ButtonGroup>
        </Dialog>
      </DialogContainer>

      <DialogContainer onDismiss={() => setCreateSuccessDialog(false)}>
        {createSuccessDialog && (
          <AlertDialog
            title={translate('views.created.header')}
            onPrimaryAction={handleOpenOnSuccessDialog}
            onCancel={handleCloseOnSuccessDialog}
            variant="confirmation"
            cancelLabel={translate('entity.action.cancel')}
            primaryActionLabel={translate('entity.action.open')}
          >
            <Translate contentKey="views.created.content">Created view successfully</Translate>
          </AlertDialog>
        )}
      </DialogContainer>
      <DialogContainer onDismiss={() => setCreateErrorDialog(false)}>
        {createErrorDialog && (
          <AlertDialog title={translate('views.error.header')} variant="destructive" primaryActionLabel={translate('entity.action.cancel')}>
            {errorMessage}
          </AlertDialog>
        )}
      </DialogContainer>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  viewEntity: storeState.views.entity,
  loading: storeState.views.loading,
  updating: storeState.views.updating,
  updateSuccess: storeState.views.updateSuccess,
  errorMessage: storeState.views.errorMessage,
  dataSourcesList: storeState.views.entities,
  dashboardEntity: storeState.dashboard.entity,
});

const mapDispatchToProps = {
  createEntity,
  reset,
  getDashboardEntity,
  setBlob,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ViewCreateModal);
