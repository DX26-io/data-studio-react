import React, { useEffect, useState, ReactText } from 'react';
import { connect } from 'react-redux';
import { View, ProgressBar, Flex, SearchField } from '@adobe/react-spectrum';
import { getRecentlyAccessedBookmarks } from 'app/modules/home/sections/recent.reducer';
import ViewCardContent from 'app/entities/views/view-card/view-card-content';
import ViewCardThumbnail from 'app/entities/views/view-card/view-card-thumbnail';
import Card from 'app/shared/components/card/card';

export interface IBookmarksCardProps extends StateProps, DispatchProps {}

const BookmarksCard = (props: IBookmarksCardProps) => {
  const [isRequestReleaseDialogOpen, setRequestReleaseDialogOpen] = useState<boolean>(false);
  const [requestReleaseViewId, setRequestReleaseViewId] = useState();

  const dispatchReleaseRequestProps = viewId => {
    setRequestReleaseDialogOpen(true);
    setRequestReleaseViewId(viewId);
  };

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

  return (
    <Flex direction="row" gap="size-500" alignItems="center" justifyContent="start" wrap>
      {props.recentlyAccessedBookmarks.length > 0 && recentlyAccessedBookmarksListElement}
    </Flex>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  recentlyAccessedBookmarks: storeState.recent.recentlyAccessedBookmarks,
});

const mapDispatchToProps = { getRecentlyAccessedBookmarks };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BookmarksCard);
