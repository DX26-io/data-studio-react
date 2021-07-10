import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import { requestRelease,reset } from './views.reducer';
import { IRootState } from 'app/shared/reducers';
import { Flex, useDialogContainer, Dialog, Heading, Divider, Content, Form, Button, TextArea, Header, Text } from '@adobe/react-spectrum';

export interface IViewRequestReleaseDialogProps extends StateProps, DispatchProps {
  setOpen: (isOpen: boolean) => void;
  viewId: any;
}

export const ViewRequestReleaseDialog = (props: IViewRequestReleaseDialogProps) => {
  const [comment, setComment] = useState<string>();

  const dialog = useDialogContainer();

  const handleClose = () => {
    props.setOpen(false);
    dialog.dismiss();
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
      props.reset();
    }
  }, [props.updateSuccess]);

  const save = () => {
    props.requestRelease(comment, props.viewId);
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
        <span className="spectrum-Body-emphasis--sizeS">{translate('releases.viewRequestReleaseLabel', { param: props.viewId })}</span>
        <Form data-testid="request-release-form">
          <TextArea
            label={translate('releases.comment')}
            type="text"
            value={comment}
            onChange={setComment}
            autoFocus
            data-testid="comment"
          />
        </Form>
      </Content>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  updating: storeState.views.updating,
  updateSuccess: storeState.views.updateSuccess,
});

const mapDispatchToProps = { requestRelease,reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ViewRequestReleaseDialog);
