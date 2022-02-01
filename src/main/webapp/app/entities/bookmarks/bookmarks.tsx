import React, { useEffect, useState, ReactText } from 'react';
import { connect } from 'react-redux';
import { View, ProgressBar, Flex, SearchField } from '@adobe/react-spectrum';
import { getRecentlyAccessedBookmarks } from 'app/modules/home/sections/recent.reducer';
import ViewCardContent from 'app/entities/views/view-card/view-card-content';
import ViewCardThumbnail from 'app/entities/views/view-card/view-card-thumbnail';
import Card from 'app/shared/components/card/card';
import ViewRequestReleaseDialog from 'app/entities/views/view-request-release-modal';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { translate } from 'react-jhipster';

export interface IBookmarksProps extends StateProps, DispatchProps {}

const Bookmarks = (props: IBookmarksProps) => {
  const [isRequestReleaseDialogOpen, setRequestReleaseDialogOpen] = useState<boolean>(false);
  const [requestReleaseViewId, setRequestReleaseViewId] = useState();
  const [searchedText, setSearchedText] = React.useState('');
  let delayTimer;

  const getBookmarks = text => {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(() => {
      props.getRecentlyAccessedBookmarks(0, 5, 'watchTime,desc', text);
    }, 2000);
  };

  const onChangeSearchedText = event => {
    setSearchedText(event);
    getBookmarks(event);
  };

  useEffect(() => {
    getBookmarks('');
  }, []);

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
    <React.Fragment>
      <SecondaryHeader
        breadcrumbItems={[
          { label: translate('home.title'), route: '/' },
          { label: translate('featureBookmark.home.title'), route: '/bookmarks' },
        ]}
        title={translate('featureBookmark.home.title')}
      ></SecondaryHeader>
      <View marginTop="size-200" marginStart="size-125" marginEnd="size-125">
        {props.loading ? (
          <ProgressBar label="Loading…" isIndeterminate />
        ) : (
          <React.Fragment>
            <Flex justifyContent="center" alignItems="center">
              <SearchField
                placeholder={translate('home.header.search')}
                onClear={() => {
                  setSearchedText('');
                }}
                onChange={onChangeSearchedText}
                onSubmit={event => {
                  setSearchedText(event);
                  getBookmarks(event);
                }}
                value={searchedText}
                width="size-4600"
              />
            </Flex>
            <Flex marginTop="size-200" direction="row" gap="size-500" alignItems="center" justifyContent="start" wrap>
              {props.recentlyAccessedBookmarks.length > 0 && recentlyAccessedBookmarksListElement}
            </Flex>
          </React.Fragment>
        )}
      </View>
    </React.Fragment>
  );
};

const mapStateToProps = storeState => ({
  loading: storeState.recent.loading,
  account: storeState.authentication.account,
  recentlyAccessedBookmarks: storeState.recent.recentlyAccessedBookmarks,
});

const mapDispatchToProps = { getRecentlyAccessedBookmarks };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Bookmarks);
