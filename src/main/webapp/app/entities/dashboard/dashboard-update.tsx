import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './dashboard.reducer';
import { IDashboard } from 'app/shared/model/dashboard.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IDashboardUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const DashboardUpdate = (props: IDashboardUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { dashboardEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/dashboard' + props.location.search);
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
        ...dashboardEntity,
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
          <h2 id="datastudioApp.dashboard.home.createOrEditLabel">
            <Translate contentKey="datastudioApp.dashboard.home.createOrEditLabel">Create or edit a Dashboard</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : dashboardEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="dashboard-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="dashboard-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="dashboard_nameLabel" for="dashboard-dashboard_name">
                  <Translate contentKey="datastudioApp.dashboard.dashboard_name">Dashboard Name</Translate>
                </Label>
                <AvField
                  id="dashboard-dashboard_name"
                  type="text"
                  name="dashboard_name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    maxLength: { value: 30, errorMessage: translate('entity.validation.maxlength', { max: 30 }) },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="categoryLabel" for="dashboard-category">
                  <Translate contentKey="datastudioApp.dashboard.category">Category</Translate>
                </Label>
                <AvField
                  id="dashboard-category"
                  type="text"
                  name="category"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="dashboard-description">
                  <Translate contentKey="datastudioApp.dashboard.description">Description</Translate>
                </Label>
                <AvField
                  id="dashboard-description"
                  type="text"
                  name="description"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    maxLength: { value: 100, errorMessage: translate('entity.validation.maxlength', { max: 100 }) },
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="publishedLabel">
                  <AvInput id="dashboard-published" type="checkbox" className="form-check-input" name="published" />
                  <Translate contentKey="datastudioApp.dashboard.published">Published</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="image_locationLabel" for="dashboard-image_location">
                  <Translate contentKey="datastudioApp.dashboard.image_location">Image Location</Translate>
                </Label>
                <AvField id="dashboard-image_location" type="text" name="image_location" />
              </AvGroup>
              <AvGroup>
                <Label id="image_content_typeLabel" for="dashboard-image_content_type">
                  <Translate contentKey="datastudioApp.dashboard.image_content_type">Image Content Type</Translate>
                </Label>
                <AvField id="dashboard-image_content_type" type="text" name="image_content_type" />
              </AvGroup>
              <AvGroup>
                <Label id="dashboard_datasource_idLabel" for="dashboard-dashboard_datasource_id">
                  <Translate contentKey="datastudioApp.dashboard.dashboard_datasource_id">Dashboard Datasource Id</Translate>
                </Label>
                <AvField id="dashboard-dashboard_datasource_id" type="string" className="form-control" name="dashboard_datasource_id" />
              </AvGroup>
              <AvGroup>
                <Label id="created_byLabel" for="dashboard-created_by">
                  <Translate contentKey="datastudioApp.dashboard.created_by">Created By</Translate>
                </Label>
                <AvField id="dashboard-created_by" type="text" name="created_by" />
              </AvGroup>
              <AvGroup>
                <Label id="created_dateLabel" for="dashboard-created_date">
                  <Translate contentKey="datastudioApp.dashboard.created_date">Created Date</Translate>
                </Label>
                <AvField id="dashboard-created_date" type="date" className="form-control" name="created_date" />
              </AvGroup>
              <AvGroup>
                <Label id="last_modified_byLabel" for="dashboard-last_modified_by">
                  <Translate contentKey="datastudioApp.dashboard.last_modified_by">Last Modified By</Translate>
                </Label>
                <AvField id="dashboard-last_modified_by" type="text" name="last_modified_by" />
              </AvGroup>
              <AvGroup>
                <Label id="last_modified_dateLabel" for="dashboard-last_modified_date">
                  <Translate contentKey="datastudioApp.dashboard.last_modified_date">Last Modified Date</Translate>
                </Label>
                <AvField id="dashboard-last_modified_date" type="date" className="form-control" name="last_modified_date" />
              </AvGroup>
              <AvGroup>
                <Label id="current_release_idLabel" for="dashboard-current_release_id">
                  <Translate contentKey="datastudioApp.dashboard.current_release_id">Current Release Id</Translate>
                </Label>
                <AvField id="dashboard-current_release_id" type="string" className="form-control" name="current_release_id" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/dashboard" replace color="info">
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
  dashboardEntity: storeState.dashboard.entity,
  loading: storeState.dashboard.loading,
  updating: storeState.dashboard.updating,
  updateSuccess: storeState.dashboard.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DashboardUpdate);
