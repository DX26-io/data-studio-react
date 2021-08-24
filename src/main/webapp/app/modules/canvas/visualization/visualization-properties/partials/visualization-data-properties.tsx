import React, { useEffect, useState } from 'react';
import {
  ActionButton,
  Flex,
  Form,
  Heading,
  View,
  TooltipTrigger,
  Tooltip,
} from '@adobe/react-spectrum';
import TableAndChart from '@spectrum-icons/workflow/TableAndChart';
import { IFeature } from 'app/shared/model/feature.model';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import uuid from 'react-uuid';
import Properties from 'app/modules/canvas/visualization/visualization-properties/partials/properties/properties';
import { VisualWrap } from 'app/modules/canvas/visualization/util/visualmetadata-wrapper';
import LockClosed from '@spectrum-icons/workflow/LockClosed';
import Delete from '@spectrum-icons/workflow/Delete';
import Select from 'react-select';
import { Field } from 'app/shared/model/field.model';
import { IRootState } from 'app/shared/reducers';
import { addField,deleteField } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { connect } from 'react-redux';

export interface IVisualizationDataPropertiesProps extends StateProps, DispatchProps {
  features: readonly IFeature[];
  visual: IVisualMetadataSet;
  hierarchies?: Array<any>;
}

const VisualizationDataProperties = (props: IVisualizationDataPropertiesProps) => {
  const [selectedField, setSelectedField] = useState<Field>();

  const [showDimension, setShowDimension] = useState(false);
  const [showMeasure, setShowMeasure] = useState(false);
  const [properties, setProperty] = useState([]);
  const visualWrap = VisualWrap(props.visual);

  const hierarchyChange = selectedOption => {
    selectedField.hierarchy = props.hierarchies.find(item => {
      return item.id === selectedOption.value;
    });
  };

  const getDimensionList = () => {
    const dimensionList = [];
    props.features.map(item => {
      if (item.featureType === 'DIMENSION') {
        dimensionList.push({ value: item.id, label: item.name })
      };
    });
    return dimensionList;
  };

  const getMeasureList = () => {
    const measureList = [];
    props.features.map(item => {
      if (item.featureType === 'MEASURE') {
        measureList.push({ value: item.id, label: item.name })
      }
    });
    return measureList;
  };
  const dimensionList = getDimensionList();
  const measureList = getMeasureList();

  const selectedFieldChange = (field): any => {
    if (field.fieldType.featureType === 'DIMENSION') {
      setShowDimension(true);
      setShowMeasure(false);
    } else {
      setShowMeasure(true);
      setShowDimension(false);
    }
    setSelectedField(field);
  };

  const addFieldMeasure = () => {
    const fieldType = visualWrap.nextFieldMeasure(props.visual.fields, props.visual.metadataVisual);
    if (fieldType) {
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
      props.addField(props.visual, field);
      setShowMeasure(true);
      setShowDimension(false);
      setSelectedField(field);
    }
  };

  const addFieldDimension = () => {
    const fieldType = visualWrap.nextFieldDimension(props.visual.fields, props.visual.metadataVisual);
    if (fieldType) {
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
      props.addField(props.visual, field);
      setShowDimension(true);
      setShowMeasure(false);
    }
  };

  const featureChange = feature => {
    const selectedFeature = props.features.filter(item => {
      return item.name === feature.label;
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
          <Flex direction="row" justifyContent="space-around">
            <Flex direction="column" gap="size-50" justifyContent="space-around">
              <TooltipTrigger delay={0}>
                <ActionButton onPress={addFieldDimension} isQuiet={true}>
                  <TableAndChart size="XXL" />
                </ActionButton>
                <Tooltip variant="info" showIcon>
                  {'Add Dimension'}
                </Tooltip>
              </TooltipTrigger>
            </Flex>
            <Flex direction="column" gap="size-50" justifyContent="space-around">
              <TooltipTrigger delay={0}>
                <ActionButton onPress={addFieldMeasure} isQuiet={true}>
                  <TableAndChart size="XXL" />
                </ActionButton>
                <Tooltip variant="info" showIcon>
                  {'Add Measure'}
                </Tooltip>
              </TooltipTrigger>
            </Flex>
          </Flex>
        </View>
        <Form>
          <>

            {props.visual.fields &&
              props.visual.fields.length > 0 &&
              props.visual.fields
                .sort((a, b) => (a.fieldType.order > b.fieldType.order ? 1 : -1))
                .map((field, i) => (
                  <View borderRadius="large" key={uuid()} borderWidth={selectedField?.fieldType?.id === field.fieldType.id ? 'thicker' : 'thin'} borderColor="default" >
                    <Flex direction="row" justifyContent="space-between">
                      <Flex direction="column" gap="size-50" justifyContent="space-around">
                        <ActionButton isQuiet={true} onPress={() => {
                          selectedFieldChange(field);
                        }}
                        >
                          <TableAndChart />
                          {field.feature?.name || ''}
                        </ActionButton>
                      </Flex>
                      <Flex direction="column">
                        {field.fieldType.constraint === 'REQUIRED' &&
                          <ActionButton isQuiet={true} isDisabled >
                            <LockClosed />
                          </ActionButton>}
                        {field.fieldType.constraint === 'OPTIONAL' &&
                          <ActionButton isQuiet={true} onPress={() => {
                            props.deleteField(props.visual,field);
                          }}
                          >
                            <Delete />
                          </ActionButton>}

                      </Flex>
                    </Flex>
                  </View>
                ))}
          </>

          {showDimension && (
            <>

              <Select
                onChange={(selected) => {
                  featureChange(selected)
                }}
                className="basic-single"
                classNamePrefix="select"
                value={{ value: selectedField?.feature?.id, label: selectedField?.feature?.name }}
                isSearchable={true}
                name="dimension"
                options={dimensionList}
              />


              {props.hierarchies && props.hierarchies.length > 0 && (
                <Select
                  onChange={hierarchyChange}
                  className="basic-single"
                  classNamePrefix="select"
                  value={{ value: selectedField?.hierarchy?.id, label: selectedField?.hierarchy?.name }}
                  isSearchable={true}
                  name="hierarchy"
                  options={props.hierarchies}
                />
              )}
            </>
          )}

          {showMeasure && (

            <Select
              onChange={(selected) => {
                featureChange(selected)
              }}
              className="basic-single"
              classNamePrefix="select"
              value={{ value: selectedField?.feature?.id, label: selectedField?.feature?.name }}
              isSearchable={true}
              name="measureList"
              options={measureList}
            />

          )}
        </Form>
        <Form>
          {selectedField &&
            selectedField.properties &&
            selectedField.properties.length > 0 &&
            selectedField.properties
              .sort((a, b) => (a.order > b.order ? 1 : -1))
              .map((property, i) => (
                <Properties key={uuid()} property={property} propstyle={'data'} visual={props.visual} features={props.features} />
              ))}
        </Form>
      </View>
    </>
  );
};



const mapStateToProps = (storeState: IRootState) => ({
});

const mapDispatchToProps = {
  addField,
  deleteField
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationDataProperties);

