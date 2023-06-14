import React from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { View, Form } from '@adobe/react-spectrum';
import Property from 'app/modules/canvas/visualisation/visualisation-properties/property';

export interface IVisualisationChartConfigPropertiesProps extends StateProps, DispatchProps {}

const VisualisationChartConfigProperties = (props: IVisualisationChartConfigPropertiesProps) => {
  return (
    <>
      <View>
        <Form>
          {props.visual.properties &&
            props.visual.properties.length > 0 &&
            props.visual.properties
              .sort((a, b) => (a.order > b.order ? 1 : -1))
              .map(property => (
                <Property
                  key={property.propertyType.id}
                  property={property}
                  propertyType={'chart'}
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

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationChartConfigProperties);
