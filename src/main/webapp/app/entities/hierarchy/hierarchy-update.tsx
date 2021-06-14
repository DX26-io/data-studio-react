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

import AsyncSelect from 'react-select/async';
import { forwardCall } from 'app/shared/websocket/proxy-websocket.service';
import { generateOptions } from 'app/shared/util/entity-utils';
import AddCircel from '@spectrum-icons/workflow/AddCircle';
import RemoveCircle from '@spectrum-icons/workflow/RemoveCircle';
import { isFormValid } from './hierarchy.util';
import Separators from 'app/shared/components/separator/separators';

export interface IDatasourceConstraintUpdateProps extends StateProps, DispatchProps {
  setOpen: (isOpen: boolean) => void;
  history: any;
}

export const HierarchyUpdate = (props: IDatasourceConstraintUpdateProps) => {
  const { setOpen, updateSuccess, history, updating } = props;
  const [error, setError] = useState(defaultValue);

  const dialog = useDialogContainer();

  const handleClose = () => {
    setOpen(false);
    dialog.dismiss();
    // props.reset();
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
    if (props.hierarchy.id) {
    } else {
    }
  };

  const remove = () => {};

  const getDrillDownOrderLabel = order => {
    return translate('hierarchies.drilldown') + ' ' + order + 1;
  };

  return (
    <Dialog data-testid="hierarchy-form-dialog" width="80vw" minHeight="60vh">
      <Heading>
        <Flex alignItems="center" gap="size-100" data-testid="hierarchy-form-heading">
          {props.hierarchy.id !== '' ? (
            <Translate contentKey="hierarchies.editLabel">Edit Constraints</Translate>
          ) : (
            <Translate contentKey="hierarchies.createLabel">Create Constraints</Translate>
          )}
        </Flex>
      </Heading>
      <Header data-testid="hierarchy-form-action">
        <Flex alignItems="center" gap="size-100">
          <Button variant="secondary" onPress={handleClose} data-testid="hierarchy-form-cancel">
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button variant="cta" onPress={saveUser} isDisabled={updating || !error.isValid} data-testid="hierarchy-form-submit">
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </Flex>
      </Header>
      <Divider />
      <Content>
        <Form data-testid="hierarchy-form">
          <TextField label={translate('hierarchies.name')} />
          {props.hierarchy.drilldown.map((drilldown, i) => (
            <Flex alignItems="center" gap="size-200" key={`hierarchy-${i}`}>
              <ComboBox
                // isDisabled={!props.hierarchy.datasource.id}
                key={`hierarchy-feature-${i}`}
                placeholder={translate('hierarchies.drilldownPlaceholder')}
                label={getDrillDownOrderLabel(drilldown.order)}
                // defaultItems={props.dimensions}
                items={props.dimensions}
                // inputValue={con.featureName ? con.featureName : ''}
                onSelectionChange={event => {
                  // const filteredFeatures = props.features.filter(item => {
                  //   return item.id === event;
                  // });
                  // if (filteredFeatures && filteredFeatures.length > 0) {
                  //   con.featureName = filteredFeatures[0].name;
                  //   // props.setDatasourceConstraints(props.hierarchy);
                  // }
                  // // setError(isFormValid(props.hierarchy));
                  // con['isCommaSeparatedInputOn'] = false;
                }}
                onInputChange={event => {
                  // if (event) {
                  // }
                }}
              >
                {item => <Item>{item.name}</Item>}
              </ComboBox>
              {/* TODO : this will be done once khushbu's pr is merged */}

              {/* <ActionButton isQuiet onPress={()=>{
                toggleCommaSeparator(con);
              }}>
                <Separator size="S" />
              </ActionButton> */}

              <ActionButton
                isQuiet
                onPress={() => {
                  // props.addConstraint();
                }}
              >
                <AddCircel size="S" />
              </ActionButton>

              {i !== 0 ? (
                <ActionButton
                  isQuiet
                  onPress={() => {
                    // props.removeConstraint(con);
                  }}
                >
                  <RemoveCircle size="S" />
                </ActionButton>
              ) : null}
            </Flex>
          ))}
        </Form>
        {props.hierarchy.id !== '' ? (
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
  dimensions: storeState.feature.entities.filter(item => {
    return item.featureType === 'DIMENSION';
  }),
  users: storeState.userManagement.users,
  searchedUsers: storeState.userManagement.searchedUsers,
  hierarchy: storeState.hierarchies.hierarchy,
});

const mapDispatchToProps = {
  getDatasources,
  searchUsers,
  getDatasourcesByName,
  getUsers,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(HierarchyUpdate);
