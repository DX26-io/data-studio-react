import React, { useState, useEffect, ReactText } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { DialogContainer, View, Button, Flex, Item, Form, ProgressBar, Content, Text } from '@adobe/react-spectrum';
import {
  setConnection,
  setDatasource,
  setExploreModelId,
  selectConnectionType,
} from '../datasource-steps.reducer';
import { listTables, createDatasource, resetUpdateError } from '../../datasources.reducer';
import { Translate, translate } from 'react-jhipster';
import { Tabs } from '@react-spectrum/tabs';
import Select from 'react-select';
import SqlQueryContainer from '../sql-query-container/sql-query-container';
import Alert from '@spectrum-icons/workflow/Alert';
import SampleData from './sample-data';
import DuplicateDatasourceDialog from './duplicate-datasource-dialog';
import {
  getConnectionsTypes,
  getConnections,
  createConnection,
  updateConnection,
  deleteConnection,
} from '../../../connections/connection.reducer';
import { generateConnectionsOptions, prepareConnection } from '../../../connections/connections.util';
import { connectionDefaultValue } from 'app/shared/model/connection.model';
import { defaultDatasourceValue } from 'app/shared/model/datasources.model';
import { defaultConnectionTypeValue } from 'app/shared/model/connection-type.model';
import { isShowDataButtonDisabled } from '../datasource-util';

export interface IExploreDataModelProps extends StateProps, DispatchProps {}

