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
  View,
} from '@adobe/react-spectrum';
import { getEntity, updateEntity, reset } from './views.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate, Translate } from 'react-jhipster';
import { getViewErrorTranslations, getViewFromTranslations } from 'app/entities/views/view-util';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { getEntity as getDashboardEntity } from '../dashboard/dashboard.reducer';

export interface IViewPropertiesModalProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string; viewId: string }> {}

const ViewPropertiesModal = (props: IViewPropertiesModalProps) => {
  const [isEdit, setEdit] = React.useState(false);
  const [viewName, setViewNameText] = React.useState(props.viewEntity.viewName);
  const [viewDescription, setDescriptionText] = React.useState(props.viewEntity.description);
  const [isError, setErrorOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const { VIEW_LABEL, DESCRIPTION_LABEL } = getViewFromTranslations();
  const { ERROR_LABEL, ERROR_CLOSE_LABEL } = getViewErrorTranslations();
  const history = useHistory();
  const viewId = props.match.params.viewId;
  const dashboardId = props.match.params.id;

  const handleClose = () => {
    history.push('/dashboards/' + dashboardId);
  };

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
    });
  };

  useEffect(() => {
    if (viewId) {
      props.getEntity(viewId);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }

    if (props.errorMessage != null) {
      if (props.errorMessage.response.data.message === 'uniqueError') {
        setErrorMessage(translate('views.uniqueError.update'));
      } else {
        setErrorMessage(translate('views.error.content'));
      }
      setErrorOpen(true);
    }
    if (props.dashboardEntity) {
      setViewNameText(props.viewEntity.viewName);
      setDescriptionText(props.viewEntity.description);
    }
  }, [props.updateSuccess, props.errorMessage, props.viewEntity]);

  return (
    <>
      <DialogContainer type="fullscreenTakeover" onDismiss={handleClose}>
        <Dialog>
          {isEdit ? <Heading>Edit {props.viewEntity.viewName}</Heading> : <Heading>{props.viewEntity.viewName}</Heading>}
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
            <Button variant="secondary" onPress={ handleClose}>
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
  dashboardEntity: storeState.dashboard.entity,
});

const mapDispatchToProps = {
  updateEntity,
  getEntity,
  reset,
  getDashboardEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ViewPropertiesModal);
