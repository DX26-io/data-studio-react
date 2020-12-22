import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './visualizations.reducer';
import { IVisualizations } from 'app/shared/model/visualizations.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IVisualizationsDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const VisualizationsDetail = (props: IVisualizationsDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { visualizationsEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="datastudioApp.visualizations.detail.title">Visualizations</Translate> [<b>{visualizationsEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="datastudioApp.visualizations.name">Name</Translate>
            </span>
          </dt>
          <dd>{visualizationsEntity.name}</dd>
          <dt>
            <span id="functionname">
              <Translate contentKey="datastudioApp.visualizations.functionname">Functionname</Translate>
            </span>
          </dt>
          <dd>{visualizationsEntity.functionname}</dd>
        </dl>
        <Button tag={Link} to="/visualizations" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/visualizations/${visualizationsEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ visualizations }: IRootState) => ({
  visualizationsEntity: visualizations.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationsDetail);
