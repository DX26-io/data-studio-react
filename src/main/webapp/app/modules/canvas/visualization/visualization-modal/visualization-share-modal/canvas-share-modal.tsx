import React from 'react';
import { Dialog, Heading, Divider, Content, ButtonGroup, Button, useDialogContainer, View, Form, TextField } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';

export const CanvasShareModal = () => {
  const dialog = useDialogContainer();

  const copyDashboardUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    dialog.dismiss();
  };

  return (
    <Dialog>
      <Heading level={4}>Share</Heading>
      <Divider />
      <Content>
        <Form labelPosition="side" width="100%">
          <TextField autoFocus label="Copy URL" defaultValue={window.location.href} />
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

export default CanvasShareModal;
