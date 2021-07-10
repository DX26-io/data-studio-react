import React, { ReactText, useState } from 'react';
import { ActionButton, Flex, Item, Menu, MenuTrigger, Section, Text, Tooltip, TooltipTrigger, View } from '@adobe/react-spectrum';
import MoreSmallListVert from '@spectrum-icons/workflow/MoreSmallListVert';
import InfoOutline from '@spectrum-icons/workflow/InfoOutline';
import { Translate } from 'react-jhipster';
import { IDashboard } from 'app/shared/model/dashboard.model';
import {Redirect, RouteComponentProps} from 'react-router-dom';
import { hasAuthority } from 'app/shared/reducers/authentication';
import {exportView} from "app/entities/views/views.reducer";
import {connect} from "react-redux";
import {IRootState} from "app/shared/reducers";

export interface IViewCardContentProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string; viewId: string }> {
  viewDashboard: IDashboard;
  viewName: string;
  description: string;
  viewId: number;
  account: any;
  dispatchReleaseRequestProps: (viewId: any) => void;
}

const ViewCardContent = (props: IViewCardContentProps) => {

  const { viewName, viewId, description, viewDashboard, account,dispatchReleaseRequestProps } = props;

  const [redirect, setRedirect] = useState<ReactText>('');

  const onMenuAction = (key) => {
    if (key === 'export') {
      props.exportView(viewId);
    } else {
      setRedirect(key);
    }
  }

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
              <Menu onAction={key => {
                    onMenuAction(key);
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
                  {account && hasAuthority(props.account, 'REQUEST-PUBLISH_' + viewId + '_VIEW') && (
                    <Item key="release">
                      <Text>
                        <Translate contentKey="entity.options.release">Release</Translate>
                      </Text>
                    </Item>
                  )}
                  <Item key="export">
                    <Text>
                      <Translate contentKey="entity.options.export">_Export</Translate>
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

const mapDispatchToProps = {
  exportView,
}

const mapStateToProps = (storeState: IRootState) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ViewCardContent);
