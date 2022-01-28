import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  getUserGroupDatasourceConstraints,
  reset,
  getDatasourceConstraints,
  setDatasourceConstraints,
} from './user-group-datasource-constraints.reducer';
import { IRootState } from 'app/shared/reducers';
import { Flex } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import Edit from '@spectrum-icons/workflow/Edit';
import { Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { NoItemsFoundPlaceHolder } from 'app/shared/components/placeholder/placeholder';
import { getEntitiesByFeatureType as getFeatures } from 'app/entities/feature/feature.reducer';
import { getSearchParam } from '../../permissions-util';

export interface IUserGroupDatasourceConstraintsProps extends StateProps, DispatchProps {
  routeProps: any;
  setOpen: (isOpen: boolean) => void;
}

export const UserGroupDatasourceConstraints = (props: IUserGroupDatasourceConstraintsProps) => {

  const { constraints, routeProps, updateSuccess } = props;

  const fetchConstraints = _group => {
    let endURL = '';
    if (_group) {
      endURL = `?group=${_group}`;
      props.getUserGroupDatasourceConstraints(_group);
      props.setDatasourceConstraints({ ...props.constraint, userGroupName: _group });
    }
    if (routeProps.location.search && routeProps.location.search !== endURL) {
      routeProps.history.push(`${routeProps.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    if (routeProps.location.search) {
      fetchConstraints(getSearchParam('group', routeProps.location.search));
    }
  }, [props.searchUrl]);

  useEffect(() => {
    if (updateSuccess) {
      fetchConstraints(getSearchParam('group', routeProps.location.search));
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
  constraints: storeState.userGroupDatasourceConstraints.constraints,
  updateSuccess: storeState.userGroupDatasourceConstraints.updateSuccess,
  groups: storeState.userGroups.groups,
  constraint: storeState.userGroupDatasourceConstraints.constraint,
  searchUrl: storeState.permissions.searchUrl,
});

const mapDispatchToProps = {
  getUserGroupDatasourceConstraints,
  reset,
  getDatasourceConstraints,
  getFeatures,
  setDatasourceConstraints,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserGroupDatasourceConstraints);
