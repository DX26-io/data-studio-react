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
  Form,
  TextField,
} from '@adobe/react-spectrum';
import { translate, Translate } from 'react-jhipster';
import { createRealm, setRealm, reset } from './realm.reducer';
import { toast } from 'react-toastify';

export interface IRealmUpdateProps extends StateProps, DispatchProps {
  setUpdateSuccess: () => void;
  setOpen: (isOpen: boolean) => void;
}

const RealmUpdate = (props: IRealmUpdateProps) => {
  const dialog = useDialogContainer();

  const handleClose = () => {
    props.setOpen(false);
    dialog.dismiss();
    props.reset();
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
      props.setUpdateSuccess();
      toast.success(translate('realms.createSuccessMessages'));
    }
  }, [props.updateSuccess]);

  const save = () => {
    props.createRealm({...props.realm,organisation:props.account.organisation});
  };

  return (
    <Dialog>
      <Heading>
        {' '}
        <Translate contentKey="realms.create">Create Realm</Translate>
      </Heading>
      <Divider />
      <Content>
        <Form>
          <TextField
            label={translate('realms.name')}
            placeholder={translate('realms.title')}
            minLength={3}
            validationState={props.realm?.name.length > 3 ? 'valid' : 'invalid'}
            type="text"
            value={props.realm?.name}
            onChange={event => {
              props.setRealm({ ...props.realm, name: event, isActive: true });
            }}
            autoFocus
            isRequired
          />
        </Form>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={handleClose}>
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button variant="cta" onPress={save} isDisabled={props.updating || !props.realm?.name || props.realm?.name.length < 3}>
          <Translate contentKey="entity.action.save">save</Translate>
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  updateSuccess: storeState.realms.updateSuccess,
  realm: storeState.realms.realm,
  updating: storeState.realms.updating,
  account: storeState.authentication.account,
});

const mapDispatchToProps = { setRealm, createRealm, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RealmUpdate);
