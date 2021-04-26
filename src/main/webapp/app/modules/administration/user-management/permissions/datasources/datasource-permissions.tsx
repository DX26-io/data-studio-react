import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  getUserGroupDatasourcePermissions,
  getUserDatasourcePermissions,
  updateUserGroupPermissions,
  updateUserPermissions,
  resetViewsPermissions,
} from '../permissions.reducer';
import { IRootState } from 'app/shared/reducers';
import { Flex, Text, SearchField, Checkbox } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import Edit from '@spectrum-icons/workflow/Edit';
import { ITEMS_PER_PAGE, ACTIVE_PAGE, ITEMS_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants';
import { Translate, getSortState, translate } from 'react-jhipster';
import { StatusLight } from '@adobe/react-spectrum';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { findViewsPermissionsChanges } from '../permissions-util';
import { toast } from 'react-toastify';

// TODO : when hit the url,params should be visible

export interface IDatasourceProps extends StateProps, DispatchProps {
  permissionProps: any;
}

export const DatasourcePermissions = (props: IDatasourceProps) => {
  const [user, setUser] = React.useState(null);
  const [group, setGroup] = React.useState(null);

  const { datasourcePermissions, totalDatasourcePermissions, permissionProps } = props;

  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getSortState(permissionProps.location, ITEMS_PER_PAGE), permissionProps.location.search)
  );
  const fetchPermissions = () => {
    let endURL = '';
    if (user) {
      endURL = `?page=${pagination.activePage}&user=${user}`;
      props.getUserDatasourcePermissions(pagination.activePage, pagination.itemsPerPage, user);
    } else if (group) {
      endURL = `?page=${pagination.activePage}&group=${group}`;
      props.getUserGroupDatasourcePermissions(pagination.activePage, pagination.itemsPerPage, group);
    }
    if (permissionProps.location.search && permissionProps.location.search !== endURL) {
      permissionProps.history.push(`${permissionProps.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [pagination.activePage, pagination.itemsPerPage, user, group]);

  useEffect(() => {
    if (permissionProps.location.search) {
      const params = new URLSearchParams(permissionProps.location.search);
      const page = params.get('page');
      const groupName = params.get('group');
      const login = params.get('user');
      if (page) {
        setPagination({
          ...pagination,
          activePage: +page,
        });
      }
      setUser(login);
      setGroup(groupName);
    }
  }, [permissionProps.location.search]);

  const handleChangePage = (event, newPage) => {
    setPagination({
      ...pagination,
      activePage: newPage,
    });
  };

  const handleChangeRowsPerPage = event => {
    setPagination({
      ...pagination,
      itemsPerPage: +event.target.value,
    });
  };

  const save = () => {
    const permissionChanges = findViewsPermissionsChanges(datasourcePermissions);
    if (user) {
      props.updateUserPermissions(permissionChanges, user);
    } else if (group) {
      props.updateUserGroupPermissions(permissionChanges, group);
    }
  };

  useEffect(() => {
    if (props.updateSuccess) {
      toast.success(translate('permissions.messages'));
    }
  }, [props.updateSuccess]);

  return (
    <div className="dx26-container">
      <Paper className="dx26-table-pager">
        <TableContainer>
          <Table aria-label="customized table">
            <TableHead style={{ backgroundColor: '#f5f5f5' }}>
              <TableCell align="center">
                <Translate contentKey="permissions.datasourcePermissions.datasource">DATASOURCE</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.datasourcePermissions.read">READ</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.datasourcePermissions.write">WRITE</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.datasourcePermissions.update">UPDATE</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.datasourcePermissions.delete">DELETE</Translate>
              </TableCell>
            </TableHead>
            <TableBody>
              {datasourcePermissions.map((datasource, i) => (
                <TableRow key={`view-${datasource.info.resourceName}`}>
                  <TableCell align="center">{datasource.info.resourceName}</TableCell>
                  {datasource.info.permissionMetadata.map((p, j) => (
                    <TableCell align="center" key={`permission-${p.permission.key.action}`}>
                      <Checkbox
                        defaultSelected={p.hasIt}
                        isEmphasized
                        onChange={() => {
                          p.value = p.hasIt;
                          p.hasIt = !p.hasIt;
                        }}
                      ></Checkbox>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
          component="div"
          count={totalDatasourcePermissions}
          rowsPerPage={pagination.itemsPerPage}
          page={pagination.activePage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  datasourcePermissions: storeState.permissions.datasourcePermissions,
  totalDatasourcePermissions: storeState.permissions.totalDatasourcePermissions,
  updateSuccess: storeState.permissions.updateSuccess,
});

const mapDispatchToProps = {
  getUserGroupDatasourcePermissions,
  getUserDatasourcePermissions,
  updateUserGroupPermissions,
  updateUserPermissions,
  resetViewsPermissions,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DatasourcePermissions);
