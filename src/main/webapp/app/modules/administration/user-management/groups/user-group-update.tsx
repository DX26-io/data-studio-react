import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import { getUserGroup, updateUserGroup, createUserGroup, reset, deleteUserGroup } from './user-group.reducer';
import { IRootState } from 'app/shared/reducers';
import { isFormValid } from './user-group.util';
import Alert from '@spectrum-icons/workflow/Alert';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Flex, useDialogContainer, Dialog, Heading, Divider, Content, Form, Button, TextField, Header, Text } from '@adobe/react-spectrum';

export interface IUserGroupUpdateProps extends StateProps, DispatchProps {
  setUpdateSuccess: () => void;
  isNew: boolean;
  setOpen: (isOpen: boolean) => void;
  groupName: string;
}

export const UserUpdate = (props: IUserGroupUpdateProps) => {
  const { isNew, setOpen, setUpdateSuccess, groupName, group, loading, updating, fetchSuccess, updateSuccess } = props;
  const [name, setName] = useState('');
  const [isInValidForm, setInValidForm] = useState(false);
  const [validationErrorKey, setValidationErrorKey] = useState('');

  const dialog = useDialogContainer();

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getUserGroup(groupName);
    }
    return () => {
      props.reset();
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    dialog.dismiss();
  };

  useEffect(() => {
    if (isNew) {
      setName('');
    } else {
      setName(group.name);
    }
    if (updateSuccess) {
      handleClose();
      setUpdateSuccess();
    }
  }, [fetchSuccess, isNew, updateSuccess]);

  const saveUser = () => {
    const error = isFormValid({ ...group, name });
    if (error.isValid) {
      const values = { ...group, name };
      if (isNew) {
        props.createUserGroup(values);
      } else {
        props.updateUserGroup(values);
      }
    } else {
      setInValidForm(!error.isValid);
      setValidationErrorKey(error.translationKey);
    }
  };

  const removeGroup = () => {
    props.deleteUserGroup(group.name);
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Dialog data-testid="user-form-dialog">
          <Heading>
            <Flex alignItems="center" gap="size-100" data-testid="user-form-heading">
              {!isNew ? (
                <Translate contentKey="userGroups.home.editLabel">Edit Group</Translate>
              ) : (
                <Translate contentKey="userGroups.home.createLabel">Create Group</Translate>
              )}
            </Flex>
          </Heading>
          <Header data-testid="user-form-action">
            <Flex alignItems="center" gap="size-100">
              <Button variant="secondary" onPress={handleClose} data-testid="user-form-cancel">
                <Translate contentKey="entity.action.cancel">Cancel</Translate>
              </Button>
              <Button variant="cta" onPress={saveUser} isDisabled={updating} data-testid="user-form-submit">
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </Flex>
          </Header>
          <Divider />
          <Content>
            <Form data-testid="user-form">
              <TextField
                label="Name"
                placeholder="ROLE_ACCOUNT"
                type="text"
                value={name}
                onChange={setName}
                autoFocus
                isRequired
                data-testid="name"
              />
              <div style={{ marginTop: '20px' }}>
                <p className="spectrum-Heading spectrum-Heading--sizeXXS">
                  <Translate contentKey="userGroups.tip"></Translate>
                </p>
                {!isNew ? (
                  <p>
                    <span className="spectrum-Body-emphasis">
                      <Translate contentKey="userGroups.updateTipMessage"></Translate>
                    </span>
                    {/* TODO : once permission page is done.this url will be updated */}
                    <Link className="dx26-link" to={`/dahsboard-permission`}>
                      &nbsp;&nbsp;
                      <Translate contentKey="userGroups.permissionManagement"></Translate>
                    </Link>
                  </p>
                ) : (
                  <p>
                    <span className="spectrum-Body-emphasis">
                      <Translate contentKey="userGroups.newTipMessage1"></Translate>
                    </span>
                    {/* TODO : once permission page is done.this url will be updated */}
                    <Link className="dx26-link" to={`/dahsboard-permission`}>
                      &nbsp;&nbsp;
                      <Translate contentKey="userGroups.permissionManagement"></Translate>
                    </Link>
                    &nbsp;&nbsp;
                    <span className="spectrum-Body-emphasis">
                      <Translate contentKey="userGroups.newTipMessage2"></Translate>
                    </span>
                  </p>
                )}
              </div>
              {!isNew ? (
                <React.Fragment>
                  <span className="spectrum-Heading spectrum-Heading--sizeXXS">
                    <Translate contentKey="entity.action.dangerZone">Danger Zone</Translate>
                  </span>
                  <Divider size="M" />{' '}
                </React.Fragment>
              ) : null}
            </Form>
            {!isNew ? (
              <Button data-testid="delete" variant="negative" onPress={removeGroup} marginTop="size-175">
                <Translate contentKey="entity.action.delete">Delete</Translate>
              </Button>
            ) : null}
            {isInValidForm && (
              <Flex gap="size-100" data-testid="validation-error" marginTop="static-size-200">
                <Alert color="negative" />
                <Text marginBottom="size-300">
                  <span className="spectrum-Body-emphasis error-message">
                    <Translate contentKey={validationErrorKey}></Translate>
                  </span>
                </Text>
              </Flex>
            )}
          </Content>
        </Dialog>
      )}
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  group: storeState.userGroups.group,
  loading: storeState.userGroups.loading,
  updating: storeState.userGroups.updating,
  fetchSuccess: storeState.userGroups.fetchSuccess,
  updateSuccess: storeState.userGroups.updateSuccess,
});

const mapDispatchToProps = { getUserGroup, updateUserGroup, createUserGroup, reset, deleteUserGroup };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserUpdate);
