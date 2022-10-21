import React, { useEffect, useState, ReactText } from 'react';
import { connect } from 'react-redux';
import { Item, Content, View, Flex, ProgressBar, DialogContainer } from '@adobe/react-spectrum';
import { Tabs } from '@react-spectrum/tabs';
import { translate } from 'react-jhipster';
import { getRecentlyCreatedViews, getRecentlyCreatedBookmarks } from './recent.reducer';
import ViewCardContent from 'app/entities/views/view-card/view-card-content';
import ViewCardThumbnail from 'app/entities/views/view-card/view-card-thumbnail';
import Card from 'app/shared/components/card/card';
import ViewRequestReleaseDialog  from 'app/entities/views/view-request-release-modal';

export interface IRecentlyCreatedProps extends StateProps, DispatchProps {}

const RecentlyCreated = (props: IRecentlyCreatedProps) => {
  const [tabId, setTabId] = useState<ReactText>('1');
  const [isRequestReleaseDialogOpen, setRequestReleaseDialogOpen] = useState<boolean>(false);
  const [requestReleaseViewId, setRequestReleaseViewId] = useState();

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
        props.getRecentlyCreatedBookmarks(0, 5, 'watchCreatedTime,desc');
      },
    },
  };

  const dispatchReleaseRequestProps = (viewId)=>{
    setRequestReleaseDialogOpen(true);
    setRequestReleaseViewId(viewId)
  }

  const recentlyCreatedViewsListElement = props.recentlyCreatedViews.map(view => {
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

  const recentlyCreatedBookmarksListElement = props.recentlyCreatedBookmarks.map(recent => {
    return (
      <Card
        key={recent.view.id}
        thumbnail={
          <View height="size-3200">
            <ViewCardThumbnail
              thumbnailImagePath={recent.view.imageLocation}
              viewName={recent.view.viewName}
              url={`/dashboards/build?dashboardId=${recent.view.viewDashboard.id}&viewId=${recent.view.id}&bookmarkId${recent.featureBookmark.id}`}

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

  return (
    <React.Fragment>
      <Tabs
        aria-label="recent-tabs"
        items={tabs}
        selectedKey={tabId}
        onSelectionChange={id => {
          setTabId(id);
          recentlyCreated[id].getData();
        }}
      >
            {/* 
// @ts-ignore */}
        {item => (
          <Item title={translate(item.name)}>
            <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
              {props.loading ? (
                <ProgressBar label="Loading…" isIndeterminate />
              ) : (
                <View>
                  <Flex direction="row" gap="size-500" alignItems="start" justifyContent="start" wrap>
                    {tabId === 1 && props.recentlyCreatedViews.length > 0 ? recentlyCreatedViewsListElement : null}
                    {tabId === 2 && props.recentlyCreatedBookmarks.length > 0 ? recentlyCreatedBookmarksListElement : null}
                  </Flex>
                </View>
              )}
            </Content>
          </Item>
        )}
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
  recentlyCreatedViews: storeState.recent.recentlyCreatedViews,
  recentlyCreatedBookmarks: storeState.recent.recentlyCreatedBookmarks,
  loading: storeState.recent.loading,
  account: storeState.authentication.account,
});

const mapDispatchToProps = { getRecentlyCreatedViews, getRecentlyCreatedBookmarks };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RecentlyCreated);
