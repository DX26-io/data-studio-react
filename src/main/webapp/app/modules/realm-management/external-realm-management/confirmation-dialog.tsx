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
import { updateStatus, updateRealm } from './realm.reducer';

export interface IConfirmationDialogProps extends StateProps, DispatchProps {
  setUpdateSuccess: () => void;
  setOpen: (isOpen: boolean) => void;
}

const ConfirmationDialog = (props: IConfirmationDialogProps) => {
  const dialog = useDialogContainer();

  const handleClose = () => {
    props.setOpen(false);
    dialog.dismiss();
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
      props.setUpdateSuccess();
    }
  }, [props.updateSuccess]);

  const handleConfirm = () => {
    props.updateStatus(!props.realm.isActive, props.realm.id);
  };

  return (
    <Dialog>
      <Heading>
        {' '}
        <Translate contentKey="realms.update">Update Realm</Translate>
      </Heading>
      <Header>
        {' '}
        <Translate contentKey="realms.realm">Realm</Translate>{' : '}
        {props.realm?.name}
      </Header>
      <Divider />
      <Content>
        <Text>
          <Translate
            contentKey="realms.confirmMessage"
            interpolate={{
              name: props.realm?.name,
              status: props.realm?.isActive ? (
                <Translate contentKey="realms.deactivate">Deactivate</Translate>
              ) : (
                <Translate contentKey="realms.activate">Activate</Translate>
              ),
            }}
          ></Translate>
        </Text>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={handleClose}>
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button variant="cta" onPress={handleConfirm} isDisabled={props.updating}>
          <Translate contentKey="entity.action.confirm">Confirm</Translate>
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  updateSuccess: storeState.realms.updateSuccess,
  realm: storeState.realms.realm,
  updating: storeState.realms.updating,
});

const mapDispatchToProps = { updateStatus, updateRealm };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationDialog);
