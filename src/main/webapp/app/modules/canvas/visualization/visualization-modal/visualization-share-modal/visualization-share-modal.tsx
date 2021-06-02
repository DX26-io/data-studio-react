import React, { useState, useRef, useEffect } from 'react';
import { Dialog, Heading, Divider, Content, ButtonGroup, Button, useDialogContainer, View, Form, TextField } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import TableView from 'app/shared/components/table/table';
import { CSVLink } from 'react-csv';

export interface IVisualizationShareModalProps {}

export const VisualizationShareModal = (props: IVisualizationShareModalProps) => {
  const dialog = useDialogContainer();

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
          onPress={() => {
            navigator.clipboard.writeText(window.location.href);
          }}
          variant="cta"
        >
          Copy
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};

export default VisualizationShareModal;
