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
  AlertDialog,
  DialogContainer,
} from '@adobe/react-spectrum';
import { createEntity, reset } from './views.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { IDashboard } from 'app/shared/model/dashboard.model';

export interface ViewCreateModal extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
  viewDashboard: IDashboard;
}

const ViewCreateModal = (props: ViewCreateModal) => {
  const dialog = useDialogContainer();
  const { viewEntity, loading, updating } = props;
  const [isOpen, setOpen] = React.useState(false);
  const [isError, setErrorOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [viewName, setViewNameText] = React.useState('');
  const [viewDescription, setDescriptionText] = React.useState('');
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
      viewDashboard: props.viewDashboard,
    });
  };

  const alertClose = () => {
    setOpen(false);
    dialog.dismiss();
  };

  const alertOpen = () => {
    setOpen(false);
    dialog.dismiss();
    //TODO
    //redirect to build page
  };

  useEffect(() => {
    if (props.updateSuccess) {
      setOpen(true);
    }
    if (props.errorMessage != null) {
      if (props.errorMessage.response.data.message === 'uniqueError') {
        setErrorMessage(translate('datastudioApp.views.uniqueError'));
      } else {
        setErrorMessage(translate('datastudioApp.views.errorSaving'));
      }
      setErrorOpen(true);
    }
  }, [props.updateSuccess, props.errorMessage]);

  return (
    <Dialog>
      <Heading>
        <Translate contentKey="datastudioApp.views.home.createNewView">Create new view</Translate>
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
                label="View name"
                maxLength={30}
                validationState={viewName?.length < 30 ? 'valid' : 'invalid'}
                onChange={setViewNameText}
              />

              <TextArea
                label="Description"
                maxLength={100}
                isRequired={false}
                validationState={viewDescription?.length < 100 ? 'valid' : 'invalid'}
                onChange={setDescriptionText}
              />
            </Form>
          </View>
        </Flex>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={dialog.dismiss}>
          <Translate contentKey="datastudioApp.views.home.cancelLabel">Cancel</Translate>
        </Button>
        <Button onPress={() => createView(viewName, viewDescription)} variant="cta">
          <Translate contentKey="datastudioApp.views.home.save">Save</Translate>
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  viewEntity: storeState.views.entity,
  loading: storeState.views.loading,
  updating: storeState.views.updating,
  updateSuccess: storeState.views.updateSuccess,
  errorMessage: storeState.views.errorMessage,
  datasourcesList: storeState.views.entities,
});

const mapDispatchToProps = {
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ViewCreateModal);
