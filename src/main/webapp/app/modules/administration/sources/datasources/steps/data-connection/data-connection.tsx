import React, { useState, useEffect, ReactText } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { Button, Flex, Picker, Item, TextField, Form, ProgressBar, Text } from '@adobe/react-spectrum';
import { getConnectionsByConnectionTypeId } from '../../../connections/connection.reducer';
import { prepareConnection } from '../datasource-util';
import ConnectionProperty from './connection-property';
import { selectConnection, setConnection, setIsConnectionSelected } from '../datasource-steps.reducer';
import { queryToConnection,setIsConnected } from '../../datasources.reducer';
import { Translate, translate } from 'react-jhipster';
import Checkmark from '@spectrum-icons/workflow/Checkmark';
import Alert from '@spectrum-icons/workflow/Alert';

export interface IDataConnectionProps extends StateProps, DispatchProps {
  connectionType: any;
}

export const DataConnection = (props: IDataConnectionProps) => {
  const { connections, connectionType, errorMessage, isConnected, loading } = props;
  const [connectionName, setConnectionName] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [connectionId, setConnectionId] = React.useState<ReactText>(props.connection.id !== '' ? props.connection.id.toString() : '');

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
          placeholder={translate('datasources.dataConnection.selectConnectionPlaceholder')}
          label={translate('datasources.dataConnection.configDatabaseServer')}
          items={connections}
          selectedKey={connectionId}
          defaultSelectedKey={connectionId}
          onSelectionChange={selected => {
            setConnectionId(selected);
            const result = connections.filter(con => con.id.toString() === selected.toString())[0];
            setFields(result);
            props.setConnection(result);
            if (selected) {
              props.setIsConnectionSelected(true);
            } else {
              props.setIsConnectionSelected(false);
              props.setIsConnected(false);
            }
          }}
        >
          {item => <Item key={item.id}>{item.name}</Item>}
        </Picker>
        <div style={{ textAlign: 'center', marginTop: '14px' }}>
          {/* TODO : OR needs to be badge component or something else */}
          <span className="spectrum-Heading.spectrum-Heading--sizeL.spectrum-Heading--heavy">
            <Translate contentKey="datasources.dataConnection.or">OR</Translate>
          </span>
        </div>
        <TextField
          label={translate('datasources.dataConnection.connectionName')}
          onChange={(event) => {
            props.setConnection({ ...props.connection, name: event });
            setConnectionName(event);
          }}
          value={connectionName}
          isDisabled={props.isConnectionSelected}
          isRequired={!props.isConnectionSelected}
        />
        {connectionType.connectionPropertiesSchema.connectionProperties.map((p, i) => (
          <ConnectionProperty connection={props.connection} key={p.fieldName} property={p} disabled={props.isConnectionSelected} />
        ))}
        {connectionType.connectionPropertiesSchema.config['disableUsername'] !== 'true' ? (
          <TextField
            type="text"
            isDisabled={props.isConnectionSelected}
            isRequired={!props.isConnectionSelected}
            label={translate('datasources.dataConnection.userName')}
            onChange={(event) => {
              props.setConnection({ ...props.connection, connectionUsername: event });
              setUserName(event);
            }}
            value={userName}
          />
        ) : null}
        {connectionType.connectionPropertiesSchema.config['disablePassword'] !== 'true' ? (
          <TextField
            type="password"
            isDisabled={props.isConnectionSelected}
            isRequired={!props.isConnectionSelected}
            label={translate('datasources.dataConnection.password')}
            onChange={(event) => {
              props.setConnection({ ...props.connection, connectionPassword: event });
              setPassword(event);
            }}
            value={password}
          />
        ) : null}
        <br />
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
  isConnectionSelected: storeState.datasourceSteps.isConnectionSelected,
  isConnected: storeState.datasources.isConnected,
  errorMessage: storeState.datasources.errorMessage,
  loading: storeState.datasources.loading,
});

const mapDispatchToProps = {
  setIsConnectionSelected,
  getConnectionsByConnectionTypeId,
  selectConnection,
  setConnection,
  queryToConnection,
  setIsConnected,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DataConnection);
