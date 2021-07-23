import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, View, Text, Button, Divider } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { IFeature } from 'app/shared/model/feature.model';
import AsyncSelect from 'react-select/async';
import { setFilterData } from 'app/shared/websocket/websocket.reducer';
import DateRangeComponent from '../data-constraints/date-range-component';
import { resetTimezoneData } from '../data-constraints/utils/date-util';
import { checkIsDateType } from '../visualization/util/visualization-utils';
import { saveSelectedFilter } from './filter.reducer';
import { saveDynamicDateRangeMetaData, getPin, load,generateFilterOptions } from './filter-util';
import Select from 'react-select';
import { IQueryDTO } from 'app/shared/model/query-dto.model';
import PinOn from '@spectrum-icons/workflow/PinOn';
import PinOff from '@spectrum-icons/workflow/PinOff';
import { pinFeature } from 'app/entities/feature/feature.reducer';

export interface IFilterElementProp extends StateProps, DispatchProps {
  feature: IFeature;
}

const FilterElement = (props: IFilterElementProp) => {
  const [defaultValues, setdefaultValues] = useState<string[]>();
  const [isPinOn, setIsPinOn] = useState(getPin(props.feature.pin));

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
      // props.setFilterLoader(false);
    }
  }, [props.selectedFilters]);

  const handleInputChange = (newValue: string) => {
    // props.setFilterLoader(true);
    props.setFilterData(null);
    load(newValue, props.feature.name, props.view?.id, props.view?.viewDashboard?.dashboardDatasource.id);
  };

  const onFocus = () => {
    // props.setFilterLoader(true);
    props.setFilterData(null);
    load(null, props.feature.name, props.view?.id, props.view?.viewDashboard?.dashboardDatasource.id);
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
    //updateDefaultValues(props.selectedFilters[props.feature.name]);
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
       // updateDefaultValues(filterParameters[props.feature.name]);
        return filterParameters;
      }
    }
   // updateDefaultValues(filterParameters[props.feature.name]);
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

  const togglePin = feature => {
    setIsPinOn(!isPinOn);
    props.pinFeature(feature.id, !isPinOn);
  };

  return (
    <>
      <div className="filter-element">
        <View padding={5} margin={5} borderWidth="thin" borderColor="default" backgroundColor="gray-75" borderRadius="regular">
          <span className="spectrum-Body-emphasis--sizeXXS">{props.feature.name}</span>
          <Flex direction="row" alignItems="center" gap="size-50">
            {checkIsDateType(props.feature) ? (
              <View minWidth="size-3400">
                <DateRangeComponent onDateChange={onDateChange} />
              </View>
            ) : (
              <View marginTop="size-125" minWidth="size-3400">
                <Select
                  isMulti
                  value={defaultValues}
                  searchable={true}
                  onBlurResetsInput={false}
                  onCloseResetsInput={false}
                  onFocus={onFocus}
                  closeMenuOnSelect={false}
                  classNamePrefix="select"
                  onChange={handleChange}
                  // isLoading={props.isFilterLoaderOn}
                  placeholder={`Search ${props.feature.name}`}
                  onInputChange={handleInputChange}
                  options={props.filterSelectOptions}
                />
              </View>
            )}
            <ActionButton
              isQuiet
              onPress={() => {
                togglePin(props.feature);
              }}
            >
              {isPinOn ? <PinOn size="S" /> : <PinOff size="S" />}
            </ActionButton>
          </Flex>
        </View>
      </div>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  filterSelectOptions: generateFilterOptions(storeState.visualizationData.filterData),
  featuresList: storeState.feature.entities,
  selectedFilters: storeState.filter.selectedFilters,
});
const mapDispatchToProps = {
  saveSelectedFilter,
  pinFeature,
  setFilterData
  // setFilterLoader
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(FilterElement);
