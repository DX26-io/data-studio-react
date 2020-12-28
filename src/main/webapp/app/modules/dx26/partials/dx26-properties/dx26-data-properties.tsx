import React, { useEffect, useState } from 'react';
import { ActionButton, Flex, Heading, Item, ListBox, View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import TableAndChart from '@spectrum-icons/workflow/TableAndChart';
import { IFeature } from 'app/shared/model/feature.model';
import { IVisualMetadataSet } from 'app/shared/model/visualMetadata.model';
import Properties from 'app/modules/dx26/partials/properties';

export interface IDx26DataPropertiesProps extends StateProps, DispatchProps {
  features: IFeature[];
  visual: IVisualMetadataSet;
}

const Dx26DataProperties = (props: IDx26DataPropertiesProps) => {
  const [selected, setSelected] = useState(new Set());
  const selectedField = props.visual.fields[0];
  useEffect(() => {}, [selected]);

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
        <View>
          <ListBox onSelectionChange={val => setSelected(val)} aria-label="Options" selectionMode="single">
            {props.visual.fields &&
              props.visual.fields.length > 0 &&
              props.visual.fields
                .sort((a, b) => (a.fieldType.order > b.fieldType.order ? 1 : -1))
                .map(field => <Item key={field.feature.id}>{field.feature.name}</Item>)}
          </ListBox>
        </View>
        <View>
          {selectedField.properties &&
            selectedField.properties.length > 0 &&
            selectedField.properties
              .sort((a, b) => (a.order > b.order ? 1 : -1))
              .map(property => (
                <Properties key={property.id} property={property} propstype={'data'} visual={props.visual} features={props.features} />
              ))}
        </View>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dx26DataProperties);
