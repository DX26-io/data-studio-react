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
import { updateStatus, updateRealm } from './realm.reducer';
import { updateName } from '../organisation.reducer';
import { toast } from 'react-toastify';

export interface IConfirmationDialogProps extends StateProps, DispatchProps {
  setUpdateSuccess: () => void;
  setOpen: (isOpen: boolean) => void;
}

const ConfirmationDialog = (props: IConfirmationDialogProps) => {
  const dialog = useDialogContainer();
  const [orgName, setOrgName] = useState('');

  const handleClose = () => {
    props.setOpen(false);
    dialog.dismiss();
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
      props.setUpdateSuccess();
      toast.success(translate('organisations.createSuccessMessages'));
    }
  }, [props.updateSuccess]);

  const save = () => {
    props.updateName(orgName);
  };

  return (
    <Dialog>
      <Heading>
        {' '}
        <Translate contentKey="organisations.create">Create Organisation</Translate>
      </Heading>
      <Divider />
      <Content>
        <Form>
          <TextField
            label={translate('organisations.name')}
            placeholder={translate('organisations.title')}
            minLength={3}
            validationState={orgName.length > 3 ? 'valid' : 'invalid'}
            type="text"
            value={orgName}
            onChange={event => {
              setOrgName(event);
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
        <Button variant="cta" onPress={save} isDisabled={props.updating || orgName.length < 3}>
          <Translate contentKey="entity.action.save">save</Translate>
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  updateSuccess: storeState.organisations.updateSuccess,
  realm: storeState.organisations.organisation,
  updating: storeState.organisations.updating,
});

const mapDispatchToProps = { updateStatus, updateRealm, updateName };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationDialog);
