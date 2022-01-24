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
  reset,
  createDatasourceConstraints,
  updateDatasourceConstraints,
  deleteDatasourceConstraints,
  addConstraint,
  removeConstraint,
  updateConditionValues,
} from './user-datasource-constraints.reducer';
import { getEntitiesByFeatureType as getFeatures } from 'app/entities/feature/feature.reducer';
import { setFilterData } from 'app/shared/websocket/websocket.reducer';
import { generateOptions } from 'app/shared/util/entity-utils';
import AddCircel from '@spectrum-icons/workflow/AddCircle';
import RemoveCircle from '@spectrum-icons/workflow/RemoveCircle';
import {
  generateDatasourcesOptions,
  generateFeatureNameOptions,
  generateUserOptions,
  isFormValid,
} from './user-datasource-constraints.util';
import Separators from 'app/shared/components/separator/separators';
import SeparatorInput from 'app/shared/components/separator/separator-input';
import SeparatorIcon from 'app/shared/components/separator/separator-icon';
import { addCommaSeparatedValuesIntoConstraint } from 'app/shared/components/separator/separator.util';
import { SEPARATORS } from 'app/config/constants';
import Select from 'react-select';
import { loadFilterOptions, generateFilterOptions } from 'app/modules/canvas/filter/filter-util';

export interface IUserDatasourceConstraintUpdateProps extends StateProps, DispatchProps {
  setOpen: (isOpen: boolean) => void;
  history: any;
}

export const UserDatasourceConstraintUpdate = (props: IUserDatasourceConstraintUpdateProps) => {
  const { setOpen, updateSuccess, history, updating } = props;
  const [error, setError] = useState(defaultValue);
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
    loadFilterOptions(constraint.featureName, props.constraint.datasource.id, newValue);
  };

  const onFocus = constraint => {
    props.setFilterData(null);
    loadFilterOptions(constraint.featureName, props.constraint.datasource.id);
  };

  const handleChange = (selectedOption, actionMeta, con) => {
    props.updateConditionValues(con, selectedOption);
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
            value={{ label: props.constraint.user.login, value: props.constraint.user.login }}
          />

          {
            <>
              <span className="spectrum-Body-emphasis--sizeXXS">{translate('datasources.select')}</span>
              <div style={{ minWidth: '250px' }}>
                <Select
                  placeholder={translate('datasources.search')}
                  onChange={event => {
                    if (event) {
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
                  value={{ label: props.constraint.datasource.name, value: props.constraint.datasource.name }}
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
              <div style={{ minWidth: '200px' }}>
                <Select
                  placeholder={translate('permissions.datasourceConstraints.selectType')}
                  className="basic-single"
                  classNamePrefix="select"
                  isDisabled={!props.constraint.datasource.id}
                  value={{ value: con['@type'], label: con['@type'] }}
                  onChange={selected => {
                    con['@type'] = selected.value;
                    props.setDatasourceConstraints(props.constraint);
                  }}
                  options={generateOptions(CONSTRAINT_TYPES)}
                  style={{ minWidth: '200' }}
                />
              </div>
              <div style={{ minWidth: '200px' }}>
                <Select
                  isDisabled={!props.constraint.datasource.id}
                  placeholder={translate('permissions.datasourceConstraints.selectField')}
                  onChange={event => {
                    if (event) {
                      con.featureName = event.label;
                      const filteredFeatures = props.features.filter(item => {
                        return item.id === event.value;
                      });
                      if (filteredFeatures && filteredFeatures.length > 0) {
                        con.featureName = filteredFeatures[0].name;
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
                  value={{ value: con.featureName, label: con.featureName }}
                />
              </div>
              {con.isCommaSeparatedInputOn ? (
                <SeparatorInput values={con.values} dispatchCommaSeparatedValues={dispatchCommaSeparatedValues} separator={separator} />
              ) : (
                <div style={{ minWidth: '300px' }}>
                  <Select
                    isDisabled={!props.constraint.datasource.id}
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
                </div>
              )}

              <SeparatorIcon toggleCommaSeparator={toggleCommaSeparator} condition={con} />
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
  features: storeState.feature.entities,
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
  updateConditionValues,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserDatasourceConstraintUpdate);
