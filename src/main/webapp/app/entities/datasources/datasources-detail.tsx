import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './datasources.reducer';
import { IDatasources } from 'app/shared/model/datasources.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IDatasourcesDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const DatasourcesDetail = (props: IDatasourcesDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { datasourcesEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="datastudioApp.datasources.detail.title">Datasources</Translate> [<b>{datasourcesEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="datastudioApp.datasources.name">Name</Translate>
            </span>
          </dt>
          <dd>{datasourcesEntity.name}</dd>
          <dt>
            <span id="lastUpdated">
              <Translate contentKey="datastudioApp.datasources.lastUpdated">Last Updated</Translate>
            </span>
          </dt>
          <dd>
            {datasourcesEntity.lastUpdated ? (
              <TextFormat value={datasourcesEntity.lastUpdated} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="connectionName">
              <Translate contentKey="datastudioApp.datasources.connectionName">Connection Name</Translate>
            </span>
          </dt>
          <dd>{datasourcesEntity.connectionName}</dd>
          <dt>
            <span id="queryPath">
              <Translate contentKey="datastudioApp.datasources.queryPath">Query Path</Translate>
            </span>
          </dt>
          <dd>{datasourcesEntity.queryPath}</dd>
        </dl>
        <Button tag={Link} to="/datasources" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/datasources/${datasourcesEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ datasources }: IRootState) => ({
  datasourcesEntity: datasources.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DatasourcesDetail);
