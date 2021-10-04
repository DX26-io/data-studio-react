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
import { IVisualisations } from 'app/shared/model/visualisations.model';
import TableAndChart from '@spectrum-icons/workflow/TableAndChart';
import { IViews } from 'app/shared/model/views.model';
import { createVisualMetadata } from './visualisations-util';

export interface IVisualisationsListProps {
  visualisations?: readonly IVisualisations[];
  handleVisualisationClick?: (visualisation) => void;
  view?: IViews;
  totalItem?: number;
  setVisualisationsModelOpen: (boolean) => void;
}
export const VisualisationsList = (props: IVisualisationsListProps) => {
  const { handleVisualisationClick } = props;

  const addWidget = viz => {
    handleVisualisationClick(createVisualMetadata(viz, props.view, props.totalItem));
  };
  return (
    <Dialog>
      <Heading>Select visualisations</Heading>
      <Divider />
      <Content>
        <Flex direction="row" gap="size-250" wrap alignItems="center" justifyContent="start">
          {props.visualisations &&
            props.visualisations.length > 0 &&
            props.visualisations.map(viz => (
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
        <Button onPress={() => props.setVisualisationsModelOpen(false)} variant="secondary">
          Cancel
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};

export default VisualisationsList;
