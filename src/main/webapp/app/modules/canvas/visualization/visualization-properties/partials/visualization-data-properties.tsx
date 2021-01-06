import React, { useEffect, useState } from 'react';
import { ActionButton, Text, Button, ButtonGroup, Flex, Form, Heading, Item, ListBox, Picker, View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import TableAndChart from '@spectrum-icons/workflow/TableAndChart';
import { IFeature } from 'app/shared/model/feature.model';
import { IVisualMetadataSet } from 'app/shared/model/visualMetadata.model';
import { Field } from 'app/shared/model/visualMetadata.model';

import Properties from 'app/modules/canvas/visualization/visualization-properties/partials/properties/properties';
import Brush from '@spectrum-icons/workflow/Brush';
import Select from '@spectrum-icons/workflow/Select';
import RegionSelect from '@spectrum-icons/workflow/RegionSelect';

export interface IVisualizationDataPropertiesProps extends StateProps, DispatchProps {
  features: readonly IFeature[];
  visual: IVisualMetadataSet;
}

const VisualizationDataProperties = (props: IVisualizationDataPropertiesProps) => {
  const [selectedField, setSelectedField] = useState(props.visual.fields[0]);
  const getDimensionList = () => {
    return props.features.filter(item => {
      if (item.featureType === 'DIMENSION') {
        return item;
      }
    });
  };
  const getMeasureList = () => {
    return props.features.filter(item => {
      if (item.featureType === 'MEASURE') {
        return item;
      }
    });
  };
  const dimensionList = getDimensionList();
  const measureList = getMeasureList();

  const selectedFieldChange = field => {
    const selected = props.visual.fields.filter(item => {
      return item.feature.id === field.feature.id;
    });
    setSelectedField(selected[0]);
  };

  return (
    <>
      <View>
        <Heading level={4}>Data Properties</Heading>
        <View>
          <Flex direction="row" justifyContent="space-between">
            <Flex direction="column" gap="size-50" justifyContent="space-around">
              <ActionButton isQuiet={true}>
                <TableAndChart size="XXL" />
              </ActionButton>
            </Flex>
            <Flex direction="column" gap="size-50" justifyContent="space-around">
              <ActionButton isQuiet={true}>
                <TableAndChart size="XXL" />
              </ActionButton>
            </Flex>
          </Flex>
        </View>
        <Form>
          <ButtonGroup orientation="vertical">
            {props.visual.fields &&
              props.visual.fields.length > 0 &&
              props.visual.fields
                .sort((a, b) => (a.fieldType.order > b.fieldType.order ? 1 : -1))
                .map((field, i) => (
                  <Button
                    width={'100%'}
                    variant="secondary"
                    onPress={() => {
                      selectedFieldChange(field);
                    }}
                    key={field.feature?.id || 'field-' + i}
                  >
                    <TableAndChart />
                    <Text alignSelf={'start'}> {field.feature?.name || ''}</Text>
                  </Button>
                ))}
          </ButtonGroup>
          <Picker label="Choose dimension">
            {dimensionList &&
              dimensionList.length > 0 &&
              dimensionList
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((feature, i) => <Item key={feature.id || 'feature-' + i}> {feature.name} </Item>)}
          </Picker>

          <Picker label="Choose measure">
            {measureList &&
              measureList.length > 0 &&
              measureList
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((feature, i) => <Item key={feature.id || 'feature-' + i}> {feature.name} </Item>)}
          </Picker>
        </Form>
        <Form>
          {selectedField.properties &&
            selectedField.properties.length > 0 &&
            selectedField.properties
              .sort((a, b) => (a.order > b.order ? 1 : -1))
              .map((property, i) => (
                <Properties
                  key={property.propertyType.id ? property.propertyType.id : 'Properties-' + i}
                  property={property}
                  propstype={'data'}
                  visual={props.visual}
                  features={props.features}
                />
              ))}
        </Form>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationDataProperties);
