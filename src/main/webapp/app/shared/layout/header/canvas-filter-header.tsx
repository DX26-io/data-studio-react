import './header.scss';
import React, { useEffect, useState } from 'react';
import { View, Flex, Text } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { createEntity as addVisualmetadataEntity, toggleEditMode } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { saveViewState } from 'app/entities/views/views.reducer';
import 'bootstrap/dist/css/bootstrap.css';
import { applyFilter, addAppliedFilters, removeAppliedFilters, toggleFilterPanel, saveSelectedFilter, removeDateFilters } from 'app/modules/canvas/filter/filter.reducer';
import { removeOptionFromFilters } from 'app/modules/canvas/filter/filter-util';
import Close from '@spectrum-icons/workflow/Close';
import Select from 'react-select';
import { generateOptions } from 'app/shared/util/entity-utils';
import { generateOptionsForDateRange, isDateFilterType, isDateRange } from 'app/modules/canvas/filter/filter-util';
import { getFeature } from './header.util';
export interface ICanvasFilterHeaderProps extends StateProps, DispatchProps { }

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
        <View minWidth="size-2000" key={`filter-${featureName}`}>
          {
            isDateFilterType(props.selectedFilters[featureName]?._meta.dataType) ? (
              <>
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
                        props.applyFilter(props.selectedFilters, props.visualmetadata, props.view);
                      }

                    }
                  }}
                  placeholder={featureName}
                  options={generateOptionsForDateRange(props.dynamicDateRangeMetaData[featureName])}
                /></>

            ) : (
              <Select
                key={featureName}
                value={null}
                searchable={true}
                formatOptionLabel={formatOptionLabel}
                classNamePrefix="select"
                onChange={(value, actionMeta) => {
                  if (actionMeta.action === 'select-option') {
                    const filters = removeOptionFromFilters(value.value, props.selectedFilters, { name: featureName });
                    props.applyFilter(filters, props.visualmetadata, props.view);
                    props.removeAppliedFilters(value.value, { name: featureName });
                  }
                }}
                placeholder={featureName}
                options={generateOptions(props.selectedFilters[featureName])}
              />
            )
          }

        </View>
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
});

const mapDispatchToProps = {
  addVisualmetadataEntity,
  toggleEditMode,
  toggleFilterPanel,
  saveViewState,
  saveSelectedFilter,
  applyFilter,
  addAppliedFilters,
  removeAppliedFilters,
  removeDateFilters
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CanvasFilterHeader);
