import './header.scss';
import React, { useEffect, useState } from 'react';
import { View, Flex, Text } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { createEntity as addVisualmetadataEntity, toggleEditMode } from 'app/entities/visualmetadata/visualmetadata.reducer';
import 'bootstrap/dist/css/bootstrap.css';
import {
  applyFilter,
  addAppliedFilters,
  removeAppliedFilters,
  toggleFilterPanel,
  saveSelectedFilter,
  removeDateFilters,
} from 'app/modules/canvas/filter/filter.reducer';
import { removeOptionFromFilters } from 'app/modules/canvas/filter/filter-util';
import Close from '@spectrum-icons/workflow/Close';
import Select from 'react-select';
import { generateOptions } from 'app/shared/util/entity-utils';
import { generateOptionsForDateRange, isDateFilterType, isDateRange } from 'app/modules/canvas/filter/filter-util';
import { getFeature } from 'app/entities/feature/feature-util';
import { setDatesInFeature } from 'app/entities/feature/feature.reducer';

export interface ICanvasFilterHeaderProps extends StateProps, DispatchProps {}

const CanvasFilterHeader = (props: ICanvasFilterHeaderProps) => {
  const formatOptionLabel = ({ value, label }) => (
    <Flex direction="row" alignItems="center">
      <span className="spectrum-Body-emphasis--sizeXXS" style={{ marginRight: 'auto' }}>
        {label}
      </span>
      <Close size="S" />
    </Flex>
  );

  const createdSelectedFilterElements = () => {
    const options = Object.keys(props.selectedFilters).map((featureName, i) => {
      return (
        <React.Fragment key={`header-filter-${featureName}`}>
          {isDateFilterType(props.selectedFilters[featureName]?._meta?.dataType) ? (
            <View minWidth="size-3000">
              <Select
                key={featureName}
                value={null}
                searchable={true}
                formatOptionLabel={formatOptionLabel}
                classNamePrefix="select"
                onChange={(value, actionMeta) => {
                  if (actionMeta.action === 'select-option') {
                    const feature = getFeature(props.featureList, featureName);
                    if (feature && feature.dateFilter !== 'ENABLED') {
                      props.removeDateFilters(props.selectedFilters, featureName);
                      props.applyFilter(props.selectedFilters, props.visualmetadata, props.view,props.sendEvent);
                    }
                    props.setDatesInFeature(featureName,'','',null);
                  }
                }}
                placeholder={featureName}
                options={generateOptionsForDateRange(props.dynamicDateRangeMetaData[featureName],props.selectedFilters[featureName])}
              />
            </View>
          ) : (
            <View minWidth="size-2000">
              <Select
                key={featureName}
                value={null}
                searchable={true}
                formatOptionLabel={formatOptionLabel}
                classNamePrefix="select"
                onChange={(value, actionMeta) => {
                  if (actionMeta.action === 'select-option') {
                    const filters = removeOptionFromFilters(value.value, props.selectedFilters, { name: featureName });
                    props.applyFilter(filters, props.visualmetadata, props.view,props.sendEvent);
                    props.removeAppliedFilters(props.sendEvent,value.value, { name: featureName });
                  }
                }}
                placeholder={featureName}
                options={generateOptions(props.selectedFilters[featureName])}
              />
            </View>
          )}
        </React.Fragment>
      );
    });
    return options;
  };

  return (
    <Flex direction="row" gap="size-100" marginStart="size-200" wrap>
      {createdSelectedFilterElements()}
    </Flex>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  selectedFilters: storeState.filter.selectedFilters,
  dynamicDateRangeMetaData: storeState.filter.dynamicDateRangeMetaData,
  featureList: storeState.feature.entities,
  view: storeState.views.entity,
  visualmetadata: storeState.views.viewState,
  sendEvent: storeState.visualisationData.sendEvent,
});

const mapDispatchToProps = {
  addVisualmetadataEntity,
  toggleEditMode,
  toggleFilterPanel,
  saveSelectedFilter,
  applyFilter,
  addAppliedFilters,
  removeAppliedFilters,
  removeDateFilters,
  setDatesInFeature,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CanvasFilterHeader);
