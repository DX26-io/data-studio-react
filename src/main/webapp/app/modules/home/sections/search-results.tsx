import React, { useEffect, useState, ReactText } from 'react';
import { connect } from 'react-redux';
import { Item, Content, View, Flex, ProgressBar, DialogContainer } from '@adobe/react-spectrum';
import { Tabs } from '@react-spectrum/tabs';
import { Translate } from 'react-jhipster';
import { getMostPopularViews, getRecentlyAccessedBookmarks, getRecentViews } from './recent.reducer';
import ViewCardContent from 'app/entities/views/view-card/view-card-content';
import ViewCardThumbnail from 'app/entities/views/view-card/view-card-thumbnail';
import Card from 'app/shared/components/card/card';
import DashboardCardThumbnail from 'app/entities/dashboard/dashboard-card/dashboard-card-thumbnail';
import DashboardCardContent from 'app/entities/dashboard/dashboard-card/dashboard-card-content';
import { IDashboard, defaultValue } from 'app/shared/model/dashboard.model';
import DashboardRequestReleaseDialog from 'app/entities/dashboard/dashboard-request-release-modal';
import ViewRequestReleaseDialog from 'app/entities/views/view-request-release-modal';

export interface ISearchResultsProps extends StateProps {
  match: any;
}

const SearchResults = (props: ISearchResultsProps) => {
  const [isRequestReleaseDialogOpen, setRequestReleaseDialogOpen] = useState<boolean>(false);
  const [requestReleaseViewId, setRequestReleaseViewId] = useState();
  const [isRequestReleaseDashboardDialogOpen, setRequestReleaseDashboardDialogOpen] = useState<boolean>(false);
  const [requestReleaseDashboard, setRequestReleaseDashboard] = useState<IDashboard>();

  const dispatchReleaseRequestProps = viewId => {
    setRequestReleaseDialogOpen(true);
    setRequestReleaseViewId(viewId);
  };

  const dispatchReleaseRequestDashboardProps = (id, dashboardName) => {
    setRequestReleaseDashboardDialogOpen(true);
    setRequestReleaseDashboard({ ...defaultValue, id, dashboardName });
  };

  const viewsElement = props.views.map(view => {
    return (
      <Card
        key={view.id}
        thumbnail={
          <View height="size-3200">
            <ViewCardThumbnail
              thumbnailImagePath={view.imageLocation}
              viewName={view.viewName}
              url={`/dashboards/${view.viewDashboard.id}/${view.id}/build`}
            />
            <ViewCardThumbnail thumbnailImagePath={view.imageLocation} viewName={view.viewName}
             url={`/dashboards/build?dahsbordId=${view.viewDashboard.id}&viewId=${view.id}`} 
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

  const dashboardListElement = props.dashboards.map(dashboard => {
    return (
      <Card
        key={dashboard.id}
        thumbnail={
          <View height="size-3200">
            <DashboardCardThumbnail
              thumbnailImagePath={dashboard.image_location}
              dashboardName={dashboard.dashboardName}
              url={`/dashboards/${dashboard.id}`}
            />
          </View>
        }
        content={
          <DashboardCardContent
            dashboardName={dashboard.dashboardName}
            dashboardDescription={dashboard.description}
            dashboardType={dashboard.category}
            dashboardId={dashboard.id}
            datasource={dashboard.dashboardDatasource.name}
            account={props.account}
            dispatchReleaseRequestProps={dispatchReleaseRequestDashboardProps}
          />
        }
      />
    );
  });

  return (
    <View marginTop="size-50" marginStart="size-125" marginEnd="size-125">
      {props.loadingViews || props.loadingDashboards ? (
        <ProgressBar label="Loading…" isIndeterminate />
      ) : (
        <React.Fragment>
          <span className="spectrum-Heading spectrum-Heading--sizeM">
            <Translate contentKey="home.search.title">Search Results</Translate>
          </span>
          <View marginTop="size-225">
            <Flex direction="row" gap="size-500" alignItems="start" justifyContent="start" wrap>
              {props.views.length > 0 ? viewsElement : null}
              {props.dashboards.length > 0 ? dashboardListElement : null}
            </Flex>
          </View>
          <DialogContainer onDismiss={() => setRequestReleaseDialogOpen(false)}>
            {isRequestReleaseDialogOpen && (
              <ViewRequestReleaseDialog setOpen={setRequestReleaseDialogOpen} viewId={requestReleaseViewId}></ViewRequestReleaseDialog>
            )}
          </DialogContainer>
          <DialogContainer onDismiss={() => setRequestReleaseDialogOpen(false)}>
            {isRequestReleaseDashboardDialogOpen && (
              <DashboardRequestReleaseDialog
                setOpen={setRequestReleaseDashboardDialogOpen}
                dashboard={requestReleaseDashboard}
              ></DashboardRequestReleaseDialog>
            )}
          </DialogContainer>
        </React.Fragment>
      )}
    </View>
  );
};

const mapStateToProps = storeState => ({
  dashboards: storeState.dashboard.entities,
  loadingDashboards: storeState.dashboard.loading,
  views: storeState.views.entities,
  loadingViews: storeState.views.loading,
  account: storeState.authentication.account,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps, null)(SearchResults);
