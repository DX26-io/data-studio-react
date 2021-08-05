import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { View } from '@adobe/react-spectrum';
import RGL, { WidthProvider } from 'react-grid-layout';
import { IRootState } from 'app/shared/reducers';
import { receiveSocketResponse, hideLoader } from 'app/shared/websocket/websocket.reducer';
import { applyFilter, saveSelectedFilter } from 'app/modules/canvas/filter/filter.reducer';
import PinnedFilterElement from './pinned-filter-element';

const ReactGridLayout = WidthProvider(RGL);

// TODO : UI disign issues need to fixed

export interface PinnedCanvasFiltersProps extends StateProps, DispatchProps {}

const PinnedCanvasFilters = (props: PinnedCanvasFiltersProps) => {
  const defaultProps = {
    isDraggable: true,
    isResizable: true,
    items: 5,
    rowHeight: 30,
    preventCollision: true,
    cols: 12,
  };

  return (
    <>
      {props.pinnedFeatures && props.pinnedFeatures.length > 0 && (
        <ReactGridLayout {...defaultProps} key={'pinned-filters-grid-layout'}>
          <div
            key={'pinned-filters-div'}
            // TODO : marginLeft needs to removed and will be refactored from canvas.tsx
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
              marginLeft: '6px',
              backgroundColor: '#fff',
              borderWidth: 'var(--spectrum-alias-border-size-thin)',
              borderColor: 'var(--spectrum-alias-border-color)',
            }}
            className="layout"
            data-grid={{ i: '1', x: 0, y: 0, w: 2.2, h: 4, maxW: Infinity, maxH: Infinity, static: false }}
          >
            {props.pinnedFeatures &&
              props.pinnedFeatures.length > 0 &&
              props.pinnedFeatures.map((feature, i) => (
                <PinnedFilterElement key={`pinned-filter-element - ${feature.id}`} feature={feature} />
              ))}
          </div>
        </ReactGridLayout>
      )}
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  pinnedFeatures: storeState.feature.entities.filter(feature => feature.pin === true),
  isEditMode: storeState.visualmetadata.isEditMode,
  isSocketConnected: storeState.visualizationData.isSocketConnected,
  selectedFilters: storeState.filter.selectedFilters,
  isFilterOpen: storeState.filter.isFilterOpen,
  // maxHeight: storeState.feature.pinnedFeatures ? storeState.feature.pinnedFeatures.length + 1 : 0,
});

const mapDispatchToProps = {
  receiveSocketResponse,
  hideLoader,
  saveSelectedFilter,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PinnedCanvasFilters);
