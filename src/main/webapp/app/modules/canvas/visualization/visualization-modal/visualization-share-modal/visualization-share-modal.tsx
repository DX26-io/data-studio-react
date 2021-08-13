import React from 'react';
import { Dialog, Heading, Divider, Content, ButtonGroup, Button, useDialogContainer, View, Form, TextField } from '@adobe/react-spectrum';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { IViews } from 'app/shared/model/views.model';
import { getShareLinkUrl } from '../visualization-edit-modal/visualization-edit-modal-util';
import { Translate } from 'react-jhipster';

export interface IVisualizationShareModalProps {
  view: IViews;
  visual: IVisualMetadataSet;
}

export const VisualizationShareModal = (props: IVisualizationShareModalProps) => {
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
        <Form labelPosition="side" width="100%">
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

export default VisualizationShareModal;
