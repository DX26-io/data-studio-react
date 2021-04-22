import React from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { View } from '@adobe/react-spectrum';
import { IFeature } from 'app/shared/model/feature.model';
import { IVisualMetadataSet } from 'app/shared/model/visualMetadata.model';
import VisualizationTitleProperties from 'app/modules/canvas/visualization/visualization-properties/partials/properties/visualization-title-properties';
import VisualizationChartConfigProperties from 'app/modules/canvas/visualization/visualization-properties/partials/properties/visualization-chart-config-properties';
import VisualizationBodyProperties from 'app/modules/canvas/visualization/visualization-properties/partials/properties/visualization-body-properties';

export interface IVisualizationChartPropertiesProps  {
  features:readonly IFeature[];
  visual: IVisualMetadataSet;
}

const VisualizationChartProperties = (props: IVisualizationChartPropertiesProps) => {
   return (
    <>
      <View>
          <VisualizationTitleProperties titleProperties={props.visual.titleProperties} />
          <VisualizationBodyProperties  bodyProperties={props.visual.bodyProperties} />
          <VisualizationChartConfigProperties features={props.features} visual={props.visual} />

      </View>
    </>                                                                                                                                                   
  );
};

export default (VisualizationChartProperties);
