import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { View } from '@adobe/react-spectrum';
import { RouteComponentProps } from 'react-router-dom';
import RGL, { WidthProvider } from 'react-grid-layout';
import { IRootState } from 'app/shared/reducers';
import { receiveSocketResponse, hideLoader } from 'app/shared/websocket/websocket.reducer';
import { applyFilter, saveSelectedFilter } from 'app/modules/canvas/filter/filter.reducer';
import FilterElement from 'app/modules/canvas/filter/filter-element';

const ReactGridLayout = WidthProvider(RGL);

export interface PinnedCanvasFiltersProps extends StateProps, DispatchProps {}

const PinnedCanvasFilters = (props: PinnedCanvasFiltersProps) => {
  const defaultProps = {
    isDraggable: true,
    isResizable: true,
    items: 5,
    rowHeight: 30,
    preventCollision: false,
    compactType: null,
    cols: 12,
  };

  return (
    <>
      <View>
        {props.pinnedFeatures && props.pinnedFeatures.length > 0 && (
          <ReactGridLayout {...defaultProps}>
            {props.pinnedFeatures &&
              props.pinnedFeatures.length > 0 &&
              props.pinnedFeatures.map((feature, i) => (
                <div  className="item widget" key={`pinned-filter-${feature.id}`} data-grid={{i, x: i, y: 0,minW:3.5, w: 3.5, h: 3.5, static: false }}>
                  <FilterElement key={feature.id} feature={feature} />
                </div>
              ))}
          </ReactGridLayout>
        )}
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  pinnedFeatures: storeState.feature.pinnedFeatures,
  isEditMode: storeState.visualmetadata.isEditMode,
  filterData: storeState.visualmetadata.filterData,
  isSocketConnected: storeState.visualizationData.isSocketConnected,
  selectedFilters: storeState.filter.selectedFilters,
  isFilterOpen: storeState.filter.isFilterOpen,
});

const mapDispatchToProps = {
  receiveSocketResponse,
  hideLoader,
  saveSelectedFilter,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PinnedCanvasFilters);
