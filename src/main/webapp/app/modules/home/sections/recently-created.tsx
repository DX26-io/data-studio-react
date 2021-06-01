import React, { useEffect, useState, ReactText } from 'react';
import { connect } from 'react-redux';
import { Item, Content, View, Flex, ProgressBar } from '@adobe/react-spectrum';
import { Tabs } from '@react-spectrum/tabs';
import { translate } from 'react-jhipster';
import { getRecentlyCreatedViews, getRecentlyCreatedBookmarks } from './recent.reducer';
import ViewCardContent from 'app/entities/views/view-card/view-card-content';
import ViewCardThumbnail from 'app/entities/views/view-card/view-card-thumbnail';
import Card from 'app/shared/components/card/card';

export interface IRecentlyCreatedProps extends StateProps, DispatchProps {}

const RecentlyCreated = (props: IRecentlyCreatedProps) => {
  const [tabId, setTabId] = useState<ReactText>('1');

  const tabs = [
    { id: 1, name: 'home.bottom.tabs.created.tabs.recentlyCreatedViews' },
    { id: 2, name: 'home.bottom.tabs.created.tabs.recentlyCreatedBookmarks' },
  ];

  const recentlyCreated = {
    '1': {
      getData() {
        props.getRecentlyCreatedViews();
      },
    },
    '2': {
      getData() {
        // TODO
        // props.getRecentlyCreatedBookmarks(0, 5, 'watchCreatedTime,desc');
      },
    },
  };

  const recentlyCreatedViewsListElement = props.recentlyCreatedViews.map(view => {
    return (
      <Card
        key={view.id}
        thumbnail={
          <View height="size-3200">
            <ViewCardThumbnail thumbnailImagePath={view.imageLocation} viewName={view.viewName} url=''/>
          </View>
        }
        content={
          <ViewCardContent viewDashboard={view.viewDashboard} description={view.description} viewName={view.viewName} viewId={view.id} account={props.account} />
        }
      />
    );
  });

  useEffect(() => {
    recentlyCreated[tabId].getData();
  }, [tabId]);

  return (
    <Tabs aria-label="recent-tabs" items={tabs} selectedKey={tabId} onSelectionChange={setTabId}>
      {item => (
        <Item title={translate(item.name)}>
          <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
            {props.loading ? (
              <ProgressBar label="Loading…" isIndeterminate />
            ) : (
              <View>
                <Flex direction="row" gap="size-500" alignItems="start" justifyContent="start" wrap>
                  {tabId === 1 && props.recentlyCreatedViews.length > 0 ? recentlyCreatedViewsListElement : null}
                  {/* TODO : recent bookmark will be implemented when build page is completely done*/}
                </Flex>
              </View>
            )}
          </Content>
        </Item>
      )}
    </Tabs>
  );
};

const mapStateToProps = storeState => ({
  recentlyCreatedViews: storeState.recent.recentlyCreatedViews,
  loading: storeState.recent.loading,
  account: storeState.authentication.account
});

const mapDispatchToProps = { getRecentlyCreatedViews, getRecentlyCreatedBookmarks };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RecentlyCreated);
