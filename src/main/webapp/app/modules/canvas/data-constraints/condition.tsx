import React, { FC, ReactText, useEffect, useRef, useState } from 'react';
import { ActionButton, Button, Flex, Item, Picker, TextField, View, Form } from '@adobe/react-spectrum';
import uuid from 'react-uuid';
import './visualisation-data-constraints.scss';
import Select, { components, PlaceholderProps } from 'react-select';
import { resetTimezoneData } from 'app/modules/canvas/data-constraints/utils/date-util';
import DateRangeComponent from './date-range-component';
import { updateConditionExpression } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { generateFilterOptions, load } from '../filter/filter-util';
import { setFilterData } from 'app/shared/websocket/websocket.reducer';
import { generateOptions } from 'app/entities/feature/feature-util';
import { translate } from 'react-jhipster';
import { getDimension, getComparisonTypes, isDateType, getCompareTypeOptions, getContainsValues } from './data-constraints.util';
import AddRemoveAction from './add-remove-action';
import AndOrCondition from './and-or-condition';

interface IConditionProps extends StateProps, DispatchProps {
  condition: any;
}

const Condition = (props: IConditionProps) => {
  //   const [property, setProperty] = useState([]);
  //   const [isDisplayDateRange, setDisplayDateRange] = useState(false);
  const [_condition, _setCondition] = useState(props.condition);

  const [comparisonTypes, setComparisonTypes] = useState([]);
  const [comparisonType, setComparisonType] = useState(null);
  const [compareType, setCompareType] = useState(null);
  const [containsValues, setContainsValues] = useState([]);

  const onDateChange = (fromDate, toDate, metadata) => {
    if (fromDate && toDate) {
      // const dimension = getDimension(props.features, _condition.featureName);
      fromDate = resetTimezoneData(fromDate);
      toDate = resetTimezoneData(toDate);
      _condition.valueType = { value: fromDate, type: _condition.valueType.type, '@type': 'valueType' };
      _condition.secondValueType = { value: toDate, type: _condition.valueType.type, '@type': 'valueType' };
      _condition.metadata = metadata;
    }
  };

  const selectFeature = selected => {
    let condition = { ..._condition };
    condition.featureName = selected.value;
    const _feature = props.features.filter(f => f.name === selected.value)[0];
    if (condition.valueType) {
      condition = { ...condition, valueType: { type: '' } };
    }
    condition.valueType.type = _feature.type;
    _setCondition(condition);
    const _comparisonTypes = getComparisonTypes(_feature.type);
    setComparisonTypes(_comparisonTypes);
  };

  const selectComparisonType = _comparisonType => {
    _condition['@type'] = _comparisonType.value['@type'];
    _setCondition(_condition);
    setComparisonType(_comparisonType);
  };

  const selectCompareType = _compareType => {
    _condition['comparatorType'] = _compareType.value;
    _setCondition(_condition);
    setCompareType(_compareType);
  };

  const onContaintsInputFocus = () => {
    props.setFilterData(null);
    load(null, _condition.featureName, props.view?.id, props.view?.viewDashboard?.dashboardDatasource.id);
  };

  const onContaintsHandleInputChange = newValue => {
    props.setFilterData(null);
    load(newValue, _condition.featureName, props.view?.id, props.view?.viewDashboard?.dashboardDatasource.id);
  };

  const onContaintsHandleChange = (value, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      //   const dimension = getDimension(props.features, _condition.featureName);
      _condition.valueTypes.push({
        '@type': 'valueType',
        value: actionMeta.option.value,
        type: _condition.valueType.type,
      });
      _condition.values = [];
      _condition.valueTypes.forEach(item => {
        _condition.values.push(item.value);
      });
    } else if (actionMeta.action === 'remove-value') {
      _condition?.values.splice(_condition?.values.indexOf(actionMeta.removedValue.value), 1);
    }
    setContainsValues(getContainsValues(_condition));
  };

  return (
    <>
      <Form >
        {_condition['@type'] !== 'Or' && _condition['@type'] !== 'And' && (
          <View>
            <Flex direction="row" gap="size-100" justifyContent="start" alignItems="center">
              <div style={{ minWidth: '200px' }}>
                <Select
                  placeholder={translate('features.home.title')}
                  styles={{
                    placeholder: base => ({
                      ...base,
                      fontSize: '1em',
                      fontWeight: 400,
                      color: 'black',
                    }),
                  }}
                  onChange={selected => {
                    selectFeature(selected);
                  }}
                  className="basic-single"
                  classNamePrefix="select"
                  value={{ value: _condition.featureName, label: _condition.featureName }}
                  isSearchable={true}
                  options={props.featureOptions}
                />
              </div>
              <div style={{ minWidth: '200px' }}>
                <Select
                  onChange={selected => {
                    selectComparisonType(selected);
                  }}
                  className="basic-single"
                  classNamePrefix="select"
                  value={comparisonType}
                  isSearchable={true}
                  options={comparisonTypes}
                />
              </div>
              {_condition['@type'] === 'Compare' && (
                <div style={{ minWidth: '200px' }}>
                  <Select
                    onChange={selected => {
                      selectCompareType(selected);
                    }}
                    className="basic-single"
                    classNamePrefix="select"
                    value={compareType}
                    isSearchable={true}
                    options={getCompareTypeOptions()}
                  />
                </div>
              )}
              {(_condition['@type'] === 'Compare' || _condition['@type'] === 'Like') && (
                <TextField
                  height={'38px'}
                  value={_condition?.value}
                  onChange={event => {
                    _condition.value = event;
                    _setCondition(_condition);
                  }}
                />
              )}
              {(_condition['@type'] === 'Contains' || _condition['@type'] === 'NotContains') && (
                <div style={{ minWidth: '300px' }}>
                  <Select
                    isMulti
                    value={containsValues}
                    searchable={true}
                    onBlurResetsInput={false}
                    onCloseResetsInput={false}
                    onFocus={onContaintsInputFocus}
                    closeMenuOnSelect={false}
                    classNamePrefix="select"
                    onChange={onContaintsHandleChange}
                    placeholder={`Search ${_condition.featureName}`}
                    onInputChange={onContaintsHandleInputChange}
                    options={props.filterSelectOptions}
                  />
                </div>
              )}
              {_condition['@type'] === 'Between' && isDateType(_condition.valueType.type) && (
                <DateRangeComponent condition={_condition} onDateChange={onDateChange} />
              )}
              <AddRemoveAction _condition={_condition} />
            </Flex>
          </View>
        )}
 <AndOrCondition _condition={_condition} />
      </Form>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visualMetaData: storeState.visualmetadata.entity,
  featureOptions: generateOptions(storeState.feature.entities),
  features: storeState.feature.entities,
  visualDataById: storeState.visualisationData.visualDataById,
  datasource: storeState.views.entity.viewDashboard.dashboardDatasource,
  // condition: storeState.visualmetadata.entity.conditionExpression,
  filterSelectOptions: generateFilterOptions(storeState.visualisationData.filterData),
  view: storeState.views.entity,
});
const mapDispatchToProps = {
  updateConditionExpression,
  setFilterData,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Condition);
