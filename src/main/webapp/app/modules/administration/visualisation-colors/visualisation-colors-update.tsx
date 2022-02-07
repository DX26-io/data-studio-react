import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { getEntities, updateEntity, createEntity, reset, deleteEntity, setEntity } from './visualisation-colors.reducer';
import { Content, Dialog, Divider, Form, Heading, TextField, Button, useDialogContainer, Flex, Header, Text } from '@adobe/react-spectrum';
import Alert from '@spectrum-icons/workflow/Alert';

export interface IVisualisationColorsUpdateProps extends StateProps, DispatchProps {
  setOpen: (isOpen: boolean) => void;
}

const VisualisationColorsUpdate = (props: IVisualisationColorsUpdateProps) => {
  const dialog = useDialogContainer();

  const handleClose = () => {
    dialog.dismiss();
    props.setOpen(false);
    props.reset();
  };

  const save = () => {
    if (props.entity?.id) {
      props.updateEntity(props.entity);
    } else {
      props.createEntity(props.entity);
    }
    handleClose();
  };

  const remove = () => {
    props.deleteEntity(props.entity?.id);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      props.getEntities();
      handleClose();
    }
  }, [props.updateSuccess]);

  return (
    <Dialog data-testid="visualisation-colors-form-dialog">
      <Heading>
        <Flex alignItems="center" gap="size-100" data-testid="visualisation-colors-form-heading">
          {props.entity?.id ? (
            <Translate contentKey="visualisationColors.home.editLabel">Edit</Translate>
          ) : (
            <Translate contentKey="visualisationColors.home.createLabel">Create</Translate>
          )}
        </Flex>
      </Heading>
      <Header data-testid="visualisation-colors-form-action">
        <Flex alignItems="center" gap="size-100">
          <Button variant="secondary" onPress={handleClose} data-testid="visualisation-colors-form-cancel">
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button
            variant="cta"
            onPress={save}
            isDisabled={props.updating || !props.entity?.code}
            data-testid="visualisation-colors-form-submit"
          >
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </Flex>
      </Header>
      <Divider />
      <Content>
        <Form data-testid="visualisation-colors-form">
          <TextField
            value={props.entity.code ? props.entity.code : ''}
            onChange={event => {
              props.setEntity({ ...props.entity, code: event });
            }}
            label={translate('visualisationColors.field.code')}
            placeholder={translate('visualisationColors.field.code')}
          />
          {props.entity?.id ? (
            <React.Fragment>
              <span className="spectrum-Heading spectrum-Heading--sizeXXS">
                <Translate contentKey="entity.action.dangerZone">Danger Zone</Translate>
              </span>
              <Divider size="M" />{' '}
            </React.Fragment>
          ) : null}
        </Form>
        {props.entity?.id && (
          <Button data-testid="delete" variant="negative" onPress={remove} marginTop="size-175">
            <Translate contentKey="entity.action.delete">Delete</Translate>
          </Button>
        )}
        {!props.entity?.code && !props.entity?.id && (
          <Flex gap="size-100" data-testid="validation-error" marginTop="static-size-200">
            <Alert color="negative" />
            <Text marginBottom="size-300">
              <span className="spectrum-Body-emphasis error-message">
                <Translate contentKey="visualisationColors.error.code"></Translate>
              </span>
            </Text>
          </Flex>
        )}
      </Content>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  updateSuccess: storeState.visulisationColors.updateSuccess,
  entity: storeState.visulisationColors.entity,
  updating: storeState.visulisationColors.updating,
});

const mapDispatchToProps = {
  updateEntity,
  createEntity,
  deleteEntity,
  getEntities,
  setEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationColorsUpdate);
