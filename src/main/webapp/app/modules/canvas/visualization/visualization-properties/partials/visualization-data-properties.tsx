import React, { useEffect, useState, ReactText } from 'react';
import { ActionButton, Flex, Form, Heading, View, TooltipTrigger, Tooltip, Content, Item, Button } from '@adobe/react-spectrum';
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
import { addField, deleteField } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { connect } from 'react-redux';
import { getDataPropertiesTabTranslations } from 'app/modules/canvas/visualization/visualization-modal/visualization-edit-modal/visualization-edit-modal-util';
import { Tabs } from '@react-spectrum/tabs';
import Add from '@spectrum-icons/workflow/Add';

export interface IVisualizationDataPropertiesProps extends StateProps, DispatchProps {
  features: readonly IFeature[];
  visual: IVisualMetadataSet;
  hierarchies?: Array<any>;
}

const VisualizationDataProperties = (props: IVisualizationDataPropertiesProps) => {
  const [activeTabId, setActiveTabId] = useState<ReactText>('DIMENSION');
  const [selectedField, setSelectedField] = useState<Field>();

  // const [showDimension, setShowDimension] = useState(false);
  // const [showMeasure, setShowMeasure] = useState(false);
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
        dimensionList.push({ value: item.id, label: item.name });
      }
    });
    return dimensionList;
  };

  const getMeasureList = () => {
    const measureList = [];
    props.features.map(item => {
      if (item.featureType === 'MEASURE') {
        measureList.push({ value: item.id, label: item.name });
      }
    });
    return measureList;
  };
  const dimensionList = getDimensionList();
  const measureList = getMeasureList();

  // const selectedFieldChange = (field): any => {
  //   if (field.fieldType.featureType === 'DIMENSION') {
  //     setShowDimension(true);
  //     setShowMeasure(false);
  //   } else {
  //     setShowMeasure(true);
  //     setShowDimension(false);
  //   }
  //   setSelectedField(field);
  // };

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
      // setShowMeasure(true);
      // setShowDimension(false);
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
      // setShowDimension(true);
      // setShowMeasure(false);
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

  const getSelectedFieldsElements =
    props.visual.fields &&
    props.visual.fields.length > 0 &&
    props.visual.fields
      .filter(f => f.fieldType.featureType === activeTabId)
      .sort((a, b) => (a.fieldType.order > b.fieldType.order ? 1 : -1))
      .map((field, i) => {
        return (
          <View key={`data-prop-row-${i}`} marginTop="size-100">
            <Flex direction="row" gap="size-100">
              <Button width={'200px'} variant="primary" onPress={() => setSelectedField(field)}>
                {' '}
                {/* {selectedField?.fieldType?.id === field.fieldType.id ? 'primary' : 'cta'} */}
                {field.feature?.name || 'Select'}
              </Button>
              {field.fieldType.constraint === 'REQUIRED' && (
                <ActionButton isQuiet={true} isDisabled>
                  <LockClosed />
                </ActionButton>
              )}
              {field.fieldType.constraint === 'OPTIONAL' && (
                <ActionButton
                  isQuiet={true}
                  onPress={() => {
                    props.deleteField(props.visual, field);
                  }}
                >
                  <Delete />
                </ActionButton>
              )}
            </Flex>
          </View>
        );
      });

  return (
    <View>
      {' '}
      <Tabs
        isQuiet={true}
        density={'compact'}
        position={'sticky'}
        items={getDataPropertiesTabTranslations()}
        onSelectionChange={key => {
          setActiveTabId(key);
          setSelectedField(null);
        }}
      >
        {item => (
          <Item title={item.name} key={item.id}>
            <Content>
              {activeTabId === 'DIMENSION' && (
                <View>
                  <Flex justifyContent="end">
                    <ActionButton isQuiet onPress={addFieldDimension}>
                      <Add size="S" />
                    </ActionButton>
                  </Flex>
                  <View marginBottom="size-150">{getSelectedFieldsElements}</View>
                  <Form>
                    <Select
                      onChange={selected => {
                        featureChange(selected);
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
                  </Form>
                </View>
              )}
              {activeTabId === 'MEASURE' && (
                <View>
                  <Flex justifyContent="end">
                    <ActionButton isQuiet onPress={addFieldMeasure}>
                      <Add size="S" />
                    </ActionButton>
                  </Flex>
                  <View marginBottom="size-150">{getSelectedFieldsElements}</View>
                  <Form>
                    <Select
                      onChange={selected => {
                        featureChange(selected);
                      }}
                      className="basic-single"
                      classNamePrefix="select"
                      value={{ value: selectedField?.feature?.id, label: selectedField?.feature?.name }}
                      isSearchable={true}
                      name="measureList"
                      options={measureList}
                    />
                  </Form>
                </View>
              )}
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
            </Content>
          </Item>
        )}
      </Tabs>
    </View>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {
  addField,
  deleteField,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationDataProperties);
