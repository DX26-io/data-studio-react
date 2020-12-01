import React from 'react';
import {
  ActionButton,
  Flex,
  Item,
  Menu,
  MenuTrigger,
  Section,
  Text,
  Tooltip,
  TooltipTrigger,
  View,
  DialogContainer,
} from '@adobe/react-spectrum';
import MoreSmallListVert from '@spectrum-icons/workflow/MoreSmallListVert';
import InfoOutline from '@spectrum-icons/workflow/InfoOutline';
import { Translate } from 'react-jhipster';
import ViewDeleteModal from '../view-delete-modal';
import ViewPropertiesModal from '../view-properties-modal';
import { IDashboard } from 'app/shared/model/dashboard.model';

interface IDashboardCardContentProps {
  viewDashboard: IDashboard;
  viewName: string;
  description: string;
  viewId: number;
}

const ViewCardContent: React.FC<IDashboardCardContentProps> = props => {
  const { viewName, viewId, description, viewDashboard } = props;
  const [dialog, setDialog] = React.useState();

  return (
    <>
      <View padding="size-200">
        <Flex direction="row" justifyContent="space-between">
          <Flex direction="column" gap="size-50" justifyContent="space-around">
            <span className="spectrum-Heading--XS">{viewName}</span>
          </Flex>
          <Flex direction="column">
            <MenuTrigger>
              <ActionButton isQuiet aria-label="more options">
                <MoreSmallListVert size="S" aria-label="Default Alert" />
              </ActionButton>
              <Menu onAction={setDialog}>
                <Section title={<Translate contentKey="dashboard.dashboard_card.options.more_options">More options</Translate>}>
                  <Item key="properties">
                    <Text>
                      <Translate contentKey="dashboard.dashboard_card.options.properties">Properties</Translate>
                    </Text>
                  </Item>
                  <Item key="release">
                    <Text>
                      <Translate contentKey="dashboard.dashboard_card.options.release">Release</Translate>
                    </Text>
                  </Item>
                </Section>
                <Section title={<Translate contentKey="dashboard.dashboard_card.options.danger">Danger</Translate>}>
                  <Item key="delete">
                    <Text>
                      <Translate contentKey="dashboard.dashboard_card.options.delete">Delete</Translate>
                    </Text>
                  </Item>
                </Section>
              </Menu>
            </MenuTrigger>
            <DialogContainer onDismiss={() => setDialog(null)}>
              {dialog === 'delete' && <ViewDeleteModal viewName={viewName} viewId={viewId} />}
            </DialogContainer>
            <DialogContainer type="fullscreenTakeover" onDismiss={() => setDialog(null)}>
              {dialog === 'properties' && (
                <ViewPropertiesModal viewName={viewName} description={description} viewId={viewId} viewDashboard={viewDashboard} />
              )}
            </DialogContainer>
            <TooltipTrigger delay={0} placement="end">
              <ActionButton isQuiet={true}>
                <InfoOutline />
              </ActionButton>
              <Tooltip>
                {viewName ? viewName : <Translate contentKey="dashboard.dashboard_card.no_description"> no description</Translate>}
              </Tooltip>
            </TooltipTrigger>
          </Flex>
        </Flex>
      </View>
    </>
  );
};

export default ViewCardContent;
