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
// import { updateStatus, updateRealm } from './organisation.reducer';

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
    // props.updateStatus(!props.organisation.isActive, props.organisation.id);
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
        {props.organisation?.name}
      </Header>
      <Divider />
      <Content>
        <Text>
          <Translate
            contentKey="realms.confirmMessage"
            interpolate={{
              name: props.organisation?.name,
              status: props.organisation?.isActive ? (
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
  updateSuccess: storeState.organisations.updateSuccess,
  organisation: storeState.organisations.organisation,
  updating: storeState.organisations.updating,
});

const mapDispatchToProps = {  };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationDialog);
