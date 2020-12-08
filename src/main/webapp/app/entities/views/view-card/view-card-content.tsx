import React, { ReactText } from 'react';
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
import { Redirect } from 'react-router-dom';

interface IViewCardContentProps {
  viewDashboard: IDashboard;
  viewName: string;
  description: string;
  viewId: number;
}

const ViewCardContent: React.FC<IViewCardContentProps> = props => {
  const { viewName, viewId, description, viewDashboard } = props;
  const [dialog, setDialog] = React.useState<ReactText>('');

  return (
    <>
      <View padding="size-200">
        <Flex direction="row" justifyContent="space-between">
          <Flex direction="column" gap="size-50" justifyContent="space-around">
            <span className="spectrum-Heading--sizeXS">{viewName}</span>
          </Flex>
          <Flex direction="column">
            <MenuTrigger>
              <ActionButton isQuiet aria-label="more options">
                <MoreSmallListVert size="S" aria-label="Default Alert" />
              </ActionButton>
              <Menu onAction={key => setDialog(key)}>
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
              {dialog === 'delete' &&
              <Redirect
              to={{
                pathname: '/dashboards/' + viewDashboard.id + '/' + viewId + '/delete',
              }}
            />}
            </DialogContainer>
            <DialogContainer type="fullscreenTakeover" onDismiss={() => setDialog(null)}>
              {dialog === 'properties' && (
                <Redirect
                  to={{
                    pathname: '/dashboards/' + viewDashboard.id + '/' + viewId + '/properties',
                  }}
                />
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
