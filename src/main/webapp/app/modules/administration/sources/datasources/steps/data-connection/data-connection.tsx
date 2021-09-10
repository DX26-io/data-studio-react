import React, { useState, useEffect, ReactText } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { Button, Flex, Picker, Item, TextField, Form, ProgressBar, Text } from '@adobe/react-spectrum';
import { getConnectionsByConnectionTypeId } from '../../../connections/connection.reducer';
import { prepareConnection, generateConnectionsOptions } from '../datasource-util';
import ConnectionProperty from './connection-property';
import { selectConnection, setConnection, setIsConnectionSelected } from '../datasource-steps.reducer';
import { queryToConnection, setIsConnected } from '../../datasources.reducer';
import { Translate, translate } from 'react-jhipster';
import Checkmark from '@spectrum-icons/workflow/Checkmark';
import Alert from '@spectrum-icons/workflow/Alert';
import Select from 'react-select';
import { connectionDefaultValue } from 'app/shared/model/connection.model';

export interface IDataConnectionProps extends StateProps, DispatchProps {
  connectionType: any;
}

export const DataConnection = (props: IDataConnectionProps) => {
  const { connections, connectionType, errorMessage, isConnected, loading } = props;

  const testConnection = () => {
    const payload = {};
    payload['connection'] = prepareConnection(props.connection, connectionType);
    props.queryToConnection(payload);
  };

  useEffect(() => {
    props.getConnectionsByConnectionTypeId(connectionType.id);
  }, []);

  return (
    <Flex direction="column" gap="size-100" alignItems="center">
      <Form isRequired necessityIndicator="icon" minWidth="size-4600">
        <div style={{ minWidth: '305px' }}>
          <Select
            className="basic-single"
            classNamePrefix="select"
            isClearable
            isSearchable
            placeholder={translate('datasources.dataConnection.selectConnectionPlaceholder')}
            value={props.connection && props.connection.id ? { value: props.connection.id, label: props.connection.name } : null}
            options={props.connectionsSelectOptions}
            onChange={selectedOption => {
              if (selectedOption) {
                const result = connections.filter(con => con.id === selectedOption.value)[0];
                props.setConnection(result);
                props.setIsConnectionSelected(true);
              } else {
                props.setIsConnectionSelected(false);
                props.setIsConnected(false);
                props.setConnection(connectionDefaultValue);
              }
            }}
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: '14px' }}>
          {/* TODO : OR needs to be badge component or something else */}
          <span className="spectrum-Heading.spectrum-Heading--sizeL.spectrum-Heading--heavy">
            <Translate contentKey="datasources.dataConnection.or">OR</Translate>
          </span>
        </div>
        <TextField
          label={translate('datasources.dataConnection.connectionName')}
          onChange={event => {
            props.setConnection({ ...props.connection, name: event });
          }}
          value={props.connection.name ? props.connection.name : ''}
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
            onChange={event => {
              props.setConnection({ ...props.connection, connectionUsername: event });
            }}
            value={props.connection.connectionUsername ? props.connection.connectionUsername : ''}
          />
        ) : null}
        {connectionType.connectionPropertiesSchema.config['disablePassword'] !== 'true' ? (
          <TextField
            type="password"
            isDisabled={props.isConnectionSelected}
            isRequired={!props.isConnectionSelected}
            label={translate('datasources.dataConnection.password')}
            onChange={event => {
              props.setConnection({ ...props.connection, connectionPassword: event });
            }}
            value={props.connection.connectionPassword ? props.connection.connectionPassword : ''}
          />
        ) : null}
        <br />
        <Flex direction="row" gap="size-200" alignItems="center">
          <Button variant="cta" isDisabled={props.connection.name === ''} onPress={testConnection}>
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
  connectionsSelectOptions: generateConnectionsOptions(storeState.connections.connections),
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
