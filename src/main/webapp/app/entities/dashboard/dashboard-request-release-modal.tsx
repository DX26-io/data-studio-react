import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import { requestRelease, setRequestReleaseUpdateSuccess } from './dashboard.reducer';
import { IRootState } from 'app/shared/reducers';
import {
  Flex,
  useDialogContainer,
  Dialog,
  Heading,
  Divider,
  Content,
  Form,
  Button,
  TextArea,
  Header,
  Checkbox,
} from '@adobe/react-spectrum';
import { IDashboard } from 'app/shared/model/dashboard.model';
import { getDashboardViewEntities } from 'app/entities/views/views.reducer';
import { reset } from './dashboard.reducer';
import { setDashboardReleaseRequest } from 'app/modules/administration/release-management/releases.reducer';

export interface IDashboardRequestReleaseDialogProps extends StateProps, DispatchProps {
  setOpen: (isOpen: boolean) => void;
  dashboard: IDashboard;
}

export const DashboardRequestReleaseDialog = (props: IDashboardRequestReleaseDialogProps) => {
  const dialog = useDialogContainer();

  useEffect(() => {
    props.getDashboardViewEntities(props.dashboard.id, 0, 20, 'id,asc');
  }, []);

  const handleClose = () => {
    props.setRequestReleaseUpdateSuccess(false);
    props.setDashboardReleaseRequest({ comment: '', viewIds: [] });
    props.setOpen(false);
    dialog.dismiss();
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const save = () => {
    props.requestRelease(props.dashboard.id, props.dashboardReleaseRequest);
  };

  return (
    <Dialog data-testid="request-release-form-dialog">
      <Heading>
        <Flex alignItems="center" gap="size-100" data-testid="request-release-form-heading">
          <Translate contentKey="releases.home.request">Release request</Translate>
        </Flex>
      </Heading>
      <Header data-testid="request-release-form-action">
        <Flex alignItems="center" gap="size-100">
          <Button variant="secondary" onPress={handleClose} data-testid="request-release-form-cancel">
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button
            variant="cta"
            onPress={save}
            isDisabled={props.updating || (props.views && props.views.length === 0) || props.dashboardReleaseRequest.viewIds.length === 0}
            data-testid="request-release-form-submit"
          >
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </Flex>
      </Header>
      <Divider />
      <Content>
        <p className="spectrum-Body-emphasis--sizeS">
          {translate('releases.dashboardRequestReleaseLabel', { param: props.dashboard.dashboardName })}
        </p>
        <p className="spectrum-Body-emphasis--sizeS">{translate('releases.selectViewLabel', { param: props.dashboard.dashboardName })}</p>
        <Flex direction="row" wrap="wrap" gap="size-100">
          {props.views &&
            props.views.length > 0 &&
            props.views.map(view => (
              <Checkbox
                key={view.id}
                isEmphasized
                isSelected={props.dashboardReleaseRequest.viewIds.includes(view.id)}
                onChange={event => {
                  view.selected = event;
                  if (event) {
                    props.dashboardReleaseRequest.viewIds.push(view.id);
                  } else {
                    const index = props.dashboardReleaseRequest.viewIds.findIndex(id => id === view.id);
                    if (index > -1) {
                      props.dashboardReleaseRequest.viewIds.splice(index, 1);
                    }
                  }
                  props.setDashboardReleaseRequest(props.dashboardReleaseRequest);
                }}
              >
                {view.viewName}
              </Checkbox>
            ))}
        </Flex>
        {props.views && props.views.length === 0 && (
          <span className="spectrum-Body-emphasis error-message">
            <Translate contentKey="releases.error">
              You cannot request a release for this dashboard, because the dashboard does not have a view.
            </Translate>
          </span>
        )}
        <Form data-testid="request-release-form">
          <TextArea
            label={translate('releases.comment')}
            type="text"
            isDisabled={props.dashboardReleaseRequest.viewIds.length === 0}
            value={props.dashboardReleaseRequest.comment ? props.dashboardReleaseRequest.comment : ''}
            onChange={event => {
              props.setDashboardReleaseRequest({ ...props.dashboardReleaseRequest, comment: event });
            }}
            autoFocus
            data-testid="comment"
          />
        </Form>
      </Content>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  updating: storeState.dashboard.updating,
  updateSuccess: storeState.dashboard.releaseRequestUpdateSuccess,
  views: storeState.views.entities,
  dashboardReleaseRequest: storeState.releases.dashboardReleaseRequest,
});

const mapDispatchToProps = { setRequestReleaseUpdateSuccess, requestRelease, getDashboardViewEntities, reset, setDashboardReleaseRequest };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DashboardRequestReleaseDialog);
