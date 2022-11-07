import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Translate, getSortState } from 'react-jhipster';
import { ITEMS_PER_PAGE_OPTIONS, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { getUsers, updateUser, getUser } from './user.reducer';
import { IRootState } from 'app/shared/reducers';
import { Button, Flex, DialogContainer } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import Edit from '@spectrum-icons/workflow/Edit';
import UserUpdate from './user-update';

export interface IUsersProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const Users = (props: IUsersProps) => {
  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );
  const [isOpen, setOpen] = React.useState(false);

  const fetchUsers = () => {
    props.getUsers(pagination.activePage, pagination.itemsPerPage, `${pagination.sort},${pagination.order}`);
    const endURL = `?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    fetchUsers();
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

  const setUpdateSuccess = () => {
    fetchUsers();
  };

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

  const onPageChange = (event, page) => {};

  const { users, match, totalItems } = props;

  return (
    <div>
      {/* TODO : mapping of urls */}
      <SecondaryHeader
        breadcrumbItems={[
          { label: 'Home', route: '/' },
          { label: 'User Management', route: '/administration/user-management' },
          { label: 'Users', route: '/administration/user-management/users' },
        ]}
        title={'User Management'}
      >
        <Button
          variant="cta"
          onPress={() => {
            setOpen(true);
          }}
          data-testid="create-user"
        >
          <Translate contentKey="entity.action.create">Create</Translate>
        </Button>
      </SecondaryHeader>
      <DialogContainer onDismiss={() => setOpen(false)}>
        {isOpen && <UserUpdate setUpdateSuccess={setUpdateSuccess} setOpen={setOpen} />}
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
                      {u.id}
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
                        <a
                          onClick={() => {
                            setOpen(true);
                            props.getUser(u.login);
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
            onPageChange={handleChangePage}
            component="div"
            count={totalItems}
            rowsPerPage={pagination.itemsPerPage}
            page={pagination.activePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  totalItems: storeState.userManagement.totalItems,
});

const mapDispatchToProps = { getUsers, updateUser, getUser };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Users);
