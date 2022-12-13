import React, { useState, useEffect, ReactText } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { Flex, ActionButton } from '@adobe/react-spectrum';
import { searchUsers, getUsers } from 'app/modules/administration/user-management/users/user.reducer';
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
import SeparatorInput from 'app/shared/components/separator/separator-input';
import SeparatorIcon from 'app/shared/components/separator/separator-icon';
import { addSeparatedValuesIntoConstraint } from 'app/shared/components/separator/separator.util';
import Select from 'react-select';
import { generateFilterOptions } from 'app/modules/canvas/filter/filter-util';
import { generateFeatureNameOptions } from '../../permissions-util';
import { loadFilterOptions } from 'app/entities/feature/feature.reducer';
import { debouncedSearch } from 'app/shared/util/common-utils';
import { useSocket } from 'app/shared/websocket/socket-io-factory';

export interface IUserDatasourceConstraintConditionProps extends StateProps, DispatchProps {
  condition: any;
  index: number;
}

export const UserDatasourceConstraintCondition = (props: IUserDatasourceConstraintConditionProps) => {
  const [isSeparatorOn,setSeparatorOn] = useState(false);
  const {sendEvent} =useSocket();
  const dispatchSeparatedValues = receivedCommaSeparatedvalues => {
    const _constraint = addSeparatedValuesIntoConstraint(
      receivedCommaSeparatedvalues,
      props.constraint,
      props.condition,
      props.separator
    );
    props.setDatasourceConstraints(_constraint);
  };

  const toggleCommaSeparator = _isSeparatedOn => {
      setSeparatorOn(_isSeparatedOn);
  };

  const handleInputChange = (constraint: any, newValue: string) => {
    props.setFilterData(null);
    debouncedSearch(props.loadFilterOptions,[constraint.featureName, props.constraint.datasource.id, newValue]);
  };

  const onFocus = constraint => {
    props.setFilterData(null);
    props.loadFilterOptions(sendEvent,constraint.featureName, props.constraint.datasource.id);
  };

  const handleChange = (selectedOption, actionMeta, con) => {
    props.updateConditionValues(con, selectedOption);
  };

  return (
    <Flex alignItems="center" gap="size-100">
      <div style={{ minWidth: '200px' }}>
        <Select
          placeholder={translate('permissions.datasourceConstraints.selectType')}
          className="basic-single"
          classNamePrefix="select"
          isDisabled={!props.constraint.datasource.id}
          value={{ value: props.condition['@type'], label: props.condition['@type'] }}
          onChange={selected => {
            props.condition['@type'] = selected.value;
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
              props.condition.featureName = event.label;
              const filteredFeatures = props.features.filter(item => {
                return item.id === event.value;
              });
              if (filteredFeatures && filteredFeatures.length > 0) {
                props.condition.featureName = filteredFeatures[0].name;
                props.setDatasourceConstraints(props.constraint);
              }
            }
          }}
          className="basic-single"
          classNamePrefix="select"
          isSearchable={true}
          name="features"
          options={generateFeatureNameOptions(props.features)}
          value={{ value: props.condition.featureName, label: props.condition.featureName }}
        />
      </div>
      {isSeparatorOn ? (
        <SeparatorInput values={props.condition.values} dispatchSeparatedValues={dispatchSeparatedValues} separator={props.separator} />
      ) : (
        <div style={{ minWidth: '300px' }}>
          <Select
            isDisabled={!props.constraint.datasource.id}
            isMulti
            value={generateOptions(props.condition.values)}
            searchable={true}
            onBlurResetsInput={false}
            onCloseResetsInput={false}
            onFocus={() => {
              onFocus(props.condition);
            }}
            closeMenuOnSelect={false}
            classNamePrefix="select"
            onChange={(value, actionMeta) => {
              handleChange(value, actionMeta, props.condition);
            }}
            placeholder={`Search ${props.condition.featureName}`}
            onInputChange={event => {
              handleInputChange(props.condition, event);
            }}
            options={props.filterSelectOptions}
          />
        </div>
      )}

      <SeparatorIcon toggleCommaSeparator={toggleCommaSeparator} isSeparatedOn={isSeparatorOn} />
      <ActionButton
        isQuiet
        onPress={() => {
          props.addConstraint();
        }}
      >
        <AddCircel size="S" />
      </ActionButton>
      {props.index !== 0 ? (
        <ActionButton
          isQuiet
          onPress={() => {
            props.removeConstraint(props.condition);
          }}
        >
          <RemoveCircle size="S" />
        </ActionButton>
      ) : null}
    </Flex>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  datasources: storeState.datasources.datasources,
  updateSuccess: storeState.userDatasourceConstraints.updateSuccess,
  updating: storeState.userDatasourceConstraints.updating,
  features: storeState.feature.entities,
  users: storeState.userManagement.users,
  searchedUsers: storeState.userManagement.searchedUsers,
  constraint: storeState.userDatasourceConstraints.constraint,
  filterSelectOptions: generateFilterOptions(storeState.visualisationData.filterData),
  separator: storeState.filter.separator,
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
  loadFilterOptions
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserDatasourceConstraintCondition);
