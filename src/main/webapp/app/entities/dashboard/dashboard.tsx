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
import moment from "moment";

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
    <div>
      <h2 id="dashboard-heading">
        <Translate contentKey="datastudioApp.dashboard.home.title">Dashboards</Translate>
       
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="datastudioApp.dashboard.home.createLabel">Create new Dashboard</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        <Flex direction="row" gap="size-175" wrap margin="size-175">
          {dashboardList.map(dashboard => (
            <View>
              <Cards
                thumbnail="https://i.imgur.com/Z7AzH2c.png"
                header={<CardHeader title={dashboard.dashboardName} description={dashboard.description} />}
                footer={<CardFooter modifyDate= {moment(dashboard.lastModifiedDate).format("MMM DD,YYYY")} status={dashboard.published} />}
              />
            </View>
          ))}
        </Flex>
      </div>
      <div className="table-responsive">
        {dashboardList && dashboardList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dashboard_name')}>
                  <Translate contentKey="datastudioApp.dashboard.dashboard_name">Dashboard Name</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('category')}>
                  <Translate contentKey="datastudioApp.dashboard.category">Category</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('description')}>
                  <Translate contentKey="datastudioApp.dashboard.description">Description</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('published')}>
                  <Translate contentKey="datastudioApp.dashboard.published">Published</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('image_location')}>
                  <Translate contentKey="datastudioApp.dashboard.image_location">Image Location</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('image_content_type')}>
                  <Translate contentKey="datastudioApp.dashboard.image_content_type">Image Content Type</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dashboard_datasource_id')}>
                  <Translate contentKey="datastudioApp.dashboard.dashboard_datasource_id">Dashboard Datasource Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('created_by')}>
                  <Translate contentKey="datastudioApp.dashboard.created_by">Created By</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('created_date')}>
                  <Translate contentKey="datastudioApp.dashboard.created_date">Created Date</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('last_modified_by')}>
                  <Translate contentKey="datastudioApp.dashboard.last_modified_by">Last Modified By</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('last_modified_date')}>
                  <Translate contentKey="datastudioApp.dashboard.last_modified_date">Last Modified Date</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('current_release_id')}>
                  <Translate contentKey="datastudioApp.dashboard.current_release_id">Current Release Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {dashboardList.map((dashboard, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${dashboard.id}`} color="link" size="sm">
                      {dashboard.id}
                    </Button>
                  </td>
                  <td>{dashboard.dashboardName}</td>
                  <td>{dashboard.category}</td>
                  <td>{dashboard.description}</td>
                  <td>{dashboard.published ? 'true' : 'false'}</td>
                  <td>{dashboard.image_location}</td>
                  <td>{dashboard.image_content_type}</td>
                  <td>{dashboard.dashboard_datasource_id}</td>
                  <td>{dashboard.created_by}</td>
                  <td>
                    {dashboard.created_date ? (
                      <TextFormat type="date" value={dashboard.created_date} format={APP_LOCAL_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{dashboard.last_modified_by}</td>
                  <td>
                    {dashboard.lastModifiedDate ? (
                      <TextFormat type="date" value={dashboard.lastModifiedDate} format={APP_LOCAL_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{dashboard.current_release_id}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${dashboard.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${dashboard.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${dashboard.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="datastudioApp.dashboard.home.notFound">No Dashboards found</Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={dashboardList && dashboardList.length > 0 ? '' : 'd-none'}>
          <Row className="justify-content-center">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </Row>
          <Row className="justify-content-center">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={props.totalItems}
            />
          </Row>
        </div>
      ) : (
        ''
      )}
    </div>
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
