import React, { useEffect, useState, ReactText } from 'react';
import { connect } from 'react-redux';
import { Item, Content, View, Flex, ProgressBar, DialogContainer, Tabs, TabList, TabPanels } from '@adobe/react-spectrum';
import { translate, Translate } from 'react-jhipster';
import { getMostPopularViews, getRecentlyAccessedBookmarks, getRecentViews } from './recent.reducer';
import ViewCardContent from 'app/entities/views/view-card/view-card-content';
import ViewCardThumbnail from 'app/entities/views/view-card/view-card-thumbnail';
import Card from 'app/shared/components/card/card';
import ViewRequestReleaseDialog from 'app/entities/views/view-request-release-modal';

export interface IRecentlyAccessedProps extends StateProps, DispatchProps {}

const RecentlyAccessed = (props: IRecentlyAccessedProps) => {
  const [isRequestReleaseDialogOpen, setRequestReleaseDialogOpen] = useState<boolean>(false);
  const [requestReleaseViewId, setRequestReleaseViewId] = useState();

  const recentlyAccessed = {
    '1': {
      getData() {
        props.getRecentViews(0, 5, 'watchTime,desc');
      },
    },
    '2': {
      getData() {
        props.getMostPopularViews();
      },
    },
    '3': {
      getData() {
        props.getRecentlyAccessedBookmarks(0, 5, 'watchTime,desc');
      },
    },
    '4': {
      getData() {
        props.getRecentlyAccessedBookmarks(0, 5, 'watchCount,desc');
      },
    },
  };

  const dispatchReleaseRequestProps = viewId => {
    setRequestReleaseDialogOpen(true);
    setRequestReleaseViewId(viewId);
  };

  const recentlyAccessedViewsListElement = props.recentlyAccessedViews.map(recent => {
    return (
      <Card
        key={recent.view.id}
        thumbnail={
          <View height="size-3200">
            <ViewCardThumbnail
              thumbnailImagePath={recent.view.imageLocation}
              viewName={recent.view.viewName}
              url={`/dashboards/build?dashboardId=${recent.view.viewDashboard.id}&viewId=${recent.view.id}`}
            />
          </View>
        }
        content={
          <ViewCardContent
            viewDashboard={recent.view.viewDashboard}
            description={recent.view.description}
            viewName={recent.view.viewName}
            viewId={recent.view.id}
            account={props.account}
            dispatchReleaseRequestProps={dispatchReleaseRequestProps}
          />
        }
      />
    );
  });

  const recentlyAccessedBookmarksListElement = props.recentlyAccessedBookmarks.map(recent => {
    return (
      <Card
        key={recent.view.id}
        thumbnail={
          <View height="size-3200">
            <ViewCardThumbnail
              thumbnailImagePath={recent.view.imageLocation}
              viewName={recent.view.viewName}
              url={`/dashboards/build?dashboardId=${recent.view.viewDashboard.id}&viewId=${recent.view.id}&bookmarkId=${recent.featureBookmark.id}`}
            />
          </View>
        }
        content={
          <ViewCardContent
            viewDashboard={recent.view.viewDashboard}
            description={recent.view.description}
            viewName={recent.view.viewName}
            viewId={recent.view.id}
            account={props.account}
            dispatchReleaseRequestProps={dispatchReleaseRequestProps}
          />
        }
      />
    );
  });

  const popularViewsListElement = props.popularViews.map(view => {
    return (
      <Card
        key={view.id}
        thumbnail={
          <View height="size-3200">
            <ViewCardThumbnail
              thumbnailImagePath={view.imageLocation}
              viewName={view.viewName}
              url={`/dashboards/build?dashboardId=${view.viewDashboard.id}&viewId=${view.id}`}
            />
          </View>
        }
        content={
          <ViewCardContent
            viewDashboard={view.viewDashboard}
            description={view.description}
            viewName={view.viewName}
            viewId={view.id}
            account={props.account}
            dispatchReleaseRequestProps={dispatchReleaseRequestProps}
          />
        }
      />
    );
  });

  return (
    <React.Fragment>
      <Tabs
        aria-label="recent-tabs"
        onSelectionChange={id => {
          const idTemp = Number(id);
          recentlyAccessed[idTemp].getData();
        }}
      >
        <TabList>
          <Item key="1">
            <Translate contentKey="home.bottom.tabs.accessed.tabs.recentlyAccessedViews"></Translate>
          </Item>
          <Item key="2">
            <Translate contentKey="home.bottom.tabs.accessed.tabs.overallMostPopularViews"></Translate>
          </Item>
          <Item key="3">
            <Translate contentKey="home.bottom.tabs.accessed.tabs.recentlyAccessedBookmarks"></Translate>
          </Item>
          <Item key="4">
            <Translate contentKey="home.bottom.tabs.accessed.tabs.overallMostPopularBookmarks"></Translate>
          </Item>
        </TabList>
        <Content marginTop="size-125"  marginEnd="size-125">
          {props.loading ? (
            <ProgressBar label="Loading…" isIndeterminate />
          ) : (
            <View>
              <TabPanels>
                <Item key="1">
                  <Content marginTop="size-125"  marginEnd="size-125">
                    <View>
                      <Flex direction="row" gap="size-500" alignItems="start" justifyContent="start" wrap>
                        {props.recentlyAccessedViews.length > 0 ? recentlyAccessedViewsListElement : null}
                      </Flex>
                    </View>
                  </Content>
                </Item>
                <Item key="2">
                  <Content marginTop="size-125"  marginEnd="size-125">
                    <View>
                      <Flex direction="row" gap="size-500" alignItems="start" justifyContent="start" wrap>
                        {props.popularViews.length > 0 ? popularViewsListElement : null}
                      </Flex>
                    </View>
                  </Content>
                </Item>
                <Item key="3">
                  <Content marginTop="size-125"  marginEnd="size-125">
                    <View>
                      <Flex direction="row" gap="size-500" alignItems="start" justifyContent="start" wrap>
                        {props.recentlyAccessedBookmarks.length > 0 ? recentlyAccessedBookmarksListElement : null}
                      </Flex>
                    </View>
                  </Content>
                </Item>
                <Item key="4">
                  <Content marginTop="size-125"  marginEnd="size-125">
                    <View>
                      {' '}
                      <Flex direction="row" gap="size-500" alignItems="start" justifyContent="start" wrap>
                        {props.recentlyAccessedBookmarks.length > 0 ? recentlyAccessedBookmarksListElement : null}{' '}
                      </Flex>{' '}
                    </View>
                  </Content>
                </Item>
              </TabPanels>
            </View>
          )}
        </Content>
      </Tabs>
      <DialogContainer onDismiss={() => setRequestReleaseDialogOpen(false)}>
        {isRequestReleaseDialogOpen && (
          <ViewRequestReleaseDialog setOpen={setRequestReleaseDialogOpen} viewId={requestReleaseViewId}></ViewRequestReleaseDialog>
        )}
      </DialogContainer>
    </React.Fragment>
  );
};

const mapStateToProps = storeState => ({
  recentlyAccessedViews: storeState.recent.recentlyAccessedViews,
  popularViews: storeState.recent.popularViews,
  loading: storeState.recent.loading,
  account: storeState.authentication.account,
  recentlyAccessedBookmarks: storeState.recent.recentlyAccessedBookmarks,
});

const mapDispatchToProps = { getMostPopularViews, getRecentlyAccessedBookmarks, getRecentViews };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RecentlyAccessed);