export const ExploreDataModel = (props: IExploreDataModelProps) => {
  const {
    connectionType,
    connection,
    tables,
    loading,
    datasource,
    updateError,
    exploreModelTabId,
    isSaveConnectionCalled,
    datasourceError,
  } = props;

  const [searchedText, setSearchedText] = React.useState('');

  const [sqlOptions, setSqlOptions] = React.useState([]);

  const [sql, setSql] = React.useState(datasource.sql);

  const [isSampleTableOpen, setSampleTableOpen] = React.useState(false);

  const tabs = [
    { id: 1, name: 'datasources.exploreDataModel.regular.name' },
    { id: 2, name: 'datasources.exploreDataModel.sqlmode.name' },
  ];

  const [tabId, setTabId] = useState<ReactText>(exploreModelTabId);

  const search = (inputValue, { action }) => {
    setSearchedText(inputValue);
    if (inputValue) {
      const body = {
        searchTerm: inputValue,
        filter: tabId === 1 ? 'TABLE' : 'SQL',
      };
      body['connection'] = prepareConnection(connection, connectionType);
      props.listTables(body);
    }
  };

  useEffect(() => {
    if (tabId === 1) {
      setSql('');
    }
  }, [tabId]);

  useEffect(() => {
    if (tabId === 2 && tables.length === 0) {
      setSqlOptions([
        {
          value: sql,
          label: searchedText,
        },
        ...tables,
      ]);
    } else {
      setSqlOptions(tables);
    }
  }, [loading]);

  const dispatchQuery = sqlQuery => {
    setSql(sqlQuery);
    props.setDatasource({ ...datasource, sql: sqlQuery });
  };

  const selectDatasource = selectedOption => {
    let datasourceSql = '';
    let datasourceName = '';
    if (selectedOption) {
      if (tabId === 2) {
        datasourceSql = selectedOption.value ? selectedOption.value : sql;
      }
      datasourceName = selectedOption.label;
    } else {
      datasourceSql = '';
      datasourceName = '';
    }
    props.setDatasource({
      ...datasource,
      sql: datasourceSql ? datasourceSql : null,
      name: datasourceName,
      queryPath: '/api/queries',
      connectionName: connection.linkId,
      lastUpdated: new Date(),
    });
    props.setExploreModelId(tabId);
    setSql(datasourceSql);
  };

  const selectStyles = {
    control: styles => ({ ...styles, minWidth: '305px' }),
  };

  useEffect(() => {
    props.getConnectionsTypes();
    props.getConnections();
  }, []);
  

  return (
    <React.Fragment>
      <DialogContainer onDismiss={() => setSampleTableOpen(false)}>
        {isSampleTableOpen && <SampleData setOpen={setSampleTableOpen} />}
      </DialogContainer>
      <Flex direction="column" gap="size-100" alignItems="center">
        {isSaveConnectionCalled ? <ProgressBar label="Creating..." isIndeterminate /> : null}
        <Form isRequired necessityIndicator="icon" minWidth="size-4600">
          <span className="spectrum-Body-emphasis">
            <Translate contentKey="connections.select">Select Connection*</Translate>
          </span>
          <div style={{ minWidth: '305px', marginTop: '10px' }}>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isClearable
              isSearchable
              placeholder={translate('connections.dataConnection.selectConnectionPlaceholder')}
              value={props.connection && props.connection.id ? { value: props.connection.id, label: props.connection.name } : null}
              options={props.connectionsSelectOptions}
              onChange={selectedOption => {
                if (selectedOption) {
                  const _connection = props.connections.filter(con => con.id === selectedOption.value)[0];
                  const _connectionType = props.connectionsTypes.filter(
                    connectionsType => connectionsType.id === _connection.connectionTypeId
                  )[0];
                  props.setConnection(_connection);
                  props.selectConnectionType(_connectionType);
                } else {
                  props.setConnection(connectionDefaultValue);
                  props.setDatasource(defaultDatasourceValue);
                  props.selectConnectionType(defaultConnectionTypeValue);
                }
              }}
            />
          </div>
          <Tabs aria-label="datasources" items={tabs} selectedKey={tabId} onSelectionChange={setTabId}>
            {item => (
              <Item title={translate(item.name)}>
                <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
                  {tabId === 1 ? (
                    <View>
                      <Flex direction="row" gap="size-300" alignItems="center">
                        <Select
                          isClearable
                          isSearchable
                          options={tables}
                          onInputChange={search}
                          onChange={selectDatasource}
                          styles={selectStyles}
                          defaultValue={{ value: datasource.name, label: datasource.name }}
                          value={{ value: datasource.name, label: datasource.name }}
                        />
                        <Button variant="cta" isDisabled={isShowDataButtonDisabled(datasource)} onPress={() => setSampleTableOpen(true)}>
                          <Translate contentKey="datasources.exploreDataModel.showData">Show Data</Translate>
                        </Button>
                      </Flex>
                    </View>
                  ) : (
                    <View>
                      <Flex direction="row" gap="size-300" alignItems="center">
                        <Select
                          isClearable
                          isSearchable
                          options={sqlOptions}
                          onInputChange={search}
                          onChange={selectDatasource}
                          styles={selectStyles}
                          defaultValue={{ value: datasource.sql, label: datasource.name }}
                        />
                        <Button
                          variant="cta"
                          isDisabled={isShowDataButtonDisabled(datasource) || datasource.sql === null || datasource.sql === ''}
                          onPress={() => setSampleTableOpen(true)}
                        >
                          <Translate contentKey="datasources.exploreDataModel.showData">Show Data</Translate>
                        </Button>
                      </Flex>
                      <br />
                      <SqlQueryContainer dispatchQuery={dispatchQuery} sqlQuery={sql} />
                    </View>
                  )}

                  <DialogContainer onDismiss={() => props.resetUpdateError()}>
                    {updateError === 'SAME_NAME_EXISTS' && <DuplicateDatasourceDialog datasource={datasource} />}
                  </DialogContainer>
                  {datasourceError  ? (
                    <React.Fragment>
                      <br />
                      <Alert color="notice" />
                      <span className="spectrum-Body-emphasis" style={{ verticalAlign: '6px', marginLeft: '5px' }}>
                        {datasourceError}
                      </span>
                      <br />
                    </React.Fragment>
                  ) : null}
                </Content>
              </Item>
            )}
          </Tabs>
        </Form>
      </Flex>
    </React.Fragment>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  datasource: storeState.datasourceSteps.datasource,
  tables: storeState.datasources.tables,
  loading: storeState.datasources.loading,
  updateError: storeState.datasources.updateError,
  exploreModelTabId: storeState.datasourceSteps.exploreModelTabId,
  isSaveConnectionCalled: storeState.datasourceSteps.isSaveConnectionCalled,
  createdConnection: storeState.connections.connection,
  datasourceError: storeState.datasources.errorMessage,
  connectionType: storeState.datasourceSteps.connectionType,
  connection: storeState.datasourceSteps.connection,
  connections: storeState.connections.connections,
  connectionsTypes: storeState.connections.connectionsTypes,
  connectionsSelectOptions: generateConnectionsOptions(storeState.connections.connections),
});

const mapDispatchToProps = {
  setConnection,
  listTables,
  setDatasource,
  setExploreModelId,
  createDatasource,
  createConnection,
  updateConnection,
  deleteConnection,
  resetUpdateError,
  getConnectionsTypes,
  getConnections,
  selectConnectionType,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ExploreDataModel);
