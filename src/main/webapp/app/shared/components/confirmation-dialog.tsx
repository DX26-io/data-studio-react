import React, { useState, useEffect, ReactText } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Divider,
  Header,
  Heading,
  Text,
  DialogContainer,
  useDialogContainer,
} from '@adobe/react-spectrum';
import { translate, Translate } from 'react-jhipster';

export interface IConfirmationDialogProps {
  setUpdateSuccess: () => void;
  setOpen: (isOpen: boolean) => void;
  updateSuccess: boolean;
  updating: boolean;
  entity: any;
  updateStatus: (isActive: boolean, id: number) => void;
  updateContentKey: string;
  titleContentKey: string;
  confirmMessageContentKey: string;
}

const ConfirmationDialog: React.FC<IConfirmationDialogProps> = ({
  setUpdateSuccess,
  setOpen,
  updateSuccess,
  entity,
  updating,
  updateStatus,
  updateContentKey,
  titleContentKey,
  confirmMessageContentKey,
}) => {
  const dialog = useDialogContainer();

  const handleClose = () => {
    setOpen(false);
    dialog.dismiss();
  };

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
      setUpdateSuccess();
    }
  }, [updateSuccess]);

  const handleConfirm = () => {
    updateStatus(!entity.isActive, entity.id);
  };

  return (
    <Dialog>
      <Heading>
        {' '}
        <Translate contentKey={updateContentKey}>Update</Translate>
      </Heading>
      <Header>
        {' '}
        <Translate contentKey={titleContentKey}>Entity</Translate>
        {' : '}
        {entity?.name}
      </Header>
      <Divider />
      <Content>
        <Text>
          <Translate
            contentKey={confirmMessageContentKey}
            interpolate={{
              name: entity?.name,
              status: entity?.isActive ? (
                <Translate contentKey="entity.action.deactivate">Deactivate</Translate>
              ) : (
                <Translate contentKey="entity.action.activate">Activate</Translate>
              ),
            }}
          ></Translate>
        </Text>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={handleClose}>
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button variant="cta" onPress={handleConfirm} isDisabled={updating}>
          <Translate contentKey="entity.action.confirm">Confirm</Translate>
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};

export default ConfirmationDialog;
