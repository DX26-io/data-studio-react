import React from 'react';
import { View } from '@adobe/react-spectrum';
import VisualizationTitleProperties from 'app/modules/canvas/visualization/visualization-properties/partials/properties/visualization-title-properties';
import VisualizationChartConfigProperties from 'app/modules/canvas/visualization/visualization-properties/partials/properties/visualization-chart-config-properties';
import VisualizationBodyProperties from 'app/modules/canvas/visualization/visualization-properties/partials/properties/visualization-body-properties';

const VisualizationChartProperties = () => {
  return (
    <View>
      <VisualizationTitleProperties />
      <VisualizationBodyProperties />
      <VisualizationChartConfigProperties />
    </View>
  );
};

export default VisualizationChartProperties;
