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
import { createVisualMetadata } from './visualizations-util';

export interface IVisualizationsListProps {
  visualizations?: readonly IVisualizations[];
  handleVisualizationClick?: (visualization) => void;
  view?: IViews;
  totalItem?: number;
  setVisualizationsModelOpen: (boolean) => void;
}
export const VisualizationsList = (props: IVisualizationsListProps) => {
  const { handleVisualizationClick } = props;

  const addWidget = viz => {
    handleVisualizationClick(createVisualMetadata(viz, props.view, props.totalItem));
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
        <Button onPress={() => props.setVisualizationsModelOpen(false)} variant="secondary">
          Cancel
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};

export default VisualizationsList;
