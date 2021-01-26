import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getUserGroupDashboardPermissions, getUserDashboardPermissions } from './permissions.reducer';
import { IRootState } from 'app/shared/reducers';
import { Flex, Text, SearchField, DialogContainer } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import Edit from '@spectrum-icons/workflow/Edit';
import { makeStyles } from '@material-ui/core/styles';
import { ITEMS_PER_PAGE, ACTIVE_PAGE, ITEMS_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants';
import { Translate, getSortState } from 'react-jhipster';
import { StatusLight } from '@adobe/react-spectrum';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import ViewsPermissions from './views-permissions';

// TODO : when hit the url,params should be visible

export interface IDashboardsPermissionsProps extends StateProps, DispatchProps {
  permissionProps: any;
}

export const DashboardsPermissions = (props: IDashboardsPermissionsProps) => {
  const [user, setUser] = React.useState(null);
  const [group, setGroup] = React.useState(null);
  const [isOpen, setOpen] = React.useState(false);
  const [id, setId] = React.useState();
  const [dashboardName, setDashboardName] = React.useState();

  const { dashboardPermissions, totalDashboardPermissions, permissionProps } = props;

  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getSortState(permissionProps.location, ITEMS_PER_PAGE), permissionProps.location.search)
  );

  const fetchPermissions = () => {
    let endURL = '';
    if (user) {
      endURL = `?page=${pagination.activePage}&user=${user}`;
      props.getUserDashboardPermissions(pagination.activePage, pagination.itemsPerPage, user);
    } else if (group) {
      endURL = `?page=${pagination.activePage}&group=${group}`;
      props.getUserGroupDashboardPermissions(pagination.activePage, pagination.itemsPerPage, group);
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

  const setUpdateSuccess = () => {
    fetchPermissions();
  };

  return (
    <div className="dx26-container">
      <DialogContainer onDismiss={() => setOpen(false)}>
        {isOpen && (
          <ViewsPermissions
            dashboardName={dashboardName}
            setOpen={setOpen}
            group={group}
            user={user}
            id={id}
            setUpdateSuccess={setUpdateSuccess}
            {...props}
          ></ViewsPermissions>
        )}
      </DialogContainer>
      <Paper className="dx26-table-pager">
        <TableContainer>
          <Table aria-label="customized table">
            <TableHead style={{ backgroundColor: '#f5f5f5' }}>
              <TableCell align="center">
                <Translate contentKey="permissions.dashboardPermissions.dashboard">DASHBOARD</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.read">READ</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.write">WRITE</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.update">UPDATE</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.delete">DELETE</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.manage">MANAGE</Translate>
              </TableCell>
            </TableHead>
            <TableBody>
              {dashboardPermissions.map((dashboard, i) => (
                <TableRow key={`dashboard-${dashboard.info.dashboardName}`}>
                  <TableCell align="center">{dashboard.info.dashboardName}</TableCell>
                  {dashboard.info.permissionMetadata.slice(0, 4).map((p, j) => (
                    <TableCell align="center" key={`permission-${p.permission.key.action}`}>
                      {/* Todo : allow,deny and partial need to be decided during save of view permission. api change is required and one more field will be added in json */}
                      {p.hasIt ? (
                        <StatusLight variant="positive">
                          <Translate contentKey="permissions.dashboardPermissions.allow">allow</Translate>
                        </StatusLight>
                      ) : (
                        <StatusLight variant="negative">
                          <Translate contentKey="permissions.dashboardPermissions.deny">deny</Translate>
                        </StatusLight>
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Flex gap="size-100" justifyContent="center">
                      <a
                        onClick={() => {
                          setOpen(true);
                          setId(dashboard.info.id);
                          setDashboardName(dashboard.info.dashboardName);
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
  dashboardPermissions: storeState.permissions.dashboardPermissions,
  totalDashboardPermissions: storeState.permissions.totalDashboardPermissions,
});

const mapDispatchToProps = { getUserDashboardPermissions, getUserGroupDashboardPermissions };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DashboardsPermissions);
