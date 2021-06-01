import React, { useState, useEffect, ReactText } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import Alert from '@spectrum-icons/workflow/Alert';
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
  ActionButton,
} from '@adobe/react-spectrum';
import { defaultValue } from 'app/shared/model/error.model';
import { ComboBox, Item } from '@react-spectrum/combobox';
import { searchUsers, getUsers } from 'app/modules/administration/user-management/users/user.reducer';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { getDatasourcesByName, getDatasources } from 'app/modules/administration/sources/datasources/datasources.reducer';
import { CONSTRAINT_TYPES } from 'app/config/constants';
import {
  setDatasourceConstraints,
  getFeatures,
  reset,
  createDatasourceConstraints,
  updateDatasourceConstraints,
  deleteDatasourceConstraints,
  addConstraint,
  removeConstraint,
} from './datasource-constraints.reducer';
import AsyncSelect from 'react-select/async';
import { forwardCall } from 'app/shared/websocket/proxy-websocket.service';
import { generateOptions } from 'app/shared/util/entity-utils';
import AddCircel from '@spectrum-icons/workflow/AddCircle';
import RemoveCircle from '@spectrum-icons/workflow/RemoveCircle';
import { isFormValid } from './datasource-constraints.util';
import Separators from 'app/shared/components/separator/separators';
import SeparatorInput from 'app/shared/components/separator/separator-input';
import SeparatorIcon from 'app/shared/components/separator/separator-icon';
import { addCommaSeparatedValuesIntoConstraint } from 'app/shared/components/separator/separator.util';
import { SEPARATORS } from 'app/config/constants';

export interface IDatasourceConstraintUpdateProps extends StateProps, DispatchProps {
  setOpen: (isOpen: boolean) => void;
  history: any;
}

