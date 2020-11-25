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
} from '@adobe/react-spectrum';
import { updateEntity, getEntity } from './views.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { IDashboard } from 'app/shared/model/dashboard.model';
import { error } from 'console';

export interface ViewPropertiesModal extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
  viewDashboard: IDashboard;
  viewName: string;
  description: string;
  viewId: number;
}

const ViewPropertiesModal = (props: ViewPropertiesModal) => {
  const [isEdit, setEdit] = React.useState(false);
  const [viewName, setViewNameText] = React.useState(props.viewName);
  const [viewDescription, setDescriptionText] = React.useState(props.description);

  const dialog = useDialogContainer();
  const editEntity = values => {
    const entity = {
      ...props.viewEntity,
      ...values,
    };
    new Promise(resolve => {
      resolve(props.updateEntity(entity));
    })
      .then(data => {
        if (data['value'].status === 200) {
          dialog.dismiss();
        }
      })
      .catch(error => {
        debugger
      });
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

  return (
    <Dialog>
      {isEdit ? <Heading>Edit {props.viewName}</Heading> : <Heading>{props.viewName}</Heading>}
      <Divider />
      <Content>
        <Flex direction="column" gap="size-100" alignItems="center">
          <View padding="size-600">
            <Form isDisabled={!isEdit} isRequired necessityIndicator="icon" minWidth="size-4600">
              <TextField
                label="View name"
                maxLength={30}
                validationState={viewName?.length < 30 ? 'valid' : 'invalid'}
                onChange={setViewNameText}
                value={viewName}
              />

              <TextArea
                label="Description"
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
          <Translate contentKey="dashboard.home.cancelLabel">Cancel</Translate>
        </Button>
        {!isEdit && (
          <Button
            variant="cta"
            onPress={() => {
              setEdit(true);
            }}
          >
            <Translate contentKey="dashboard.home.editLabel">Edit</Translate>
          </Button>
        )}

        {isEdit && (
          <Button variant="cta" onPress={() => updateView(viewName, viewDescription)}>
            <Translate contentKey="dashboard.home.save">Save</Translate>
          </Button>
        )}
      </ButtonGroup>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  viewEntity: storeState.views.entity,
  loading: storeState.views.loading,
  updating: storeState.views.updating,
  updateSuccess: storeState.views.updateSuccess,
});

const mapDispatchToProps = {
  updateEntity,
  getEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ViewPropertiesModal);
