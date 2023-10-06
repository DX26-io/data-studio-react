import React, { useEffect, useState, ReactText } from 'react';
import { ActionButton, Flex, Form, View, Content, Item, Button, TextField, Heading, Tabs, TabList, TabPanels } from '@adobe/react-spectrum';
import uuid from 'react-uuid';
import Property from 'app/modules/canvas/visualisation/visualisation-properties/property';
import { VisualWrap } from 'app/modules/canvas/visualisation/util/visualmetadata-wrapper';
import LockClosed from '@spectrum-icons/workflow/LockClosed';
import Delete from '@spectrum-icons/workflow/Delete';
import Select from 'react-select';
import { Field, defaultValue } from 'app/shared/model/field.model';
import { IRootState } from 'app/shared/reducers';
import { addField, deleteField, updateField } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { connect } from 'react-redux';
import { getDataPropertiesTabTranslations } from 'app/modules/canvas/visualisation/visualisation-modal/visualisation-edit-modal/visualisation-edit-modal-util';
import Add from '@spectrum-icons/workflow/Add';
import { generateHierarchiesOptions } from 'app/entities/hierarchy/hierarchy.reducer';
import { getDimensionsList, getMeasuresList } from 'app/entities/feature/feature.reducer';
import { addFieldDimension, addFieldMeasure } from 'app/entities/visualmetadata/visualmetadata-util';
import { translate, Translate } from 'react-jhipster';

export interface IVisualisationDataPropertiesProps extends StateProps, DispatchProps {}

