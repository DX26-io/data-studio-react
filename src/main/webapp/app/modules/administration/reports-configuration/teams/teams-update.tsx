import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { isFormValid } from '../reports-configuration.util';
import Alert from '@spectrum-icons/workflow/Alert';
import AlertCircle from '@spectrum-icons/workflow/AlertCircle';
import { Flex, useDialogContainer, Dialog, Heading, Divider, Content, Form, Button, TextField, Header, Text } from '@adobe/react-spectrum';
import ChannelProperty from '../channel-property';
import { createTeamConfig, updateTeamConfig, deleteChannelConfig, resetTeamConfig } from '../reports-configuration.reducer';

export interface ITeamsUpdateProps extends StateProps, DispatchProps {
  setUpdateSuccess: () => void;
  setOpen: (isOpen: boolean) => void;
  properties: any;
}

export const TeamsUpdate = (props: ITeamsUpdateProps) => {
  const { setOpen, setUpdateSuccess, updating, updateSuccess, teamConfig, properties } = props;
  const [name, setName] = useState('');
  const [error, setError] = useState({ message: '', isValid: false });

  const dialog = useDialogContainer();

  const handleClose = () => {
    setOpen(false);
    dialog.dismiss();
    props.resetTeamConfig();
  };

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
      setUpdateSuccess();
    }
  }, [updateSuccess]);

  const save = () => {
    const errorObj = isFormValid(teamConfig, properties);
    setError(errorObj);
    {
      if (teamConfig.id) {
        props.updateTeamConfig(teamConfig);
      } else {
        props.createTeamConfig(teamConfig);
      }
    }
  };

  const remove = () => {
    props.deleteChannelConfig(teamConfig.id);
  };

  return (
    <Dialog data-testid="team-config-form-dialog">
      <Heading>
        <Flex alignItems="center" gap="size-100" data-testid="team-config-form-heading">
          {teamConfig.id ? (
            <Translate contentKey="reportsManagement.reportConfiguration.teams.updateLabel">Update MS Teams Configurationp</Translate>
          ) : (
            <Translate contentKey="reportsManagement.reportConfiguration.teams.createLabel">Create MS Teams Configuration</Translate>
          )}
        </Flex>
      </Heading>
      <Header data-testid="team-config-form-action">
        <Flex alignItems="center" gap="size-100">
          <Button variant="secondary" onPress={handleClose} data-testid="team-config-form-cancel">
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button variant="cta" onPress={save} isDisabled={updating} data-testid="team-config-form-submit">
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </Flex>
      </Header>
      <Divider />
      <Content>
        <Form data-testid="team-config-form">
          {properties.map(property => (
            <ChannelProperty key={property.fieldName} property={property} config={teamConfig} />
          ))}
          {teamConfig.id ? (
            <React.Fragment>
              <span className="spectrum-Heading spectrum-Heading--sizeXXS">
                <Translate contentKey="entity.action.dangerZone">Danger Zone</Translate>
              </span>
              <Divider size="M" />{' '}
            </React.Fragment>
          ) : null}
        </Form>
        {teamConfig.id ? (
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
  teamConfig: storeState.reportConfiguration.teamConfig,
  updateSuccess: storeState.reportConfiguration.updateSuccess,
  updating: storeState.reportConfiguration.updating,
});

const mapDispatchToProps = { createTeamConfig, updateTeamConfig, deleteChannelConfig, resetTeamConfig };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TeamsUpdate);
