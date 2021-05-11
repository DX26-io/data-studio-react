import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import {} from './datasource-constraints.reducer';
import { IRootState } from 'app/shared/reducers';
import Alert from '@spectrum-icons/workflow/Alert';
import AlertCircle from '@spectrum-icons/workflow/AlertCircle';
import {
  Picker,
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
  Text,
  View,
} from '@adobe/react-spectrum';
import { defaultValue } from 'app/shared/model/error.model';
import { ComboBox, Item } from '@react-spectrum/combobox';
import { searchUsers, getUsers } from 'app/modules/administration/user-management/users/user.reducer';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { getDatasourcesByName } from 'app/modules/administration/sources/datasources/datasources.reducer';
import { CONSTRAINT_TYPES } from 'app/config/constants';
import Select from 'react-select';

export interface IDatasourceConstraintUpdateProps extends StateProps, DispatchProps {
  setUpdateSuccess: () => void;
  setOpen: (isOpen: boolean) => void;
  history: any;
}

export const UserUpdate = (props: IDatasourceConstraintUpdateProps) => {
  const { setOpen, setUpdateSuccess, updateSuccess, history, updating } = props;
  const [name, setName] = useState('');
  const [error, setError] = useState(defaultValue);
  const [searchedUser, setSearchedUser] = React.useState('');
  const [searchedDatasource, setSearchedDatasource] = React.useState('');
  const [constraintType, setConstraintType] = React.useState('');

  const dialog = useDialogContainer();

  //   useEffect(() => {
  //     if (true) {
  //       props.reset();
  //     } else {
  //       props.getDatasourceConstraint(groupName);
  //     }
  //     return () => {
  //       props.reset();
  //     };
  //   }, []);

  const handleClose = () => {
    setOpen(false);
    dialog.dismiss();
  };

  //   useEffect(() => {
  //     if (true) {
  //       setName('');
  //     } else {
  //       setName(group.name);
  //     }
  //     if (updateSuccess) {
  //       handleClose();
  //       setUpdateSuccess();
  //     }
  //   }, [fetchSuccess, true, updateSuccess]);

  useEffect(() => {
    props.getDatasourcesByName(0, ITEMS_PER_PAGE, 'lastUpdated,desc');
    props.getUsers(0, ITEMS_PER_PAGE);
  }, []);

  const saveUser = () => {
    // if (true) {
    //   props.createDatasourceConstraint(values);
    // } else {
    //   props.updateDatasourceConstraint(values);
    // }
  };

  const removeGroup = () => {
    // props.deleteDatasourceConstraint(group.name);
  };

  return (
    <Dialog data-testid="datasource-constraint-form-dialog" width="80vw">
      <Heading>
        <Flex alignItems="center" gap="size-100" data-testid="datasource-constraint-form-heading">
          {!true ? (
            <Translate contentKey="permissions.datasourceConstraints.editLabel">Edit Constraints</Translate>
          ) : (
            <Translate contentKey="permissions.datasourceConstraints.createLabel">Create Constraints</Translate>
          )}
        </Flex>
      </Heading>
      <Header data-testid="datasource-constraint-form-action">
        <Flex alignItems="center" gap="size-100">
          <Button variant="secondary" onPress={handleClose} data-testid="datasource-constraint-form-cancel">
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button variant="cta" onPress={saveUser} isDisabled={updating || !error.isValid} data-testid="datasource-constraint-form-submit">
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </Flex>
      </Header>
      <Divider />
      <Content>
        <Form data-testid="datasource-constraint-form">
          <ComboBox
            placeholder={translate('userManagement.search')}
            label={translate('userManagement.select')}
            defaultItems={props.users}
            items={props.users}
            inputValue={searchedUser}
            onInputChange={event => {
              setSearchedUser(event);
              props.searchUsers(0, ITEMS_PER_PAGE, 'login,asc', event);
            }}
          >
            {item => <Item>{item.login}</Item>}
          </ComboBox>
          <ComboBox
            placeholder={translate('datasources.search')}
            label={translate('datasources.select')}
            defaultItems={props.dataSources}
            items={props.dataSources}
            inputValue={searchedDatasource}
            onInputChange={event => {
              setSearchedDatasource(event);
              props.getDatasourcesByName(0, ITEMS_PER_PAGE, 'lastUpdated,desc', event);
            }}
          >
            {item => <Item>{item.name}</Item>}
          </ComboBox>
          <View>
            <span className="spectrum-Heading spectrum-Heading--sizeXXS">
              <Translate contentKey="permissions.datasourceConstraints.constraints">Constraints</Translate>
            </span>
            <Divider size="M" marginTop="size-100" marginBottom="size-200" />
          </View>
          <Flex alignItems="center" gap="size-25">
            <Picker placeholder={translate('permissions.datasourceConstraints.selectType')}>
              {CONSTRAINT_TYPES.map(item => (
                <Item key={item}>{item}</Item>
              ))}
            </Picker>
            <Select
              isClearable
              isSearchable
              isMulti
              // options={roles}
              // className="basic-multi-select"
              // classNamePrefix="select"
              // onInputChange={search}
              // onChange={selectDatasource}
              // styles={selectStyles}
              // defaultValue={{ value: datasource.name, label: datasource.name }}
            />
          </Flex>
          {!true ? (
            <React.Fragment>
              <span className="spectrum-Heading spectrum-Heading--sizeXXS">
                <Translate contentKey="entity.action.dangerZone">Danger Zone</Translate>
              </span>
              <Divider size="M" />{' '}
            </React.Fragment>
          ) : null}
        </Form>
        {!true ? (
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
  dataSources: storeState.datasources.datasources,
  updateSuccess: storeState.datasourceConstraints.updateSuccess,
  updating: storeState.datasourceConstraints.updating,
  users: storeState.userManagement.users,
});

const mapDispatchToProps = { searchUsers, getDatasourcesByName, getUsers };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserUpdate);
