import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, View, Text, Button, Divider } from '@adobe/react-spectrum';
import $ from 'jquery';
import { IRootState } from 'app/shared/reducers';
import './filter-panel.scss';
import Minimize from '@spectrum-icons/workflow/Minimize';
import Search from '@spectrum-icons/workflow/Search';
import Maximize from '@spectrum-icons/workflow/Maximize';
import FilterElement from 'app/modules/canvas/filter/filter-element';
import uuid from 'react-uuid';
import { getViewFeaturesEntities as getfeatureEntities } from 'app/entities/feature/feature.reducer';
import { getVisualizationData, ValidateFields } from '../visualization/util/visualization-render-utils';
import { FilterParameterService } from './filter-parameters-service';
import { updateSelectedFilter } from 'app/modules/canvas/filter/filter.reducer';

export interface IFilterPanelProp extends StateProps, DispatchProps {}

const FilterPanel = (props: IFilterPanelProp) => {
  const [isFilterMinimize, setFilterMinimize] = useState(true);
  const [isFilterPanelClose, setFilterPanelClose] = useState(props.isFilterOpen);

  const renderVisualizationById = item => {
    if (ValidateFields(item.fields)) {
      getVisualizationData(item, props.view);
    } else {
      $(`.loader-${item.id}`).hide();
    }
  };

  const loadVisualization = () => {
    props.visualmetadata.visualMetadataSet.map((item, i) => {
      renderVisualizationById(item);
    });
  };

  const applyFilter = () => {
    FilterParameterService.save(props.selectedFilter);
    props.updateSelectedFilter();
    loadVisualization();
  };

  useEffect(() => {
    props.getfeatureEntities(props.view.id);
  }, [props.view]);

  useEffect(() => {
    setFilterPanelClose(props.isFilterOpen);
  }, [props.isFilterOpen]);

  return (
    <>
      <div className={!isFilterPanelClose ? 'FilterPanel-Main FilterPanel-hide' : 'FilterPanel-Main FilterPanel-show'}>
        <div className={isFilterMinimize ? 'FilterPanel FilterPanel-minimize' : 'FilterPanel FilterPanel-maximize'}>
          <Flex direction="column" gap="size-100">
            <View justifySelf="center">
              <div className="filter-header">
                <Text>
                  <span>Filter</span>
                </Text>
                {isFilterMinimize ? (
                  <ActionButton
                    onPress={() => {
                      setFilterMinimize(!isFilterMinimize);
                    }}
                    isQuiet={true}
                  >
                    <Maximize></Maximize>
                  </ActionButton>
                ) : (
                  <ActionButton
                    onPress={() => {
                      setFilterMinimize(!isFilterMinimize);
                    }}
                    isQuiet={true}
                  >
                    <Minimize></Minimize>
                  </ActionButton>
                )}
              </div>
              <Divider size={'S'} />
            </View>
            <View>
              <div className="filter-body">
                {props.featuresList &&
                  props.featuresList.length > 0 &&
                  props.featuresList.map((item, i) => {
                    if (item.featureType === 'DIMENSION') {
                      return <FilterElement key={item.id} feature={item} />;
                    }
                  })}
              </div>
            </View>
            <View>
              <Button onPress={applyFilter} marginX={5} variant="cta">
                <Text>Filter</Text> <Search></Search>
              </Button>
              <Button marginX={5} variant="primary">
                <Text>Clear</Text>
              </Button>
            </View>
          </Flex>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  isFilterOpen: storeState.applicationProfile.isFilterOpen,
  featuresList: storeState.feature.entities,
  visualmetadata: storeState.views.viewState,
  selectedFilter: storeState.filter.selectedFilter,
  filterStateChange: storeState.filter.filterStateChange,
});
const mapDispatchToProps = {
  getfeatureEntities,
  updateSelectedFilter,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);