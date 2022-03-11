import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, View, Text, Button, Divider, Tooltip, TooltipTrigger } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { IFeature } from 'app/shared/model/feature.model';
import { setFilterData } from 'app/shared/websocket/websocket.reducer';
import DateRangeComponent from '../data-constraints/date-range-component';
import { resetTimezoneData } from 'app/shared/util/date-utils';
import { checkIsDateType } from '../visualisation/util/visualisation-utils';
import { saveDynamicDateRangeMetaData, saveSelectedFilter, onDateRangeFilterChange } from './filter.reducer';
import { loadFilterOptions, generateFilterOptions } from './filter-util';
import Select from 'react-select';
import PinOn from '@spectrum-icons/workflow/PinOn';
import PinOff from '@spectrum-icons/workflow/PinOff';
import { pinFeature } from 'app/entities/feature/feature.reducer';
import { addAppliedFilters, removeAppliedFilters, applyFilter } from './filter.reducer';
import { generateOptions } from 'app/shared/util/entity-utils';
import SeparatorInput from 'app/shared/components/separator/separator-input';
import Separator from '@spectrum-icons/workflow/Separator';
import { Translate } from 'react-jhipster';
import { setDatesInFeature } from 'app/entities/feature/feature.reducer';

export interface IFilterElementProp extends StateProps, DispatchProps {
  feature: IFeature;
}

const FilterElement = (props: IFilterElementProp) => {
  const [isSeparatorOn, setSeparatorOn] = useState(false);

  const handleInputChange = (newValue: string) => {
    props.setFilterData(null);
    loadFilterOptions(props.feature.name, props.view?.viewDashboard?.dashboardDatasource.id, newValue);
  };

  const onFocus = () => {
    props.setFilterData(null);
    loadFilterOptions(props.feature.name, props.view?.viewDashboard?.dashboardDatasource.id);
  };

  const handleChange = (value, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      props.addAppliedFilters(actionMeta.option.value, props.feature, props.view, props.visualmetadata, props.selectedFilters);
    } else if (actionMeta.action === 'remove-value') {
      props.removeAppliedFilters(actionMeta.removedValue.value, props.feature, props.view, props.visualmetadata, props.selectedFilters);
    }
  };

  // TODO : need to refector this code

  // function removeFilter(filter) {
  //   props.selectedFilters[filter] = [];
  //   // this is duplicate code
  //   props.saveSelectedFilter(props.selectedFilters);
  // }

  // TODO : need to refector this code

  // const addDateRangeFilter = date => {
  //   if (!props.selectedFilters[props.feature.name]) {
  //     props.selectedFilters[props.feature.name] = [];
  //   }
  //   props.selectedFilters[props.feature.name].push(date);
  //   props.selectedFilters[props.feature.name]._meta = {
  //     dataType: props.feature.type,
  //     valueType: 'dateRangeValueType',
  //   };
  //   props.saveSelectedFilter(props.selectedFilters);
  // };

  // TODO: need to refector this code
  // const onDateChange = (startDate, endDate, metadata) => {
  //   if (startDate && endDate) {
  //     props.feature.metadata = metadata;
  //     if (metadata.dateRangeTab !== 2) {
  //       props.feature.selected = startDate;
  //       props.feature.selected2 = endDate;
  //     }
  //     props.saveDynamicDateRangeMetaData(props.feature.name, metadata);
  //     removeFilter(props.feature.name);
  //     if (startDate) {
  //       startDate = resetTimezoneData(startDate);
  //       addDateRangeFilter(startDate);
  //     }
  //     if (endDate) {
  //       endDate = resetTimezoneData(endDate);
  //       addDateRangeFilter(endDate);
  //     }
  //   } else {
  //     props.feature.selected = '';
  //     props.feature.selected2 ='';
  //     props.selectedFilters[props.feature.name] = [];
  //     props.removeAppliedFilters('', props.feature, props.view, props.visualmetadata, props.selectedFilters);
  //   }
  //   props.applyFilter(props.selectedFilters, props.visualmetadata, props.view);
  // };

  const togglePin = feature => {
    feature.pin = !feature.pin;
    props.pinFeature(feature.id, feature.pin);
  };

  const dispatchSeparatedValues = receivedSeparatedvalues => {
    if (receivedSeparatedvalues) {
      props.selectedFilters[props.feature.name] = receivedSeparatedvalues.split(props.separator);
      if (props.selectedFilters[props.feature.name]?._meta?.dataType) {
        props.selectedFilters[props.feature.name]._meta.dataType = props.feature.type;
      } else {
        props.selectedFilters[props.feature.name]._meta = { dataType: props.feature.type };
      }
      props.saveSelectedFilter(props.selectedFilters);
    }
  };

  const onDateChange = (startDate, endDate, metaData) => {
    // props.selectedFilters[props.feature.name] = [];
    // props.saveSelectedFilter(props.selectedFilters);
    props.onDateRangeFilterChange(props.selectedFilters, props.feature, startDate, endDate, metaData, props.view, props.visualmetadata);
  };

  return (
    <>
      <div className="filter-element">
        <View padding={5} margin={5} borderWidth="thin" borderColor="default" backgroundColor="gray-75" borderRadius="regular">
          <span className="spectrum-Body-emphasis--sizeXXS">{props.feature.name}</span>
          <Flex direction="row" justifyContent={'space-between'} alignItems="center" gap="size-50">
            {isSeparatorOn ? (
              <SeparatorInput
                values={props.selectedFilters[props.feature.name]}
                dispatchSeparatedValues={dispatchSeparatedValues}
                separator={props.separator}
              />
            ) : checkIsDateType(props.feature) ? (
              <View minWidth="size-3200">
                <DateRangeComponent onDateChange={onDateChange} startDate={props.feature.selected} endDate={props.feature.selected2} />
              </View>
            ) : (
              <View marginTop="size-125" minWidth="size-3200" width="100%">
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
                  placeholder={`Search ${props.feature.name}`}
                  onInputChange={handleInputChange}
                  options={props.filterSelectOptions}
                />
              </View>
            )}
            <View>
              <Flex direction="row">
                <ActionButton
                  isQuiet
                  onPress={() => {
                    togglePin(props.feature);
                  }}
                >
                  {props.feature.pin ? <PinOn size="S" /> : <PinOff size="S" />}
                </ActionButton>
                <TooltipTrigger>
                  <ActionButton
                    isQuiet
                    onPress={() => {
                      setSeparatorOn(!isSeparatorOn);
                    }}
                  >
                    <Separator size="S" />
                  </ActionButton>
                  <Tooltip>
                    {isSeparatorOn ? (
                      <Translate contentKey="separators.tooltipCommaSeparatedOff"></Translate>
                    ) : (
                      <Translate contentKey="separators.tooltipCommaSeparatedOn"></Translate>
                    )}
                  </Tooltip>
                </TooltipTrigger>
              </Flex>
            </View>
          </Flex>
        </View>
      </div>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  filterSelectOptions: generateFilterOptions(storeState.visualisationData.filterData),
  selectedFilters: storeState.filter.selectedFilters,
  separator: storeState.filter.separator,
  visualmetadata: storeState.views.viewState,
});
const mapDispatchToProps = {
  saveSelectedFilter,
  pinFeature,
  setFilterData,
  addAppliedFilters,
  removeAppliedFilters,
  saveDynamicDateRangeMetaData,
  applyFilter,
  onDateRangeFilterChange,
  setDatesInFeature,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(FilterElement);
