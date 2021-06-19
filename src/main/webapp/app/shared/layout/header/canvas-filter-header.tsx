import './header.scss';
import React, { useEffect, useState } from 'react';
import { ActionButton, View, Flex } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { createEntity as addVisualmetadataEntity, toggleEditMode } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { toggleFilterPanel, saveSelectedFilter } from 'app/modules/canvas/filter/filter.reducer';
import { saveViewState } from 'app/entities/views/views.reducer';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { applyFilter } from 'app/modules/canvas/filter/filter.reducer';
import Close from '@spectrum-icons/workflow/Close';
export interface ICanvasFilterHeaderProps extends StateProps, DispatchProps {
  hideLoader?: (id) => void;
}

const CanvasFilterHeader = (props: ICanvasFilterHeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean[]>();
  const [filters, setFilters] = useState<string[]>();

  let dropdownStatus = [];
  const toggle = index => {
    dropdownStatus[index] = !dropdownStatus[index];
    setDropdownOpen(dropdownStatus);
  };

  useEffect(() => {
    if (props.selectedFilter) {
      const filterList = Object.keys(props.selectedFilter);
      dropdownStatus = [];
      setFilters(filterList);
      filterList.forEach(item => {
        dropdownStatus.push(false);
      });
      setDropdownOpen(dropdownStatus);
    }
  }, [props.selectedFilter]);

  const removeFromFilter = (key, values, index) => {
    const filter = props.selectedFilter;
    const position = filter[key].indexOf(values);
    filter[key].splice(position, 1);
    toggle(index);
    props.applyFilter(filter, props.visualmetadata, props.view);
  };

  return (
    <>
      <View>
        <Flex direction="row" gap="size-100" wrap>
          {filters &&
            filters.length > 0 &&
            filters.map((item, i) => {
              if (props.selectedFilter && props.selectedFilter[item] && props.selectedFilter[item].length > 0) {
                return (
                  <>
                    <View>
                      <Dropdown
                        isOpen={dropdownOpen[i]}
                        toggle={() => {
                          toggle(i);
                        }}
                      >
                        <DropdownToggle caret>{item}</DropdownToggle>
                        <DropdownMenu>
                          {props.selectedFilter[item].map(value => {
                            return (
                              <DropdownItem key={value}>
                                {value}
                                <ActionButton onPress={() => removeFromFilter(item, value, i)} isQuiet aria-label="Icon only">
                                  <Close size={'XS'} />
                                </ActionButton>
                              </DropdownItem>
                            );
                          })}
                        </DropdownMenu>
                      </Dropdown>
                    </View>
                  </>
                );
              }
            })}
        </Flex>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  isAuthenticated: storeState.authentication.isAuthenticated,
  selectedFilter: storeState.filter.selectedFilters,
  visualmetadata: storeState.views.viewState,
  filters: storeState.filter.selectedFilters,
});

const mapDispatchToProps = {
  addVisualmetadataEntity,
  toggleEditMode,
  toggleFilterPanel,
  saveViewState,
  saveSelectedFilter,
  applyFilter,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CanvasFilterHeader);
