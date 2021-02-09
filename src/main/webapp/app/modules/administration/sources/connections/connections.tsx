import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Translate, getSortState, translate } from 'react-jhipster';
import { getConnections } from './connections.reducer';
import { IRootState } from 'app/shared/reducers';
import { Button, Flex, DialogContainer } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import Edit from '@spectrum-icons/workflow/Edit';

export interface IConnectionsProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const Connections = (props: IConnectionsProps) => {
  const [isOpen, setOpen] = React.useState(false);
  const [isNew, setNew] = React.useState(false);
  const [groupName, setGroupName] = React.useState('');

  useEffect(() => {
    props.getConnections();
  }, []);

  const setUpdateSuccess = () => {};

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
            setOpen(true);
            setNew(true);
            setGroupName('');
          }}
          data-testid="create-group"
        >
          <Translate contentKey="datasources.home.create">Create Datasource</Translate>
        </Button>
      </SecondaryHeader>
      {/* <DialogContainer onDismiss={() => setOpen(false)}>
        {isOpen && (
          <UserGroupUpdate
            setUpdateSuccess={setUpdateSuccess}
            isNew={isNew}
            setOpen={setOpen}
            groupName={groupName}
            {...props}
          ></UserGroupUpdate>
        )}
      </DialogContainer> */}
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
                {connections.map((connection, i) => (
                  <TableRow key={`connection-${i}`}>
                    <TableCell component="th" scope="row" align="center">
                      {connection.id}
                    </TableCell>
                    <TableCell align="center">{connection.name}</TableCell>
                    <TableCell align="center">{connection.details['@type']}</TableCell>
                    <TableCell align="center">
                      <Flex gap="size-100" justifyContent="center">
                        <a
                          onClick={() => {
                            setOpen(true);
                            setNew(false);
                            setGroupName(connection.name);
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
