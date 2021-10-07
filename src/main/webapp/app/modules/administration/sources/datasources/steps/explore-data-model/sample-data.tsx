import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import { prepareConnection } from '../datasource-util';
import { IRootState } from 'app/shared/reducers';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { executeQuery } from '../../datasources.reducer';
import { Flex, Dialog, Heading, Divider, Content, Button, Header, useDialogContainer, ProgressBar } from '@adobe/react-spectrum';

interface ISampleDataprops extends StateProps, DispatchProps {
  setOpen: (isOpen: boolean) => void;
}

export const SampleData = (props: ISampleDataprops) => {
  const dialog = useDialogContainer();

  const { setOpen, isConnectionSelected, connection, connectionType, datasource, sampleData, sampleDataHeader, loading } = props;

  useEffect(() => {
    const body = {
      query: {
        fields: [],
        distinct: true,
        limit: 10,
        source: datasource.name,
      },
      sql: datasource.sql ? datasource.sql : null,
    };
    if (isConnectionSelected) {
      body['connectionLinkId'] = connection.linkId;
    } else {
      body['connection'] = prepareConnection(connection, connectionType);
    }
    props.executeQuery(body);
  }, []);

  const generateTableHead = () => {
    const cells = sampleDataHeader
      ? Object.keys(sampleDataHeader).map(function (key) {
          return (
            <TableCell align="center" key={key}>
              {key}
            </TableCell>
          );
        })
      : null;
    return cells;
  };

  const generateTableBody = row => {
    const cells = row
      ? Object.keys(row).map(function (key) {
          return (
            <TableCell align="center" key={key}>
              {row[key]}
            </TableCell>
          );
        })
      : null;
    return cells;
  };
  return (
    <Dialog data-testid="sample-data-dialog" width="80vw" size="L" minHeight="90vh">
      <Heading>
        <Flex alignItems="center" gap="size-100">
          <Translate contentKey="datasources.exploreDataModel.sampleData">Sample Data</Translate>
        </Flex>
      </Heading>
      <Header>
        <Flex alignItems="center" gap="size-100">
          <Button
            variant="secondary"
            onPress={() => {
              dialog.dismiss();
              setOpen(false);
            }}
          >
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
        </Flex>
      </Header>
      <Divider />
      <Content>
        {loading ? (
          <ProgressBar label="Loading…" isIndeterminate />
        ) : (
          <div>
            <div className="dx26-container">
              <Paper className="dx26-table-pager">
                <TableContainer>
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow>{generateTableHead()}</TableRow>
                    </TableHead>
                    <TableBody>
                      {sampleData.map((row, i) => (
                        <TableRow key={`row-${i}`}>{generateTableBody(row)}</TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </div>
          </div>
        )}
      </Content>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  datasource: storeState.datasourceSteps.datasource,
  isConnectionSelected: storeState.datasourceSteps.isConnectionSelected,
  connection: storeState.datasourceSteps.connection,
  connectionType: storeState.datasourceSteps.connectionType,
  sampleData: storeState.datasources.sampleData,
  loading: storeState.datasources.loading,
  sampleDataHeader: storeState.datasources.sampleData.length > 0 ? storeState.datasources.sampleData[0] : null,
});

const mapDispatchToProps = { executeQuery };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SampleData);
