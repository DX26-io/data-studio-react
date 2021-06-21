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
import { searchUsers, getUsers } from 'app/modules/administration/user-management/users/user.reducer';
import { getDatasourcesByName, getDatasources } from 'app/modules/administration/sources/datasources/datasources.reducer';
import Select from 'react-select';
import AddCircel from '@spectrum-icons/workflow/AddCircle';
import RemoveCircle from '@spectrum-icons/workflow/RemoveCircle';
import { isFormValid, generateFeaturesOptions } from './hierarchy.util';
import {
  getHierarchies,
  addDrilldown,
  removeDrilldown,
  setHierarchy,
  updateHierarchy,
  createHierarchy,
  deleteHierarchy,
  reset,
} from './hierarchy.reducer';
import { defaultValue } from 'app/shared/model/error.model';

export interface HierarchyUpdateProps extends StateProps, DispatchProps {
  setOpen: (isOpen: boolean) => void;
}

export const HierarchyUpdate = (props: HierarchyUpdateProps) => {
  const [error, setError] = useState(defaultValue);

  const dialog = useDialogContainer();

  const handleClose = () => {
    props.setOpen(false);
    dialog.dismiss();
    props.reset();
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
      props.getHierarchies(props.datasource.id);
    }
  }, [props.updateSuccess]);

  const save = () => {
    const errorObj = isFormValid(props.hierarchy);
    if (errorObj.isValid) {
      if (props.hierarchy.id) {
        props.updateHierarchy({ ...props.hierarchy, datasource: props.datasource });
      } else {
        props.createHierarchy({ ...props.hierarchy, datasource: props.datasource });
      }
    }else{
      setError(errorObj);
    }
  };

  const remove = () => {
    props.deleteHierarchy(props.hierarchy.id);
  };

  const getDrillDownOrderLabel = order => {
    return translate('hierarchies.drilldown') + ' ' + (Number(order) + 1);
  };

  return (
    <Dialog data-testid="hierarchy-form-dialog" size="L" minHeight="60vh">
      <Heading>
        <Flex alignItems="center" gap="size-100" data-testid="hierarchy-form-heading">
          {props.hierarchy && props.hierarchy.id !== '' ? (
            <Translate contentKey="hierarchies.home.editLabel">Edit Constraints</Translate>
          ) : (
            <Translate contentKey="hierarchies.home.createLabel">Create Constraints</Translate>
          )}
        </Flex>
      </Heading>
      <Header data-testid="hierarchy-form-action">
        <Flex alignItems="center" gap="size-100">
          <Button variant="secondary" onPress={handleClose} data-testid="hierarchy-form-cancel">
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button variant="cta" onPress={save} isDisabled={props.updating || !error.isValid} data-testid="hierarchy-form-submit">
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </Flex>
      </Header>
      <Divider />
      <Content>
        <Form data-testid="hierarchy-form">
          <TextField
            label={translate('hierarchies.name')}
            value={props.hierarchy && props.hierarchy.name ? props.hierarchy.name : ''}
            onChange={event => {
              props.setHierarchy({ ...props.hierarchy, name: event });
              const errorObj = isFormValid({ ...props.hierarchy, name: event });
              setError(errorObj);
            }}
          />
          <br />
          {props.hierarchy &&
            props.hierarchy.drilldown.map((drilldown, i) => (
              <Flex alignItems="center" gap="size-100" key={`hierarchy-${i}`}>
                <span className="spectrum-Body-emphasis--sizeXXS">{getDrillDownOrderLabel(drilldown.order)}</span>
                <div style={{ minWidth: '305px' }}>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isClearable
                    isSearchable
                    defaultValue={drilldown.feature ? { value: drilldown.feature.id, label: drilldown.feature.name } : null}
                    key={`hierarchy-select-${i}`}
                    name={`hierarchy-name-${i}`}
                    options={props.dimensions}
                    onChange={selectedOption => {
                      const _feature = props.features.filter(f => f.id === selectedOption.value)[0];
                      drilldown.feature = _feature;
                      props.setHierarchy(props.hierarchy);
                      const errorObj = isFormValid(props.hierarchy);
                      setError(errorObj);
                    }}
                  />
                </div>
                {i !== 0 ? (
                  <ActionButton
                    isQuiet
                    onPress={() => {
                      props.addDrilldown();
                    }}
                  >
                    <AddCircel size="S" />
                  </ActionButton>
                ) : null}
                {i > 1 ? (
                  <ActionButton
                    isQuiet
                    onPress={() => {
                      props.removeDrilldown(drilldown);
                    }}
                  >
                    <RemoveCircle size="S" />
                  </ActionButton>
                ) : null}
              </Flex>
            ))}
          {props.hierarchy && props.hierarchy.id !== '' ? (
            <React.Fragment>
              <span className="spectrum-Heading spectrum-Heading--sizeXXS">
                <Translate contentKey="entity.action.dangerZone">Danger Zone</Translate>
              </span>
              <Divider size="M" />{' '}
            </React.Fragment>
          ) : null}
        </Form>
        {props.hierarchy && props.hierarchy.id !== '' ? (
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
  updateSuccess: storeState.hierarchies.updateSuccess,
  updating: storeState.hierarchies.updating,
  features: storeState.feature.entities,
  dimensions: generateFeaturesOptions(storeState.feature.entities),
  hierarchy: storeState.hierarchies.hierarchy,
  datasource: storeState.views.entity.viewDashboard.dashboardDatasource,
});

const mapDispatchToProps = {
  getDatasources,
  searchUsers,
  getDatasourcesByName,
  getUsers,
  addDrilldown,
  removeDrilldown,
  setHierarchy,
  updateHierarchy,
  createHierarchy,
  deleteHierarchy,
  reset,
  getHierarchies,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(HierarchyUpdate);
