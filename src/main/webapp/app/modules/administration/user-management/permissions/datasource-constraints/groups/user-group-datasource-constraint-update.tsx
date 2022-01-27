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
  updateCondition
} from './user-group-datasource-constraints.reducer';
import { getEntitiesByFeatureType as getFeatures } from 'app/entities/feature/feature.reducer';
import { generateOptions } from 'app/shared/util/entity-utils';
import AddCircel from '@spectrum-icons/workflow/AddCircle';
import RemoveCircle from '@spectrum-icons/workflow/RemoveCircle';
import { generateDatasourcesOptions, generateFeatureNameOptions, isFormValid } from './user-group-datasource-constraints.util';
import Select from 'react-select';
import { loadFilterOptions, generateFilterOptions } from 'app/modules/canvas/filter/filter-util';
import { IDatasources } from 'app/shared/model/datasources.model';
import { IFeature } from 'app/shared/model/feature.model';

export interface IUserGroupDatasourceConstraintUpdateProps extends StateProps, DispatchProps {
  setOpen: (isOpen: boolean) => void;
}

export const UserGroupDatasourceConstraintUpdate = (props: IUserGroupDatasourceConstraintUpdateProps) => {
  const { setOpen, updateSuccess, updating } = props;
  const [error, setError] = useState(defaultValue);
  const [datasource, setDatasource] = useState<IDatasources>(null);
  const [feature, setFeature] = useState<IFeature>(null);

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

  useEffect(() => {
    setError(isFormValid(props.constraint));
    if (props.constraint?.datasource) {
      setDatasource(props.constraint?.datasource);
    }
  }, [props.constraint]);

  const getFeature = id => {
    if(id){
      const filteredFeatures = props.features.filter(item => {
        return item.id === id;
      })[0];
      return {label:filteredFeatures.name,value:filteredFeatures.id};
    }else{
      return {label:'',value:''};
    }
  };

  return (
    <Dialog data-testid="group-datasource-constraint-form-dialog" width="80vw" minHeight="60vh">
      <Heading>
        <Flex alignItems="center" gap="size-100" data-testid="group-datasource-constraint-form-heading">
          {props.constraint.id !== '' ? (
            <Translate contentKey="permissions.datasourceConstraints.editLabel">Edit Constraints</Translate>
          ) : (
            <Translate contentKey="permissions.datasourceConstraints.createLabel">Create Constraints</Translate>
          )}
        </Flex>
      </Heading>
      <Header data-testid="group-datasource-constraint-form-action">
        <Flex alignItems="center" gap="size-100">
          <Button variant="secondary" onPress={handleClose} data-testid="group-datasource-constraint-form-cancel">
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button
            variant="cta"
            onPress={save}
            isDisabled={updating || !error.isValid}
            data-testid="group-datasource-constraint-form-submit"
          >
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </Flex>
      </Header>
      <Divider />
      <Content>
        <Form data-testid="group-datasource-constraint-form">
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
                      })[0];
                      setDatasource(filteredDatasource);
                      props.setDatasourceConstraints({ ...props.constraint, datasourceId: filteredDatasource.id });
                      props.getFeatures(Number(event.value), 'DIMENSION');
                    }
                  }}
                  className="basic-single"
                  classNamePrefix="select"
                  isSearchable={true}
                  name="datasources"
                  options={generateDatasourcesOptions(props.datasources)}
                  value={{ label: datasource?.name, value: datasource?.id }}
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
                  placeholder={translate('permissions.datasourceConstraints.selectField')}
                  onChange={event => {
                    if (event) {
                      con['@type'] = 'Feature';
                      const filteredFeatures = props.features.filter(item => {
                        return item.id === event.value;
                      })[0];
                      if (filteredFeatures) {
                        con.id = filteredFeatures.id;
                        props.setDatasourceConstraints(props.constraint);
                      }
                      props.updateCondition(con);
                    }
                  }}
                  className="basic-single"
                  classNamePrefix="select"
                  isSearchable={true}
                  name="features"
                  options={generateFeatureNameOptions(props.features)}
                  value={getFeature(con.id)}
                />
              </div>
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
  updateSuccess: storeState.userGroupDatasourceConstraints.updateSuccess,
  updating: storeState.userGroupDatasourceConstraints.updating,
  features: storeState.feature.entities,
  constraint: storeState.userGroupDatasourceConstraints.constraint,
  filterSelectOptions: generateFilterOptions(storeState.visualisationData.filterData),
});

const mapDispatchToProps = {
  setDatasourceConstraints,
  getDatasources,
  getDatasourcesByName,
  getFeatures,
  reset,
  createDatasourceConstraints,
  updateDatasourceConstraints,
  deleteDatasourceConstraints,
  addConstraint,
  removeConstraint,
  updateCondition
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserGroupDatasourceConstraintUpdate);
