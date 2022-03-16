import React from 'react';
import { Dialog, Heading, Divider, Content, ButtonGroup, Button, Form, TextField, DialogContainer } from '@adobe/react-spectrum';
import { getShareLinkUrl } from '../visualisation-edit-modal/visualisation-edit-modal-util';
import { Translate, translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { setVisualisationAction } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { toast } from 'react-toastify';

export const VisualisationShareModal = props => {
  const handleClose = () => {
    props.setVisualisationAction(null);
    toast.info(translate('canvas.copiedMessage'));
  };

  const copyDashboardUrl = () => {
    navigator.clipboard.writeText(getShareLinkUrl(props.view, props.visual.id));
    handleClose();
  };

  return (
    <DialogContainer onDismiss={handleClose}>
      <Dialog size="S" width={'100vw'}>
        <Heading level={4}>
          {translate('canvas.menu.share')} - {props.visual?.titleProperties?.titleText}
        </Heading>
        <Divider />
        <Content>
          <Form labelPosition="top" width="100%">
            <TextField isDisabled={true} autoFocus label="Copy URL" defaultValue={getShareLinkUrl(props.view, props.visual.id)} />
          </Form>
        </Content>
        <ButtonGroup>
          <Button variant="secondary" onPress={handleClose}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button onPress={copyDashboardUrl} variant="cta">
            <Translate contentKey="entity.action.copy">Copy</Translate>
          </Button>
        </ButtonGroup>
      </Dialog>
    </DialogContainer>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visual: storeState.visualmetadata.entity,
  view: storeState.views.entity,
});

const mapDispatchToProps = { setVisualisationAction };

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationShareModal);
