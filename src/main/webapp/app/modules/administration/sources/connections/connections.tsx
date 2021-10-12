import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Translate, getSortState, translate } from 'react-jhipster';
import { getConnections } from './connection.reducer';
import { IRootState } from 'app/shared/reducers';
import { Button, Flex, DialogContainer } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import Edit from '@spectrum-icons/workflow/Edit';
import ConnectionUpdate from './connection-update';
import { IConnection, connectionDefaultValue } from 'app/shared/model/connection.model';
import ConnectionStepper from './connection-stepper';

export interface IConnectionsProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const Connections = (props: IConnectionsProps) => {
  const [isOpen, setOpen] = React.useState(false);
  const [isConnectionStepperOpen, setConnectionStepperOpen] = React.useState(false);
  const [connection, setConnection] = React.useState<IConnection>(connectionDefaultValue);

  useEffect(() => {
    props.getConnections();
  }, []);

  const setUpdateSuccess = () => {
    props.getConnections();
  };

  const { connections } = props;

  return (
    <div>
      <SecondaryHeader
        breadcrumbItems={[
          { label: 'Home', route: '/' },
          { label: 'Sources', route: '/administration/sources' },
          { label: 'Connections', route: '/administration/sources/connections' },
        ]}
        title={translate('connections.home.title')}
      >
        <Button
          variant="cta"
          onPress={() => {
            setConnectionStepperOpen(true);
          }}
          data-testid="create-connection"
        >
          <Translate contentKey="entity.action.create">Create</Translate>
        </Button>
      </SecondaryHeader>
      <DialogContainer onDismiss={() => setOpen(false)}>
        {isOpen && (
          <ConnectionUpdate setUpdateSuccess={setUpdateSuccess} setOpen={setOpen} connection={connection} {...props}></ConnectionUpdate>
        )}
        {isConnectionStepperOpen && <ConnectionStepper setUpdateSuccess={setUpdateSuccess} setConnectionStepperOpen={setConnectionStepperOpen} {...props} />}
      </DialogContainer>
      <div className="dx26-container">
        <Paper className="dx26-table-pager">
          <TableContainer>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="connections.name">Name</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="connections.type">Type</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="entity.action.manage">Manage</Translate>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {connections.map((conn, i) => (
                  <TableRow key={`conn-${i}`}>
                    <TableCell component="th" scope="row" align="center">
                      {conn.id}
                    </TableCell>
                    <TableCell align="center">{conn.name}</TableCell>
                    <TableCell align="center">{conn.details['@type']}</TableCell>
                    <TableCell align="center">
                      <Flex gap="size-100" justifyContent="center">
                        <a
                          onClick={() => {
                            setOpen(true);
                            setConnection(conn);
                          }}
                        >
                          <Edit size="S" />
                        </a>
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  connections: storeState.connections.connections,
});

const mapDispatchToProps = { getConnections };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Connections);
