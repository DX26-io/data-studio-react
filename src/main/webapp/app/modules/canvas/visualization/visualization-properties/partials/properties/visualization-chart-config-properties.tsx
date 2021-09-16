import React from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { View, Heading, Form } from '@adobe/react-spectrum';
import Properties from 'app/modules/canvas/visualization/visualization-properties/partials/properties/property';

export interface IVisualizationChartConfigPropertiesProps extends StateProps, DispatchProps {}

const VisualizationChartConfigProperties = (props: IVisualizationChartConfigPropertiesProps) => {
  return (
    <>
      <View>
        <Heading margin={0} level={4}>
          Chart Properties
        </Heading>
        <Form>
          {props.visual.properties &&
            props.visual.properties.length > 0 &&
            props.visual.properties
              .sort((a, b) => (a.order > b.order ? 1 : -1))
              .map(property => (
                <Properties
                  key={property.propertyType.id}
                  property={property}
                  propstyle={'chart'}
                  visual={props.visual}
                  features={props.features}
                />
              ))}
        </Form>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visual: storeState.visualmetadata.entity,
  features: storeState.feature.entities,
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationChartConfigProperties);