export const UserUpdate = (props: IDatasourceConstraintUpdateProps) => {
  const { setOpen, updateSuccess, history, updating } = props;
  const [error, setError] = useState(defaultValue);
  const [login, setLogin] = React.useState('');
  const [datasourceName, setDatasourceName] = React.useState('');
  const [separator, setSeparator] = useState(SEPARATORS[0].id);
  const [featureConstraint, setFeatureConstraint] = useState();

  const dialog = useDialogContainer();

  const handleClose = () => {
    setOpen(false);
    dialog.dismiss();
    props.reset();
  };

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  useEffect(() => {
    props.getDatasources(0, ITEMS_PER_PAGE, 'lastUpdated,desc');
    props.getUsers(0, ITEMS_PER_PAGE);
  }, []);

  const saveUser = () => {
    if (props.constraint.id) {
      props.updateDatasourceConstraints(props.constraint);
    } else {
      props.createDatasourceConstraints(props.constraint);
    }
  };

  const remove = () => {
    props.deleteDatasourceConstraints(props.constraint.id);
  };

  const loadFilters = selectedOption => {
    // TODO : this will be done once khushbu's pr is merged
    // // var vId = constraint.id;
    // var vId = null;
    // var query = {};
    // query['fields'] = [{ name: featureName }];
    // if (q) {
    //     query['conditionExpressions'] = [{
    //         sourceType: 'FILTER',
    //         conditionExpression: {
    //             '@type': 'Like',
    //             featureType: { featureName: featureName, type: constraint.featureName.type },
    //             caseInsensitive: true,
    //             value: q
    //         }
    //     }];
    // }
    // query['distinct'] = true;
    // query['limit'] = 20;
    // forwardCallV2()
    // proxyGrpcService.forwardCallV2(
    //     vm.datasourceConstraint.datasource.id, {
    //     queryDTO: query,
    //     type: 'filters'
    // }
    // );
    // }
  };

  const dispatchCommaSeparatedValues = receivedCommaSeparatedvalues => {
    const _constraint = addCommaSeparatedValuesIntoConstraint(receivedCommaSeparatedvalues, props.constraint, featureConstraint, separator);
    props.setDatasourceConstraints(_constraint);
  };

  const toggleCommaSeparator = _featureConstraint => {
    if (_featureConstraint['isCommaSeparatedInputOn'] !== undefined) {
      _featureConstraint['isCommaSeparatedInputOn'] = !_featureConstraint['isCommaSeparatedInputOn'];
    } else {
      _featureConstraint['isCommaSeparatedInputOn'] = true;
    }
    setFeatureConstraint(_featureConstraint);
    props.setDatasourceConstraints(props.constraint);
  };

  const selectStyles = {
    control: styles => ({ ...styles, minWidth: '305px' }),
  };

  return (
    <Dialog data-testid="datasource-constraint-form-dialog" width="80vw" minHeight="60vh">
      <Heading>
        <Flex alignItems="center" gap="size-100" data-testid="datasource-constraint-form-heading">
          {props.constraint.id !== '' ? (
            <Translate contentKey="permissions.datasourceConstraints.editLabel">Edit Constraints</Translate>
          ) : (
            <Translate contentKey="permissions.datasourceConstraints.createLabel">Create Constraints</Translate>
          )}
        </Flex>
      </Heading>
      <Header data-testid="datasource-constraint-form-action">
        <Flex alignItems="center" gap="size-100">
          <Separators setSeparator={setSeparator} />
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
            items={props.searchedUsers.length > 0 ? props.searchedUsers : props.users}
            inputValue={login ? login : props.constraint.user.login}
            onSelectionChange={event => {
              let filteredUsers = [];
              if (event) {
                filteredUsers = props.searchedUsers.filter(item => {
                  return item.id === event;
                });
                if (filteredUsers && filteredUsers.length === 0) {
                  filteredUsers = props.users.filter(item => {
                    return item.id === event;
                  });
                }
                props.setDatasourceConstraints({ ...props.constraint, user: filteredUsers[0] });
                setError(isFormValid({ ...props.constraint, user: filteredUsers[0] }));
              }
            }}
            onInputChange={event => {
              setLogin(event);
              props.searchUsers(0, ITEMS_PER_PAGE, 'login,asc', event);
            }}
          >
            {item => <Item>{item.login}</Item>}
          </ComboBox>
          <ComboBox
            placeholder={translate('datasources.search')}
            label={translate('datasources.select')}
            defaultItems={props.datasources}
            items={props.datasources}
            inputValue={datasourceName ? datasourceName : props.constraint.datasource.name}
            onSelectionChange={event => {
              if (event) {
                const filteredDatasource = props.datasources.filter(item => {
                  return item.id === event;
                });
                props.setDatasourceConstraints({ ...props.constraint, datasource: filteredDatasource[0] });
                props.getFeatures(Number(event), 'DIMENSION');
                setError(isFormValid({ ...props.constraint, datasource: filteredDatasource[0] }));
              }
            }}
            onInputChange={event => {
              setDatasourceName(event);
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
          {props.constraint.constraintDefinition.featureConstraints.map((con, i) => (
            <Flex alignItems="center" gap="size-200" key={`constraint-${i}`}>
              <Picker
                isDisabled={!props.constraint.datasource.id}
                key={`constraint-type-${i}`}
                onSelectionChange={selected => {
                  con['@type'] = selected;
                  props.setDatasourceConstraints(props.constraint);
                  setError(isFormValid(props.constraint));
                }}
                selectedKey={con['@type']}
                placeholder={translate('permissions.datasourceConstraints.selectType')}
              >
                {CONSTRAINT_TYPES.map(item => (
                  <Item key={item}>{item}</Item>
                ))}
              </Picker>
              <ComboBox
                isDisabled={!props.constraint.datasource.id}
                key={`constraint-feature-${i}`}
                placeholder={translate('permissions.datasourceConstraints.selectField')}
                defaultItems={props.features}
                items={props.features}
                inputValue={con.featureName ? con.featureName : ''}
                onSelectionChange={event => {
                  const filteredFeatures = props.features.filter(item => {
                    return item.id === event;
                  });
                  if (filteredFeatures && filteredFeatures.length > 0) {
                    con.featureName = filteredFeatures[0].name;
                    props.setDatasourceConstraints(props.constraint);
                  }
                  setError(isFormValid(props.constraint));
                  con['isCommaSeparatedInputOn'] = false;
                }}
                onInputChange={event => {
                  if (event) {
                    con.featureName = event;
                    props.setDatasourceConstraints(props.constraint);
                  }
                }}
              >
                {item => <Item>{item.name}</Item>}
              </ComboBox>
              {/* TODO : this will be done once khushbu's pr is merged */}

              {con.isCommaSeparatedInputOn ? (
                <SeparatorInput values={con.values} dispatchCommaSeparatedValues={dispatchCommaSeparatedValues} separator={separator} />
              ) : (
                <AsyncSelect
                  isDisabled={!props.constraint.datasource.id}
                  isClearable
                  isSearchable
                  isMulti
                  value={generateOptions(con.values)}
                  defaultValue={generateOptions(con.values)}
                  // options={generateOptions(con.values)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  // onInputChange={loadFilters}
                  loadOptions={loadFilters}
                  // onChange={selectDatasource}
                  styles={selectStyles}
                  // defaultValue={{ value: datasource.name, label: datasource.name }}
                />
              )}

              <SeparatorIcon toggleCommaSeparator={toggleCommaSeparator} condition={con} />

              {/* <ActionButton isQuiet onPress={()=>{
                toggleCommaSeparator(con);
              }}>
                <Separator size="S" />
              </ActionButton> */}

              <ActionButton
                isQuiet
                onPress={() => {
                  props.addConstraint();
                }}
              >
                <AddCircel size="S" />
              </ActionButton>

              {i !== 0 ? (
                <ActionButton
                  isQuiet
                  onPress={() => {
                    props.removeConstraint(con);
                  }}
                >
                  <RemoveCircle size="S" />
                </ActionButton>
              ) : null}
            </Flex>
          ))}

          {props.constraint.id !== '' ? (
            <React.Fragment>
              <span className="spectrum-Heading spectrum-Heading--sizeXXS">
                <Translate contentKey="entity.action.dangerZone">Danger Zone</Translate>
              </span>
              <Divider size="M" />{' '}
            </React.Fragment>
          ) : null}
        </Form>
        {props.constraint.id !== '' ? (
          <Button data-testid="delete" variant="negative" onPress={remove} marginTop="size-175" marginBottom="size-100">
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
  datasources: storeState.datasources.datasources,
  updateSuccess: storeState.datasourceConstraints.updateSuccess,
  updating: storeState.datasourceConstraints.updating,
  features: storeState.datasourceConstraints.features,
  users: storeState.userManagement.users,
  searchedUsers: storeState.userManagement.searchedUsers,
  constraint: storeState.datasourceConstraints.constraint,
});

const mapDispatchToProps = {
  setDatasourceConstraints,
  getDatasources,
  searchUsers,
  getDatasourcesByName,
  getUsers,
  getFeatures,
  reset,
  createDatasourceConstraints,
  updateDatasourceConstraints,
  deleteDatasourceConstraints,
  addConstraint,
  removeConstraint,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserUpdate);
