import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  getFeatures,
  getUserGroupDatasourceConstraints,
  getUserDatasourceConstraints,
  reset,
  getDatasourceConstraints,
} from './datasource-constraints.reducer';
import { IRootState } from 'app/shared/reducers';
import { Flex } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import Edit from '@spectrum-icons/workflow/Edit';
import { Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { NoItemsFoundPlaceHolder } from 'app/shared/components/placeholder/placeholder';

// TODO : when hit the url,params should be visible

export interface IDatasourceConstraintsProps extends StateProps, DispatchProps {
  routeProps: any;
  setOpen: (isOpen: boolean) => void;
}

export const DatasourceConstraints = (props: IDatasourceConstraintsProps) => {
  const [user, setUser] = React.useState(null);
  const [group, setGroup] = React.useState(null);

  const { constraints, routeProps, updateSuccess } = props;

  const fetchConstraints = () => {
    let endURL = '';
    if (user) {
      endURL = `?user=${user}`;
      props.getUserDatasourceConstraints(user);
    } else if (group) {
      endURL = `?group=${group}`;
      props.getUserGroupDatasourceConstraints(group);
    }
    if (routeProps.location.search && routeProps.location.search !== endURL) {
      routeProps.history.push(`${routeProps.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    fetchConstraints();
  }, [user, group]);

  useEffect(() => {
    if (routeProps.location.search) {
      const params = new URLSearchParams(routeProps.location.search);
      const groupName = params.get('group');
      const login = params.get('user');
      setUser(login);
      setGroup(groupName);
    }
  }, [routeProps.location.search]);

  useEffect(() => {
    if (updateSuccess) {
      fetchConstraints();
    }
  }, [updateSuccess]);

  return (
    <React.Fragment>
      {constraints.length > 0 ? (
        <div className="dx26-container">
          <Paper className="dx26-table-pager">
            <TableContainer>
              <Table aria-label="customized table">
                <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell align="center">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="permissions.datasourceConstraints.name">Name</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="entity.action.manage">Manage</Translate>
                  </TableCell>
                </TableHead>
                <TableBody>
                  {constraints.map((constraint, i) => (
                    <TableRow key={`constraint-${constraint.id}`}>
                      <TableCell align="center">{constraint.id}</TableCell>
                      <TableCell align="center">{constraint.datasource.name}</TableCell>
                      <TableCell align="center">
                        <Flex gap="size-100" justifyContent="center">
                          <a
                            onClick={() => {
                              props.setOpen(true);
                              props.getDatasourceConstraints(constraint.id);
                              props.getFeatures(constraint.datasource.id, 'DIMENSION');
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
      ) : (
        <NoItemsFoundPlaceHolder
          headerTranslationKey="permissions.datasourceConstraints.notFound.heading"
          contentTranslationKey="permissions.datasourceConstraints.notFound.content"
        />
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  constraints: storeState.datasourceConstraints.constraints,
  updateSuccess: storeState.datasourceConstraints.updateSuccess,
});

const mapDispatchToProps = {
  getUserGroupDatasourceConstraints,
  getUserDatasourceConstraints,
  reset,
  getDatasourceConstraints,
  getFeatures,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DatasourceConstraints);