const VisualisationDataProperties = (props: IVisualisationDataPropertiesProps) => {
  const [activeTabId, setActiveTabId] = useState<React.Key>('DIMENSION');
  const [selectedField, setSelectedField] = useState<Field>(null);

  const visualWrap = VisualWrap(props.visual);

  const hierarchyChange = selectedOption => {
    const hierarchy = props.hierarchies.find(item => {
      return item.id === selectedOption.value;
    });
    // selectedField.hierarchy = {};
    selectedField.hierarchy = hierarchy;
    setSelectedField(selectedField);
    props.updateField(props.visual, selectedField);
  };

  const selectFeature = feature => {
    const selectedFeature = props.features.filter(item => {
      return item.name === feature.label;
    });
    selectedField.feature = selectedFeature[0];
    props.updateField(props.visual, selectedField);
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
          <View key={`data-prop-row-${i}`} padding="size-100" marginBottom="size-100" borderColor="default" borderWidth="thin">
            <Flex direction="row" gap="size-100">
              <Button
                variant={selectedField?.fieldType?.id === field.fieldType.id ? 'cta' : 'primary'}
                width={'200px'}
                maxWidth={'200px'}
                onPress={() => setSelectedField(field)}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{field.feature?.name || 'Select'}</span>
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
        <TabList>
          <Item key="DIMENSION">
            <Translate contentKey="datastudioApp.visualmetadata.editConfiguration.properties.dataProperties.dimensions"></Translate>
          </Item>
          <Item key="MEASURE">
            <Translate contentKey="datastudioApp.visualmetadata.editConfiguration.properties.dataProperties.measures"></Translate>
          </Item>
        </TabList>
        <TabPanels>
          <Item key="DIMENSION">
            <Content>
              {' '}
              <View>
                <Flex justifyContent="end">
                  <ActionButton
                    isQuiet
                    onPress={() => {
                      const field = addFieldDimension(visualWrap, props.visual, null);
                      if (field) {
                        props.addField(props.visual, field);
                        setSelectedField(field);
                      }
                    }}
                    marginEnd={'10px'}
                  >
                    <Add size="S" />
                  </ActionButton>
                </Flex>
                <View marginBottom="size-100" marginTop="size-100">
                  {getSelectedFieldsElements}
                </View>
                <Form>
                  {selectedField && (
                    <>
                      <span className="spectrum-Body-emphasis--sizeXXS">
                        {translate('datastudioApp.visualmetadata.editConfiguration.properties.dataProperties.dimensions')}
                      </span>
                      <Select
                        onChange={selected => {
                          selectFeature(selected);
                        }}
                        className="basic-single"
                        classNamePrefix="select"
                        value={{ value: selectedField?.feature?.id, label: selectedField?.feature?.name }}
                        isSearchable={true}
                        name="dimensions"
                        options={getDimensionsList(props.features)}
                      />
                    </>
                  )}
                  {selectedField?.feature?.name && props.hierarchiesOption && props.hierarchiesOption.length > 0 && (
                    <>
                      <span className="spectrum-Body-emphasis--sizeXXS">{translate('hierarchies.hierarchy')}</span>
                      <Select
                        onChange={selected => {
                          hierarchyChange(selected);
                        }}
                        className="basic-single"
                        classNamePrefix="select"
                        value={{ value: selectedField?.hierarchy?.id, label: selectedField?.hierarchy?.name }}
                        isSearchable={true}
                        name="hierarchies"
                        options={props.hierarchiesOption}
                      />
                    </>
                  )}
                </Form>
              </View>
              <Form>
                {selectedField &&
                  selectedField.properties &&
                  selectedField.properties.length > 0 &&
                  selectedField.properties
                    .sort((a, b) => (a.order > b.order ? 1 : -1))
                    .map((property, i) => (
                      <Property key={uuid()} property={property} propertyType={'data'} visual={props.visual} features={props.features} fieldName={selectedField?.feature?.name} />
                    ))}
              </Form>
            </Content>
          </Item>
          <Item key="MEASURE">
            <Content>
              {' '}
              <View>
                <Flex justifyContent="end">
                  <ActionButton
                    isQuiet
                    onPress={() => {
                      const field = addFieldMeasure(visualWrap, props.visual, null);
                      if (field) {
                        props.addField(props.visual, field);
                        setSelectedField(field);
                      }
                    }}
                    marginEnd={'10px'}
                  >
                    <Add size="S" />
                  </ActionButton>
                </Flex>
                <View marginBottom="size-100" marginTop="size-100">
                  {getSelectedFieldsElements}
                </View>
                <Form>
                  {selectedField && (
                    <>
                      <span className="spectrum-Body-emphasis--sizeXXS">
                        {translate('datastudioApp.visualmetadata.editConfiguration.properties.dataProperties.measures')}
                      </span>
                      <Select
                        onChange={selected => {
                          selectFeature(selected);
                        }}
                        className="basic-single"
                        classNamePrefix="select"
                        value={{ value: selectedField?.feature?.id, label: selectedField?.feature?.name }}
                        isSearchable={true}
                        name="measuresList"
                        options={getMeasuresList(props.features)}
                      />
                    </>
                  )}
                </Form>
              </View>
              <Form>
                {selectedField &&
                  selectedField.properties &&
                  selectedField.properties.length > 0 &&
                  selectedField.properties
                    .sort((a, b) => (a.order > b.order ? 1 : -1))
                    .map((property, i) => (
                      <Property key={uuid()} property={property} propertyType={'data'} visual={props.visual} features={props.features} fieldName={selectedField?.feature?.name} />
                    ))}
              </Form>
            </Content>
          </Item>
        </TabPanels>
        {/* {item => (
          <Item title={item.name} key={item.id}>
            <Content>
              {activeTabId === 'DIMENSION' && (
                <View>
                  <Flex justifyContent="end">
                    <ActionButton
                      isQuiet
                      onPress={() => {
                        const field = addFieldDimension(visualWrap, props.visual, null);
                        if (field) {
                          props.addField(props.visual, field);
                          setSelectedField(field);
                        }
                      }}
                      marginEnd={'10px'}
                    >
                      <Add size="S" />
                    </ActionButton>
                  </Flex>
                  <View marginBottom="size-100" marginTop="size-100">
                    {getSelectedFieldsElements}
                  </View>
                  <Form>
                    {selectedField && (
                      <>
                        <span className="spectrum-Body-emphasis--sizeXXS">
                          {translate('datastudioApp.visualmetadata.editConfiguration.properties.dataProperties.dimensions')}
                        </span>
                        <Select
                          onChange={selected => {
                            selectFeature(selected);
                          }}
                          className="basic-single"
                          classNamePrefix="select"
                          value={{ value: selectedField?.feature?.id, label: selectedField?.feature?.name }}
                          isSearchable={true}
                          name="dimensions"
                          options={getDimensionsList(props.features)}
                        />
                      </>
                    )}
                    {selectedField?.feature?.name && props.hierarchiesOption && props.hierarchiesOption.length > 0 && (
                      <>
                        <span className="spectrum-Body-emphasis--sizeXXS">{translate('hierarchies.hierarchy')}</span>
                        <Select
                          onChange={selected => {
                            hierarchyChange(selected);
                          }}
                          className="basic-single"
                          classNamePrefix="select"
                          value={{ value: selectedField?.hierarchy?.id, label: selectedField?.hierarchy?.name }}
                          isSearchable={true}
                          name="hierarchies"
                          options={props.hierarchiesOption}
                        />
                      </>
                    )}
                  </Form>
                </View>
              )}
              {activeTabId === 'MEASURE' && (
                <View>
                  <Flex justifyContent="end">
                    <ActionButton
                      isQuiet
                      onPress={() => {
                        const field = addFieldMeasure(visualWrap, props.visual, null);
                        if (field) {
                          props.addField(props.visual, field);
                          setSelectedField(field);
                        }
                      }}
                      marginEnd={'10px'}
                    >
                      <Add size="S" />
                    </ActionButton>
                  </Flex>
                  <View marginBottom="size-100" marginTop="size-100">
                    {getSelectedFieldsElements}
                  </View>
                  <Form>
                    {selectedField && (
                      <>
                        <span className="spectrum-Body-emphasis--sizeXXS">
                          {translate('datastudioApp.visualmetadata.editConfiguration.properties.dataProperties.measures')}
                        </span>
                        <Select
                          onChange={selected => {
                            selectFeature(selected);
                          }}
                          className="basic-single"
                          classNamePrefix="select"
                          value={{ value: selectedField?.feature?.id, label: selectedField?.feature?.name }}
                          isSearchable={true}
                          name="measuresList"
                          options={getMeasuresList(props.features)}
                        />
                      </>
                    )}
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
                      <Properties key={uuid()} property={property} propertyType={'data'} visual={props.visual} features={props.features} />
                    ))}
              </Form>
            </Content>
          </Item>
        )} */}
      </Tabs>
    </View>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visual: storeState.visualmetadata.entity,
  features: storeState.feature.entities,
  hierarchiesOption: generateHierarchiesOptions(storeState.hierarchies.hierarchies),
  hierarchies: storeState.hierarchies.hierarchies,
});

const mapDispatchToProps = {
  addField,
  deleteField,
  updateField,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationDataProperties);
