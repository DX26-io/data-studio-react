import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, View, Text, Button, Divider } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { getDatasourcesFeaturesEntities as getfeatureEntities } from 'app/entities/feature/feature.reducer';
import { IFeature } from 'app/shared/model/feature.model';
import AsyncSelect from 'react-select/async';
import { forwardCall } from 'app/shared/websocket/proxy-websocket.service';
import { FilterParameterService } from './filter-parameters-service';
import { connectWebSocket, subscribeWebSocket } from 'app/shared/websocket/stomp-client.service';
import { getToken } from 'app/shared/reducers/authentication';
import { COMPARABLE_DATA_TYPES } from 'app/shared/util/data-constraints.constants';
import VisualizationDataConstraints from '../data-constraints/visualization-data-constraints';
import DateRangeComponent from '../data-constraints/date-range-component';
import { resetTimezoneData } from '../data-constraints/utils/date-util';

export interface IFilterState {
  featureName: string;
  filterList: string[];
}

export interface IFilterElementProp extends StateProps, DispatchProps {
  feature: IFeature;
  defaultValue: string[];
}

const FilterElement = (props: IFilterElementProp) => {
  // const onExchangeMetadata = data => {
  //   debugger
  //   const metaData = data.body === '' ? { data: [] } : JSON.parse(data.body);
  //   if (data.headers.request === 'filters') {
  //     const obj = metaData.data[0];
  //     const dimensionName = '';
  //     for (const i in obj) {
  //       dimensionName = i;
  //       break;
  //     }
  //     const retVal = metaData.data.map(function (item) {
  //       return {
  //         value: item[dimensionName],
  //         label: item[dimensionName],
  //       };
  //     });
  //     props.filterData[dimensionName] = retVal;
  //   }
  // };

  // const connectWeb = () => {
  //   connectWebSocket({ token: getToken() }, function (frame) {
  //     // console.log(' connected web socket');
  //     subscribeWebSocket('/user/exchange/metaData', onExchangeMetadata);
  //   });
  // };
  const [defaultValues, setdefaultValues] = useState<string[]>();

  useEffect(() => {
    setdefaultValues(['abc,xyz']);
  }, [props.filterStateChange]);
  useEffect(() => {
    setdefaultValues(props.defaultValue);
  }, []);

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
    if (inputValue !== '') {
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
    const filterParameters = FilterParameterService.getSelectedFilter();
    if (!filterParameters[props.feature.name]) {
      filterParameters[props.feature.name] = [];
    }
    filterParameters[props.feature.name].push(value);
    filterParameters[props.feature.name]._meta = {
      dataType: props.feature.type,
      valueType: 'valueType',
    };
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
        return filterParameters;
      }
    }
    return filterParameters;
  }

  const handleChange = (value, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      addValueInFilter(actionMeta.option.value);
    } else if (actionMeta.action === 'remove-value') {
      FilterParameterService.saveSelectedFilter(
        removeTagFromFilterList(FilterParameterService.getSelectedFilter(), actionMeta.removedValue.value)
      );
    }
  };

  const checkIsDateType = () => {
    const dataType = props.feature.type;
    const isDateType = COMPARABLE_DATA_TYPES.includes(dataType.toLowerCase());
    return isDateType;
  };

  function removeFilter(filter) {
    let filterParameters;
    filterParameters = FilterParameterService.get();
    filterParameters[filter] = [];
    FilterParameterService.save(filterParameters);

    filterParameters = FilterParameterService.getSelectedFilter();
    filterParameters[filter] = [];
    FilterParameterService.saveSelectedFilter(filterParameters);
  }

  const addDateRangeFilter = date => {
    const filterParameters = FilterParameterService.getSelectedFilter();
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
        {checkIsDateType() ? (
          <View>
            <DateRangeComponent onDateChange={onDateChange} />
          </View>
        ) : (
          <View>
            <AsyncSelect
              cacheOptions
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
  isFilterOpen: storeState.applicationProfile.isFilterOpen,
  featuresList: storeState.feature.entities,
  selectedFilter: storeState.visualmetadata.selectedFilter,
  filterStateChange: storeState.visualmetadata.filterStateChange,
});
const mapDispatchToProps = {
  getfeatureEntities,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(FilterElement);
