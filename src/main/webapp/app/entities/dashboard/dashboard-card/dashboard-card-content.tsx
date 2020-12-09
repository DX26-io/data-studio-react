import React, { ReactText } from 'react';
import { ActionButton, Flex, Item, Menu, MenuTrigger, Section, Text, Tooltip, TooltipTrigger, View } from '@adobe/react-spectrum';
import MoreSmallListVert from '@spectrum-icons/workflow/MoreSmallListVert';
import InfoOutline from '@spectrum-icons/workflow/InfoOutline';
import { Translate } from 'react-jhipster';
import { Redirect } from 'react-router-dom';

interface IDashboardCardContentProps {
  dashboardName: string;
  dashboardType: string;
  dashboardDescription: string;
  dashboardId: number;
  datasource: string;
}

const DashboardCardContent: React.FC<IDashboardCardContentProps> = props => {
  const { dashboardName, dashboardType, dashboardDescription, dashboardId } = props;
  const [redirect, setRedirect] = React.useState<ReactText>('');

  return (
    <>
      <View padding="size-200">
        <Flex direction="row" justifyContent="space-between">
          <Flex direction="column" gap="size-50" justifyContent="space-around">
            <span className="spectrum-Detail spectrum-Detail--sizeS">
              <span className="spectrum-Detail--light">{dashboardType}</span>
            </span>
            <span className="spectrum-Heading--sizeXS">{dashboardName}</span>
          </Flex>
          <Flex direction="column">
            <MenuTrigger>
              <ActionButton isQuiet aria-label="more options">
                <MoreSmallListVert size="S" aria-label="Default Alert" />
              </ActionButton>
              <Menu onAction={key => setRedirect(key)}>
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
            <TooltipTrigger delay={0} placement="end">
              <ActionButton isQuiet={true}>
                <InfoOutline />
              </ActionButton>
              <Tooltip>
                {dashboardDescription ? (
                  dashboardDescription
                ) : (
                  <Translate contentKey="dashboard.dashboard_card.no_description"> no description</Translate>
                )}
              </Tooltip>
            </TooltipTrigger>
          </Flex>
        </Flex>
      </View>
      {redirect === 'delete' && (
        <Redirect
          to={{
            pathname: '/dashboards/' + dashboardId + '/delete',
          }}
        />
      )}
      {redirect === 'properties' && (
        <Redirect
          to={{
            pathname: '/dashboards/' + dashboardId + '/properties',
          }}
        />
      )}
    </>
  );
};

export default DashboardCardContent;
