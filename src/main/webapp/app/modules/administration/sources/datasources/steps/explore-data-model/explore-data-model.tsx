import React, { useState, useEffect, ReactText } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import {
  ActionButton,
  DialogContainer,
  View,
  Button,
  Flex,
  Item,
  Form,
  ProgressBar,
  Content,
  AlertDialog,
  DialogTrigger,
} from '@adobe/react-spectrum';
import { prepareConnection } from '../datasource-util';
import { setConnection, setDatasource, setExploreModelId, setIsSaveConnectionCalled } from '../datasource-steps.reducer';
import { listTables, createDatasource, resetUpdateError } from '../../datasources.reducer';
import { Translate, translate } from 'react-jhipster';
import { Tabs } from '@react-spectrum/tabs';
import Select from 'react-select';
import SqlQueryContainer from '../sql-query-container/sql-query-container';
import Alert from '@spectrum-icons/workflow/Alert';
import SampleData from './sample-data';
import { createConnection, updateConnection, deleteConnection } from '../../../connections/connection.reducer';
import DuplicateDatasourceDialog from './duplicate-datasource-dialog';

export interface IExploreDataModelProps extends StateProps, DispatchProps {
  connectionType: any;
  connection: any;
}

export const ExploreDataModel = (props: IExploreDataModelProps) => {
  const {
    connectionUpdateSuccess,
    connectionUpdateError,
    connectionType,
    connection,
    isConnectionSelected,
    tables,
    loading,
    datasource,
    updateError,
    exploreModelTabId,
    isSaveConnectionCalled,
    datasourceUpdateSuccess,
    createdConnection,
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
      if (isConnectionSelected) {
        body['connectionLinkId'] = connection.linkId;
      } else {
        body['connection'] = prepareConnection(connection, connectionType);
      }
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
      connectionName: connection.linkId ? connection.linkId : createdConnection.linkId,
      lastUpdated: new Date(),
    });
    props.setExploreModelId(tabId);
    setSql(datasourceSql);
  };

  const selectStyles = {
    control: styles => ({ ...styles, minWidth: '305px' }),
  };

  const rollbackConnection = () => {
    if (!isConnectionSelected) {
      props.deleteConnection(connection.id);
    }
  };

  const create = () => {
    props.createDatasource(datasource);
  };

  const saveConnection = () => {
    const conn = prepareConnection(connection, connectionType);
    if (!isConnectionSelected) {
      props.createConnection(conn);
    } else {
      props.updateConnection(conn);
    }
  };

  useEffect(() => {
    if (connectionUpdateSuccess && connectionUpdateError === null) {
      create();
    } else {
      props.setIsSaveConnectionCalled(false);
    }
  }, [connectionUpdateSuccess]);

  useEffect(() => {
    if (connectionUpdateError && !connectionUpdateSuccess) {
      rollbackConnection();
      props.setIsSaveConnectionCalled(false);
    }
  }, [connectionUpdateError]);

  useEffect(() => {
    if (isSaveConnectionCalled) {
      saveConnection();
    }
  }, [isSaveConnectionCalled]);

  useEffect(() => {
    if (updateError) {
      props.setIsSaveConnectionCalled(false);
    }
  }, [updateError]);

  return (
    <React.Fragment>
      <DialogContainer onDismiss={() => setSampleTableOpen(false)}>
        {isSampleTableOpen && <SampleData setOpen={setSampleTableOpen} />}
      </DialogContainer>
      <Flex direction="column" gap="size-100" alignItems="center">
        {isSaveConnectionCalled ? <ProgressBar label="Creating..." isIndeterminate /> : null}
        <Form isRequired necessityIndicator="icon" minWidth="size-4600">
          <Tabs aria-label="roles" items={tabs} selectedKey={tabId} onSelectionChange={setTabId}>
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
                        />
                        <Button variant="cta" isDisabled={false} onPress={() => setSampleTableOpen(true)}>
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
                        <Button variant="cta" isDisabled={false} onPress={() => setSampleTableOpen(true)}>
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
                  {datasourceError || connectionUpdateError ? (
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
  isConnectionSelected: storeState.datasourceSteps.isConnectionSelected,
  datasource: storeState.datasourceSteps.datasource,
  tables: storeState.datasources.tables,
  loading: storeState.datasources.loading,
  updateError: storeState.datasources.updateError,
  exploreModelTabId: storeState.datasourceSteps.exploreModelTabId,
  isSaveConnectionCalled: storeState.datasourceSteps.isSaveConnectionCalled,
  connectionUpdateError: storeState.connections.updateError,
  connectionUpdateSuccess: storeState.connections.updateSuccess,
  datasourceUpdateSuccess: storeState.datasources.updateSuccess,
  createdConnection: storeState.connections.connection,
  datasourceError: storeState.datasources.errorMessage,
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
  setIsSaveConnectionCalled,
  resetUpdateError,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ExploreDataModel);
