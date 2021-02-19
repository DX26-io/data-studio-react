import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { Button, Flex, Picker, Item, TextField, Form, View } from '@adobe/react-spectrum';
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
} from './datasource-util';
import ConnectionProperty from './connection-property';
import { selectConnection } from './datasource-steps.reducer';

export interface IDataConnectionProps extends StateProps, DispatchProps {
  connectionType: any;
  // connection: any;
  disabledDataConnection: boolean;
}

export const DataConnection = (props: IDataConnectionProps) => {
  const { connections, connectionType, disabledDataConnection } = props;
  const [connectionName, setConnectionName] = React.useState();
  const [userName, setUserName] = React.useState();
  const [password, setPassword] = React.useState();
  const [connectionId, setConnection] = React.useState(props.connection ? props.connection.id.toString() : "");

  const setFields = c => {
    setConnectionName(c.name);
    setUserName(c.connectionUsername);
    setPassword(c.connectionPassword);
    console.log(connectionId);
    console.log(c.id);
    // setConnection(c.id.toString);
  };

  // const setConnectionId = connectionId => {
  //   const result = connections.filter(con => con.id.toString() === connectionId)[0];
  //   setFields(result);
  //   props.selectConnection(result);
  // };

  useEffect(() => {
    if (props.connection) {
      setFields(props.connection);
    }
    props.getConnectionsByConnectionTypeId(connectionType.id);
  }, []);

  useEffect(() => {
    console.log(connectionId);
  }, [connectionId]);

  return (
    <Flex direction="column" gap="size-100" alignItems="center">
      <View padding="size-600" paddingTop="size-300">
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
            isDisabled={disabledDataConnection}
            isRequired={!disabledDataConnection}
          />
          {connectionType.connectionPropertiesSchema.connectionProperties.map((p, i) => (
            <ConnectionProperty connection={props.connection} key={p.fieldName} property={p} disabled={disabledDataConnection} />
          ))}
          {connectionType.connectionPropertiesSchema.config['disableUsername'] !== 'true' ? (
            <TextField
              type="text"
              isDisabled={disabledDataConnection}
              isRequired={!disabledDataConnection}
              label={USERNAME_LABEL}
              onChange={setUserName}
              value={userName}
            />
          ) : null}
          {connectionType.connectionPropertiesSchema.config['disablePassword'] !== 'true' ? (
            <TextField
              type="password"
              isDisabled={disabledDataConnection}
              isRequired={!disabledDataConnection}
              label={PASSWORD_LABEL}
              onChange={setPassword}
              value={password}
            />
          ) : null}
        </Form>
      </View>
    </Flex>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  connections: storeState.connections.connections,
  connection: storeState.datasourceSteps.connection,
});

const mapDispatchToProps = { getConnectionsByConnectionTypeId, selectConnection };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DataConnection);
