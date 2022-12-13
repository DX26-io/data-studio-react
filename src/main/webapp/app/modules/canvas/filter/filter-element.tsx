import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, View, Text, Button, Divider, Tooltip, TooltipTrigger } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { IFeature } from 'app/shared/model/feature.model';
import { setFilterData } from 'app/shared/websocket/websocket.reducer';
import DateRangeComponent from '../data-constraints/date-range-component';
import { checkIsDateType } from '../visualisation/util/visualisation-utils';
import { saveDynamicDateRangeMetaData, saveSelectedFilter, onDateRangeFilterChange } from './filter.reducer';
import { generateFilterOptions } from './filter-util';
import Select from 'react-select';
import PinOn from '@spectrum-icons/workflow/PinOn';
import PinOff from '@spectrum-icons/workflow/PinOff';
import Star from '@spectrum-icons/workflow/Star';
import StarOutline from '@spectrum-icons/workflow/StarOutline';
import { pinFeature } from 'app/entities/feature/feature.reducer';
import { addAppliedFilters, removeAppliedFilters, applyFilter, removeAllSelectedOptionsAppliedFilters } from './filter.reducer';
import { generateOptions } from 'app/shared/util/entity-utils';
import SeparatorInput from 'app/shared/components/separator/separator-input';
import Separator from '@spectrum-icons/workflow/Separator';
import { Translate } from 'react-jhipster';
import { setDatesInFeature, markFavouriteFilter } from 'app/entities/feature/feature.reducer';
import { loadFilterOptions } from 'app/entities/feature/feature.reducer';
import { debouncedSearch } from 'app/shared/util/common-utils';

export interface IFilterElementProp extends StateProps, DispatchProps {
  feature: IFeature;
}

const FilterElement = (props: IFilterElementProp) => {
  const [isSeparatorOn, setSeparatorOn] = useState(false);
  const minWidth = 'size-3200';

  const handleInputChange = (newValue: string) => {
    props.setFilterData(null);
    debouncedSearch(props.loadFilterOptions, [props.sendEvent,props.feature.name, props.view?.viewDashboard?.dashboardDatasource.id, newValue]);
  };

  const onFocus = () => {
    props.setFilterData(null);
    props.loadFilterOptions(props.sendEvent,props.feature.name, props.view?.viewDashboard?.dashboardDatasource.id);
  };

  const handleChange = (value, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      props.addAppliedFilters(actionMeta.option.value, props.feature, props.view, props.visualmetadata, props.selectedFilters,props.sendEvent);
    } else if (actionMeta.action === 'remove-value') {
      props.removeAppliedFilters(actionMeta.removedValue.value, props.feature, props.view, props.visualmetadata, props.selectedFilters);
    } else if (actionMeta.action === 'clear') {
      props.selectedFilters[props.feature.name] = [];
      props.removeAllSelectedOptionsAppliedFilters(props.feature.name, props.view, props.visualmetadata, props.selectedFilters);
    }
  };

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
    props.setDatesInFeature(props.feature.name, startDate, endDate, metaData);
    props.onDateRangeFilterChange(props.selectedFilters, props.feature, startDate, endDate, metaData, props.view, props.visualmetadata,props.sendEvent);
  };

  const toggleFavoriteFilter = feature => {
    feature.favouriteFilter = !feature.favouriteFilter;
    props.markFavouriteFilter(feature.favouriteFilter, feature.id);
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
              <View minWidth={minWidth}>
                <DateRangeComponent
                  onDateChange={onDateChange}
                  startDate={props.feature.selected}
                  endDate={props.feature.selected2}
                  metadata={props.feature.metadata}
                />
              </View>
            ) : (
              <View marginTop="size-125" minWidth={minWidth} width="100%">
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
                  placeholder={`Search...`}
                  onInputChange={handleInputChange}
                  options={props.filterSelectOptions}
                />
              </View>
            )}
            <View marginEnd={'-8px'}>
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
                <ActionButton
                  isQuiet
                  onPress={() => {
                    toggleFavoriteFilter(props.feature);
                  }}
                >
                  {props.feature.favouriteFilter ? <Star size="S" /> : <StarOutline size="S" />}
                </ActionButton>
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
  sendEvent: storeState.visualisationData.sendEvent,
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
  markFavouriteFilter,
  loadFilterOptions,
  removeAllSelectedOptionsAppliedFilters,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(FilterElement);
