import React from 'react';
import {
  Tooltip,
  Flex,
  Dialog,
  Heading,
  Divider,
  Content,
  ButtonGroup,
  Button,
  View,
  TooltipTrigger,
  ActionButton,
  Text,
} from '@adobe/react-spectrum';
import { IVisualizations } from 'app/shared/model/visualizations.model';
import TableAndChart from '@spectrum-icons/workflow/TableAndChart';
import { IViews } from 'app/shared/model/views.model';
import { VisualWrap } from 'app/modules/canvas/visualization/util/visualmetadata-wrapper';

interface IVisualizationsListProps {
  visualizations?: readonly IVisualizations[];
  handleVisualizationClick?: (visualization) => void;
  view?: IViews;
  totalItem?: number;
}
export const VisualizationsList = (props: IVisualizationsListProps) => {
  const { handleVisualizationClick } = props;

  const createFields = newVM => {
    let order = 0;
    newVM.fields = newVM.metadataVisual.fieldTypes
      .filter(function (item) {
        return item.constraint === 'REQUIRED';
      })
      .map(function (item) {
        return {
          fieldType: item,
          feature: null,
          constraint: item.constraint,
          properties: item.propertyTypes,
        };
      });
    newVM.fields.forEach(function (field) {
      field.fieldType = field.fieldType;
      field.order = order + 1;
      field.properties = field.fieldType.propertyTypes.map(function (item) {
        return {
          propertyType: item.propertyType,
          value: item.propertyType.defaultValue,
          type: item.propertyType.type,
          order: item.order,
        };
      });
    });

    return newVM;
  };

  const createProperties = newVM => {
    newVM.properties = newVM.metadataVisual.propertyTypes.map(function (item) {
      return {
        propertyType: item.propertyType,
        value: item.propertyType.defaultValue,
        order: item.order,
        type: item.propertyType.type,
      };
    });
    return newVM;
  };

  const createVisualMetadata = visualization => {
    let newVM = {
      isCardRevealed: true,
      isSaved: false,
      viewId: props.view.id,
      titleProperties: {
        titleText: visualization.name,
        backgroundColor: '#fafafa',
        borderBottom: 'none',
        color: '#676a6c',
      },
      bodyProperties: {
        opacity: 1,
        backgroundColor: '#ffffff',
        border: 'none',
      },
      visualBuildId: visualization.id + 'a' + Math.round(Math.random() * 1000000),
      width: 1,
      w: 1,
      xPosition: (props.totalItem * 2) % (3 || 12),
      x: (props.totalItem * 2) % (3 || 12),
      height: 3,
      h: 3,
      yPosition: 0,
      y: 0,
      metadataVisual: visualization,
      views: props.view,
      datasource: props.view.viewDashboard.dashboardDatasource.id,
    };
    newVM = createProperties(newVM);
    newVM = createFields(newVM);
    return VisualWrap(newVM);
  };

  const addWidget = viz => {
    handleVisualizationClick(createVisualMetadata(viz));
  };
  return (
    <Dialog>
      <Heading>Select Visualizations</Heading>
      <Divider />
      <Content>
        <Flex direction="row" gap="size-250" wrap alignItems="center" justifyContent="start">
          {props.visualizations &&
            props.visualizations.length > 0 &&
            props.visualizations.map(viz => (
              <Flex key={viz.id} gap="size-250" alignItems="center" justifyContent="center" height="size-2000" width="size-3000">
                <View borderWidth="thin" borderColor="default" borderRadius="regular">
                  <TooltipTrigger delay={0}>
                    <ActionButton
                      alignSelf="end"
                      height="size-1600"
                      width="size-3000"
                      isQuiet={true}
                      onPress={() => addWidget(viz)}
                      aria-label="Information"
                    >
                      <TableAndChart size="XXL" />
                    </ActionButton>
                    <Tooltip variant="info" showIcon>
                      {viz.name}
                    </Tooltip>
                  </TooltipTrigger>
                  <Divider size="S" />
                  <Text margin={'size-100'} alignSelf={'center'}>
                    {' '}
                    {viz.name}
                  </Text>
                </View>
              </Flex>
            ))}
        </Flex>
      </Content>
      <ButtonGroup>
        <Button variant="secondary">Cancel</Button>
      </ButtonGroup>
    </Dialog>
  );
};

export default VisualizationsList;
