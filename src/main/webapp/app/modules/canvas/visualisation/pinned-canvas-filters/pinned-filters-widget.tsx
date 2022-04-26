import React from 'react';
import { IFeature } from 'app/shared/model/feature.model';
import { IVisualMetadataSet } from 'app/shared/model/visualmetadata.model';
import PinnedFiltersHeader from './pinned-filters-header';
import PinnedFilterElement from './pinned-filter-element';

interface IPinnedFiltersWidgetProps {
  visualisation: IVisualMetadataSet;
  pinnedFeatures: Array<IFeature>;
  index:number;
}

const PinnedFiltersWidget: React.FC<IPinnedFiltersWidgetProps> = props => {
  return (
    <div
      className="item widget pinned-filters-widget"
      id={`pinned-filters-${props.visualisation.key + props.index}`}
      key={`viz-widget-${props.visualisation.key + props.index}`}
      data-grid={{
        i: props.visualisation.key,
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
      <div className="visualBody" id={`visualBody-${props.visualisation.key}`}>
        {props.pinnedFeatures &&
          props.pinnedFeatures.length > 0 &&
          props.pinnedFeatures.map(feature => <PinnedFilterElement key={`pinned-filter-element - ${feature.id}`} feature={feature} />)}
      </div>
    </div>
  );
};

export default PinnedFiltersWidget;
