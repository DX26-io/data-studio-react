import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './dashboard.reducer';
import { IDashboard } from 'app/shared/model/dashboard.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IDashboardDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const DashboardDetail = (props: IDashboardDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { dashboardEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="datastudioApp.dashboard.detail.title">Dashboard</Translate> [<b>{dashboardEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="dashboard_name">
              <Translate contentKey="datastudioApp.dashboard.dashboard_name">Dashboard Name</Translate>
            </span>
          </dt>
          <dd>{dashboardEntity.dashboardName}</dd>
          <dt>
            <span id="category">
              <Translate contentKey="datastudioApp.dashboard.category">Category</Translate>
            </span>
          </dt>
          <dd>{dashboardEntity.category}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="datastudioApp.dashboard.description">Description</Translate>
            </span>
          </dt>
          <dd>{dashboardEntity.description}</dd>
          <dt>
            <span id="published">
              <Translate contentKey="datastudioApp.dashboard.published">Published</Translate>
            </span>
          </dt>
          <dd>{dashboardEntity.published ? 'true' : 'false'}</dd>
          <dt>
            <span id="image_location">
              <Translate contentKey="datastudioApp.dashboard.image_location">Image Location</Translate>
            </span>
          </dt>
          <dd>{dashboardEntity.image_location}</dd>
          <dt>
            <span id="image_content_type">
              <Translate contentKey="datastudioApp.dashboard.image_content_type">Image Content Type</Translate>
            </span>
          </dt>
          <dd>{dashboardEntity.image_content_type}</dd>
          <dt>
            <span id="dashboard_datasource_id">
              <Translate contentKey="datastudioApp.dashboard.dashboard_datasource_id">Dashboard Datasource Id</Translate>
            </span>
          </dt>
          <dd>{dashboardEntity.dashboard_datasource_id}</dd>
          <dt>
            <span id="created_by">
              <Translate contentKey="datastudioApp.dashboard.created_by">Created By</Translate>
            </span>
          </dt>
          <dd>{dashboardEntity.created_by}</dd>
          <dt>
            <span id="created_date">
              <Translate contentKey="datastudioApp.dashboard.created_date">Created Date</Translate>
            </span>
          </dt>
          <dd>
            {dashboardEntity.created_date ? (
              <TextFormat value={dashboardEntity.created_date} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="last_modified_by">
              <Translate contentKey="datastudioApp.dashboard.last_modified_by">Last Modified By</Translate>
            </span>
          </dt>
          <dd>{dashboardEntity.last_modified_by}</dd>
          <dt>
            <span id="last_modified_date">
              <Translate contentKey="datastudioApp.dashboard.last_modified_date">Last Modified Date</Translate>
            </span>
          </dt>
          <dd>
            {dashboardEntity.lastModifiedDate ? (
              <TextFormat value={dashboardEntity.lastModifiedDate} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="current_release_id">
              <Translate contentKey="datastudioApp.dashboard.current_release_id">Current Release Id</Translate>
            </span>
          </dt>
          <dd>{dashboardEntity.current_release_id}</dd>
        </dl>
        <Button tag={Link} to="/dashboard" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/dashboard/${dashboardEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ dashboard }: IRootState) => ({
  dashboardEntity: dashboard.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DashboardDetail);
