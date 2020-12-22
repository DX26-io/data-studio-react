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
  Text
} from '@adobe/react-spectrum';
import { IVisualizations } from 'app/shared/model/visualizations.model';
import TableAndChart from '@spectrum-icons/workflow/TableAndChart';
import { IViews } from 'app/shared/model/views.model';

interface IVisualizationsListProps {
  visualizations: IVisualizations[];
  handleVisualizationClick: (visualization) => void;
  view: IViews;
}
export const VisualizationsList = (props: IVisualizationsListProps) => {
  const { handleVisualizationClick } = props;

  const createFields = newVM => {
   // let order = 0;
    newVM.fields = newVM.metadataVisual.fieldTypes
      .filter(function (item) {
        return item.constraint === 'REQUIRED';
      })
      .map(function (item) {
        return {
          fieldType: item,
          feature: null,
          constraint: item.constraint,
        };
      });
    // newVM.fields.forEach(function (field) {
    //   Visualizations.getFieldType(
    //     {
    //       id: newVM.metadataVisual.id,
    //       fieldTypeId: field.fieldType.id,
    //     },
    //     function (result) {
    //       field.fieldType = result;
    //       field.order = order + 1;
    //       field.properties = field.fieldType.propertyTypes.map(function (item) {
    //         return {
    //           propertyType: item.propertyType,
    //           value: item.propertyType.defaultValue,
    //           type: item.propertyType.type,
    //           order: item.order,
    //         };
    //       });
    //     },
    //     function (error) {}
    //   );
    // });

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
      width: 5,
      w: 5,
      xPosition: 0,
      x:0,
      height: 5,
      h: 5,
      yPosition: 1000,
      y:1000,
      metadataVisual: visualization,
      views: props.view,
      datasource: props.view.viewDashboard.dashboardDatasource.id,
    };
    newVM = createProperties(newVM);
    newVM = createFields(newVM);
    return newVM;
  };

  const addWidget = viz => {
    handleVisualizationClick(createVisualMetadata(viz));
  };
  return (
    <Dialog>
      <Heading>Select Visualizations</Heading>
      <Divider />
      <Content>
        <Flex direction="row" gap="size-100" wrap>
          {props.visualizations &&
            props.visualizations.length > 0 &&
            props.visualizations.map(viz => (
              <Flex alignItems="center" justifyContent="center">
<View alignSelf={"center"} key={viz.id} width="size-1700" height="size-1700" borderWidth="thin" borderColor="default" borderRadius="regular">
                <TooltipTrigger delay={0}>
                  <ActionButton alignSelf={"center"} onPress={() => addWidget(viz)} aria-label="Information" height="size-800" width="size-800">
                    <TableAndChart size="XL" />
                    
                  </ActionButton>
                
                  <Tooltip variant="info" showIcon>
                    {viz.name}
                  </Tooltip>
                </TooltipTrigger>
                <View>
                <Text>{viz.name}</Text>
                </View>
               
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
