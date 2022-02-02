import React, { useState, ReactText } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Grid, View, DialogContainer, Content, Item, ProgressBar } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { translate } from 'react-jhipster';
import BookmarkSearch from './bookmark-search';
import { Tabs } from '@react-spectrum/tabs';
import BookmarkCard from './bookmarks-card';
import BookmarkTable from './bookmarks-table';


export const BookmarksContainer = (props) => {
  const [tabId, setTabId] = useState<ReactText>(1);

  const tabs = [
    { id: 1, name: 'featureBookmark.tabs.table' },
    { id: 2, name: 'featureBookmark.tabs.cards' },
  ];
  return (
    <View marginTop="size-200" marginStart="size-125" marginEnd="size-125">
      <SecondaryHeader
        breadcrumbItems={[
          { label: translate('home.title'), route: '/' },
          { label: translate('featureBookmark.home.title'), route: '/bookmarks' },
        ]}
        title={translate('featureBookmark.home.title')}
      ></SecondaryHeader>
      <Tabs aria-label="roles" items={tabs} selectedKey={tabId} onSelectionChange={setTabId}>
        {item => (
          <Item title={translate(item.name)}>
            <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
              <BookmarkSearch />
              {props.loading && <ProgressBar label="Loading…" isIndeterminate />}
              {tabId === 1 ? <BookmarkTable /> : <BookmarkCard />}
            </Content>
          </Item>
        )}
      </Tabs>
    </View>
  );
};
const mapStateToProps = (storeState: IRootState) => ({
  loading: storeState.recent.loading,
});

export default connect(mapStateToProps, null)(BookmarksContainer);
