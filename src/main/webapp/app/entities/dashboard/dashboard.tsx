import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getSortState, Translate } from 'react-jhipster';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './dashboard.reducer';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import Card from 'app/shared/components/card/card';
import { Button, Content, DialogContainer, Flex, IllustratedMessage, View } from '@adobe/react-spectrum';
import DashboardCardThumbnail from 'app/entities/dashboard/dashboard-card/dashboard-card-thumbnail';
import DashboardCardContent from 'app/entities/dashboard/dashboard-card/dashboard-card-content';
import Pagination from '@material-ui/lab/Pagination';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import DashboardModal from '../dashboard/dashboard-modal';
import NotFound from '@spectrum-icons/illustrations/NotFound';

export interface IDashboardProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Dashboard = (props: IDashboardProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );

  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
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

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });
  };

  const handleChangePage = (event, newPage) => {
    setPaginationState({
      ...paginationState,
      activePage: newPage,
    });
  };

  const dashboardListElement = props.dashboardList.map(dashboard => {
    return (
      <>
        <Card
          key={dashboard.id}
          thumbnail={
            <View height="size-3200">
              <DashboardCardThumbnail
                dashboardId={dashboard.id}
                thumbnailImagePath={dashboard.image_location}
                dashboardName={dashboard.dashboardName}
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
            />
          }
        />
      </>
    );
  });

  const { dashboardList, match, loading, totalItems } = props;
  const [isOpen, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <SecondaryHeader
        breadcrumbItems={[
          { key: 'home', label: 'Home', route: '/' },
          { key: 'dashboard', label: 'Dashboard', route: '/dashboard' },
        ]}
        title={'Dashboard'}
      >
        <Button variant="cta" onPress={() => setOpen(true)}>
          <Translate contentKey="dashboard.home.createLabel">Create</Translate>
        </Button>

        <DialogContainer type="fullscreenTakeover" onDismiss={() => setOpen(false)} {...props}>
          {isOpen && <DashboardModal></DashboardModal>}
        </DialogContainer>
      </SecondaryHeader>
      <Flex direction="row" gap="size-175" wrap margin="size-175" alignItems="center" justifyContent="start">
        {dashboardListElement}
      </Flex>
      <Flex direction="row" margin="size-175" alignItems="center" justifyContent="center">
        {dashboardList && dashboardList.length > 0 ? (
          <Pagination
            defaultPage={paginationState.activePage}
            onChange={handleChangePage}
            count={Math.ceil(totalItems / paginationState.itemsPerPage)}
          />
        ) : (
          <IllustratedMessage>
            <NotFound />
            <Content>
              <Translate contentKey="dashboard.home.notFound">No dashboard found</Translate>
            </Content>
          </IllustratedMessage>
        )}
      </Flex>
    </React.Fragment>
  );
};

const mapStateToProps = ({ dashboard }: IRootState) => ({
  dashboardList: dashboard.entities,
  loading: dashboard.loading,
  totalItems: dashboard.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
