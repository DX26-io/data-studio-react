import './header.scss';
import React, { useEffect, useState } from 'react';
import { ActionButton, View, DialogContainer, TooltipTrigger, Tooltip, MenuTrigger, Menu, Item, Flex } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import {
  createEntity as addVisualmetadataEntity,
  deleteEntity as deleteVisualmetadataEntity,
  modifyFilterState
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import { toggleEditMode, toggleFilterPanel } from 'app/shared/reducers/application-profile';
import { saveViewState } from 'app/entities/views/views.reducer';
import Filter from '@spectrum-icons/workflow/Filter';
import { FilterParameterService } from 'app/modules/canvas/filter/filter-parameters-service';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import Edit from '@spectrum-icons/workflow/Edit';
import { getVisualizationData, ValidateFields } from 'app/modules/canvas/visualization/util/visualization-render-utils';
import Close from '@spectrum-icons/workflow/Close';

const CanvasFilterHeader = props => {
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

  const removeFromFilter = (key, values, index) => {
    const position = props.selectedFilter[key].indexOf(values);
    props.selectedFilter[key].splice(position, 1);
    toggle(index);
    loadVisualization();
    props.modifyFilterState();
  };

  return (
    <>
      <View>
        <Flex direction="row" gap="size-100" wrap>
          {filters &&
            filters.length > 0 &&
            filters.map((item, i) => {
              if (props.selectedFilter[item].length > 0) {
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
                              <DropdownItem>
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
  selectedFilter: storeState.visualmetadata.selectedFilter,
  visualmetadata: storeState.views.viewState,
});

const mapDispatchToProps = {
  addVisualmetadataEntity,
  toggleEditMode,
  toggleFilterPanel,
  saveViewState,
  modifyFilterState
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CanvasFilterHeader);
