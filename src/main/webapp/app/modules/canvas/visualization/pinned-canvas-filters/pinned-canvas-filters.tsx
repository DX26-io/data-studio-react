import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import RGL, { WidthProvider } from 'react-grid-layout';
import { IRootState } from 'app/shared/reducers';
import { receiveSocketResponse, hideLoader } from 'app/shared/websocket/websocket.reducer';
import { saveSelectedFilter } from 'app/modules/canvas/filter/filter.reducer';
import PinnedFilterElement from './pinned-filter-element';
import PinnedFiltersHeader from './pinned-filters-header';
const ReactGridLayout = WidthProvider(RGL);

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
        <ReactGridLayout margin={[15, 15]} {...defaultProps} key={`pinned-filters-grid-layout-${props.pinnedFeatures.length}`}>
          <div
            key={'pinned-filters-div'}
            // TODO : marginLeft needs to removed and will be refactored from canvas.tsx
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
              backgroundColor:
                'var(--spectrum-alias-background-color-gray-75, var(--spectrum-global-color-gray-75, var(--spectrum-semantic-gray-75-color-background)))',
              borderWidth: 'var(--spectrum-alias-border-size-thin)',
              borderColor: 'var(--spectrum-alias-border-color)',
            }}
            className="layout"
            data-grid={{
              i: '1',
              x: 0,
              y: 0,
              w: 2.2,
              h: 5 + props.pinnedFeatures.length,
              maxW: Infinity,
              maxH: Infinity,
              static: false,
            }}
          >
            <PinnedFiltersHeader />
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
  pinnedFeatures: storeState.feature.entities.filter(feature => feature.pin === true)
});

const mapDispatchToProps = {
  receiveSocketResponse,
  hideLoader,
  saveSelectedFilter,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PinnedCanvasFilters);
