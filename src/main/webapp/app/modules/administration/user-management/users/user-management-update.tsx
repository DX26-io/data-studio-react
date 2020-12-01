import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
// import { Button, Label, Row, Col } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField, AvFeedback } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IUser } from 'app/shared/model/user.model';
import { locales, languages } from 'app/config/translation';
import { getUser, getRoles, updateUser, createUser, reset, deleteUser } from './user-management.reducer';
import { IRootState } from 'app/shared/reducers';
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
  Picker,
  Item,
  DialogTrigger,
  Footer,
  ActionButton,
  Header,
  Checkbox,
  Text,
} from '@adobe/react-spectrum';

export interface IUserManagementUpdateProps extends StateProps, DispatchProps {
  user: IUser;
  setOpen: (isOpen: boolean) => void;
}

export const UserManagementUpdate = (props: IUserManagementUpdateProps) => {
  const { user, setOpen } = props;
  const [login, setLogin] = useState(user.login);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [activated, setActivated] = useState(user.activated);

  const isValidLogin = React.useMemo(() => /^[_'.@A-Za-z0-9-]*$/.test(login), [login]);

  const dialog = useDialogContainer();

  useEffect(() => {
    props.getRoles();
  }, []);

  const buildUser = () => {
    user.login = login;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.activated = activated;
  };

  const handleClose = () => {
    setOpen(false);
    dialog.dismiss();
    // props.history.push('/admin/user-management');
  };

  const saveUser = () => {
    buildUser();
    if (user.id) {
      props.updateUser(user);
    } else {
      props.createUser(user);
    }
    handleClose();
  };

  const removeUser = () => {
    props.deleteUser(user.login);
    handleClose();
  };

  const isInvalid = false;
  const { loading, updating, roles } = props;

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Dialog>
          <Heading>
            <Flex alignItems="center" gap="size-100">
              {user.id ? (
                <Translate contentKey="userManagement.home.editLabel">Edit User</Translate>
              ) : (
                <Translate contentKey="userManagement.home.createLabel">Create User</Translate>
              )}
            </Flex>
          </Heading>
          <Header>
            <Flex alignItems="center" gap="size-100">
              <Button variant="secondary" onPress={handleClose}>
                <Translate contentKey="entity.action.cancel">Cancel</Translate>
              </Button>
              <Button variant="cta" onPress={saveUser} isDisabled={updating}>
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </Flex>
          </Header>
          <Divider />
          <Content>
            <Form>
              <TextField
                label="Login ID"
                placeholder="John"
                minLength={1}
                // maxlength={50} it does not exist..need to be part of valaidation
                validationState={isValidLogin ? 'valid' : 'invalid'}
                type="text"
                value={login}
                onChange={setLogin}
                autoFocus
                isRequired
              />
              <TextField
                label="First Name"
                placeholder="John"
                isRequired
                type="text"
                value={firstName}
                onChange={setFirstName}
                // maxlength={50} it does not exist..need to be part of valaidation
                autoFocus
              />
              <TextField
                label="Last Name"
                placeholder="Deo"

                type="text"
                value={lastName}
                onChange={setLastName}
                // maxlength={50} it does not exist..need to be part of valaidation
                autoFocus
              />
              <TextField
                label="Email"
                placeholder="John@dx26.com"
                isRequired
                type="email"
                value={email}
                onChange={setEmail}
                // maxlength={100} it does not exist..need to be part of valaidation
                autoFocus
              />
              <Checkbox isSelected={activated} onChange={setActivated} isEmphasized defaultSelected>
                <Translate contentKey="userManagement.activate">Activate</Translate>
              </Checkbox>
              <Text>
                <Translate contentKey="entity.action.dangerZone">Danger Zone</Translate>
              </Text>
              <Divider size="M" />
            </Form>
            {user.id ? (
              <Button variant="negative" onPress={removeUser} marginTop="size-175">
                <Translate contentKey="entity.action.delete">Delete</Translate>
              </Button>
            ) : null}
          </Content>
        </Dialog>
      )}

      {/* <Row className="justify-content-center">
        <Col md="8">
          <h1>
            <Translate contentKey="userManagement.home.createOrEditLabel">Create or edit a User</Translate>
          </h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm onValidSubmit={saveUser}>
              {user.id ? (
                <AvGroup>
                  <Label for="id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvField type="text" className="form-control" name="id" required readOnly value={user.id} />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label for="login">
                  <Translate contentKey="userManagement.login">Login</Translate>
                </Label>
                <AvField
                  type="text"
                  className="form-control"
                  name="login"
                  validate={{
                    required: {
                      value: true,
                      errorMessage: translate('register.messages.validate.login.required'),
                    },
                    pattern: {
                      value: '^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$',
                      errorMessage: translate('register.messages.validate.login.pattern'),
                    },
                    minLength: {
                      value: 1,
                      errorMessage: translate('register.messages.validate.login.minlength'),
                    },
                    maxLength: {
                      value: 50,
                      errorMessage: translate('register.messages.validate.login.maxlength'),
                    },
                  }}
                  value={user.login}
                />
              </AvGroup>
              <AvGroup>
                <Label for="firstName">
                  <Translate contentKey="userManagement.firstName">First Name</Translate>
                </Label>
                <AvField
                  type="text"
                  className="form-control"
                  name="firstName"
                  validate={{
                    maxLength: {
                      value: 50,
                      errorMessage: translate('entity.validation.maxlength', { max: 50 }),
                    },
                  }}
                  value={user.firstName}
                />
              </AvGroup>
              <AvGroup>
                <Label for="lastName">
                  <Translate contentKey="userManagement.lastName">Last Name</Translate>
                </Label>
                <AvField
                  type="text"
                  className="form-control"
                  name="lastName"
                  validate={{
                    maxLength: {
                      value: 50,
                      errorMessage: translate('entity.validation.maxlength', { max: 50 }),
                    },
                  }}
                  value={user.lastName}
                />
                <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
              </AvGroup>
              <AvGroup>
                <AvField
                  name="email"
                  label={translate('global.form.email.label')}
                  placeholder={translate('global.form.email.placeholder')}
                  type="email"
                  validate={{
                    required: {
                      value: true,
                      errorMessage: translate('global.messages.validate.email.required'),
                    },
                    email: {
                      errorMessage: translate('global.messages.validate.email.invalid'),
                    },
                    minLength: {
                      value: 5,
                      errorMessage: translate('global.messages.validate.email.minlength'),
                    },
                    maxLength: {
                      value: 254,
                      errorMessage: translate('global.messages.validate.email.maxlength'),
                    },
                  }}
                  value={user.email}
                />
              </AvGroup>
              <AvGroup check>
                <Label>
                  <AvInput type="checkbox" name="activated" value={user.activated} checked={user.activated} disabled={!user.id} />{' '}
                  <Translate contentKey="userManagement.activated">Activated</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="langKey">
                  <Translate contentKey="userManagement.langKey">Language Key</Translate>
                </Label>
                <AvField type="select" className="form-control" name="langKey" value={user.langKey || locales[0]}>
                  {locales.map(locale => (
                    <option value={locale} key={locale}>
                      {languages[locale].name}
                    </option>
                  ))}
                </AvField>
              </AvGroup>
              <AvGroup>
                <Label for="authorities">
                  <Translate contentKey="userManagement.profiles">Profiles</Translate>
                </Label>
                <AvInput type="select" className="form-control" name="authorities" value={user.userGroups} multiple>
                  {roles.map(role => (
                    <option value={role} key={role}>
                      {role}
                    </option>
                  ))}
                </AvInput>
              </AvGroup>
              <Button tag={Link} to="/admin/user-management" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" type="submit" disabled={isInvalid || updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row> */}
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  roles: storeState.userManagement.authorities,
  loading: storeState.userManagement.loading,
  updating: storeState.userManagement.updating,
});

const mapDispatchToProps = { getUser, getRoles, updateUser, createUser, reset, deleteUser };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserManagementUpdate);
