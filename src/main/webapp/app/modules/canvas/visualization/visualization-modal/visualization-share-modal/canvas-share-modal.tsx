import React from 'react';
import { Dialog, Heading, Divider, Content, ButtonGroup, Button, useDialogContainer, View, Form, TextField } from '@adobe/react-spectrum';

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

export default CanvasShareModal;
