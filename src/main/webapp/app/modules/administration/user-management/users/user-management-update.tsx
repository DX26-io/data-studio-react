import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { AvForm, AvGroup, AvInput, AvField, AvFeedback } from 'availity-reactstrap-validation';
import { Translate } from 'react-jhipster';
import { getUser, getRoles, updateUser, createUser, reset, deleteUser } from './user-management.reducer';
import { IRootState } from 'app/shared/reducers';
import {
  Flex,
  useDialogContainer,
  Dialog,
  Heading,
  Divider,
  Content,
  Form,
  Button,
  TextField,
  Header,
  Checkbox,
  Text,
} from '@adobe/react-spectrum';
import Select from 'react-select';

export interface IUserManagementUpdateProps extends StateProps, DispatchProps {
  isNew: boolean;
  setOpen: (isOpen: boolean) => void;
  loginID: string;
}

export const UserManagementUpdate = (props: IUserManagementUpdateProps) => {
  const isInvalid = false;
  const { isNew, setOpen, loginID, user, loading, updating, roles, fetchSuccess, updateSuccess } = props;
  const [login, setLogin] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [activated, setActivated] = useState(true);
  let userGroups = [];

  const dialog = useDialogContainer();

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getUser(loginID);
    }
    props.getRoles();
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
      setLogin('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setActivated(true);
      userGroups = [];
    } else {
      setLogin(user.login);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setActivated(user.activated);
    }
    if (updateSuccess) {
      handleClose();
    }
  }, [fetchSuccess, isNew, updateSuccess]);

  const saveUser = () => {
    // TODO : this condition has to be part of form itself
    if (email && login) {
      const values = { ...user, login, firstName, lastName, email, activated, userGroups };
      if (isNew) {
        props.createUser(values);
      } else {
        props.updateUser(values);
      }
    }
  };

  const removeUser = () => {
    props.deleteUser(user.login);
  };

  const selectRole = selectedOption => {
    userGroups = [];
    if (selectedOption) {
      selectedOption.forEach(function (option) {
        userGroups.push(option.value);
      });
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Dialog  data-testid="user-form-dialog">
          <Heading>
            <Flex alignItems="center" gap="size-100" data-testid="user-form-heading">
              {!isNew ? (
                <Translate contentKey="userManagement.home.editLabel">Edit User</Translate>
              ) : (
                <Translate contentKey="userManagement.home.createLabel">Create User</Translate>
              )}
            </Flex>
          </Heading>
          <Header data-testid="user-form-action">
            <Flex alignItems="center" gap="size-100">
              <Button variant="secondary" onPress={handleClose}>
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
                label="Login ID"
                placeholder="John"
                minLength={1}
                pattern="/^[_'.@A-Za-z0-9-]*$/"
                validationState={login.length < 50 ? 'valid' : 'invalid'}
                type="text"
                value={login}
                onChange={setLogin}
                autoFocus
                isRequired
                data-testid="login"
              />
              <TextField
                label="First Name"
                placeholder="John"
                type="text"
                value={firstName}
                onChange={setFirstName}
                validationState={firstName.length < 50 ? 'valid' : 'invalid'}
                autoFocus
                data-testid="first-name"
              />
              <TextField
                label="Last Name"
                placeholder="Deo"
                type="text"
                value={lastName}
                onChange={setLastName}
                validationState={lastName.length < 50 ? 'valid' : 'invalid'}
                autoFocus
                data-testid="last-name"
              />
              <TextField
                label="Email"
                placeholder="John@dx26.com"
                isRequired
                type="email"
                value={email}
                onChange={setEmail}
                data-testid="email"
                validationState={email.length < 100 ? 'valid' : 'invalid'}
                autoFocus
              />
              <Checkbox isSelected={activated} onChange={setActivated} isEmphasized defaultSelected data-testid="activated">
                <Translate contentKey="userManagement.activate">Activate</Translate>
              </Checkbox>
              <Text>
                <Translate contentKey="userManagement.profiles">Activate</Translate>
              </Text>
              {/* TODO : need to find a better approach to set defaultValue. it does not reset  */}
              <Select
                isMulti
                onChange={selectRole}
                defaultValue={isNew ? userGroups : user.userGroups}
                options={roles}
                className="basic-multi-select"
                classNamePrefix="select"
              />
              {!isNew ? (
                <React.Fragment>
                  <Text>
                    <Translate contentKey="entity.action.dangerZone">Danger Zone</Translate>
                  </Text>
                  <Divider size="M" />{' '}
                </React.Fragment>
              ) : null}
            </Form>
            {!isNew ? (
              <Button data-testid="delete" variant="negative" onPress={removeUser} marginTop="size-175">
                <Translate contentKey="entity.action.delete">Delete</Translate>
              </Button>
            ) : null}
          </Content>
        </Dialog>
      )}
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  user: storeState.userManagement.user,
  roles: storeState.userManagement.authorities,
  loading: storeState.userManagement.loading,
  updating: storeState.userManagement.updating,
  fetchSuccess: storeState.userManagement.fetchSuccess,
  updateSuccess: storeState.userManagement.updateSuccess,
});

const mapDispatchToProps = { getUser, getRoles, updateUser, createUser, reset, deleteUser };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserManagementUpdate);
