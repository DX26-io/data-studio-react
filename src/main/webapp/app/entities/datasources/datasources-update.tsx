import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './datasources.reducer';
import { IDatasources } from 'app/shared/model/datasources.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IDatasourcesUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const DatasourcesUpdate = (props: IDatasourcesUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { datasourcesEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/datasources' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...datasourcesEntity,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="datastudioApp.datasources.home.createOrEditLabel">
            <Translate contentKey="datastudioApp.datasources.home.createOrEditLabel">Create or edit a Datasources</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : datasourcesEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="datasources-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="datasources-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="datasources-name">
                  <Translate contentKey="datastudioApp.datasources.name">Name</Translate>
                </Label>
                <AvField id="datasources-name" type="text" name="name" />
              </AvGroup>
              <AvGroup>
                <Label id="lastUpdatedLabel" for="datasources-lastUpdated">
                  <Translate contentKey="datastudioApp.datasources.lastUpdated">Last Updated</Translate>
                </Label>
                <AvField id="datasources-lastUpdated" type="date" className="form-control" name="lastUpdated" />
              </AvGroup>
              <AvGroup>
                <Label id="connectionNameLabel" for="datasources-connectionName">
                  <Translate contentKey="datastudioApp.datasources.connectionName">Connection Name</Translate>
                </Label>
                <AvField id="datasources-connectionName" type="text" name="connectionName" />
              </AvGroup>
              <AvGroup>
                <Label id="queryPathLabel" for="datasources-queryPath">
                  <Translate contentKey="datastudioApp.datasources.queryPath">Query Path</Translate>
                </Label>
                <AvField id="datasources-queryPath" type="text" name="queryPath" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/datasources" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  datasourcesEntity: storeState.datasources.entity,
  loading: storeState.datasources.loading,
  updating: storeState.datasources.updating,
  updateSuccess: storeState.datasources.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DatasourcesUpdate);
