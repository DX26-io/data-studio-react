import React from 'react';
import { Dialog, Heading, Divider, Content, ButtonGroup, Button, useDialogContainer, View, Form, TextField } from '@adobe/react-spectrum';
import { getShareLinkUrl } from '../visualisation-edit-modal/visualisation-edit-modal-util';
import { Translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';


export const VisualisationShareModal = (props) => {
  const dialog = useDialogContainer();

  const copyDashboardUrl = () => {
    navigator.clipboard.writeText(getShareLinkUrl(props.view, props.visual.id));
    dialog.dismiss();
  };

  return (
    <Dialog>
      <Heading level={4}>Share - {props.visual?.titleProperties?.titleText}</Heading>
      <Divider />
      <Content>
        <Form labelPosition="top" width="100%">
          <TextField autoFocus label="Copy URL" defaultValue={getShareLinkUrl(props.view, props.visual.id)} />
        </Form>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={dialog.dismiss}>
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button
          onPress={
            copyDashboardUrl
          }
          variant="cta"
        >
          <Translate contentKey="entity.action.copy">Copy</Translate>
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visual: storeState.visualmetadata.entity,
  view: storeState.views.entity,
});

export default connect(mapStateToProps, null)(VisualisationShareModal);
