import React, { useEffect, useState } from 'react';
import { ActionButton, Text, Button, ButtonGroup, Flex, Form, Heading, Item, ListBox, Picker, View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import TableAndChart from '@spectrum-icons/workflow/TableAndChart';
import { IFeature } from 'app/shared/model/feature.model';
import { IVisualMetadataSet } from 'app/shared/model/visualMetadata.model';
import { Field } from 'app/shared/model/visualMetadata.model';
import uuid from 'react-uuid';
import Properties from 'app/modules/canvas/visualization/visualization-properties/partials/properties/properties';
import { VisualWrap } from 'app/modules/canvas/visualization/util/visualmetadata-wrapper';

export interface IVisualizationDataPropertiesProps extends StateProps, DispatchProps {
  features: readonly IFeature[];
  visual: IVisualMetadataSet;
}

const VisualizationDataProperties = (props: IVisualizationDataPropertiesProps) => {
  const [selectedField, setSelectedField] = useState<Field>();
  const [showDimension, setShowDimension] = useState(false);
  const [showMeasure, setShowMeasure] = useState(false);
  const [properties, setProperty] = useState([]);

  const visualWrap = VisualWrap(props.visual);
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
    if (field.fieldType.featureType === 'DIMENSION') {
      setShowDimension(true);
      setShowMeasure(false);
    } else {
      setShowMeasure(true);
      setShowDimension(false);
    }
    setSelectedField(field);
  };

  useEffect(() => {}, [props.visual]);

  const addFieldMeasure = () => {
    const fieldType = visualWrap.nextFieldMeasure(props.visual.fields, props.visual.metadataVisual);
    if (fieldType !== undefined) {
      const field = {
        fieldType,
        feature: null,
        constraint: fieldType.constraint,
        properties: fieldType.propertyTypes.map(function (item) {
          return {
            propertyType: item.propertyType,
            value: item.propertyType.defaultValue,
            type: item.propertyType.type,
            order: item.order,
          };
        }),
        order: fieldType.order,
      };
      props.visual.fields.push(field);
      setSelectedField(field);
    }
  };

  const addFieldDimension = () => {
    const fieldType = visualWrap.nextFieldDimension(props.visual.fields, props.visual.metadataVisual);
    if (fieldType !== undefined) {
      const field = {
        fieldType,
        feature: null,
        constraint: fieldType.constraint,
        properties: fieldType.propertyTypes.map(function (item) {
          return {
            propertyType: item.propertyType,
            value: item.propertyType.defaultValue,
            type: item.propertyType.type,
            order: item.order,
          };
        }),
        order: fieldType.order,
      };
      props.visual.fields.push(field);
    }
  };

  const featureChange = feature => {
    const selectedFeature = props.features.filter(item => {
      return item.name === feature.split('|')[1];
    });
    selectedField.feature = selectedFeature[0];
    setProperty([selectedField]);
    setSelectedField(selectedField);
  };
  return (
    <>
      <View>
        <Heading level={4}>Data Properties</Heading>
        <View>
          <Flex direction="row" justifyContent="space-between">
            <Flex direction="column" gap="size-50" justifyContent="space-around">
              <ActionButton onPress={addFieldDimension} isQuiet={true}>
                <TableAndChart size="XXL" />
              </ActionButton>
            </Flex>
            <Flex direction="column" gap="size-50" justifyContent="space-around">
              <ActionButton onPress={addFieldMeasure} isQuiet={true}>
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
                    marginTop={'size-25'}
                    variant={selectedField?.fieldType?.id === field.fieldType.id ? 'cta' : 'secondary'}
                    onPress={() => {
                      selectedFieldChange(field);
                    }}
                    key={uuid()}
                  >
                    <TableAndChart />

                    <Text> {field.feature?.name || ''}</Text>
                  </Button>
                ))}
          </ButtonGroup>

          {showDimension && (
            <Picker
              onSelectionChange={selected => featureChange(selected.toString())}
              label="Select dimension"
              selectedKey={selectedField?.feature?.name || ''}
            >
              {dimensionList &&
                dimensionList.length > 0 &&
                dimensionList
                  .sort((a, b) => (a.name > b.name ? 1 : -1))
                  .map((feature, i) => <Item key={uuid() + '|' + feature.name}> {feature.name} </Item>)}
            </Picker>
          )}

          {showMeasure && (
            <Picker
              onSelectionChange={selected => featureChange(selected.toString())}
              label="Select measure"
              selectedKey={selectedField?.feature?.name || ''}
            >
              {measureList &&
                measureList.length > 0 &&
                measureList
                  .sort((a, b) => (a.name > b.name ? 1 : -1))
                  .map((feature, i) => <Item key={uuid() + '|' + feature.name}> {feature.name} </Item>)}
            </Picker>
          )}
        </Form>
        <Form>
          {selectedField &&
            selectedField.properties &&
            selectedField.properties.length > 0 &&
            selectedField.properties
              .sort((a, b) => (a.order > b.order ? 1 : -1))
              .map((property, i) => (
                <Properties key={uuid()} property={property} propstype={'data'} visual={props.visual} features={props.features} />
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
