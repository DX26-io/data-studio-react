import React, { useEffect, useState, ReactText } from 'react';
import { connect } from 'react-redux';
import { Flex, View, Text, Button, Divider, Item, Content } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import './filter-panel.scss';
import Search from '@spectrum-icons/workflow/Search';
import FilterElement from 'app/modules/canvas/filter/filter-element';
import { Translate, translate } from 'react-jhipster';
import {
  applyFilter,
  applyFilterForShareLink,
  clearFilter,
  clearFilterForShareLink,
  setSeparator,
  toggleFilterPanel,
} from './filter.reducer';
import PanelHeader from 'app/shared/components/panel-header';
import { removeEnabledFilters } from './filter-util';
import Separators from 'app/shared/components/separator/separators';
import { Tabs } from '@react-spectrum/tabs';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

export interface IFilterPanelProp extends StateProps, DispatchProps {
  visualisationId?: string;
  isShareLink?: boolean;
}

const FilterPanel = (props: IFilterPanelProp) => {
  // TODO : need to refector this code
  const [isFilterMinimize, setFilterMinimize] = useState(true);
  // const [isFilterPanelClose, setFilterPanelClose] = useState(props.isFilterOpen);
  const [tabId, setTabId] = useState<ReactText>(1);

  const tabs = [
    { id: 1, name: 'canvas.filters.tabs.filters' },
    { id: 2, name: 'canvas.filters.tabs.favFilters' },
  ];

  // useEffect(() => {
  //   setFilterPanelClose(props.isFilterOpen);
  // }, [props.isFilterOpen]);

  const _setSeparator = separator => {
    props.setSeparator(separator);
  };

  const getPanelClasses = () => {
    let panelClass = '';
    panelClass = isFilterMinimize ? 'filter-panel filter-panel-minimize ' : 'filter-panel filter-panel-maximize';
    panelClass = panelClass.concat(props.isShareLink ? ' share-link-filter-panel' : '');
    return panelClass;
  };

  const handleClickAway = event => {
    if (event.target.firstChild.id !== 'filter-button') {
      props.toggleFilterPanel();
    }
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className="filter-panel-main">
          <div className={getPanelClasses()}>
            <PanelHeader setMinimize={setFilterMinimize} isMinimized={isFilterMinimize} titleKey="entity.action.filters" />
            <Divider size={'S'} />
            <Tabs aria-label="filters" items={tabs} selectedKey={tabId} onSelectionChange={setTabId}>
              {item_ => (
                <Item title={translate(item_.name)}>
                  <Flex marginTop="size-150" marginBottom="size-150" direction="row" alignItems="center" justifyContent="center">
                    <Separators setSeparator={_setSeparator} />
                  </Flex>
                  <Flex direction="column" gap="size-100" justifySelf="center">
                    <div className="filter-body">
                      {tabId === 1
                        ? props.featuresList &&
                          props.featuresList.length > 0 &&
                          props.featuresList.map((item, i) => {
                            if (item.featureType === 'DIMENSION') {
                              return <FilterElement key={item.id} feature={item} />;
                            }
                          })
                        : props.favoriteFeaturesList &&
                          props.favoriteFeaturesList.length > 0 &&
                          props.favoriteFeaturesList.map((item, i) => {
                            if (item.featureType === 'DIMENSION') {
                              return <FilterElement key={item.id} feature={item} />;
                            }
                          })}
                      <Flex direction="row" justifyContent="end" marginTop="size-125">
                        <Button
                          onPress={() => {
                            if (!props.visualisationId) {
                              props.applyFilter(props.selectedFilters, props.visualmetadata, props.view);
                            } else {
                              props.applyFilterForShareLink(props.selectedFilters, props.visualmetadataEntity, props.view);
                            }
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
                            if (!props.visualisationId) {
                              props.clearFilter(
                                removeEnabledFilters(props.selectedFilters, props.featuresList),
                                props.visualmetadata,
                                props.view
                              );
                            } else {
                              props.clearFilterForShareLink({}, props.visualmetadataEntity, props.view);
                            }
                          }}
                          marginX={9}
                          variant="primary"
                        >
                          <Text>
                            <Translate contentKey="entity.action.clear">Clear</Translate>
                          </Text>
                        </Button>
                      </Flex>
                    </div>
                  </Flex>
                </Item>
              )}
            </Tabs>
          </div>
        </div>
      </ClickAwayListener>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  isFilterOpen: storeState.filter.isFilterOpen,
  featuresList: storeState.feature.entities,
  favoriteFeaturesList: storeState.feature.entities.filter(f => f.favouriteFilter === true),
  visualmetadata: storeState.views.viewState,
  selectedFilters: storeState.filter.selectedFilters,
  visualmetadataEntity: storeState.visualmetadata.entity,
});
const mapDispatchToProps = {
  applyFilter,
  clearFilter,
  applyFilterForShareLink,
  clearFilterForShareLink,
  setSeparator,
  toggleFilterPanel,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
