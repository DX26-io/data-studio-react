import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Flex, View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { IFeature } from 'app/shared/model/feature.model';
import { setFilterData } from 'app/shared/websocket/websocket.reducer';
import DateRangeComponent from 'app/modules/canvas/data-constraints/date-range-component';
import { checkIsDateType } from 'app/modules/canvas/visualisation/util/visualisation-utils';
import { generateFilterOptions } from 'app/modules/canvas/filter/filter-util';
import Select from 'react-select';
import {
  addAppliedFilters,
  removeAppliedFilters,
  saveDynamicDateRangeMetaData,
  saveSelectedFilter,
  onDateRangeFilterChange,
} from 'app/modules/canvas/filter/filter.reducer';
import { generateOptions } from 'app/shared/util/entity-utils';
import { setDatesInFeature } from 'app/entities/feature/feature.reducer';
import { loadFilterOptions } from 'app/entities/feature/feature.reducer';

export interface IPinnedFilterElementProp extends StateProps, DispatchProps {
  feature: IFeature;
}

const PinnedFilterElement = (props: IPinnedFilterElementProp) => {
  const handleInputChange = (newValue: string) => {
    props.setFilterData(null);
    props.loadFilterOptions(props.feature.name, props.view?.viewDashboard?.dashboardDatasource.id, newValue);
  };

  const onFocus = () => {
    props.setFilterData(null);
    props.loadFilterOptions(props.feature.name, props.view?.viewDashboard?.dashboardDatasource.id);
  };

  const handleChange = (value, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      props.addAppliedFilters(actionMeta.option.value, props.feature, props.view, props.visualmetadata, props.selectedFilters);
    } else if (actionMeta.action === 'remove-value') {
      props.removeAppliedFilters(actionMeta.removedValue.value, props.feature, props.view, props.visualmetadata, props.selectedFilters);
    }
  };

  const onDateChange = (startDate, endDate, metaData) => {
    props.setDatesInFeature(props.feature.name, startDate, endDate, metaData);
    props.onDateRangeFilterChange(props.selectedFilters, props.feature, startDate, endDate, metaData, props.view, props.visualmetadata);
  };

  return (
    <View padding={5} margin={5}>
      <Flex alignItems="center">
        {checkIsDateType(props.feature) ? (
          <View minWidth="100%">
            <span className="spectrum-Body-emphasis--sizeXXS">{props.feature.name}</span>
            <DateRangeComponent
              onDateChange={onDateChange}
              startDate={props.feature.selected}
              endDate={props.feature.selected2}
              metadata={props.feature.metadata}
            />
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
  visualmetadata: storeState.views.viewState,
});
const mapDispatchToProps = {
  saveSelectedFilter,
  setFilterData,
  addAppliedFilters,
  removeAppliedFilters,
  saveDynamicDateRangeMetaData,
  onDateRangeFilterChange,
  setDatesInFeature,
  loadFilterOptions,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(PinnedFilterElement);
