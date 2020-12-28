import React, { useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { View, Well, Text, Heading } from '@adobe/react-spectrum';
import { IViews } from 'app/shared/model/views.model';
import { IFeature } from 'app/shared/model/feature.model';
import { IVisualMetadataSet } from 'app/shared/model/visualMetadata.model';
import Properties from 'app/modules/dx26/partials/properties';

export interface IDx26ChartPropertiesProps extends StateProps, DispatchProps {
  features: IFeature[];
  visual: IVisualMetadataSet;
}

const Dx26ChartProperties = (props: IDx26ChartPropertiesProps) => {
  return (
    <>
      <View>
        <Heading level={4}>Chart Properties</Heading>
        {props.visual.properties &&
          props.visual.properties.length > 0 &&
          props.visual.properties
            .sort((a, b) => (a.order > b.order ? 1 : -1))
            .map(property => (
              <Properties key={property.id} property={property} propstype={'chart'} visual={props.visual} features={props.features} />
            ))}
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dx26ChartProperties);
