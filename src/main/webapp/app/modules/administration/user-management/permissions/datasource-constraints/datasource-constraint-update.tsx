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
  addConditionValue,
  removeConditionValue,
} from './datasource-constraints.reducer';
import { setFilterData } from 'app/shared/websocket/websocket.reducer';
import { generateOptions } from 'app/shared/util/entity-utils';
import AddCircel from '@spectrum-icons/workflow/AddCircle';
import RemoveCircle from '@spectrum-icons/workflow/RemoveCircle';
import { generateDatasourcesOptions, generateFeatureNameOptions, generateUserOptions, isFormValid } from './datasource-constraints.util';
import Separators from 'app/shared/components/separator/separators';
import SeparatorInput from 'app/shared/components/separator/separator-input';
import SeparatorIcon from 'app/shared/components/separator/separator-icon';
import { addCommaSeparatedValuesIntoConstraint } from 'app/shared/components/separator/separator.util';
import { SEPARATORS } from 'app/config/constants';
import Select from 'react-select';
import { load, loadV2, generateFilterOptions } from 'app/modules/canvas/filter/filter-util';

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

  const save = () => {
    if (props.constraint.id) {
      props.updateDatasourceConstraints(props.constraint);
    } else {
      props.createDatasourceConstraints(props.constraint);
    }
  };

  const remove = () => {
    props.deleteDatasourceConstraints(props.constraint.id);
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

  const handleInputChange = (constraint: any, newValue: string) => {
    props.setFilterData(null);
    loadV2(constraint, props.constraint.datasource.id, newValue);
  };

  const onFocus = constraint => {
    props.setFilterData(null);
    loadV2(constraint, props.constraint.datasource.id);
  };

  const handleChange = (selectedOption, actionMeta, con) => {
    if (actionMeta.action === 'select-option') {
      props.addConditionValue(con, selectedOption[0].value);
    } else if (actionMeta.action === 'remove-value') {
      props.removeConditionValue(con, selectedOption ? selectedOption[0].value : selectedOption);
    }
  };

  useEffect(() => {
    setError(isFormValid(props.constraint));
  }, [props.constraint]);

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
          <Button variant="cta" onPress={save} isDisabled={updating || !error.isValid} data-testid="datasource-constraint-form-submit">
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </Flex>
      </Header>
      <Divider />
      <Content>
        <Form data-testid="datasource-constraint-form">
          <span className="spectrum-Body-emphasis--sizeXXS">{translate('userManagement.select')}</span>
          <Select
            onChange={event => {
              let filteredUsers = [];
              if (event) {
                setLogin(event.value);
                filteredUsers = props.searchedUsers.filter(item => {
                  return item.id === event.value;
                });
                if (filteredUsers && filteredUsers.length === 0) {
                  filteredUsers = props.users.filter(item => {
                    return item.id === event.value;
                  });
                }
                props.setDatasourceConstraints({ ...props.constraint, user: filteredUsers[0] });
              }
            }}
            placeholder={translate('userManagement.search')}
            label={translate('userManagement.select')}
            className="basic-single"
            classNamePrefix="select"
            isSearchable={true}
            name="users"
            options={generateUserOptions(props.users)}
            value={{label:props.constraint.user.login,value:props.constraint.user.login}}
          />

          {
            <>
              <span className="spectrum-Body-emphasis--sizeXXS">{translate('datasources.select')}</span>
              <div style={{ minWidth: '250px' }}>
                <Select
                  placeholder={translate('datasources.search')}
                  onChange={event => {
                    if (event) {
                      setDatasourceName(event.label);
                      const filteredDatasource = props.datasources.filter(item => {
                        return item.id === event.value;
                      });
                      props.setDatasourceConstraints({ ...props.constraint, datasource: filteredDatasource[0] });
                      props.getFeatures(Number(event.value), 'DIMENSION');
                    }
                  }}
                  className="basic-single"
                  classNamePrefix="select"
                  isSearchable={true}
                  name="datasources"
                  options={generateDatasourcesOptions(props.datasources)}
                  value={{label:props.constraint.datasource.name,value:props.constraint.datasource.name}}
                />
              </div>
            </>
          }
          <View>
            <span className="spectrum-Heading spectrum-Heading--sizeXXS">
              <Translate contentKey="permissions.datasourceConstraints.constraints">Constraints</Translate>
            </span>
            <Divider size="M" marginTop="size-200" marginBottom="size-200" />
          </View>
          {props.constraint.constraintDefinition.featureConstraints.map((con, i) => (
            <Flex alignItems="center" gap="size-100" key={`constraint-${i}`}>
              <Picker
                isDisabled={!props.constraint.datasource.id}
                key={`constraint-type-${i}`}
                onSelectionChange={selected => {
                  con['@type'] = selected;
                  props.setDatasourceConstraints(props.constraint);
                }}
                selectedKey={con['@type']}
                placeholder={translate('permissions.datasourceConstraints.selectType')}
              >
                {CONSTRAINT_TYPES.map(item => (
                  <Item key={item}>{item}</Item>
                ))}
              </Picker>
              <div style={{ minWidth: '200px' }}>
                <Select
                  placeholder={translate('permissions.datasourceConstraints.selectField')}
                  onChange={event => {
                    if (event) {
                      con.featureName = event.label;
                      const filteredFeatures = props.features.filter(item => {
                        return item.id === event.value;
                      });
                      if (filteredFeatures && filteredFeatures.length > 0) {
                        con.featureName = filteredFeatures[0].name;
                        con['@type']=filteredFeatures[0].type
                        props.setDatasourceConstraints(props.constraint);
                      }
                      con['isCommaSeparatedInputOn'] = false;
                    }
                  }}
                  className="basic-single"
                  classNamePrefix="select"
                  isSearchable={true}
                  name="features"
                  options={generateFeatureNameOptions(props.features)}
                  value={{value:con.featureName,label:con.featureName}}
                />
              </div>
              {con.isCommaSeparatedInputOn ? (
                <SeparatorInput values={con.values} dispatchCommaSeparatedValues={dispatchCommaSeparatedValues} separator={separator} />
              ) : (
                <View marginTop="size-125" minWidth="size-3400" width="100%">
                  <Select
                    isMulti
                    value={generateOptions(con.values)}
                    searchable={true}
                    onBlurResetsInput={false}
                    onCloseResetsInput={false}
                    onFocus={() => {
                      onFocus(con);
                    }}
                    closeMenuOnSelect={false}
                    classNamePrefix="select"
                    onChange={(value, actionMeta) => {
                      handleChange(value, actionMeta, con);
                    }}
                    placeholder={`Search ${con.featureName}`}
                    onInputChange={event => {
                      handleInputChange(con, event);
                    }}
                    options={props.filterSelectOptions}
                  />
                </View>
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
  filterSelectOptions: generateFilterOptions(storeState.visualisationData.filterData),
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
  setFilterData,
  addConditionValue,
  removeConditionValue,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserUpdate);
