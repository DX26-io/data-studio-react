import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './views.reducer';
import { IViews } from 'app/shared/model/views.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IViewsDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ViewsDetail = (props: IViewsDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { viewsEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="datastudioApp.views.detail.title">Views</Translate> [<b>{viewsEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="viewName">
              <Translate contentKey="datastudioApp.views.viewName">View Name</Translate>
            </span>
          </dt>
          <dd>{viewsEntity.viewName}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="datastudioApp.views.description">Description</Translate>
            </span>
          </dt>
          <dd>{viewsEntity.description}</dd>
          <dt>
            <span id="createdBy">
              <Translate contentKey="datastudioApp.views.createdBy">Created By</Translate>
            </span>
          </dt>
          <dd>{viewsEntity.createdBy}</dd>
          <dt>
            <span id="lastModifiedBy">
              <Translate contentKey="datastudioApp.views.lastModifiedBy">Last Modified By</Translate>
            </span>
          </dt>
          <dd>{viewsEntity.lastModifiedBy}</dd>
          <dt>
            <span id="lastModifiedDate">
              <Translate contentKey="datastudioApp.views.lastModifiedDate">Last Modified Date</Translate>
            </span>
          </dt>
          <dd>
            {viewsEntity.lastModifiedDate ? (
              <TextFormat value={viewsEntity.lastModifiedDate} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="published">
              <Translate contentKey="datastudioApp.views.published">Published</Translate>
            </span>
          </dt>
          <dd>{viewsEntity.published ? 'true' : 'false'}</dd>
          <dt>
            <span id="image">
              <Translate contentKey="datastudioApp.views.image">Image</Translate>
            </span>
          </dt>
          <dd>
            {viewsEntity.image ? (
              <div>
                {viewsEntity.imageContentType ? (
                  <a onClick={openFile(viewsEntity.imageContentType, viewsEntity.image)}>
                    <img src={`data:${viewsEntity.imageContentType};base64,${viewsEntity.image}`} style={{ maxHeight: '30px' }} />
                  </a>
                ) : null}
                <span>
                  {viewsEntity.imageContentType}, {byteSize(viewsEntity.image)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="viewDashboard">
              <Translate contentKey="datastudioApp.views.viewDashboard">View Dashboard</Translate>
            </span>
          </dt>
          <dd>{viewsEntity.viewDashboard}</dd>
        </dl>
        <Button tag={Link} to="/views" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/views/${viewsEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ views }: IRootState) => ({
  viewsEntity: views.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ViewsDetail);
