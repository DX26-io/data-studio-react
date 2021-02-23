import React, { useState, useEffect, ReactText } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { Button, Flex, Picker, Item, TextField, Form, ProgressBar, Text } from '@adobe/react-spectrum';
import { getConnectionsByConnectionTypeId } from '../../connections/connections.reducer';
import {
  SELECT_CONNECTION_PLACEHOLDER,
  CONFIGURE_DATABASE_SERVER_LABEL,
  DATABASE_NAME_LABEL,
  PASSWORD_LABEL,
  PORT_LABEL,
  SERVER_ADDRESS_LABEL,
  TEST_CONNECTION_LABEL,
  USERNAME_LABEL,
  CONNECTION_NAME_LABEL,
  prepareConnection,
} from './datasource-util';
import ConnectionProperty from './connection-property';
import { selectConnection } from './datasource-steps.reducer';
import { queryToConnection } from '../datasources.reducer';
import { Translate } from 'react-jhipster';
import Checkmark from '@spectrum-icons/workflow/Checkmark';
import Alert from '@spectrum-icons/workflow/Alert';

export interface IDataConnectionProps extends StateProps, DispatchProps {
  connectionType: any;
}

export const DataConnection = (props: IDataConnectionProps) => {
  const { connections, connectionType, errorMessage, isConnected, loading } = props;
  const [connectionName, setConnectionName] = React.useState();
  const [userName, setUserName] = React.useState();
  const [password, setPassword] = React.useState();
  const [connectionId, setConnection] = React.useState<ReactText>(props.connection ? props.connection.id.toString() : '');

  const setFields = c => {
    setConnectionName(c.name);
    setUserName(c.connectionUsername);
    setPassword(c.connectionPassword);
  };

  const testConnection = () => {
    const payload = {};
    payload['connection'] = prepareConnection(props.connection, connectionType);
    props.queryToConnection(payload);
  };

  useEffect(() => {
    if (props.connection) {
      setFields(props.connection);
    }
    props.getConnectionsByConnectionTypeId(connectionType.id);
  }, []);

  return (
    <Flex direction="column" gap="size-100" alignItems="center">
      <Form isRequired necessityIndicator="icon" minWidth="size-4600">
        <Picker
          disallowEmptySelection={false}
          placeholder={SELECT_CONNECTION_PLACEHOLDER}
          label={CONFIGURE_DATABASE_SERVER_LABEL}
          items={connections}
          selectedKey={connectionId}
          defaultSelectedKey={connectionId}
          onSelectionChange={selected => {
            setConnection(selected);
            const result = connections.filter(con => con.id.toString() === selected.toString())[0];
            setFields(result);
            props.selectConnection(result);
          }}
        >
          {item => <Item key={item.id}>{item.name}</Item>}
        </Picker>
        <TextField
          label={CONNECTION_NAME_LABEL}
          onChange={setConnectionName}
          value={connectionName}
          isDisabled={props.disabledDataConnection}
          isRequired={!props.disabledDataConnection}
        />
        {connectionType.connectionPropertiesSchema.connectionProperties.map((p, i) => (
          <ConnectionProperty connection={props.connection} key={p.fieldName} property={p} disabled={props.disabledDataConnection} />
        ))}
        {connectionType.connectionPropertiesSchema.config['disableUsername'] !== 'true' ? (
          <TextField
            type="text"
            isDisabled={props.disabledDataConnection}
            isRequired={!props.disabledDataConnection}
            label={USERNAME_LABEL}
            onChange={setUserName}
            value={userName}
          />
        ) : null}
        {connectionType.connectionPropertiesSchema.config['disablePassword'] !== 'true' ? (
          <TextField
            type="password"
            isDisabled={props.disabledDataConnection}
            isRequired={!props.disabledDataConnection}
            label={PASSWORD_LABEL}
            onChange={setPassword}
            value={password}
          />
        ) : null}
        <Flex direction="row" gap="size-200" alignItems="center">
          <Button variant="cta" isDisabled={connectionName === null} onPress={testConnection}>
            <Translate contentKey="datasources.dataConnection.testConnection">Test Connection</Translate>
          </Button>
          {loading ? <ProgressBar label="Loading…" isIndeterminate /> : null}

          {isConnected && errorMessage === null ? (
            <React.Fragment>
              <Checkmark color="positive" />
              <Text marginBottom="size-300">
                <span className="spectrum-Body-emphasis" style={{ verticalAlign: '-19px', marginLeft: '-12px' }}>
                  <Translate contentKey="datasources.dataConnection.connectionSuccess">Connection Success</Translate>
                </span>
              </Text>
            </React.Fragment>
          ) : null}
          {!isConnected && errorMessage !== null ? (
            <React.Fragment>
              <Alert color="negative" />
              <Text marginBottom="size-300">
                <span className="spectrum-Body-emphasis error-message" style={{ verticalAlign: '-19px', marginLeft: '-12px' }}>
                  {' '}
                  <Translate contentKey="datasources.dataConnection.connectionFailure">
                    Connection Error. Please check configurations
                  </Translate>
                </span>
              </Text>
            </React.Fragment>
          ) : null}
        </Flex>
      </Form>
    </Flex>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  connections: storeState.connections.connections,
  connection: storeState.datasourceSteps.connection,
  disabledDataConnection: storeState.datasourceSteps.disabledDataConnection,
  isConnected: storeState.datasources.isConnected,
  errorMessage: storeState.datasources.errorMessage,
  loading: storeState.datasources.loading,
});

const mapDispatchToProps = { getConnectionsByConnectionTypeId, selectConnection, queryToConnection };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DataConnection);
