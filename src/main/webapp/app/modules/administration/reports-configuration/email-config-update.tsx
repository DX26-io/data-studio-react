import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import Alert from '@spectrum-icons/workflow/Alert';
import { Flex, useDialogContainer, Dialog, Heading, Divider, Content, Form, Button, TextField, Header, Text } from '@adobe/react-spectrum';
import { fetchEmailConfig, createEmailConfig, deleteChannelConfig, reset } from './reports-configuration.reducer';
import ChannelProperty from './channel-property';
import { isFormValid } from './reports-configuration.util';

export interface IEmailConfigUpdateProps extends StateProps, DispatchProps {
  setOpen: (isOpen: boolean) => void;
  properties: any;
  history: any;
  match: any;
}

export const EmailConfigUpdate = (props: IEmailConfigUpdateProps) => {
  const { setOpen, properties, emailConfig, updating, updateSuccess, history, match } = props;
  const [error, setError] = React.useState({ message: '', isValid: false });

  const dialog = useDialogContainer();

  useEffect(() => {
    props.fetchEmailConfig(0);
  }, []);

  const handleClose = () => {
    setOpen(false);
    dialog.dismiss();
    props.reset();
    history.push(`${match.url}?channel=`);
  };

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const save = () => {
    const errorObj = isFormValid(emailConfig, properties);
    setError(errorObj);
    if (errorObj.isValid) {
      props.createEmailConfig(emailConfig);
    }
  };

  const remove = () => {
    props.deleteChannelConfig(emailConfig.id);
  };

  return (
    <Dialog data-testid="email-config-form-dialog">
      <Heading>
        <Flex alignItems="center" gap="size-100" data-testid="email-config-form-heading">
          {emailConfig.id ? (
            <Translate contentKey="reportsManagement.reportConfiguration.email.updateLabel">Update Email Configurationp</Translate>
          ) : (
            <Translate contentKey="reportsManagement.reportConfiguration.email.createLabel">Create Email Configuration</Translate>
          )}
        </Flex>
      </Heading>
      <Header data-testid="email-config-form-action">
        <Flex alignItems="center" gap="size-100">
          <Button variant="secondary" onPress={handleClose} data-testid="email-config-form-cancel">
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button variant="cta" onPress={save} isDisabled={updating} data-testid="email-config-form-submit">
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </Flex>
      </Header>
      <Divider />
      <Content>
        <Form data-testid="email-config-form">
          {props.fetchedEmailConfig &&
            properties.map(property => <ChannelProperty key={property.fieldName} property={property} config={emailConfig} />)}
          {emailConfig.id ? (
            <React.Fragment>
              <span className="spectrum-Heading spectrum-Heading--sizeXXS">
                <Translate contentKey="entity.action.dangerZone">Danger Zone</Translate>
              </span>
              <Divider size="M" />{' '}
            </React.Fragment>
          ) : null}
        </Form>
        {emailConfig.id ? (
          <Button data-testid="delete" variant="negative" onPress={remove} marginTop="size-175">
            <Translate contentKey="entity.action.delete">Delete</Translate>
          </Button>
        ) : null}
        {error.message && (
          <Flex gap="size-100" data-testid="validation-error" marginTop="static-size-200">
            <Alert color="negative" />
            <Text marginBottom="size-300">
              <span className="spectrum-Body-emphasis error-message">{error.message}</span>
            </Text>
          </Flex>
        )}
      </Content>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  emailConfig: storeState.reportConfiguration.emailConfig,
  loading: storeState.reportConfiguration.loading,
  updating: storeState.reportConfiguration.updating,
  updateSuccess: storeState.reportConfiguration.updateSuccess,
  fetchedEmailConfig: storeState.reportConfiguration.fetchedEmailConfig,
});

const mapDispatchToProps = { fetchEmailConfig, createEmailConfig, deleteChannelConfig, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EmailConfigUpdate);
