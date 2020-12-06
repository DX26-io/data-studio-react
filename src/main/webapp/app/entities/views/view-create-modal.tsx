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
import { Translate, translate } from 'react-jhipster';
import { IDashboard } from 'app/shared/model/dashboard.model';
import { getViewFromTranslations, getViewSuccessTranslations, getViewErrorTranslations } from 'app/entities/views/view-util';

export interface IViewCreateModalProps extends StateProps, DispatchProps {
  viewDashboard: IDashboard;
}

const ViewCreateModal = (props: IViewCreateModalProps) => {
  const dialog = useDialogContainer();
  const [isOpen, setOpen] = React.useState(false);
  const [isError, setErrorOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [viewName, setViewNameText] = React.useState('');
  const [viewDescription, setDescriptionText] = React.useState('');
  const { viewEntity, updating } = props;
  const { VIEW_LABEL, DESCRIPTION_LABEL } = getViewFromTranslations();
  const { SUCCESS_LABEL, SUCCESS_CLOSE_LABEL, PRIMARY_ACTION_LABEL } = getViewSuccessTranslations();
  const { ERROR_LABEL, ERROR_CLOSE_LABEL } = getViewErrorTranslations();
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
    // TODO
    // redirect to build page
  };

  useEffect(() => {
    if (props.updateSuccess) {
      setOpen(true);
    }
    if (props.errorMessage != null) {
      if (props.errorMessage.response.data.message === 'uniqueError') {
        setErrorMessage(translate('views.uniqueError.create'));
      } else {
        setErrorMessage(translate('views.error.content'));
      }
      setErrorOpen(true);
    }
  }, [props.updateSuccess, props.errorMessage]);

  return (
    <>
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
                  label={VIEW_LABEL}
                  maxLength={30}
                  validationState={viewName?.length < 30 ? 'valid' : 'invalid'}
                  onChange={setViewNameText}
                />

                <TextArea
                  label={DESCRIPTION_LABEL}
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
            <Translate contentKey="entity.action.cancel">close</Translate>
          </Button>
          <Button onPress={() => createView(viewName, viewDescription)} variant="cta" isDisabled={viewName === '' || updating}>
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </ButtonGroup>
      </Dialog>
      <DialogContainer onDismiss={() => setOpen(false)} {...props}>
        {isOpen && (
          <AlertDialog
            title={SUCCESS_LABEL}
            onPrimaryAction={alertOpen}
            onCancel={alertClose}
            variant="confirmation"
            cancelLabel={SUCCESS_CLOSE_LABEL}
            primaryActionLabel={PRIMARY_ACTION_LABEL}
          >
            <Translate contentKey="views.created.content">Created view successfully</Translate>
          </AlertDialog>
        )}
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
  viewEntity: storeState.views.entity,
  loading: storeState.views.loading,
  updating: storeState.views.updating,
  updateSuccess: storeState.views.updateSuccess,
  errorMessage: storeState.views.errorMessage,
  dataSourcesList: storeState.views.entities,
});

const mapDispatchToProps = {
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ViewCreateModal);
