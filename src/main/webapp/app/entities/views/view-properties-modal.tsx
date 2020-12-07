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
  TextArea,
  TextField,
  useDialogContainer,
  View,
} from '@adobe/react-spectrum';
import { getEntity, updateEntity, reset } from './views.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate, Translate } from 'react-jhipster';
import { IDashboard } from 'app/shared/model/dashboard.model';
import { getViewErrorTranslations, getViewFromTranslations } from 'app/entities/views/view-util';

export interface IViewPropertiesModalProps extends StateProps, DispatchProps {
  viewDashboard: IDashboard;
  viewName: string;
  description: string;
  viewId: number;
}

const ViewPropertiesModal = (props: IViewPropertiesModalProps) => {
  const [isEdit, setEdit] = React.useState(false);
  const [viewName, setViewNameText] = React.useState(props.viewName);
  const [viewDescription, setDescriptionText] = React.useState(props.description);
  const [isError, setErrorOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const dialog = useDialogContainer();
  const { VIEW_LABEL, DESCRIPTION_LABEL } = getViewFromTranslations();
  const { ERROR_LABEL, ERROR_CLOSE_LABEL } = getViewErrorTranslations();

  const editEntity = values => {
    const entity = {
      ...props.viewEntity,
      ...values,
    };
    props.updateEntity(entity);
  };

  const updateView = (name, description) => {
    editEntity({
      viewName: name,
      description,
      viewDashboard: props.viewDashboard,
    });
  };

  useEffect(() => {
    if (props.viewId) {
      props.getEntity(props.viewId);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      dialog.dismiss();
      props.reset();
    }
    if (props.errorMessage != null) {
      if (props.errorMessage.response.data.message === 'uniqueError') {
        setErrorMessage(translate('views.uniqueError.update'));
      } else {
        setErrorMessage(translate('views.error.content'));
      }
      setErrorOpen(true);
      props.reset();
    }
  }, [props.updateSuccess, props.errorMessage]);

  return (
    <>
      <Dialog>
        {isEdit ? <Heading>Edit {props.viewName}</Heading> : <Heading>{props.viewName}</Heading>}
        <Divider />
        <Content>
          <Flex direction="column" gap="size-100" alignItems="center">
            <View padding="size-600">
              <Form isDisabled={!isEdit} isRequired necessityIndicator="icon" minWidth="size-4600">
                <TextField
                  label={VIEW_LABEL}
                  maxLength={30}
                  validationState={viewName?.length < 30 ? 'valid' : 'invalid'}
                  onChange={setViewNameText}
                  value={viewName}
                />

                <TextArea
                  label={DESCRIPTION_LABEL}
                  maxLength={100}
                  isRequired={false}
                  value={viewDescription}
                  validationState={viewDescription?.length < 100 ? 'valid' : 'invalid'}
                  onChange={setDescriptionText}
                />
              </Form>
            </View>
          </Flex>
        </Content>
        <ButtonGroup>
          <Button variant="secondary" onPress={dialog.dismiss}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
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
            <Button variant="cta" onPress={() => updateView(viewName, viewDescription)} isDisabled={viewName === '' || props.updating}>
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
  viewEntity: storeState.views.entity,
  loading: storeState.views.loading,
  updating: storeState.views.updating,
  updateSuccess: storeState.views.updateSuccess,
  errorMessage: storeState.views.errorMessage,
});

const mapDispatchToProps = {
  updateEntity,
  getEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ViewPropertiesModal);
