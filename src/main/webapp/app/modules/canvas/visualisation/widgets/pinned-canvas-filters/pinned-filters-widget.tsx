import React from 'react';
import { IFeature } from 'app/shared/model/feature.model';
import PinnedFiltersHeader from './pinned-filters-header';
import PinnedFilterElement from './pinned-filter-element';

interface IPinnedFiltersWidgetProps {
  pinnedWidgetKey: any;
  pinnedFeatures: Array<IFeature>;
}
const PinnedFiltersWidget = (props: IPinnedFiltersWidgetProps) => (
  <React.Fragment>
    <div className="header">
      <PinnedFiltersHeader />
    </div>
    <div className="visualBody" id={`visualBody-${props.pinnedWidgetKey}`}>
      {props.pinnedFeatures &&
        props.pinnedFeatures.length > 0 &&
        props.pinnedFeatures.map(feature => <PinnedFilterElement key={`pinned-filter-element - ${feature.id}`} feature={feature} />)}
    </div>
  </React.Fragment>
);

export default PinnedFiltersWidget;
