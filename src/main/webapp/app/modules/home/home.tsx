import './home.scss';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { View, Content, Item, Tabs, TabList, TabPanels } from '@adobe/react-spectrum';
import { setIsHome, updateSearchedText } from 'app/modules/home/home.reducer';
import { Translate } from 'react-jhipster';
import { RouteComponentProps } from 'react-router-dom';
import QuickStart from './sections/quick-start';
import Admin from './sections/admin';
import SuperAdmin from './sections/super-admin';
import Root from './sections/root';
import RecentlyAccessed from './sections/recently-accessed';
import RecentlyCreated from './sections/recently-created';
import SearchResult from './sections/search-results';
import { isAdminUser, isEnterpriseAndSuperadminUser, isRootUser } from 'app/shared/util/common-utils';
import  TestWebSocketIO  from "./test-web-socket-io";


export interface IHomeProp extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const Home = (props: IHomeProp) => {
  const { account } = props;

  useEffect(() => {
    props.setIsHome(true);
    return () => {
      props.setIsHome(false);
      props.updateSearchedText('');
    };
  }, []);

  return (
    <View padding={'size-150'}>
      <TestWebSocketIO />
      {props.searchedText ? (
        <SearchResult match={props.match} />
      ) : (
        <React.Fragment>
          {' '}
          <Tabs aria-label="top-tabs">
            <TabList>
              <Item key="1">
                <Translate contentKey="home.top.tabs.quickStart.title"></Translate>
              </Item>
              {(isRootUser(account) || isAdminUser(account) || isEnterpriseAndSuperadminUser(account)) && (
                <Item key="2">
                  <Translate contentKey="home.top.tabs.admin"></Translate>
                </Item>
              )}
              {isRootUser(account) && (
                <Item key="3">
                  <Translate contentKey="home.top.tabs.root"></Translate>
                </Item>
              )}
              {isEnterpriseAndSuperadminUser(account) && (
                <Item key="4">
                  <Translate contentKey="home.top.tabs.superadmin"></Translate>
                </Item>
              )}
            </TabList>
            <TabPanels>
              <Item key="1">
                <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
                  <View>
                    <QuickStart />
                  </View>
                </Content>
              </Item>
              <Item key="2">
                <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
                  <View>
                    <Admin />
                  </View>
                </Content>
              </Item>
              <Item key="3">
                <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
                  <View>
                    <Root />
                  </View>
                </Content>
              </Item>
              <Item key="4">
                <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
                  <View>
                    <SuperAdmin />
                  </View>
                </Content>
              </Item>
            </TabPanels>
          </Tabs>
          <br />
          <Tabs aria-label="bottom-tabs">
            <TabList>
              <Item key="1">
                <Translate contentKey="home.bottom.tabs.accessed.title"></Translate>
              </Item>
              <Item key="2">
                <Translate contentKey="home.bottom.tabs.created.title"></Translate>
              </Item>
            </TabList>
            <TabPanels>
              <Item key="1">
                <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
                  <View>
                    <RecentlyAccessed />
                  </View>
                </Content>
              </Item>
              <Item key="2">
                <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
                  <View>
                    <RecentlyCreated />
                  </View>
                </Content>
              </Item>
            </TabPanels>
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
