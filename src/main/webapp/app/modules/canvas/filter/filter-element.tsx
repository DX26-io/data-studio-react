import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, View, Text, Button, Divider } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { getViewFeaturesEntities as getfeatureEntities } from 'app/entities/feature/feature.reducer';
import { IFeature } from 'app/shared/model/feature.model';
import AsyncSelect from 'react-select/async';
import { forwardCall } from 'app/shared/websocket/proxy-websocket.service';
import DateRangeComponent from '../data-constraints/date-range-component';
import { resetTimezoneData } from '../data-constraints/utils/date-util';
import { checkIsDateType } from '../visualization/util/visualization-utils';
import { saveSelectedFilter } from './filter.reducer';
import { saveDynamicDateRangeMetaData } from './filter-util';
export interface IFilterElementProp extends StateProps, DispatchProps {
  feature: IFeature;
}

const FilterElement = (props: IFilterElementProp) => {
  const [defaultValues, setdefaultValues] = useState<string[]>();

  const updateDefaultValues = data => {
    const filterValues = [];
    data &&
      data.forEach(item => {
        filterValues.push({
          label: item,
          value: item,
        });
      });
    setdefaultValues(filterValues);
  };

  useEffect(() => {
    if (props.selectedFilters[props.feature.name]) {
      updateDefaultValues(props.selectedFilters[props.feature.name]);
    } else {
      setdefaultValues([]);
    }
  }, [props.selectedFilters]);

  const load = (q, dimension) => {
    const vId = props.view?.id;
    const query = {
      fields: null,
      distinct: true,
    };
    query.fields = [{ name: dimension }];
    forwardCall(
      props.view?.viewDashboard?.dashboardDatasource.id,
      {
        queryDTO: query,
        vId,
        type: 'filters',
      },
      vId
    );
  };
  const handleInputChange = (newValue: string) => {
    const inputValue = newValue.replace(/\W/g, '');
    return inputValue;
  };
  const mapOptionsToValues = (options, inputValue) => {
    if (!inputValue) {
      return options.filter(i => i.label?.toString().toLowerCase().includes(inputValue.toLowerCase()));
    }
    return options;
  };

  const loadOptions = (inputValue, callback) => {
    if (props.filterData) {
      const dimensions = Object.keys(props.filterData);
      if (!dimensions.includes(props.feature.name)) {
        callback(load(inputValue, props.feature.name));
      } else {
        if (props.filterData[props.feature.name].length > 100 && inputValue !== '') {
          callback(load(inputValue, props.feature.name));
        } else {
          callback(mapOptionsToValues(props.filterData[props.feature.name], inputValue));
        }
      }
    } else {
      callback(load(inputValue, props.feature.name));
    }
  };

  const addValueInFilter = value => {
    if (!props.selectedFilters[props.feature.name]) {
      props.selectedFilters[props.feature.name] = [];
    }
    props.selectedFilters[props.feature.name].push(value);
    props.selectedFilters[props.feature.name]._meta = {
      dataType: props.feature.type,
      valueType: 'valueType',
    };
    updateDefaultValues(props.selectedFilters[props.feature.name]);
    props.saveSelectedFilter(props.selectedFilters);
  };

  function removeTagFromFilterList(filterParameters, tag) {
    const array = filterParameters[props.feature.name]
      ? filterParameters[props.feature.name.toLowerCase()]
      : filterParameters[props.feature.name];
    if (array) {
      const index = array.indexOf(tag);
      if (index > -1) {
        array.splice(index, 1);
        filterParameters[props.feature.name] = array;
        if (filterParameters[props.feature.name].length === 0) delete filterParameters[props.feature.name];
        updateDefaultValues(filterParameters[props.feature.name]);
        return filterParameters;
      }
    }
    updateDefaultValues(filterParameters[props.feature.name]);
    return filterParameters;
  }

  const handleChange = (value, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      addValueInFilter(actionMeta.option.value);
    } else if (actionMeta.action === 'remove-value') {
      props.saveSelectedFilter(removeTagFromFilterList(props.selectedFilters, actionMeta.removedValue.value));
    }
  };

  function removeFilter(filter) {
    props.selectedFilters[filter] = [];
    props.saveSelectedFilter(props.selectedFilters);
  }

  const addDateRangeFilter = date => {
    if (!props.selectedFilters[props.feature.name]) {
      props.selectedFilters[props.feature.name] = [];
    }
    props.selectedFilters[props.feature.name].push(date);
    props.selectedFilters[props.feature.name]._meta = {
      dataType: props.feature.type,
      valueType: 'dateRangeValueType',
    };
    props.saveSelectedFilter(props.selectedFilters);
  };

  const onDateChange = (startDate, endDate, metadata) => {
    if (startDate && endDate) {
      props.feature.metadata = metadata;
      if (metadata.dateRangeTab !== 2) {
        props.feature.selected = startDate;
        props.feature.selected2 = endDate;
      } else {
        saveDynamicDateRangeMetaData(props.feature.name, metadata);
      }
      removeFilter(props.feature.name);
      if (startDate) {
        startDate = resetTimezoneData(startDate);
        addDateRangeFilter(startDate);
      }
      if (endDate) {
        endDate = resetTimezoneData(endDate);
        addDateRangeFilter(endDate);
      }
    }
  };

  return (
    <>
      <View
        padding={5}
        margin={5}
        borderWidth="thin"
        borderColor="default"
        backgroundColor="gray-75"
        borderRadius="regular"
      >
        <View>{props.feature.name}</View>
        {checkIsDateType(props.feature) ? (
          <View>
            <DateRangeComponent onDateChange={onDateChange} />
          </View>
        ) : (
          <View>
            <AsyncSelect
              cacheOptions
              value={defaultValues}
              isMulti
              isSearchable={true}
              classNamePrefix="select"
              loadOptions={loadOptions}
              onInputChange={handleInputChange}
              onChange={handleChange}
            />
          </View>
        )}
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  filterData: storeState.visualmetadata.filterData,
  featuresList: storeState.feature.entities,
  selectedFilters: storeState.filter.selectedFilters,
});
const mapDispatchToProps = {
  getfeatureEntities,
  saveSelectedFilter,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(FilterElement);
