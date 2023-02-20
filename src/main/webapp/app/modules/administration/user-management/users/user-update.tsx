import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import { getUser, getRoles, updateUser, createUser, reset, deleteUser, setUser } from './user.reducer';
import { IRootState } from 'app/shared/reducers';
import { isFormValid, isValidEmail, filterRoles } from './user.util';
import Alert from '@spectrum-icons/workflow/Alert';
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
import { IError, defaultValue } from 'app/shared/model/error.model';
import { generateOptions } from 'app/shared/util/entity-utils';

export interface IUserUpdateProps extends StateProps, DispatchProps {
  setUpdateSuccess: () => void;
  setOpen: (isOpen: boolean) => void;
}

export const UserUpdate = (props: IUserUpdateProps) => {
  const { setOpen, setUpdateSuccess, user, updating, roles, updateSuccess } = props;
  const [error, setError] = useState(defaultValue);

  const dialog = useDialogContainer();

  useEffect(() => {
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
    if (updateSuccess) {
      handleClose();
      setUpdateSuccess();
    }
  }, [updateSuccess]);

  const saveUser = () => {
    if (!user.id) {
      props.createUser(user);
    } else {
      props.updateUser(user);
    }
  };

  const removeUser = () => {
    props.deleteUser(user.login);
  };

  const selectRole = selectedOption => {
    const userGroups = [];
    if (selectedOption) {
      selectedOption.forEach(function (option) {
        userGroups.push(option.value);
      });
    }
    props.setUser({ ...user, userGroups });
  };

  return (
    <Dialog data-testid="user-form-dialog">
      <Heading>
        <Flex alignItems="center" gap="size-100" data-testid="user-form-heading">
          {user.id ? (
            <Translate contentKey="userManagement.home.editLabel">Edit User</Translate>
          ) : (
            <Translate contentKey="userManagement.home.createLabel">Create User</Translate>
          )}
        </Flex>
      </Heading>
      <Header data-testid="user-form-action">
        <Flex alignItems="center" gap="size-100">
          <Button variant="secondary" onPress={handleClose} data-testid="user-form-cancel">
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button variant="cta" onPress={saveUser} isDisabled={updating || !isFormValid(user).isValid} data-testid="user-form-submit">
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
            validationState={user.login.length < 50 ? 'valid' : 'invalid'}
            type="text"
            value={user.login}
            onChange={event => {
              props.setUser({ ...user, login: event });
              const errorObj = isFormValid({ ...user, login: event });
              setError(errorObj);
            }}
            autoFocus
            isRequired
            data-testid="login"
          />
          <TextField
            label="First Name"
            placeholder="John"
            type="text"
            value={user.firstName}
            onChange={event => {
              props.setUser({ ...user, firstName: event });
              const errorObj = isFormValid({ ...user, firstName: event });
              setError(errorObj);
            }}
            validationState={user.firstName.length < 50 ? 'valid' : 'invalid'}
            autoFocus
            data-testid="first-name"
          />
          <TextField
            label="Last Name"
            placeholder="Deo"
            type="text"
            value={user.lastName}
            onChange={event => {
              props.setUser({ ...user, lastName: event });
              const errorObj = isFormValid({ ...user, lastName: event });
              setError(errorObj);
            }}
            validationState={user.lastName.length < 50 ? 'valid' : 'invalid'}
            autoFocus
            data-testid="last-name"
          />
          <TextField
            label="Email"
            placeholder="John@dx26.com"
            isRequired
            type="email"
            value={user.email}
            onChange={event => {
              props.setUser({ ...user, email: event });
              const errorObj = isFormValid({ ...user, email: event });
              setError(errorObj);
            }}
            data-testid="email"
            validationState={isValidEmail(user.email) ? 'valid' : 'invalid'}
            autoFocus
          />
          <Checkbox
            isSelected={user.activated}
            onChange={event => {
              props.setUser({ ...user, activated: event });
              const errorObj = isFormValid({ ...user, activated: event });
              setError(errorObj);
            }}
            isEmphasized
            defaultSelected
            data-testid="activated"
          >
            <Translate contentKey="userManagement.activate">Activate</Translate>
          </Checkbox>
          <Text>
            <Translate contentKey="userManagement.profiles">Profiles</Translate>
          </Text>
          {/* TODO : need to find a better approach to set defaultValue. it does not reset  */}
          <Select
            isMulti
            onChange={selectRole}
            value={generateOptions(user.userGroups)}
            options={roles}
            className="basic-multi-select"
            classNamePrefix="select"
          />
          {user.id ? (
            <React.Fragment>
              <span className="spectrum-Heading spectrum-Heading--sizeXXS">
                <Translate contentKey="entity.action.dangerZone">Danger Zone</Translate>
              </span>
              <Divider size="M" />{' '}
            </React.Fragment>
          ) : null}
        </Form>
        {user.id ? (
          <Button data-testid="delete" variant="negative" onPress={removeUser} marginTop="size-175">
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
  user: storeState.userManagement.user,
  roles: filterRoles(storeState.userManagement.authorities),
  loading: storeState.userManagement.loading,
  updating: storeState.userManagement.updating,
  fetchSuccess: storeState.userManagement.fetchSuccess,
  updateSuccess: storeState.userManagement.updateSuccess,
});

const mapDispatchToProps = { getUser, getRoles, updateUser, createUser, reset, deleteUser, setUser };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserUpdate);
