import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './views.reducer';
import { IViews } from 'app/shared/model/views.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IViewsUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ViewsUpdate = (props: IViewsUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { viewsEntity, loading, updating } = props;

  const { image, imageContentType } = viewsEntity;

  const handleClose = () => {
    props.history.push('/views' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  const onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType), isAnImage);
  };

  const clearBlob = name => () => {
    props.setBlob(name, undefined, undefined);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...viewsEntity,
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
          <h2 id="datastudioApp.views.home.createOrEditLabel">
            <Translate contentKey="datastudioApp.views.home.createOrEditLabel">Create or edit a Views</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : viewsEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="views-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="views-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="viewNameLabel" for="views-viewName">
                  <Translate contentKey="datastudioApp.views.viewName">View Name</Translate>
                </Label>
                <AvField id="views-viewName" type="text" name="viewName" />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="views-description">
                  <Translate contentKey="datastudioApp.views.description">Description</Translate>
                </Label>
                <AvField
                  id="views-description"
                  type="text"
                  name="description"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    maxLength: { value: 100, errorMessage: translate('entity.validation.maxlength', { max: 100 }) },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="views-createdBy">
                  <Translate contentKey="datastudioApp.views.createdBy">Created By</Translate>
                </Label>
                <AvField id="views-createdBy" type="text" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="lastModifiedByLabel" for="views-lastModifiedBy">
                  <Translate contentKey="datastudioApp.views.lastModifiedBy">Last Modified By</Translate>
                </Label>
                <AvField id="views-lastModifiedBy" type="text" name="lastModifiedBy" />
              </AvGroup>
              <AvGroup>
                <Label id="lastModifiedDateLabel" for="views-lastModifiedDate">
                  <Translate contentKey="datastudioApp.views.lastModifiedDate">Last Modified Date</Translate>
                </Label>
                <AvField id="views-lastModifiedDate" type="date" className="form-control" name="lastModifiedDate" />
              </AvGroup>
              <AvGroup check>
                <Label id="publishedLabel">
                  <AvInput id="views-published" type="checkbox" className="form-check-input" name="published" />
                  <Translate contentKey="datastudioApp.views.published">Published</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <AvGroup>
                  <Label id="imageLabel" for="image">
                    <Translate contentKey="datastudioApp.views.image">Image</Translate>
                  </Label>
                  <br />
                  {image ? (
                    <div>
                      {imageContentType ? (
                        <a onClick={openFile(imageContentType, image)}>
                          <img src={`data:${imageContentType};base64,${image}`} style={{ maxHeight: '100px' }} />
                        </a>
                      ) : null}
                      <br />
                      <Row>
                        <Col md="11">
                          <span>
                            {imageContentType}, {byteSize(image)}
                          </span>
                        </Col>
                        <Col md="1">
                          <Button color="danger" onClick={clearBlob('image')}>
                            <FontAwesomeIcon icon="times-circle" />
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ) : null}
                  <input id="file_image" type="file" onChange={onBlobChange(true, 'image')} accept="image/*" />
                  <AvInput type="hidden" name="image" value={image} />
                </AvGroup>
              </AvGroup>
              <AvGroup>
                <Label id="viewDashboardLabel" for="views-viewDashboard">
                  <Translate contentKey="datastudioApp.views.viewDashboard">View Dashboard</Translate>
                </Label>
                <AvField id="views-viewDashboard" type="text" name="viewDashboard" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/views" replace color="info">
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
  viewsEntity: storeState.views.entity,
  loading: storeState.views.loading,
  updating: storeState.views.updating,
  updateSuccess: storeState.views.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ViewsUpdate);
