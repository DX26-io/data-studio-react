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
  TextArea,
  TextField,
  View,
} from '@adobe/react-spectrum';
import { getEntity, updateEntity, reset } from './views.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate, Translate } from 'react-jhipster';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { getEntity as getDashboardEntity } from '../dashboard/dashboard.reducer';
import { hasAuthority } from 'app/shared/reducers/authentication';

export interface IViewPropertiesModalProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string; viewId: string }> {}

const ViewPropertiesModal = (props: IViewPropertiesModalProps) => {
  const [isEdit, setEdit] = useState(false);
  const [viewName, setViewNameText] = useState(props.viewEntity.viewName ? props.viewEntity.viewName : '');
  const [viewDescription, setDescriptionText] = useState(props.viewEntity.description ? props.viewEntity.description : '');
  const [isError, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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
    if (props.viewEntity.id) {
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
                    label={translate('views.viewName')}
                    maxLength={30}
                    validationState={viewName?.length < 30 ? 'valid' : 'invalid'}
                    onChange={setViewNameText}
                    value={viewName}
                  />

                  <TextArea
                    label={translate('views.description')}
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
            <Button variant="secondary" onPress={handleClose}>
              <Translate contentKey="entity.action.cancel">Cancel</Translate>
            </Button>
            {props.account &&  hasAuthority(props.account, 'DELETE_' + viewId + '_VIEW') && !isEdit && (
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
          <AlertDialog title={translate('views.error.header')} variant="destructive" primaryActionLabel={ translate('entity.action.cancel')}>
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
  account: storeState.authentication.account,

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
