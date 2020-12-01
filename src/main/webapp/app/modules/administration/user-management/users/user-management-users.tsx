import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Translate, getSortState } from 'react-jhipster';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { getUsers, updateUser } from './user-management.reducer';
import { IRootState } from 'app/shared/reducers';
import { Button, Flex,DialogContainer } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import Edit from '@spectrum-icons/workflow/Edit';
import UserManagementUpdate from './user-management-update';
import { defaultValue } from 'app/shared/model/user.model';

export interface IUserManagementProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const UserManagementUsers = (props: IUserManagementProps) => {
  const [pagination, setPagination] = useState(overridePaginationStateWithQueryParams(getSortState(props.location), props.location.search));

  useEffect(() => {
    props.getUsers(pagination.activePage, pagination.itemsPerPage, `${pagination.sort},${pagination.order}`);
    const endURL = `?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  }, [pagination.activePage, pagination.order, pagination.sort, pagination.itemsPerPage]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPagination({
        ...pagination,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  const sort = p => () =>
    setPagination({
      ...pagination,
      order: pagination.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });

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

  const [isOpen, setOpen] = React.useState(false);
  const [user,setUser] = React.useState(defaultValue);


  const { users, account, match, totalItems } = props;

  return (
    <div>
      {/* TODO : mapping of urls */}
      <SecondaryHeader
        breadcrumbItems={[
          { key: 'home', label: 'Home', route: '/' },
          { key: 'user-management', label: 'User Management', route: '/administration/user-management' },
          { key: 'user-management-users', label: 'Users', route: '/administration/user-management/users' },
        ]}
        title={'User Management'}
      >
        <Button variant="cta" onPress={() => {setOpen(true);setUser(defaultValue)}}>
          <Translate contentKey="entity.action.create">Create</Translate>
        </Button>
      </SecondaryHeader>
      <DialogContainer onDismiss={() => setOpen(false)}>
        {isOpen && (
          <UserManagementUpdate user={user} setOpen={setOpen} ></UserManagementUpdate>
        )}
      </DialogContainer>
      <div className="dx26-container">
        <Paper className="dx26-table-pager">
          <TableContainer>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" onClick={sort('id')}>
                    <Translate contentKey="global.field.id">ID</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="userManagement.login">Login</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="userManagement.email">Email</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="userManagement.status">Status</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="userManagement.userType">User Type</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="entity.action.manage">Manage</Translate>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u, i) => (
                  <TableRow key={`user-${i}`}>
                    <TableCell component="th" scope="row" align="center">
                      <Link className="dx26-link" to={`${match.url}/${user.login}`}>
                        {u.id}
                      </Link>
                    </TableCell>
                    <TableCell align="center">{u.login}</TableCell>
                    <TableCell align="center">{u.email}</TableCell>
                    <TableCell align="center">
                      {u.activated ? (
                        <Translate contentKey="userManagement.activated">Enabled</Translate>
                      ) : (
                        <Translate contentKey="userManagement.deactivated">Disabled</Translate>
                      )}
                    </TableCell>
                    <TableCell align="center">{u.userType}</TableCell>
                    <TableCell align="center">
                      <Flex gap="size-100" justifyContent="center">
                        <a onClick={() => {setOpen(true);setUser(u)}}><Edit size="S"/></a>
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
            count={props.totalItems}
            rowsPerPage={pagination.itemsPerPage}
            page={pagination.activePage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  totalItems: storeState.userManagement.totalItems,
  account: storeState.authentication.account,
});

const mapDispatchToProps = { getUsers, updateUser };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserManagementUsers);
