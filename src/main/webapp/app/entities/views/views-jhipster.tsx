import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import {
  openFile,
  byteSize,
  Translate,
  ICrudGetAllAction,
  TextFormat,
  getSortState,
  IPaginationBaseState,
  JhiPagination,
  JhiItemCount,
} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './views.reducer';
import { IViews } from 'app/shared/model/views.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IViewsProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Views = (props: IViewsProps) => {
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

  const { viewsList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="views-heading">
        <Translate contentKey="datastudioApp.views.home.title">Views</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="datastudioApp.views.home.createLabel">Create new Views</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {viewsList && viewsList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('viewName')}>
                  <Translate contentKey="datastudioApp.views.viewName">View Name</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('description')}>
                  <Translate contentKey="datastudioApp.views.description">Description</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('createdBy')}>
                  <Translate contentKey="datastudioApp.views.createdBy">Created By</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('lastModifiedBy')}>
                  <Translate contentKey="datastudioApp.views.lastModifiedBy">Last Modified By</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                {/* <th className="hand" onClick={sort('lastModifiedDate')}>
                  <Translate contentKey="datastudioApp.views.lastModifiedDate">Last Modified Date</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th> */}
                <th className="hand" onClick={sort('published')}>
                  <Translate contentKey="datastudioApp.views.published">Published</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('image')}>
                  <Translate contentKey="datastudioApp.views.image">Image</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('viewDashboard')}>
                  <Translate contentKey="datastudioApp.views.viewDashboard">View Dashboard</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {viewsList.map((views, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${views.id}`} color="link" size="sm">
                      {views.id}
                    </Button>
                  </td>
                  <td>{views.viewName}</td>
                  <td>{views.description}</td>
                  <td>{views.createdBy}</td>
                  <td>{views.lastModifiedBy}</td>
                  {/* <td>
                    {views.lastModifiedDate ? (
                      <TextFormat type="date" value={views.lastModifiedDate} format={APP_LOCAL_DATE_FORMAT} />
                    ) : null}
                  </td> */}
                  <td>{views.published ? 'true' : 'false'}</td>
                  <td>
                    {views.image ? (
                      <div>
                        {views.imageContentType ? (
                          <a onClick={openFile(views.imageContentType, views.image)}>
                            <img src={`data:${views.imageContentType};base64,${views.image}`} style={{ maxHeight: '30px' }} />
                            &nbsp;
                          </a>
                        ) : null}
                        <span>
                          {views.imageContentType}, {byteSize(views.image)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  {/* <td>{views.viewDashboard}</td> */}
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${views.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${views.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${views.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="datastudioApp.views.home.notFound">No Views found</Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={viewsList && viewsList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ views }: IRootState) => ({
  viewsList: views.entities,
  loading: views.loading,
  totalItems: views.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Views);
