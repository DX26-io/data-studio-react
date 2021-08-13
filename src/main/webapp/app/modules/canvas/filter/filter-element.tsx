import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, View, Text, Button, Divider } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { IFeature } from 'app/shared/model/feature.model';
import { setFilterData } from 'app/shared/websocket/websocket.reducer';
import DateRangeComponent from '../data-constraints/date-range-component';
import { resetTimezoneData } from '../data-constraints/utils/date-util';
import { checkIsDateType } from '../visualization/util/visualization-utils';
import { saveSelectedFilter } from './filter.reducer';
import { saveDynamicDateRangeMetaData, getPin, load, generateFilterOptions } from './filter-util';
import Select from 'react-select';
import PinOn from '@spectrum-icons/workflow/PinOn';
import PinOff from '@spectrum-icons/workflow/PinOff';
import { pinFeature } from 'app/entities/feature/feature.reducer';
import { addAppliedFilters, removeAppliedFilters } from './filter.reducer';
import { generateOptions } from 'app/shared/util/entity-utils';

export interface IFilterElementProp extends StateProps, DispatchProps {
  feature: IFeature;
}

const FilterElement = (props: IFilterElementProp) => {

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

  const handleChange = (value, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      props.addAppliedFilters(actionMeta.option.value, props.feature);
    } else if (actionMeta.action === 'remove-value') {
      props.removeAppliedFilters(actionMeta.removedValue.value, props.feature);
    }
  };

  // TODO : need to refector this code

  function removeFilter(filter) {
    props.selectedFilters[filter] = [];
    props.saveSelectedFilter(props.selectedFilters);
  }

  // TODO : need to refector this code

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

  // TODO: need to refector this code
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
    // setIsPinOn(!isPinOn);
    feature.pin = !feature.pin;
    props.pinFeature(feature.id, feature.pin);
  };

  return (
    <>
      <div className="filter-element">
        <View padding={5} margin={5} borderWidth="thin" borderColor="default" backgroundColor="gray-75" borderRadius="regular">
          <span className="spectrum-Body-emphasis--sizeXXS">{props.feature.name}</span>
          <Flex direction="row" justifyContent={"space-between"} alignItems="center" gap="size-50">
            {checkIsDateType(props.feature) ? (
              <View minWidth="size-3400">
                <DateRangeComponent onDateChange={onDateChange} />
              </View>
            ) : (
              <View marginTop="size-125" minWidth="size-3400">
                <Select
                  isMulti
                  value={generateOptions(props.selectedFilters[props.feature.name])}
                  searchable={true}
                  onBlurResetsInput={false}
                  onCloseResetsInput={false}
                  onFocus={onFocus}
                  closeMenuOnSelect={false}
                  classNamePrefix="select"
                  onChange={handleChange}
                  // TODO:  isLoading={props.isFilterLoaderOn} this will be done later
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
              {props.feature.pin ? <PinOn size="S" /> : <PinOff size="S" />}
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
  selectedFilters: storeState.filter.selectedFilters,
});
const mapDispatchToProps = {
  saveSelectedFilter,
  pinFeature,
  setFilterData,
  addAppliedFilters,
  removeAppliedFilters,
  // setFilterLoader
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(FilterElement);
