import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, View, Text, Button, Divider } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { getViewFeaturesEntities as getfeatureEntities } from 'app/entities/feature/feature.reducer';
import { IFeature } from 'app/shared/model/feature.model';
import AsyncSelect from 'react-select/async';
import { forwardCall } from 'app/shared/websocket/proxy-websocket.service';
import { FilterParameterService } from './filter-parameters-service';
import { getToken } from 'app/shared/reducers/authentication';
import { COMPARABLE_DATA_TYPES } from 'app/shared/util/data-constraints.constants';
import VisualizationDataConstraints from '../data-constraints/visualization-data-constraints';
import DateRangeComponent from '../data-constraints/date-range-component';
import { resetTimezoneData } from '../data-constraints/utils/date-util';
import $ from 'jquery';
import { checkIsDateType } from '../visualization/util/visualization-utils';
export interface IFilterElementProp extends StateProps, DispatchProps {
  feature: IFeature;
}

const FilterElement = (props: IFilterElementProp) => {
  const [defaultValues, setdefaultValues] = useState<string[]>();

  const updateDefaultValues = data => {
    const filterValues = [];
    data.forEach(item => {
      filterValues.push({
        label: item,
        value: item,
      });
    });
    setdefaultValues(filterValues);
  };

  useEffect(() => {
    if (props.selectedFilter[props.feature.name]) {
      updateDefaultValues(props.selectedFilter[props.feature.name]);
    } else {
      setdefaultValues([]);
    }
  }, [props.filterStateChange]);

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
      return options.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()));
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
    const filterParameters = props.selectedFilter;
    if (!filterParameters[props.feature.name]) {
      filterParameters[props.feature.name] = [];
    }
    filterParameters[props.feature.name].push(value);
    filterParameters[props.feature.name]._meta = {
      dataType: props.feature.type,
      valueType: 'valueType',
    };
    updateDefaultValues(filterParameters[props.feature.name]);
    FilterParameterService.saveSelectedFilter(filterParameters);
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
      FilterParameterService.saveSelectedFilter(removeTagFromFilterList(props.selectedFilter, actionMeta.removedValue.value));
    }
  };

  function removeFilter(filter) {
    let filterParameters;
    filterParameters = FilterParameterService.get();
    filterParameters[filter] = [];
    FilterParameterService.save(filterParameters);

    filterParameters = props.selectedFilter;
    filterParameters[filter] = [];
    FilterParameterService.saveSelectedFilter(filterParameters);
  }

  const addDateRangeFilter = date => {
    const filterParameters = props.selectedFilter;
    if (!filterParameters[props.feature.name]) {
      filterParameters[props.feature.name] = [];
    }
    filterParameters[props.feature.name].push(date);
    filterParameters[props.feature.name]._meta = {
      dataType: props.feature.type,
      valueType: 'dateRangeValueType',
    };
    FilterParameterService.saveSelectedFilter(filterParameters);
  };

  const onDateChange = (startDate, endDate, metadata) => {
    props.feature.metadata = metadata;
    if (metadata.dateRangeTab !== 2) {
      props.feature.selected = startDate;
      props.feature.selected2 = endDate;
    } else {
      FilterParameterService.saveDynamicDateRangeMetaData(props.feature.name, metadata);
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
  };

  return (
    <>
      <View
        padding={5}
        margin={5}
        maxWidth={'size-4600'}
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
              defaultOptions
              defaultValue={defaultValues}
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
  selectedFilter: storeState.filter.selectedFilter,
  filterStateChange: storeState.filter.filterStateChange,
});
const mapDispatchToProps = {
  getfeatureEntities,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(FilterElement);
