import React from 'react';
import { Dialog, Heading, Divider, Content, ButtonGroup, Button, useDialogContainer, View, Form, TextField } from '@adobe/react-spectrum';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { IViews } from 'app/shared/model/views.model';
import { getSharePath } from '../visualization-edit-modal/visualization-edit-modal-util';

export interface IVisualizationShareModalProps {
  view: IViews;
  visual: IVisualMetadataSet;
}

export const VisualizationShareModal = (props: IVisualizationShareModalProps) => {
  const dialog = useDialogContainer();

  const copyDashboardUrl = () => {
    navigator.clipboard.writeText(getSharePath(props.view,props.visual.id));
    dialog.dismiss();
  };

  return (
    <Dialog>
      <Heading level={4}>Share - {props.visual?.titleProperties?.titleText}</Heading>
      <Divider />
      <Content>
        <Form labelPosition="side" width="100%">
          <TextField autoFocus label="Copy URL" defaultValue={getSharePath(props.view,props.visual.id)} />
        </Form>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={dialog.dismiss}>
          Cancel
        </Button>
        <Button
          onPress={
            copyDashboardUrl
          }
          variant="cta"
        >
          Copy
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};

export default VisualizationShareModal;
