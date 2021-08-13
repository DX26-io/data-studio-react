import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import RGL, { WidthProvider } from 'react-grid-layout';
import { IRootState } from 'app/shared/reducers';
import { receiveSocketResponse, hideLoader } from 'app/shared/websocket/websocket.reducer';
import { saveSelectedFilter } from 'app/modules/canvas/filter/filter.reducer';
import PinnedFilterElement from './pinned-filter-element';
import PinnedFiltersHeader from './pinned-filters-header';
const ReactGridLayout = WidthProvider(RGL);

export interface PinnedCanvasFiltersProps extends StateProps, DispatchProps { }

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
        <div
          className="layout widget"
          id={`filter-pinned-filters-div`}
          key={`viz-widget-pinned-filters-div`}
          data-grid={{
            i: 'pinned-filters-div',
            x: 0,
            y: 0,
            w: 1,
            h: 5 + props.pinnedFeatures.length,
            maxW: Infinity,
            maxH: Infinity,
            isBounded: true,
          }}
        >
          <div className="header">
            <PinnedFiltersHeader />
          </div>
          <div className="visualBody" id={`visualBody-pinned-filters-div`}>
            {props.pinnedFeatures &&
              props.pinnedFeatures.length > 0 &&
              props.pinnedFeatures.map((feature, i) => (
                <PinnedFilterElement key={`pinned-filter-element - ${feature.id}`} feature={feature} />
              ))}

          </div>
        </div>
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
