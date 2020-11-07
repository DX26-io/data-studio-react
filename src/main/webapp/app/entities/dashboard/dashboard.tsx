import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './dashboard.reducer';
import { IDashboard } from 'app/shared/model/dashboard.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import Cards from 'app/shared/components/card/card';
import CardHeader from 'app/shared/components/card/partials/dashboard-card-header';
import CardFooter from 'app/shared/components/card/partials/dashboard-card-footer';
import { Flex, View } from '@adobe/react-spectrum';
import moment from 'moment';

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

  const handlePagination = currentPage =>
    setPaginationState({  
      ...paginationState,
      activePage: currentPage,
    });

  const { dashboardList, match, loading, totalItems } = props;
  return (
    <Flex direction="row" gap="size-175" wrap margin="size-175" alignItems="center" justifyContent="start">
      {dashboardList.map(dashboard => (
        <View>
          <Cards
            thumbnail="https://i.imgur.com/Z7AzH2c.png"
            header={<CardHeader title={dashboard.dashboardName} description={dashboard.description} />}
            footer={<CardFooter modifyDate={moment(dashboard.lastModifiedDate).format('MMM DD,YYYY')} status={dashboard.published} />}
          />
        </View>
      ))}
    </Flex>
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
