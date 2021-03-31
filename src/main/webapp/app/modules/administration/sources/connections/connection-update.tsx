import React, { useState, useEffect, ReactText } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import { updateConnection, deleteConnection, setConnection, resetConnection } from './connection.reducer';
import { IRootState } from 'app/shared/reducers';
import { isFormValid } from './connections.util';
import Alert from '@spectrum-icons/workflow/Alert';
import {
  Flex,
  useDialogContainer,
  Dialog,
  Heading,
  Divider,
  Content,
  Form,
  Button,
  TextField,
  Header,
  Checkbox,
  Text,
} from '@adobe/react-spectrum';
import { IError, defaultValue } from 'app/shared/model/error.model';
import { IConnection } from 'app/shared/model/connection.model';

export interface IConnectionUpdateProps extends StateProps, DispatchProps {
  setUpdateSuccess: () => void;
  setOpen: (isOpen: boolean) => void;
  connection: IConnection;
}

export const ConnectionUpdate = (props: IConnectionUpdateProps) => {
  const dialog = useDialogContainer();

  const { setOpen, setUpdateSuccess, updateSuccess, connection, updating } = props;
  const [connectionName, setConnectionName] = React.useState(connection.name);
  const [userName, setUserName] = React.useState(connection.connectionUsername);
  const [password, setPassword] = React.useState(connection.connectionPassword);
  const x = Boolean(connection.connectionParameters.cacheEnabled);
  const [cacheEnabled, setEnableCache] = React.useState(
    connection.connectionParameters.cacheEnabled && typeof connection.connectionParameters.cacheEnabled === 'string' ? JSON.parse(connection.connectionParameters.cacheEnabled) : false
  );
  const [cachePurgeAfterMinutes, setCachePurgeAfterMinutes] = React.useState(connection.connectionParameters.cachePurgeAfterMinutes);
  const [refreshAfterTimesRead, setRefreshAfterTimesRead] = React.useState(connection.connectionParameters.refreshAfterTimesRead);
  const [refreshAfterMinutes, setRefreshAfterMinutes] = React.useState(connection.connectionParameters.refreshAfterMinutes);
  const [error, setError] = React.useState<IError>(defaultValue);

  const handleClose = () => {
    setOpen(false);
    dialog.dismiss();
    props.resetConnection();
  };

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
      setUpdateSuccess();
    }
  }, [updateSuccess]);

  const saveConnection = () => {
    if (error.isValid) {
      props.updateConnection({ ...connection, name: connectionName, connectionUsername: userName, connectionPassword: password });
    }
  };

  const raiseError = (conn: IConnection) => {
    const errorObj = isFormValid(conn);
    setError(errorObj);
  };

  return (
    <Dialog data-testid="connection-form-dialog">
      <Heading>
        <Flex alignItems="center" gap="size-100" data-testid="connection-form-heading">
          <Translate contentKey="connections.home.updateLabel">Update Connection</Translate>
        </Flex>
      </Heading>
      <Header data-testid="connection-form-action">
        <Flex alignItems="center" gap="size-100">
          <Button variant="secondary" onPress={handleClose} data-testid="connection-form-cancel">
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button variant="cta" onPress={saveConnection} isDisabled={updating || !error.isValid} data-testid="connection-form-submit">
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </Flex>
      </Header>
      <Divider />
      <Content>
        <Form data-testid="connection-form">
          <TextField
            label={translate('datasources.dataConnection.connectionName')}
            onChange={event => {
              setConnectionName(event);
              raiseError({ ...connection, name: event });
            }}
            value={connectionName}
            isRequired
          />
          <TextField
            type="text"
            label={translate('datasources.dataConnection.userName')}
            onChange={event => {
              setUserName(event);
              raiseError({ ...connection, connectionUsername: event });
            }}
            value={userName}
          />
          <TextField
            type="password"
            label={translate('datasources.dataConnection.password')}
            onChange={event => {
              setPassword(event);
              raiseError({ ...connection, connectionPassword: event });
            }}
            value={password}
          />

          <Checkbox
            onChange={event => {
              connection.connectionParameters.cacheEnabled = event;
              setEnableCache(connection.connectionParameters.cacheEnabled);
            }}
            isSelected={Boolean(cacheEnabled)}
            isEmphasized
          >
            <Translate contentKey="datasources.cacheProperty.cacheEnabled">Enable cache</Translate>
          </Checkbox>
          <TextField
            type="number"
            isDisabled={!cacheEnabled}
            label={translate('datasources.cacheProperty.cachePurgeAfterMinutes')}
            isRequired={cacheEnabled}
            value={String(cachePurgeAfterMinutes)}
            onChange={event => {
              connection.connectionParameters.cachePurgeAfterMinutes = Number(event);
              setCachePurgeAfterMinutes(Number(event));
              raiseError(connection);
            }}
          />
          <TextField
            type="number"
            isDisabled={!cacheEnabled}
            label={translate('datasources.cacheProperty.refreshAfterTimesRead')}
            isRequired={cacheEnabled}
            value={String(refreshAfterTimesRead)}
            onChange={event => {
              connection.connectionParameters.refreshAfterTimesRead = Number(event);
              setRefreshAfterTimesRead(Number(event));
              raiseError(connection);
            }}
          />
          <TextField
            type="number"
            isDisabled={!cacheEnabled}
            label={translate('datasources.cacheProperty.refreshAfterMinutes')}
            isRequired={cacheEnabled}
            value={String(refreshAfterMinutes)}
            onChange={event => {
              connection.connectionParameters.refreshAfterMinutes = Number(event);
              setRefreshAfterMinutes(Number(event));
              raiseError(connection);
            }}
          />
        </Form>
        {!error.isValid && (
          <Flex gap="size-100" data-testid="validation-error" marginTop="static-size-200">
            <Alert color="negative" />
            <Text marginBottom="size-300">
              <span className="spectrum-Body-emphasis error-message">
                <Translate contentKey={error.translationKey}></Translate>
              </span>
            </Text>
          </Flex>
        )}
      </Content>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  updating: storeState.connections.updating,
  updateSuccess: storeState.connections.updateSuccess,
});

const mapDispatchToProps = { updateConnection, deleteConnection, setConnection, resetConnection };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionUpdate);
