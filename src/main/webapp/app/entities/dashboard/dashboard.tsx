import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { translate, Translate, getSortState, size } from 'react-jhipster';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './dashboard.reducer';
import Card from 'app/shared/components/card/card';
import { Button, DialogContainer, Flex, View, ProgressBar } from '@adobe/react-spectrum';
import DashboardCardThumbnail from 'app/entities/dashboard/dashboard-card/dashboard-card-thumbnail';
import DashboardCardContent from 'app/entities/dashboard/dashboard-card/dashboard-card-content';
import Pagination from '@mui/lab/Pagination';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import DashboardCreateModal from './dashboard-create-modal';
import { NoItemsFoundPlaceHolder } from 'app/shared/components/placeholder/placeholder';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { hasAuthority } from 'app/shared/reducers/authentication';
import DashboardRequestReleaseDialog from './dashboard-request-release-modal';
import { defaultValue, IDashboard } from 'app/shared/model/dashboard.model';
import DashboardSearch from './dashboard-search';
export interface IDashboardProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Dashboard = (props: IDashboardProps) => {
  const [isRequestReleaseDialogOpen, setRequestReleaseDialogOpen] = useState<boolean>(false);
  const [requestReleaseDashboard, setRequestReleaseDashboard] = useState<IDashboard>();

  const [isDashboardCreateModelOpen, setDashboardCreateModelOpen] = useState(false);
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );
  const DASHBOARDS_TITLE = translate('dashboard.home.title');
  const { dashboardList, match, totalItems } = props;
  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };
  const sortEntities = () => {
    getAllEntities();
  };
  useEffect(() => {
    sortEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  const handleChangePage = (event, newPage) => {
    setPaginationState({
      ...paginationState,
      activePage: newPage,
    });
  };

  const dispatchReleaseRequestProps = (id, dashboardName) => {
    setRequestReleaseDialogOpen(true);
    setRequestReleaseDashboard({ ...defaultValue, id, dashboardName });
  };

  const dashboardListElement = dashboardList.map(dashboard => {
    return (
      <Card
        key={dashboard.id}
        thumbnail={
          <View height="size-3200">
            <DashboardCardThumbnail
              thumbnailImagePath={dashboard.image_location}
              dashboardName={dashboard.dashboardName}
              url={`${match.url}/${dashboard.id}`}
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
            dispatchReleaseRequestProps={dispatchReleaseRequestProps}
          />
        }
      />
    );
  });

  return (
    <>
      <SecondaryHeader
        breadcrumbItems={[
          { label: 'Home', route: '/' },
          { label: 'Dashboards', route: '/dashboards' },
        ]}
        title={DASHBOARDS_TITLE}
      >
        {props.account && hasAuthority(props.account, 'WRITE_DASHBOARDS_APPLICATION') && (
          <Button variant="cta" onPress={() => props.history.push(`${match.url}/create`)}>
            <Translate contentKey="dashboard.home.createLabel">Create</Translate>
          </Button>
        )}
        <DialogContainer type="fullscreenTakeover" onDismiss={() => setDashboardCreateModelOpen(false)} {...props}>
          {isDashboardCreateModelOpen && <DashboardCreateModal />}
        </DialogContainer>
      </SecondaryHeader>
      <View marginTop="size-250">
        <DashboardSearch />
        {props.loading && (
          <Flex marginTop="size-250" alignItems="center" justifyContent="center">
            <ProgressBar label="Loading…" isIndeterminate />
          </Flex>
        )}
      </View>
      {!props.loading && dashboardList.length > 0 ? (
        <>
          <Flex direction="row" gap="size-250" wrap marginX="5%" marginY="size-250" alignItems="center" justifyContent="start">
            {dashboardListElement}
          </Flex>
          <Flex direction="row" margin="size-175" alignItems="center" justifyContent="center">
            {dashboardList && dashboardList.length > 0 && (
              <Pagination
                defaultPage={paginationState.activePage}
                onChange={handleChangePage}
                count={Math.ceil(totalItems / paginationState.itemsPerPage)}
              />
            )}
          </Flex>
        </>
      ) : (
        <NoItemsFoundPlaceHolder
          headerTranslationKey="dashboard.home.notFound.heading"
          contentTranslationKey="dashboard.home.notFound.content"
        />
      )}
      <DialogContainer onDismiss={() => setRequestReleaseDialogOpen(false)}>
        {isRequestReleaseDialogOpen && (
          <DashboardRequestReleaseDialog
            setOpen={setRequestReleaseDialogOpen}
            dashboard={requestReleaseDashboard}
          ></DashboardRequestReleaseDialog>
        )}
      </DialogContainer>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  dashboardList: storeState.dashboard.entities,
  loading: storeState.dashboard.loading,
  totalItems: storeState.dashboard.totalItems,
  account: storeState.authentication.account,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
