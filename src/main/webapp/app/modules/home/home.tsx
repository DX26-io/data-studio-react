import './home.scss';

import React, { useEffect, useState, ReactText } from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, Heading, Text, View, Content, Item } from '@adobe/react-spectrum';
import ViewGrid from '@spectrum-icons/workflow/ViewGrid';

import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { useHistory } from 'react-router-dom';
import User from '@spectrum-icons/workflow/User';
import { setIsHome } from 'app/modules/home/home.reducer';
import { Tabs } from '@react-spectrum/tabs';
import { translate } from 'react-jhipster';

export interface IHomeProp extends StateProps, DispatchProps {}

// TODO: Test Cases
export const Home = (props: IHomeProp) => {
  const history = useHistory();
  const { account } = props;
  const [tabId, setTabId] = useState<ReactText>();

  useEffect(() => {
    props.setIsHome(true);
    return () => {
      props.setIsHome(false);
    };
  }, []);

  const tabs = [
    { id: 1, name: 'home.tabs.top.quickStart' },
    { id: 2, name: 'home.tabs.top.admin' },
    // { id: 3, name: 'home.tabs.top.quickView' },
  ];

  return (
    <View padding={'size-150'}>
      <Flex justifyContent={'center'} alignItems={'center'} direction={'column'}>
        <View>
          <Heading level={2}>
            You are logged in as &quot;<span className="username">{account.login}</span>&quot;
          </Heading>
        </View>
        <ActionButton onPress={() => history.push('/dashboards')}>
          <ViewGrid />
          <Text>Dashboards</Text>
        </ActionButton>
        <ActionButton onPress={() => history.push('/administration/user-management')} marginY="size-100">
          <ViewGrid />
          <Text>User Management</Text>
        </ActionButton>
        <ActionButton onPress={() => history.push('/administration/sources')} marginY="size-100">
          <ViewGrid />
          <Text>Sources</Text>
        </ActionButton>
      </Flex>

      <Tabs aria-label="top-tabs" items={tabs} selectedKey={tabId} onSelectionChange={setTabId}>
        {item => (
          <Item title={translate(item.name)}>
            <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
              {tabId === 1 ? <View></View> : <View></View>}
            </Content>
          </Item>
        )}
      </Tabs>
    </View>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

const mapDispatchToProps = { setIsHome };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Home);
