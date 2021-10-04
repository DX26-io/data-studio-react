import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Flex, View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { IFeature } from 'app/shared/model/feature.model';
import { setFilterData } from 'app/shared/websocket/websocket.reducer';
import DateRangeComponent from 'app/modules/canvas/data-constraints/date-range-component';
import { resetTimezoneData } from 'app/modules/canvas/data-constraints/utils/date-util';
import { checkIsDateType } from 'app/modules/canvas/visualisation/util/visualisation-utils';
import { getPin, load, generateFilterOptions } from 'app/modules/canvas/filter/filter-util';
import Select from 'react-select';
import { addAppliedFilters, removeAppliedFilters, saveDynamicDateRangeMetaData, saveSelectedFilter } from 'app/modules/canvas/filter/filter.reducer';
import { generateOptions } from 'app/shared/util/entity-utils';

export interface IPinnedFilterElementProp extends StateProps, DispatchProps {
  feature: IFeature;
}

const PinnedFilterElement = (props: IPinnedFilterElementProp) => {
  const handleInputChange = (newValue: string) => {
    props.setFilterData(null);
    load(newValue, props.feature.name, props.view?.id, props.view?.viewDashboard?.dashboardDatasource.id);
  };

  const onFocus = () => {
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

  // TODO : need to refector this code.its duplicate function

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

  // TODO: need to refector this code..it's duplicate function
  const onDateChange = (startDate, endDate, metadata) => {
    if (startDate && endDate) {
      props.feature.metadata = metadata;
      if (metadata.dateRangeTab !== 2) {
        props.feature.selected = startDate;
        props.feature.selected2 = endDate;
      } else {
        props.saveDynamicDateRangeMetaData(props.feature.name, metadata);
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
    <View padding={5} margin={5}>
      <Flex alignItems="center">
        {checkIsDateType(props.feature) ? (
          <View minWidth="100%">
            <span className="spectrum-Body-emphasis--sizeXXS">{props.feature.name}</span>
            <DateRangeComponent onDateChange={onDateChange} />
          </View>
        ) : (
          <View minWidth="100%">
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
              placeholder={`${props.feature.name}`}
              onInputChange={handleInputChange}
              options={props.filterSelectOptions}
            />
          </View>
        )}
      </Flex>
    </View>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  filterSelectOptions: generateFilterOptions(storeState.visualisationData.filterData),
  selectedFilters: storeState.filter.selectedFilters,
});
const mapDispatchToProps = {
  saveSelectedFilter,
  setFilterData,
  addAppliedFilters,
  removeAppliedFilters,
  saveDynamicDateRangeMetaData
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(PinnedFilterElement);
