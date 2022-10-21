import './home.scss';

import React, { useEffect, useState, ReactText } from 'react';
import { connect } from 'react-redux';
import { View, Content, Item } from '@adobe/react-spectrum';
import { setIsHome, updateSearchedText } from 'app/modules/home/home.reducer';
import { Tabs } from '@react-spectrum/tabs';
import { translate } from 'react-jhipster';
import { RouteComponentProps } from 'react-router-dom';
import QuickStart from './sections/quick-start';
import Admin from './sections/admin';
import SuperAdmin from './sections/super-admin';
import Root from './sections/root';
import RecentlyAccessed from './sections/recently-accessed';
import RecentlyCreated from './sections/recently-created';
import SearchResult from './sections/search-results';
import { getTabs } from './home.util';

export interface IHomeProp extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const Home = (props: IHomeProp) => {
  const { account } = props;
  const [topTabId, setTopTabId] = useState<ReactText>();
  const [bottomTabId, setBottomTabId] = useState<ReactText>();

  useEffect(() => {
    props.setIsHome(true);
    return () => {
      props.setIsHome(false);
      props.updateSearchedText('');
    };
  }, []);

  const bottomTabs = [
    { id: 1, name: 'home.bottom.tabs.accessed.title' },
    { id: 2, name: 'home.bottom.tabs.created.title' },
  ];

  return (
    <View padding={'size-150'}>
      {props.searchedText ? (
        <SearchResult match={props.match} />
      ) : (
        <React.Fragment>
          {' '}
          <Tabs aria-label="top-tabs" items={getTabs(account)} selectedKey={topTabId} onSelectionChange={setTopTabId}>
            {/* 
// @ts-ignore */}
            {item => (
              <Item title={translate(item.name)}>
                <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
                  {topTabId === 1 && (
                    <View>
                      <QuickStart />
                    </View>
                  )}
                  {topTabId === 2 && (
                    <View>
                      <Admin />
                    </View>
                  )}
                  {topTabId === 3 && (
                    <View>
                      <SuperAdmin />
                    </View>
                  )}
                  {topTabId === 4 && (
                    <View>
                      <Root />
                    </View>
                  )}
                </Content>
              </Item>
            )}
          </Tabs>
          <br />
          <Tabs aria-label="bottom-tabs" items={bottomTabs} selectedKey={bottomTabId} onSelectionChange={setBottomTabId}>
            {/* 
// @ts-ignore */}
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
        </React.Fragment>
      )}
    </View>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
  searchedText: storeState.home.searchedText,
});

const mapDispatchToProps = { setIsHome, updateSearchedText };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Home);
