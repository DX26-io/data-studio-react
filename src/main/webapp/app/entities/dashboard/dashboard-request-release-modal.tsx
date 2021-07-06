import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import { requestRelease } from './dashboard.reducer';
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

export interface IDashboardRequestReleaseDialogProps extends StateProps, DispatchProps {
  setOpen: (isOpen: boolean) => void;
  dashboard: IDashboard;
}

export const DashboardRequestReleaseDialog = (props: IDashboardRequestReleaseDialogProps) => {
  const [comment, setComment] = useState<string>();
  const [viewIds, setViewIds] = useState([]);

  const dialog = useDialogContainer();

  useEffect(() => {
    props.getDashboardViewEntities(props.dashboard.id, 0, 20, 'id,asc');
  }, []);

  const handleClose = () => {
    props.setOpen(false);
    dialog.dismiss();
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const save = () => {
    props.requestRelease(props.dashboard.id, comment, viewIds);
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
          <Button variant="cta" onPress={save} isDisabled={props.updating} data-testid="request-release-form-submit">
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
                isSelected={view.selected}
                onChange={event => {
                  view.selected = event;
                  if (event) {
                    viewIds.push(view.id);
                  } else {
                    const index = viewIds.findIndex(id => id === view.id);
                    if (index > -1) {
                      viewIds.splice(index, 1);
                    }
                  }
                  setViewIds(viewIds);
                }}
              >
                {view.viewName}
              </Checkbox>
            ))}
        </Flex>
        <Form data-testid="request-release-form">
          <TextArea
            label={translate('releases.comment')}
            type="text"
            value={comment}
            onChange={setComment}
            autoFocus
            isRequired
            data-testid="comment"
          />
        </Form>
      </Content>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  updating: storeState.dashboard.updating,
  updateSuccess: storeState.dashboard.updateSuccess,
  views: storeState.views.entities,
});

const mapDispatchToProps = { requestRelease, getDashboardViewEntities };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DashboardRequestReleaseDialog);
