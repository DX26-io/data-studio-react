import React, { ReactText, useState } from 'react';
import { ActionButton, Flex, Item, Menu, MenuTrigger, Section, Text, Tooltip, TooltipTrigger, View } from '@adobe/react-spectrum';
import MoreSmallListVert from '@spectrum-icons/workflow/MoreSmallListVert';
import InfoOutline from '@spectrum-icons/workflow/InfoOutline';
import { Translate } from 'react-jhipster';
import { IDashboard } from 'app/shared/model/dashboard.model';
import { Redirect } from 'react-router-dom';
import { hasAuthority } from 'app/shared/reducers/authentication';

interface IViewCardContentProps {
  viewDashboard: IDashboard;
  viewName: string;
  description: string;
  viewId: number;
  account: any;
  dispatchReleaseRequestProps: (viewId: any) => void;
}

const ViewCardContent: React.FC<IViewCardContentProps> = props => {
  const { viewName, viewId, description, viewDashboard, account, dispatchReleaseRequestProps } = props;
  const [redirect, setRedirect] = useState<ReactText>('');

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
              <Menu
                onAction={key => {
                  setRedirect(key);
                  if (key === 'release') {
                    dispatchReleaseRequestProps(viewId);
                  }
                }}
              >
                <Section title={<Translate contentKey="entity.options.more_options">More options</Translate>}>
                  <Item key="properties">
                    <Text>
                      <Translate contentKey="entity.options.properties">Properties</Translate>
                    </Text>
                  </Item>
                  <Item key="release">
                    <Text>
                      <Translate contentKey="entity.options.release">Release</Translate>
                    </Text>
                  </Item>
                </Section>
                {account && hasAuthority(props.account, 'DELETE_' + viewId + '_VIEW') && (
                  <Section title={<Translate contentKey="entity.options.danger">Danger</Translate>}>
                    <Item key="delete">
                      <Text>
                        <Translate contentKey="entity.options.delete">Delete</Translate>
                      </Text>
                    </Item>
                  </Section>
                )}
              </Menu>
            </MenuTrigger>

            {redirect === 'delete' && (
              <Redirect
                to={{
                  pathname: '/dashboards/' + viewDashboard.id + '/' + viewId + '/delete',
                }}
              />
            )}
            {redirect === 'properties' && (
              <Redirect
                to={{
                  pathname: '/dashboards/' + viewDashboard.id + '/' + viewId + '/properties',
                }}
              />
            )}
            <TooltipTrigger delay={0} placement="end">
              <ActionButton isQuiet={true}>
                <InfoOutline />
              </ActionButton>
              <Tooltip>
                {description ? description : <Translate contentKey="entity.options.no_description"> no description</Translate>}
              </Tooltip>
            </TooltipTrigger>
          </Flex>
        </Flex>
      </View>
    </>
  );
};

export default ViewCardContent;
