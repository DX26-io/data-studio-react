import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Grid, View, DialogContainer, Content, Item, ProgressBar, Tabs, TabList, TabPanels } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { translate, Translate } from 'react-jhipster';
import BookmarkSearch from './bookmark-search';
import BookmarkCard from './bookmarks-card';
import BookmarkTable from './bookmarks-table';

export const BookmarksContainer = props => {
  const [tabId, setTabId] = useState<React.Key>(1);

  const tabs = [
    { id: 1, name: 'featureBookmark.tabs.table' },
    { id: 2, name: 'featureBookmark.tabs.cards' },
  ];
  return (
    <View>
      <SecondaryHeader
        breadcrumbItems={[
          { label: translate('home.title'), route: '/' },
          { label: translate('featureBookmark.home.title'), route: '/bookmarks' },
        ]}
        title={translate('featureBookmark.home.title')}
      ></SecondaryHeader>
      <Tabs aria-label="bookmarks" marginStart="size-200">
        <TabList>
          <Item key="1">
            <Translate contentKey="featureBookmark.tabs.table"></Translate>
          </Item>
          <Item key="2">
            <Translate contentKey="featureBookmark.tabs.cards"></Translate>
          </Item>
        </TabList>
        <Content marginTop="size-250" marginEnd="size-125">
          <BookmarkSearch />
          {props.loading ? (
            <ProgressBar label="Loading…" isIndeterminate />
          ) : (
            <TabPanels>
              <Item key="1">
                <Content marginTop="size-250" marginEnd="size-125">
                  <View marginTop="size-250">
                    <BookmarkTable />
                  </View>
                </Content>
              </Item>
              <Item key="2">
                <Content marginTop="size-250" marginEnd="size-125">
                  <View marginTop="size-250">
                    <BookmarkCard />
                  </View>
                </Content>
              </Item>
            </TabPanels>
          )}
        </Content>
      </Tabs>
    </View>
  );
};
const mapStateToProps = (storeState: IRootState) => ({
  loading: storeState.recent.loading,
});

export default connect(mapStateToProps, null)(BookmarksContainer);
