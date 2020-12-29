import React from 'react';
import { View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';''
import Dx26TitleProperties from 'app/modules/dx26/partials/dx26-properties/dx26-viz-properties/dx26-title-properties';
import Dx26ChartProperties from 'app/modules/dx26/partials/dx26-properties/dx26-viz-properties/dx26-chart-properties';
import Dx26BodyProperties from 'app/modules/dx26/partials/dx26-properties/dx26-viz-properties/dx26-body-properties';

import { IFeature } from 'app/shared/model/feature.model';
import { IViews } from 'app/shared/model/views.model';
import { IVisualMetadataSet } from 'app/shared/model/visualMetadata.model';

export interface IDx26VizPropertiesProps extends StateProps, DispatchProps {
  features: IFeature[];
  visual: IVisualMetadataSet;
}

const Dx26VizProperties = (props: IDx26VizPropertiesProps) => {
  return (
    <>
      <View>
          <Dx26TitleProperties titleProperties={props.visual.titleProperties} />
          <Dx26BodyProperties />
          <Dx26ChartProperties features={props.features} visual={props.visual} />

      </View>
    </>                                                                                                                                                   
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dx26VizProperties);
