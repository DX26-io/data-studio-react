import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, View, Text, Button, Divider } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import './filter-panel.scss';
import Search from '@spectrum-icons/workflow/Search';
import FilterElement from 'app/modules/canvas/filter/filter-element';
import { Translate } from 'react-jhipster';
import { applyFilter, clearFilter } from './filter.reducer';
import PanelHeader from 'app/shared/components/panel-header';

export interface IFilterPanelProp extends StateProps, DispatchProps {}

const FilterPanel = (props: IFilterPanelProp) => {

  // TODO : need to refector this code
  
  const [isFilterMinimize, setFilterMinimize] = useState(true);
  const [isFilterPanelClose, setFilterPanelClose] = useState(props.isFilterOpen);

  const removeFilter = () => {
    props.clearFilter({}, props.visualmetadata, props.view);
  };

  useEffect(() => {
    setFilterPanelClose(props.isFilterOpen);
  }, [props.isFilterOpen]);

  return (
    <>
      <div className={!isFilterPanelClose ? 'FilterPanel-Main FilterPanel-hide' : 'FilterPanel-Main FilterPanel-show'}>
        <div className={isFilterMinimize ? 'FilterPanel FilterPanel-minimize' : 'FilterPanel FilterPanel-maximize'}>
          <PanelHeader setMinimize={setFilterMinimize} isMinimized={isFilterMinimize} titleKey="entity.action.filter" />
          <Divider size={'S'} />
          <Flex direction="column" gap="size-100" justifySelf="center">
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
              <Flex direction="row" justifyContent="end" marginTop="size-125" marginBottom="size-125">
                <Button
                  onPress={() => {
                    props.applyFilter(props.selectedFilters, props.visualmetadata, props.view);
                  }}
                  marginX={5}
                  variant="cta"
                >
                  <Text>
                    <Translate contentKey="entity.action.filter">Filter</Translate>
                  </Text>
                  <Search />
                </Button>
                <Button
                  onPress={() => {
                    removeFilter();
                  }}
                  marginX={9}
                  variant="primary"
                >
                  <Text>
                    {' '}
                    <Translate contentKey="entity.action.clear">Clear</Translate>
                  </Text>
                </Button>
              </Flex>
            </View>
          </Flex>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  isFilterOpen: storeState.filter.isFilterOpen,
  featuresList: storeState.feature.entities,
  visualmetadata: storeState.views.viewState,
  selectedFilters: storeState.filter.selectedFilters,
});
const mapDispatchToProps = {
  applyFilter,
  clearFilter,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);