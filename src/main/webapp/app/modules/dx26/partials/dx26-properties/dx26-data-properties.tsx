import React, { useEffect, useState } from 'react';
import { ActionButton, Button, ButtonGroup, Flex, Form, Heading, Item, ListBox, Picker, View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import TableAndChart from '@spectrum-icons/workflow/TableAndChart';
import { IFeature } from 'app/shared/model/feature.model';
import { IVisualMetadataSet } from 'app/shared/model/visualMetadata.model';
import { Field } from 'app/shared/model/visualMetadata.model';

import Properties from 'app/modules/dx26/partials/properties';

export interface IDx26DataPropertiesProps extends StateProps, DispatchProps {
  features: IFeature[];
  visual: IVisualMetadataSet;
}

const Dx26DataProperties = (props: IDx26DataPropertiesProps) => {
  const [selectedField, setSelectedField] = useState(props.visual.fields[0]);
  const [selectedFeatures, setSelectedFeatures] = useState();
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
                    onPress={() => {
                      selectedFieldChange(field);
                    }}
                    isQuiet
                    variant="secondary"
                    key={field.feature?.id || 'field-' + i}
                  >
                    {field.feature?.name || ''}
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

export default connect(mapStateToProps, mapDispatchToProps)(Dx26DataProperties);
