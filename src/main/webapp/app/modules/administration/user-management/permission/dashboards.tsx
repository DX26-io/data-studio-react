import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getUserGroupDashboardPermissions, getUserDashboardPermissions } from './permission.reducer';
import { IRootState } from 'app/shared/reducers';
import { Flex, Text, SearchField } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import Edit from '@spectrum-icons/workflow/Edit';
import { makeStyles } from '@material-ui/core/styles';
import { ITEMS_PER_PAGE, ACTIVE_PAGE, ITEMS_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants';
import { Translate, getSortState } from 'react-jhipster';
import { StatusLight } from '@adobe/react-spectrum';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IDashboardsProps extends StateProps, DispatchProps {
  permissionProps: any;
}

export const Dashboards = (props: IDashboardsProps) => {
  const { dashboardPermissions, totalDashboardPermissions, permissionProps } = props;

  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getSortState(permissionProps.location, ITEMS_PER_PAGE), permissionProps.location.search)
  );

  const fetchPermissions = () => {
    const params = new URLSearchParams(permissionProps.location.search);
    const page = params.get('page');
    const group = params.get('group');
    const user = params.get('user');
    let endURL = '';
    if (user) {
      endURL = `?page=${pagination.activePage}&user=${user}`;
      props.getUserDashboardPermissions(pagination.activePage, pagination.itemsPerPage, user);
    } else if (group) {
      endURL = `?page=${pagination.activePage}&group=${group}`;
      props.getUserGroupDashboardPermissions(ACTIVE_PAGE, pagination.itemsPerPage, group);
    }
    if (permissionProps.location.search !== endURL) {
      permissionProps.history.push(`${permissionProps.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [pagination.activePage, pagination.itemsPerPage, permissionProps.location.search]);

  // useEffect(() => {
  //   // const params = new URLSearchParams(permissionProps.location.search);
  //   // const page = params.get('page');
  //   // const group = params.get('group');
  //   // const user = params.get('user');
  //   // if (user) {
  //   //   props.getUserDashboardPermissions(ACTIVE_PAGE, ITEMS_PER_PAGE, user);
  //   // } else {
  //   //   props.getUserGroupDashboardPermissions(ACTIVE_PAGE, ITEMS_PER_PAGE, group);
  //   // }
  //   // if (page && sort) {
  //   //   const sortSplit = sort.split(',');
  //   //   setPagination({
  //   //     ...pagination,
  //   //     activePage: +page,
  //   //     sort: sortSplit[0],
  //   //     order: sortSplit[1],
  //   //   });
  //   // }
  // }, [permissionProps.location.search]);

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

  return (
    <div className="dx26-container">
      <Paper className="dx26-table-pager">
        <TableContainer>
          <Table aria-label="customized table">
            <TableHead>
              <TableCell align="center">
                <Translate contentKey="permission.dashboardPermission.dashboard">DASHBOARD</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permission.dashboardPermission.read">READ</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permission.dashboardPermission.write">WRITE</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permission.dashboardPermission.update">UPDATE</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permission.dashboardPermission.delete">DELETE</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permission.dashboardPermission.manage">MANAGE</Translate>
              </TableCell>
            </TableHead>
            <TableBody>
              {dashboardPermissions.map((dashboard, i) => (
                <TableRow key={`dashboard-${dashboard.id}`}>
                  <TableCell align="center">{dashboard.info.dashboardName}</TableCell>
                  {dashboard.info.permissionMetadata.slice(0, 4).map((p, j) => (
                    <TableCell align="center" key={`permission-${p.permission.key.action}`}>
                      {p.hasIt ? (
                        <StatusLight variant="positive">
                          <Translate contentKey="permission.dashboardPermission.allow">allow</Translate>
                        </StatusLight>
                      ) : (
                        <StatusLight variant="negative">
                          <Translate contentKey="permission.dashboardPermission.deny">deny</Translate>
                        </StatusLight>
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Flex gap="size-100" justifyContent="center">
                      <a onClick={() => {}}>
                        <Edit size="S" />
                      </a>
                    </Flex>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
          component="div"
          count={totalDashboardPermissions}
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
  dashboardPermissions: storeState.permission.dashboardPermissions,
  totalDashboardPermissions: storeState.permission.totalDashboardPermissions,
});

const mapDispatchToProps = { getUserDashboardPermissions, getUserGroupDashboardPermissions };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dashboards);
