import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getUserGroups } from '../groups/user-group.reducer';
import { getUsers } from '../users/user.reducer';
import { IRootState } from 'app/shared/reducers';
import { Flex, Text, SearchField } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import User from '@spectrum-icons/workflow/User';
import UserGroup from '@spectrum-icons/workflow/UserGroup';
import ArrowRight from '@spectrum-icons/workflow/ArrowRight';
import { makeStyles } from '@material-ui/core/styles';

export interface IUsersGroupsProps extends StateProps, DispatchProps {}

export const UsersGroups = (props: IUsersGroupsProps) => {
  const [isOpen, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const fetchUsersGroups = () => {
    props.getUserGroups(0, 5, 'name,asc');
    props.getUsers(0, 5, 'login,asc');
  };

  useEffect(() => {
    fetchUsersGroups();
  }, []);

  //   useEffect(() => {
  //     const params = new URLSearchParams(props.location.search);
  //     const page = params.get('page');
  //     const sort = params.get('sort');
  //     if (page && sort) {
  //       const sortSplit = sort.split(',');
  //       setPagination({
  //         ...pagination,
  //         activePage: +page,
  //         sort: sortSplit[0],
  //         order: sortSplit[1],
  //       });
  //     }
  //   }, [props.location.search]);

  const useStyles = makeStyles({
    search: {
      marginLeft: '7%',
      marginTop:'20px'
    },
    root: {
      backgroundColor: '#fff',
      width: '85%',
      margin: '20px auto',
    },
  });

  const classes = useStyles();

  const setUpdateSuccess = () => {
    fetchUsersGroups();
  };

  const { groups, users } = props;

  return (
    <div>
      <div className={classes.search}>
        {' '}
        <SearchField value={searchValue} onChange={setSearchValue} placeholder="User or Group" label="Search" />
      </div>
      <TableContainer className={classes.root}>
        <Table aria-label="customized table">
          <TableHead></TableHead>
          <TableBody>
            {groups.map((userGroup, i) => (
              <TableRow key={`user-${userGroup.name}`}>
                <TableCell align="center">
                  <Flex justifyContent="space-between">
                    <Flex gap="size-100" justifyContent="center" alignItems="start">
                      <UserGroup size="S" />
                      <Text>{userGroup.name}</Text>
                    </Flex>
                    <Flex justifyContent="center" alignItems="end">
                      <ArrowRight size="S" />
                    </Flex>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
            {users.map((user, i) => (
              <TableRow key={`user-${user.login}`}>
                <TableCell align="center">
                  <Flex justifyContent="space-between">
                    <Flex gap="size-100" justifyContent="center" alignItems="start">
                      <User size="S" />
                      <Text>{user.login}</Text>
                    </Flex>
                    <Flex justifyContent="center" alignItems="end">
                      <ArrowRight size="S" />
                    </Flex>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  groups: storeState.userGroups.groups,
  users: storeState.userManagement.users,
});

const mapDispatchToProps = { getUserGroups, getUsers };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UsersGroups);
