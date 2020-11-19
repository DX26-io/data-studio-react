import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getSortState } from 'react-jhipster';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './dashboard.reducer';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import Card from 'app/shared/components/card/card';
import { Button, Flex, View } from '@adobe/react-spectrum';
import DashboardCardThumbnail from 'app/entities/dashboard/dashboard-card/dashboard-card-thumbnail';
import DashboardCardContent from 'app/entities/dashboard/dashboard-card/dashboard-card-content';
import { Row } from 'reactstrap';
import { JhiPagination, JhiItemCount } from 'react-jhipster';
import Pagination from '@material-ui/lab/Pagination';
import TablePagination from '@material-ui/core/TablePagination';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';

export interface IDashboardProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Dashboard = (props: IDashboardProps) => {
  let totalPage;
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

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleChangeRowsPerPage = event => {
    // setRowsPerPage(parseInt(event.target.value, 10));

    setPaginationState({
      ...paginationState,
      activePage: 1,
      itemsPerPage: event.target.value,
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
              <DashboardCardThumbnail thumbnailImagePath={dashboard.image_location} dashboardName={dashboard.dashboardName} />
            </View>
          }
          content={
            <DashboardCardContent
              dashboardName={dashboard.dashboardName}
              dashboardDescription={dashboard.description}
              dashboardType={dashboard.category}
              dashboardId={dashboard.id}
            />
          }
        />
      </>
    );
  });

  const { dashboardList, match, loading, totalItems } = props;
  return (
    <React.Fragment>
      <Flex direction="row" gap="size-175" wrap margin="size-175" alignItems="center" justifyContent="start">
        {dashboardListElement}
      </Flex>
      <Flex direction="row" margin="size-175" alignItems="center" justifyContent="center">
        <div className={dashboardList && dashboardList.length > 0 ? '' : 'd-none'}>
          <Pagination onChange={handleChangePage} count={Math.ceil(props.totalItems / paginationState.itemsPerPage)} color="primary" />       
        </div>
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
