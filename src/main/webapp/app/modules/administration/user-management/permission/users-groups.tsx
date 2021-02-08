import React, { useState, useEffect, ReactText } from 'react';
import { connect } from 'react-redux';
import { getUserGroups, searchUserGroups } from '../groups/user-group.reducer';
import { getUsers, searchUsers } from '../users/user.reducer';
import { IRootState } from 'app/shared/reducers';
import { Flex, Text, SearchField, ListBox, Item, Section, Content, View } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import User from '@spectrum-icons/workflow/User';
import UserGroup from '@spectrum-icons/workflow/UserGroup';
import { useAsyncList } from '@react-stately/data';
import { Tabs } from '@react-spectrum/tabs';
import { Translate, translate } from 'react-jhipster';
import { ITEMS_PER_PAGE, ACTIVE_PAGE } from 'app/shared/util/pagination.constants';

export interface IUsersGroupsProps extends StateProps, DispatchProps {
  permissionProps: any;
}

export const UsersGroups = (props: IUsersGroupsProps) => {
  const tabs = [
    { id: 1, name: 'userManagement.home.title' },
    { id: 2, name: 'userGroups.home.title' },
  ];

  const [searchValue, setSearchValue] = React.useState('');
  const [tabId, setTabId] = useState<ReactText>(1);

  const { permissionProps, groups, users } = props;

  const pushParams = endURL => {
    if (permissionProps.location.search !== endURL) {
      permissionProps.history.push(`${permissionProps.location.pathname}${endURL}`);
    }
  };

  const getParam = event => {
    const it = event.values();
    return it.next();
  };

  const setGroupName = event => {
    const group = getParam(event);
    const endURL = `?page=${ACTIVE_PAGE}&group=${group.value}`;
    pushParams(endURL);
  };

  const setLogin = event => {
    const user = getParam(event);
    const endURL = `?page=${ACTIVE_PAGE}&user=${user.value}`;
    pushParams(endURL);
  };

  const fetchUsersGroups = () => {
    props.getUserGroups(ACTIVE_PAGE, ITEMS_PER_PAGE, 'name,asc');
    props.getUsers(ACTIVE_PAGE, ITEMS_PER_PAGE, 'login,asc');
  };

  useEffect(() => {
    fetchUsersGroups();
  }, []);

  useEffect(() => {
    if (searchValue.length > 1 || searchValue.length === 0)
      if (tabId === 1) {
        props.searchUsers(ACTIVE_PAGE, ITEMS_PER_PAGE, 'login,asc', searchValue);
      } else {
        props.searchUserGroups(ACTIVE_PAGE, ITEMS_PER_PAGE, 'name,asc', searchValue);
      }
  }, [searchValue]);

  return (
    <div>
      <div style={{ marginLeft: '7%', marginTop: '20px' }}>
        <SearchField value={searchValue} onChange={setSearchValue} placeholder="User or Group" label="Search" data-testid="search" />
      </div>
      <View backgroundColor="gray-75" width="85%" margin="20px auto">
        {/* TODO : need to check the issue of this component. onSelectionChange throws compilation issue */}
        <Tabs aria-label="roles" items={tabs} selectedKey={tabId} onSelectionChange={setTabId}>
          {item => (
            <Item title={translate(item.name)}>
              <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
                {tabId === 1 ? (
                  <ListBox width="size-static-size-3600" aria-label="users" selectionMode="single" onSelectionChange={setLogin}>
                    <Section>
                      {users.map((user, i) => (
                        <Item textValue="Read" key={`${user.login}`}>
                          <User size="M" />
                          <Text>{user.login}</Text>
                        </Item>
                      ))}
                    </Section>
                  </ListBox>
                ) : (
                  <ListBox width="size-static-size-3600" aria-label="groups" selectionMode="single" onSelectionChange={setGroupName}>
                    <Section>
                      {groups.map((group, i) => (
                        <Item textValue="Read" key={`${group.name}`}>
                          <UserGroup size="M" />
                          <Text>{group.name}</Text>
                          <Text slot="description">100 todo</Text>
                        </Item>
                      ))}
                    </Section>
                  </ListBox>
                )}
              </Content>
            </Item>
          )}
        </Tabs>
      </View>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  groups: storeState.userGroups.groups,
  users: storeState.userManagement.users,
});

const mapDispatchToProps = { getUserGroups, getUsers, searchUsers, searchUserGroups };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UsersGroups);
