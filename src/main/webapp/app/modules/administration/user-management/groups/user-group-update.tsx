import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import { getUserGroup, updateUserGroup, createUserGroup, reset, deleteUserGroup,setUserGroup } from './user-group.reducer';
import { IRootState } from 'app/shared/reducers';
import { isFormValid } from './user-group.util';
import Alert from '@spectrum-icons/workflow/Alert';
import AlertCircle from '@spectrum-icons/workflow/AlertCircle';
import { Flex, useDialogContainer, Dialog, Heading, Divider, Content, Form, Button, TextField, Header, Text } from '@adobe/react-spectrum';
import { defaultValue } from 'app/shared/model/error.model';

export interface IUserGroupUpdateProps extends StateProps, DispatchProps {
  setUpdateSuccess: () => void;
  setOpen: (isOpen: boolean) => void;
  history: any;
}

export const UserUpdate = (props: IUserGroupUpdateProps) => {
  const { setOpen, setUpdateSuccess, group, updating, updateSuccess,history } = props;
  const [error, setError] = useState(defaultValue);

  const dialog = useDialogContainer();

  useEffect(() => {
    return () => {
      props.reset();
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    dialog.dismiss();
  };

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
      setUpdateSuccess();
    }
  }, [updateSuccess]);

  const saveUser = () => {
    if (group.id) {
      props.updateUserGroup(group);
    } else {
      props.createUserGroup(group);
    }
  };

  const removeGroup = () => {
    props.deleteUserGroup(group.name);
  };

  const redirectToPermissionPage = () => {
    handleClose();
    history.push('/administration/user-management/dashboard-permission');
  };

  return (
    <Dialog data-testid="group-form-dialog">
      <Heading>
        <Flex alignItems="center" gap="size-100" data-testid="group-form-heading">
          {group.id ? (
            <Translate contentKey="userGroups.home.editLabel">Edit Group</Translate>
          ) : (
            <Translate contentKey="userGroups.home.createLabel">Create Group</Translate>
          )}
        </Flex>
      </Heading>
      <Header data-testid="group-form-action">
        <Flex alignItems="center" gap="size-100">
          <Button variant="secondary" onPress={handleClose} data-testid="group-form-cancel">
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button variant="cta" onPress={saveUser} isDisabled={updating || !isFormValid(group).isValid} data-testid="group-form-submit">
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </Flex>
      </Header>
      <Divider />
      <Content>
        <Form data-testid="group-form">
          <TextField
            label="Name"
            placeholder="ROLE_ACCOUNT"
            type="text"
            value={group.name}
            onChange={event => {
              props.setUserGroup({ ...group, name: event });
              const errorObj = isFormValid({ ...group, name: event });
              setError(errorObj);
            }}
            autoFocus
            isRequired
            data-testid="name"
          />
          <div style={{ marginTop: '20px' }}>
            <Flex alignItems="center" gap="size-25">
              <p className="spectrum-Heading spectrum-Heading--sizeXXS">
                <Translate contentKey="userGroups.tip"></Translate>
              </p>
              <AlertCircle size="S" />
            </Flex>
            {group.id ? (
              <p>
                <span className="spectrum-Body-emphasis">
                  <Translate contentKey="userGroups.updateTipMessage"></Translate>
                </span>
                <a className="dx26-link" onClick={redirectToPermissionPage}>
                  &nbsp;&nbsp;
                  <Translate contentKey="userGroups.permissionManagement"></Translate>
                </a>
              </p>
            ) : (
              <p>
                <span className="spectrum-Body-emphasis">
                  <Translate contentKey="userGroups.newTipMessage1"></Translate>
                </span>
                <a className="dx26-link" onClick={redirectToPermissionPage} data-testid="redirect">
                  &nbsp;&nbsp;
                  <Translate contentKey="userGroups.permissionManagement"></Translate>
                </a>
                &nbsp;&nbsp;
                <span className="spectrum-Body-emphasis">
                  <Translate contentKey="userGroups.newTipMessage2"></Translate>
                </span>
              </p>
            )}
          </div>
          {group.id ? (
            <React.Fragment>
              <span className="spectrum-Heading spectrum-Heading--sizeXXS">
                <Translate contentKey="entity.action.dangerZone">Danger Zone</Translate>
              </span>
              <Divider size="M" />{' '}
            </React.Fragment>
          ) : null}
        </Form>
        {group.id ? (
          <Button data-testid="delete" variant="negative" onPress={removeGroup} marginTop="size-175">
            <Translate contentKey="entity.action.delete">Delete</Translate>
          </Button>
        ) : null}
        {!error.isValid && (
          <Flex gap="size-100" data-testid="validation-error" marginTop="static-size-200">
            <Alert color="negative" />
            <Text marginBottom="size-300">
              <span className="spectrum-Body-emphasis error-message">
                <Translate contentKey={error.translationKey}></Translate>
              </span>
            </Text>
          </Flex>
        )}
      </Content>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  group: storeState.userGroups.group,
  loading: storeState.userGroups.loading,
  updating: storeState.userGroups.updating,
  fetchSuccess: storeState.userGroups.fetchSuccess,
  updateSuccess: storeState.userGroups.updateSuccess,
});

const mapDispatchToProps = { getUserGroup, updateUserGroup, createUserGroup, reset, deleteUserGroup,setUserGroup };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserUpdate);
