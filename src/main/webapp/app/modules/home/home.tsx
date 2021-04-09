import './home.scss';

import React, { useEffect, useState, ReactText } from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, Heading, Text, View, Content, Item } from '@adobe/react-spectrum';
import ViewGrid from '@spectrum-icons/workflow/ViewGrid';

import { useHistory } from 'react-router-dom';
import User from '@spectrum-icons/workflow/User';
import { setIsHome } from 'app/modules/home/home.reducer';
import { Tabs } from '@react-spectrum/tabs';
import { translate } from 'react-jhipster';
import { RouteComponentProps } from 'react-router-dom';
import QuickStart from './sections/quick-start';
import Admin from './sections/admin';
import RecentlyAccessed from "./sections/recently-accessed";
import RecentlyCreated from "./sections/recently-created";

export interface IHomeProp extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const Home = (props: IHomeProp) => {
  const history = useHistory();
  const { account } = props;
  const [topTabId, setTopTabId] = useState<ReactText>();
  const [bottomTabId, setBottomTabId] = useState<ReactText>();

  useEffect(() => {
    props.setIsHome(true);
    return () => {
      props.setIsHome(false);
    };
  }, []);

  const topTabs = [
    { id: 1, name: 'home.top.tabs.quickStart.title' },
    { id: 2, name: 'home.top.tabs.admin' },
  ];

  const bottomTabs = [
    { id: 1, name: 'home.bottom.tabs.accessed.title' },
    { id: 2, name: 'home.bottom.tabs.created.title' },
  ];

  return (
    <View padding={'size-150'}>
      <Tabs aria-label="top-tabs" items={topTabs} selectedKey={topTabId} onSelectionChange={setTopTabId}>
        {item => (
          <Item title={translate(item.name)}>
            <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
              {topTabId === 1 ? (
                <View>
                  <QuickStart />
                </View>
              ) : (
                <View>
                  <Admin />
                </View>
              )}
            </Content>
          </Item>
        )}
      </Tabs>
      <br/>
      <Tabs aria-label="bottom-tabs" items={bottomTabs} selectedKey={bottomTabId} onSelectionChange={setBottomTabId}>
        {item => (
          <Item title={translate(item.name)}>
            <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
              {bottomTabId === 1 ? (
                <View>
                  <RecentlyAccessed />
                </View>
              ) : (
                <View>
                  <RecentlyCreated />
                </View>
              )}
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
